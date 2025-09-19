<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsRecordOfficer
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Please log in to access this page.');
        }

        $user = Auth::user();

        if ($user->position !== 'record-officer') {
            // If the request expects JSON, return JSON response
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Access denied. Record Officer privileges required.',
                    'error' => 'Insufficient permissions'
                ], 403);
            }

            // Redirect to appropriate dashboard based on user role
            return $this->redirectToUserDashboard($user->position)
                ->with('error', 'Access denied. Record Officer privileges required.');
        }

        return $next($request);
    }

    /**
     * Redirect user to their appropriate dashboard
     */
    private function redirectToUserDashboard(string $position): \Illuminate\Http\RedirectResponse
    {
        return match ($position) {
            'admin' => redirect()->route('dashboard'),
            'law-enforcement' => redirect()->route('dashboard.law-enforcement'),
            default => redirect()->route('dashboard'),
        };
    }
}
