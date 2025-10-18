<?php

namespace App\Http\Controllers\RecordOfficer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Activity;
use App\Models\Pdl;

class JailEventsController extends Controller
{
    public function index()
    {
        $pdls = Pdl::with('personnel:id,fname,lname')
            ->whereHas('verifications', function ($query) {
                $query->where('status', 'approved');
            })
            ->latest()
            ->get();

        // Load activities with their associated PDLs
        $activities = Activity::latest()
            ->get()
            ->map(function ($activity) {
                // Load PDLs from pdl_ids
                if ($activity->pdl_ids) {
                    // Handle both array and JSON string cases
                    $pdlIds = is_array($activity->pdl_ids) ? $activity->pdl_ids : json_decode($activity->pdl_ids, true);
                    if (is_array($pdlIds) && !empty($pdlIds)) {
                        $activity->pdls = Pdl::whereIn('id', $pdlIds)->get(['id', 'fname', 'lname']);
                    } else {
                        $activity->pdls = collect();
                    }
                } else {
                    $activity->pdls = collect();
                }
                return $activity;
            });

        return Inertia::render('records-officer/jail-events/jail-events', [
            'pdls' => $pdls,
            'activities' => $activities
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'activity_name' => 'required|string|max:255',
            'activity_date' => [
                'required',
                'date',
                'after_or_equal:yesterday'
            ],
            'activity_time' => 'required|date_format:H:i',
            'category' => 'required|string',
            'pdl_ids' => 'required|array',
            'pdl_ids.*' => 'exists:pdl,id',
        ], [
            'activity_date.after_or_equal' => 'The activity date must not be in the past.',
            'pdl_ids.required' => 'Please select at least one PDL.',
        ]);

        // Check for conflicting events
        $conflictingEvents = $this->checkForConflictingEvents($validated['activity_date'], $validated['activity_time'], $validated['pdl_ids']);

        if (!empty($conflictingEvents)) {
            return back()->withErrors([
                'conflict' => 'Some PDLs have conflicting events at this time. Please check the schedule.',
                'conflicting_events' => $conflictingEvents
            ]);
        }

        // Create a single activity record with all PDLs
        $activity = Activity::create([
            'activity_name' => $validated['activity_name'],
            'activity_date' => $validated['activity_date'],
            'activity_time' => $validated['activity_time'],
            'category' => $validated['category'],
            'pdl_ids' => $validated['pdl_ids'], // Store PDL IDs as array (casting will handle JSON)
        ]);

        // Create notifications for upcoming events
        $this->createUpcomingEventNotifications($activity, $validated['pdl_ids']);

        return redirect()->back()->with('success', 'Event created successfully for ' . count($validated['pdl_ids']) . ' PDL(s).');
    }

    private function checkForConflictingEvents($date, $time, $pdlIds)
    {
        $conflictingEvents = [];

        foreach ($pdlIds as $pdlId) {
            $existingEvents = Activity::where('activity_date', $date)
                ->where('activity_time', $time)
                ->whereJsonContains('pdl_ids', $pdlId)
                ->get();

            if ($existingEvents->count() > 0) {
                $pdl = Pdl::find($pdlId);
                $conflictingEvents[] = [
                    'pdl_name' => $pdl->fname . ' ' . $pdl->lname,
                    'events' => $existingEvents->map(function ($event) {
                        return [
                            'activity_name' => $event->activity_name,
                            'time' => $event->activity_time
                        ];
                    })
                ];
            }
        }

        return $conflictingEvents;
    }

    private function createUpcomingEventNotifications($activity, $pdlIds)
    {
        $eventDate = \Carbon\Carbon::parse($activity->activity_date . ' ' . $activity->activity_time);
        $now = \Carbon\Carbon::now();

        // Create notifications for events happening in the next 24 hours
        if ($eventDate->diffInHours($now) <= 24) {
            foreach ($pdlIds as $pdlId) {
                $pdl = Pdl::find($pdlId);
                \App\Services\NotificationService::createNotification(
                    'Upcoming Event',
                    "Event '{$activity->activity_name}' for PDL {$pdl->fname} {$pdl->lname} is scheduled for {$eventDate->format('M d, Y \a\t g:i A')}",
                    'upcoming_event',
                    $pdlId
                );
            }
        }
    }

    public function reschedule(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'reason' => 'required|string|max:255',
            'status' => 'required|string|in:pending,completed,cancelled,rescheduled',
        ]);

        $activity = Activity::findOrFail($request->activity_id);

        $activity->update([
            'activity_date' => $validated['date'],
            'activity_time' => $validated['time'],
            'reason' => $validated['reason'],
            'status' => $validated['status'],
        ]);

        return redirect()->back()->with('success', 'Event rescheduled successfully.');
    }


    public function cancel(Request $request)
    {

        $validated = $request->validate([
            'activity_id' => 'required|exists:activity,activity_id',
            'reason' => 'required|string|max:255',
            'status' => 'required|string',
        ]);

        $activity = Activity::find($validated['activity_id']);
        $activity->status = $validated['status'];
        $activity->reason = $validated['reason'];
        $activity->save();

        return redirect()->back()->with('success', 'Event cancelled successfully.');
    }
}
