<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CaseInformation;
use App\Services\NotificationService;
use App\Models\Pdl;

class CaseInformationController extends Controller
{

    public function index(Request $request)
    {
        $search = $request->input('search', '');

        $cases = CaseInformation::with('pdl:id,fname,lname')
            ->when($search, function ($query, $search) {
                $query->where('case_number', 'like', "%{$search}%")
                    ->orWhere('crime_committed', 'like', "%{$search}%")
                    ->orWhere('case_status', 'like', "%{$search}%")
                    ->orWhereHas('pdl', function ($q) use ($search) {
                        $q->where('fname', 'like', "%{$search}%")
                            ->orWhere('lname', 'like', "%{$search}%");
                    });
            })
            ->latest()
            ->get();

        $pdls = Pdl::select('id', 'fname', 'lname')->get();

        return Inertia::render('records-officer/pdl-management/case-information', [
            'cases' => $cases,
            'pdls' => $pdls,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'case_number' => 'required|string|max:255|unique:case_information,case_number',
            'crime_committed' => 'required|string|max:255',
            'date_committed' => 'required|date',
            'time_committed' => 'required|date_format:H:i',
            'case_status' => 'required|in:open,closed,pending',
            'case_remarks' => 'nullable|string',
            'security_classification' => 'required|in:low,medium,high,maximum',
            'drug_related' => 'required|boolean',
            'pdl_id' => 'required|exists:pdl,id',
        ]);

        // Format time properly
        $validated['time_committed'] = date('H:i:s', strtotime($validated['time_committed']));

        $case = CaseInformation::create($validated);
        $pdl = Pdl::findOrFail($validated['pdl_id']);

        NotificationService::caseCreated($case, $pdl, auth()->user());

        return redirect()->back()
            ->with('success', 'Case information created successfully');
    }
}
