<?php

namespace App\Http\Middleware;

use App\Models\RequestLog;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;

class SystemLogRequestsMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($this->shouldSkipLogging($request)) {
            return $next($request);
        }

        $startTime = microtime(true);

        $wasAuthenticated = Auth::check();
        $previousUserId = Auth::id();

        $response = $next($request);

        $duration = (microtime(true) - $startTime) * 1000;
        $this->logRequest($request, $response, $duration, $wasAuthenticated, $previousUserId);

        return $response;
    }

    protected function logRequest(Request $request, Response $response, float $duration, bool $wasAuthenticated, $previousUserId): void
    {
        try {
            $userId = $this->getUserId($request, $response, $wasAuthenticated, $previousUserId);

            [$successMessage, $errorMessage] = $this->extractMessages($request, $response, $userId !== $previousUserId);

            $requestBody = $this->filterSensitiveData($request->all(), $this->isLoginRequest($request));

            $responseData = $this->prepareResponseData($response, $request);

            RequestLog::create([
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'status_code' => $response->getStatusCode(),
                'request_headers' => $this->getFilteredHeaders($request->headers->all()),
                'request_body' => !empty($requestBody) ? json_encode($requestBody) : null,
                'response_headers' => $this->getFilteredHeaders($response->headers->all()),
                'response_body' => $responseData['body'],
                'success_message' => $successMessage,
                'error_message' => $errorMessage,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'personnel_id' => $userId,
                'duration' => $duration,
            ]);

        } catch (\Exception $e) {
            Log::channel('system')->error('Failed to log request: ' . $e->getMessage());
        }
    }

    /**
     * Improved user ID detection for login.
     */
    protected function getUserId(Request $request, Response $response, bool $wasAuthenticated, $previousUserId): ?int
    {
        // If this is a login request and it was successful
        if ($this->isLoginRequest($request)) {
            // Login successful if:
            // 1. We weren't authenticated before but now we are
            // 2. OR we got a redirect (status 302) for login
            $isSuccessfulLogin = (!$wasAuthenticated && Auth::check()) ||
                                $response->getStatusCode() === 302;

            if ($isSuccessfulLogin && Auth::check()) {
                return Auth::id();
            }
        }

        // For other requests, use current auth state
        return Auth::id();
    }

    /**
     * Improved message extraction for login.
     */
    protected function extractMessages(Request $request, Response $response, bool $isNewLogin = false): array
    {
        $successMessage = null;
        $errorMessage = null;

        $isInertiaRequest = $request->header('X-Inertia');

        if ($isInertiaRequest) {
            $session = $request->getSession();

            if ($this->isLoginRequest($request)) {
                // Handle login-specific messages
                if ($isNewLogin) {
                    $successMessage = 'Login successful';
                } else {
                    // Check for login errors
                    $errors = $session->get('errors');
                    if ($errors && $errors->any()) {
                        $errorMessage = $errors->first();
                    } else if ($response->getStatusCode() !== 302) {
                        // If not a redirect, it's probably a failed login
                        $errorMessage = $session->get('error') ?: 'Login failed';
                    }
                }
            } else {
                // Normal Inertia requests
                $successMessage = $session->get('success');
                $errorMessage = $session->get('error');
            }
        } else {
            // API requests
            $content = $response->getContent();
            $data = json_decode($content, true) ?? [];

            if ($response->isSuccessful()) {
                $successMessage = $data['message'] ?? $data['success'] ?? null;
            } else {
                $errorMessage = $data['message'] ?? $data['error'] ?? $this->getDefaultErrorMessage($response->getStatusCode());
            }
        }

        return [$successMessage, $errorMessage];
    }

    /**
     * Enhanced sensitive data filtering.
     */
    protected function filterSensitiveData(array $data, bool $isLoginRequest = false): array
    {
        $sensitiveFields = [
            'password',
            'password_confirmation',
            'current_password',
            'token',
            'api_token',
            'secret',
            'credit_card',
            'cvv',
            'ssn',
            'social_security',
            '_token',
            '_method',
        ];

        // Extra protection for login/authentication requests
        if ($isLoginRequest) {
            $sensitiveFields = array_merge($sensitiveFields, [
                'email',
                'username', // Add username to sensitive fields
                'remember',
                'login', // Common login field names
                'auth',
            ]);
        }

        foreach ($sensitiveFields as $field) {
            if (array_key_exists($field, $data)) {
                $data[$field] = '***HIDDEN***';
            }
        }

        // Recursive filtering for nested arrays
        array_walk_recursive($data, function (&$value, $key) use ($sensitiveFields) {
            if (in_array($key, $sensitiveFields)) {
                $value = '***HIDDEN***';
            }
        });

        return $data;
    }

    /**
     * Improved response data preparation for Inertia.
     */
    protected function prepareResponseData(Response $response, Request $request): array
    {
        $content = $response->getContent();
        $isInertiaRequest = $request->header('X-Inertia');

        // Handle redirect responses properly
        if ($response->isRedirection()) {
            $redirectData = [
                'type' => 'redirect',
                'status' => $response->getStatusCode(),
            ];

            // Safely get redirect location from headers
            $location = $response->headers->get('Location');
            if ($location) {
                $redirectData['location'] = $location;
            }

            // For Inertia requests, add specific info
            if ($isInertiaRequest) {
                $redirectData['inertia'] = true;
            }

            return [
                'body' => json_encode($redirectData)
            ];
        }

        // Handle JSON responses
        if (str_contains($response->headers->get('Content-Type', ''), 'application/json')) {
            $data = json_decode($content, true) ?? [];

            if (isset($data['component'], $data['props'])) {
                // Inertia response
                return [
                    'body' => json_encode([
                        'type' => 'inertia',
                        'component' => $data['component'],
                        'props_keys' => array_keys($data['props'] ?? []),
                        'url' => $data['url'] ?? null,
                    ])
                ];
            }

            return [
                'body' => $this->filterResponseData($content)
            ];
        }

        // For HTML responses, don't log full content
        if (str_contains($response->headers->get('Content-Type', ''), 'text/html')) {
            return [
                'body' => json_encode([
                    'type' => 'html',
                    'content_length' => strlen($content),
                    'truncated' => true
                ])
            ];
        }

        return [
            'body' => $this->filterResponseData($content)
        ];
    }

    /**
     * Check if this is a login request.
     */
    protected function isLoginRequest(Request $request): bool
    {
        $loginPaths = ['login', 'auth/login', 'signin', 'authenticate'];

        return $request->routeIs('login') ||
               in_array($request->path(), $loginPaths) ||
               ($request->method() === 'POST' && in_array($request->path(), $loginPaths));
    }

    /**
     * Filter response data to avoid logging large responses.
     */
    protected function filterResponseData(string $content): ?string
    {
        $maxLength = 5000;

        if (strlen($content) > $maxLength) {
            return substr($content, 0, $maxLength) . '... [TRUNCATED]';
        }

        return $content ?: null;
    }

    /**
     * Get filtered headers (remove sensitive ones).
     */
    protected function getFilteredHeaders(array $headers): array
    {
        $sensitiveHeaders = [
            'authorization',
            'cookie',
            'php-auth-pw',
            'x-xsrf-token',
            'x-csrf-token',
        ];

        foreach ($sensitiveHeaders as $header) {
            if (isset($headers[$header])) {
                $headers[$header] = '***HIDDEN***';
            }
        }

        return $headers;
    }

    /**
     * Get default error message based on status code.
     */
    protected function getDefaultErrorMessage(int $statusCode): string
    {
        return match ($statusCode) {
            400 => 'Bad Request',
            401 => 'Unauthorized',
            403 => 'Forbidden',
            404 => 'Not Found',
            405 => 'Method Not Allowed',
            419 => 'Page Expired',
            422 => 'Unprocessable Entity',
            429 => 'Too Many Requests',
            500 => 'Internal Server Error',
            503 => 'Service Unavailable',
            default => 'Error',
        };
    }

    /**
     * Determine if the request should be skipped from logging.
     */
    protected function shouldSkipLogging(Request $request): bool
    {
        $skipPaths = [
            '_debugbar',
            'horizon',
            'telescope',
            'storage',
            'uploads',
        ];

        $path = $request->path();

        foreach ($skipPaths as $skipPath) {
            if (str_starts_with($path, $skipPath)) {
                return true;
            }
        }

        return false;
    }
}
