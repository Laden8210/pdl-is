<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Court;

class CourtController extends Controller
{
    public function index()
    {
        $courts = Court::all();
        return Inertia::render('records-officer/court-list', [
            'courts' => $courts
        ]);
    }
    public function create(Request $request)
    {
        $validated = $request->validate([
            'branch_code' => 'required|string|max:255',
            'court_type' => 'required|string|max:255',
            'location' => 'required|string|max:255',
        ]);
        Court::create($validated);
        return redirect()->back()->with('success', 'Court created successfully');
    }
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'branch_code' => 'required|string|max:255',
            'court_type' => 'required|string|max:255',
            'location' => 'required|string|max:255',
        ]);

        $court = Court::where('court_id', $id)->firstOrFail();
        $court->update($validated);

        return redirect()->back()->with('success', 'Court updated successfully');
    }
}
