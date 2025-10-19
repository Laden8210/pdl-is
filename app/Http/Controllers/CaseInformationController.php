<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CaseInformation;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Auth;
use App\Models\Pdl;


class CaseInformationController extends Controller
{

    public function index(Request $request)
    {
        $search = $request->input('search', '');

        $cases = CaseInformation::with('pdl:id,fname,lname')
            ->when($search, function ($query, $search) {
                $searchTerm = strtolower(trim($search));
                $query->where(function ($q) use ($searchTerm) {
                    $q->whereRaw('LOWER(case_number) LIKE ?', ["%{$searchTerm}%"])
                        ->orWhereRaw('LOWER(crime_committed) LIKE ?', ["%{$searchTerm}%"])
                        ->orWhereRaw('LOWER(case_status) LIKE ?', ["%{$searchTerm}%"])
                        ->orWhereRaw('LOWER(case_remarks) LIKE ?', ["%{$searchTerm}%"])
                        ->orWhereRaw('LOWER(security_classification) LIKE ?', ["%{$searchTerm}%"])
                        ->orWhereHas('pdl', function ($pdlQuery) use ($searchTerm) {
                            $pdlQuery->whereRaw('LOWER(fname) LIKE ?', ["%{$searchTerm}%"])
                                ->orWhereRaw('LOWER(lname) LIKE ?', ["%{$searchTerm}%"])
                                ->orWhereRaw('LOWER(CONCAT(fname, " ", lname)) LIKE ?', ["%{$searchTerm}%"]);
                        });
                });
            })
            ->whereHas('pdl', function ($pdlQuery) {
                $pdlQuery->whereNull('archive_status')
                ->whereDoesntHave('verifications', function ($verificationQuery) {
                    $verificationQuery->where('status', 'approved');
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
            'searchPerformed' => !empty($search),
            'totalResults' => $cases->count(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'case_number' => 'required|string|max:255|unique:case_information,case_number',
            'crime_committed' => 'required|string|max:255',
            'date_committed' => 'required|date',
            'time_committed' => 'required|date_format:H:i',
            'case_status' => 'required|in:open,pending,convicted,deceased,case closed',
            'case_remarks' => 'nullable|string',
            'security_classification' => 'required|in:low,medium,high,maximum',
            'drug_related' => 'required|boolean',
            'pdl_id' => 'required|exists:pdl,id',
        ]);

        // Format time properly
        $validated['time_committed'] = date('H:i:s', strtotime($validated['time_committed']));

        $case = CaseInformation::create($validated);
        $pdl = Pdl::findOrFail($validated['pdl_id']);

        NotificationService::caseCreated($case, $pdl, Auth::user());

        return redirect()->back()
            ->with('success', 'Case information created successfully');
    }

    public function edit($id)
    {
        $caseInfo = CaseInformation::findOrFail($id);
        return Inertia::render('records-officer/pdl-management/edit-case-information', [
            'caseInfo' => $caseInfo
        ]);
    }

    public function update(Request $request, CaseInformation $case)
    {
        $pdl = $case->pdl;
        $validated = $request->validate([
            'case_number' => 'required|string|max:255',
            'crime_committed' => 'required|string|max:255',
            'date_committed' => 'required|date',
            'time_committed' => 'required|date_format:H:i',
            'case_status' => 'required|in:open,pending,convicted,deceased,case_closed,on_trial',
            'case_remarks' => 'nullable|string',
            'security_classification' => 'required|in:low,medium,high,maximum',
            'drug_related' => 'required|boolean',
        ]);

        $case->update($validated);

        NotificationService::caseUpdated($case, $pdl, Auth::user());

        return redirect()->back()->with('success', 'Case information updated successfully');
    }

    public function updateCaseStatus(Request $request, $caseId)
    {


        $request->validate([
            'case_status' => 'required|in:bonded,transferred,served,dismissed,pending,convicted,deceased,on_trial',
        ]);

        $case = CaseInformation::findOrFail($caseId);
        $case->update([
            'case_status' => $request->case_status,
        ]);

        return redirect()->back()->with('success', 'Case status updated successfully');
    }

    public function destroy(CaseInformation $case)
    {
        $case->delete();
        return redirect()->back()->with('success', 'Case information deleted successfully.');
    }
}
