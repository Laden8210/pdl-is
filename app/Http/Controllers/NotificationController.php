<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\SystemNotification;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{


    public function markAsRead($id)
    {
        $notification = SystemNotification::findOrFail($id);

        // Mark as read if not already read
        if (!$notification->readBy()->where('personnel_id', Auth::id())->exists()) {
            $notification->readBy()->create([
                'personnel_id' => Auth::id(),
            ]);
        }

        return redirect()->back()
            ->with('success', 'Notification marked as read successfully');
    }
}
