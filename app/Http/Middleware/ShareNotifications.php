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
    /**
     * Generate notification URL based on current user's role and notification type
     */
    private static function generateNotificationUrl(?string $notificationType, ?int $pdlId): ?string
    {
        if (!$notificationType || !$pdlId) {
            return null;
        }

        $user = Auth::user();
        if (!$user) {
            return null;
        }

        // Determine base URL based on current user's role
        $baseUrl = match($user->position) {
            'admin' => "/admin",
            'record-officer' => "/record-officer",
            'law-enforcement' => "/law-enforcement",
            default => "/admin"
        };

        // Map notification types to specific URLs
        return match($notificationType) {
            'pdl_created', 'pdl_updated', 'pdl_transferred' =>
                "{$baseUrl}/pdl-management/personal-information?pdl_id={$pdlId}",
            'pdl_transfer' =>
                "{$baseUrl}/pdl-management/personal-information?pdl_id={$pdlId}",
            'case_created', 'case_updated' =>
                "{$baseUrl}/pdl-management/case-information?pdl_id={$pdlId}",
            'court_order_created', 'court_order_updated' =>
                "{$baseUrl}/pdl-management/court-order?pdl_id={$pdlId}",
            'medical_record_created', 'medical_record_updated' =>
                "{$baseUrl}/pdl-management/medical-records?pdl_id={$pdlId}",
            'physical_characteristic_created', 'physical_characteristic_updated' =>
                "{$baseUrl}/pdl-management/physical-characteristics?pdl_id={$pdlId}",
            'time_allowance_updated' =>
                "{$baseUrl}/pdl-management/time-allowance?pdl_id={$pdlId}",
            'cell_assigned' =>
                "{$baseUrl}/pdl-management/cell-assignment?pdl_id={$pdlId}",
            'jail_event_created' =>
                "{$baseUrl}/jail-events?pdl_id={$pdlId}",
            'verification_status_changed' =>
                "{$baseUrl}/pdl-management/personal-information?pdl_id={$pdlId}",
            'general' =>
                "{$baseUrl}/pdl-management/personal-information?pdl_id={$pdlId}",
            default =>
                "{$baseUrl}/pdl-management/personal-information?pdl_id={$pdlId}"
        };
    }
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $notifications = SystemNotification::with(['sender', 'pdl', 'readBy'])
                ->latest()
                ->take(20)
                ->get()
                ->map(function ($notification) {
                    // Check if this notification has been read by current user
                    $readByCurrentUser = $notification->readBy->contains('personnel_id', Auth::id());

                    // Generate URL based on current user's role and notification type
                    $actionUrl = self::generateNotificationUrl($notification->notification_type, $notification->pdl_id);

                    return [
                        'id' => $notification->notification_id,
                        'title' => $notification->title,
                        'message' => $notification->message,
                        'notification_type' => $notification->notification_type,
                        'action_url' => $actionUrl,
                        'personnel_id' => $notification->personnel_id,
                        'pdl_id' => $notification->pdl_id,
                        'created_at' => $notification->created_at->toISOString(),
                        'read_at' => $readByCurrentUser ? $notification->readBy->where('personnel_id', Auth::id())->first()?->created_at?->toISOString() : null,
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
