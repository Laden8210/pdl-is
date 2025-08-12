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
        $pdls = Pdl::with('personnel:id,fname,lname')->latest()->get();
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
                'after_or_equal:today'
            ],
            'activity_time' => 'required|date_format:H:i',
            'category' => 'required|string',
            'pdl_id' => 'required|exists:pdl,id',
        ], [
            'activity_date.after_or_equal' => 'The activity date must not be in the past.',
        ]);

        Activity::create($validated);

        return redirect()->back()->with('success', 'Event created successfully.');
    }
}
