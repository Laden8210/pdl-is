<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\SystemNotification;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ShareNotifications
{
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $notifications = SystemNotification::with(['sender', 'pdl', 'readBy'])
                ->where(function($query) {
                    // Notifications not created by current user
                    $query->where('personnel_id', '!=', Auth::id())
                          ->orWhereNull('personnel_id');
                })
                ->whereDoesntHave('readBy', function($q) {
                    // Not already read by current user
                    $q->where('personnel_id', Auth::id());
                })
                ->latest()
                ->take(10)
                ->get()
                ->map(function ($notification) {
                    return [
                        'id' => $notification->notification_id,
                        'title' => $notification->title,
                        'message' => $notification->message,
                        'created_at' => $notification->created_at->toISOString(),
                        'read_at' => null, // Since we filtered out read notifications
                        'sender' => $notification->sender ? [
                            'fname' => $notification->sender->fname,
                            'lname' => $notification->sender->lname,
                        ] : null,
                        'pdl' => $notification->pdl ? [
                            'id' => $notification->pdl->id,
                            'name' => $notification->pdl->fname . ' ' . $notification->pdl->lname,
                        ] : null,
                    ];
                });

            Inertia::share('notifications', $notifications);
        }

        return $next($request);
    }
}
