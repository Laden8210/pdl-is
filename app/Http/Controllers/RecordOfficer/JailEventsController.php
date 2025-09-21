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
        $activities = Activity::with('pdl:id,fname,lname')->latest()->get();

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



        // Create an activity for each selected PDL
        $createdActivities = [];
        foreach ($validated['pdl_ids'] as $pdlId) {
            $activity = Activity::create([
                'activity_name' => $validated['activity_name'],
                'activity_date' => $validated['activity_date'],
                'activity_time' => $validated['activity_time'],
                'category' => $validated['category'],
                'pdl_id' => $pdlId,
            ]);
            $createdActivities[] = $activity;
        }


        return redirect()->back()->with('success', 'Event created successfully for ' . count($validated['pdl_ids']) . ' PDL(s).');
    }
}
