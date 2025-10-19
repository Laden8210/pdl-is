<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\RequestLog;

class RequestLogController extends Controller
{


    public function index(Request $request)
    {
        $query = RequestLog::query()->with('user');

        // Search filter
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('url', 'like', "%{$search}%")
                    ->orWhere('ip_address', 'like', "%{$search}%")
                    ->orWhere('user_agent', 'like', "%{$search}%")
                    ->orWhere('success_message', 'like', "%{$search}%")
                    ->orWhere('error_message', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        // Method filter
        if ($request->has('method') && $request->method !== 'all') {
            $query->where('method', $request->method);
        }

        // Status filter
        if ($request->has('status') && $request->status !== 'all') {
            switch ($request->status) {
                case 'success':
                    $query->whereBetween('status_code', [200, 299]);
                    break;
                case 'client_error':
                    $query->whereBetween('status_code', [400, 499]);
                    break;
                case 'server_error':
                    $query->whereBetween('status_code', [500, 599]);
                    break;
            }
        }

        // User filter
        if ($request->has('user_id') && $request->user_id !== 'all') {
            if ($request->user_id === 'guest') {
                $query->whereNull('user_id');
            } elseif ($request->user_id === 'authenticated') {
                $query->whereNotNull('user_id');
            }
        }

        $logs = $query->latest()
            ->paginate(20)
            ->through(function ($log) {
                return [
                    'id' => $log->id,
                    'method' => $log->method,
                    'url' => $log->url,
                    'status_code' => $log->status_code,
                    'request_headers' => $log->request_headers,
                    'request_body' => $log->request_body,
                    'response_headers' => $log->response_headers,
                    'response_body' => $log->response_body,
                    'success_message' => $log->success_message,
                    'error_message' => $log->error_message,
                    'ip_address' => $log->ip_address,
                    'user_agent' => $log->user_agent,
                    'user_id' => $log->user_id,
                    'user_name' => $log->user?->fname . ' ' . $log->user?->lname,
                    'user_email' => $log->user?->username,
                    'duration' => $log->duration,
                    'created_at' => $log->created_at->toISOString(),
                ];
            });

        return Inertia::render('admin/request-logs/index', [
            'request_logs' => $logs,
            'filters' => $request->only(['search', 'method', 'status', 'user_id']),
        ]);
    }
}
