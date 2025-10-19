<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Pdl;
use App\Models\Activity;

class CourtHearingCalendarController extends Controller
{
    public function index()
    {
        $pdls = Pdl::with('personnel:id,fname,lname')->whereHas('verifications', function ($query) {
            $query->where('status', 'approved');
        })
        ->where('archive_status', '=', null)
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
                'after_or_equal:today'
            ],
            'activity_time' => 'required|date_format:H:i',
            'category' => 'required|string',
            'pdl_ids' => 'required|array',
            'pdl_ids.*' => 'exists:pdl,id',
        ], [
            'activity_date.after_or_equal' => 'The activity date must not be in the past.',
            'pdl_ids.required' => 'Please select at least one PDL.',
        ]);

        // Create a single activity record with all PDLs
        $activity = Activity::create([
            'activity_name' => $validated['activity_name'],
            'activity_date' => $validated['activity_date'],
            'activity_time' => $validated['activity_time'],
            'category' => $validated['category'],
            'pdl_ids' => $validated['pdl_ids'], // Store PDL IDs as array (casting will handle JSON)
        ]);

        return redirect()->back()->with('success', 'Event created successfully for ' . count($validated['pdl_ids']) . ' PDL(s).');
    }
}
