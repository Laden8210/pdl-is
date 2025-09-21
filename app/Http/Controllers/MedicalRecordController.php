<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\NotificationService;
use App\Models\MedicalRecord;
use Illuminate\Support\Facades\Validator;
use App\Models\Pdl;
use Illuminate\Support\Facades\Auth;

class MedicalRecordController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');

        $records = MedicalRecord::with('pdl:id,fname,lname')
            ->when($search, function ($query, $search) {
                $searchTerm = strtolower(trim($search));
                $query->where(function ($q) use ($searchTerm) {
                    $q->whereRaw('LOWER(complaint) LIKE ?', ["%{$searchTerm}%"])
                        ->orWhereRaw('LOWER(prognosis) LIKE ?', ["%{$searchTerm}%"])
                        ->orWhereRaw('LOWER(laboratory) LIKE ?', ["%{$searchTerm}%"])
                        ->orWhereRaw('LOWER(findings) LIKE ?', ["%{$searchTerm}%"])
                        ->orWhereRaw('LOWER(prescription) LIKE ?', ["%{$searchTerm}%"])
                        ->orWhereHas('pdl', function ($pdlQuery) use ($searchTerm) {
                            $pdlQuery->whereRaw('LOWER(fname) LIKE ?', ["%{$searchTerm}%"])
                                ->orWhereRaw('LOWER(lname) LIKE ?', ["%{$searchTerm}%"])
                                ->orWhereRaw('LOWER(CONCAT(fname, " ", lname)) LIKE ?', ["%{$searchTerm}%"]);
                        });
                });
            })
            ->latest()
            ->get();

        $pdls = Pdl::select('id', 'fname', 'lname')->get();


        return Inertia::render('records-officer/pdl-management/medical-records', [
            'records' => $records,
            'pdls' => $pdls,
            'filters' => [
                'search' => $search,
            ],
            'searchPerformed' => !empty($search),
            'totalResults' => $records->count(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pdl_id' => 'required|exists:pdl,id',
            'complaint' => 'required|string|max:1000',
            'date' => 'required|date',
            'prognosis' => 'required|string|max:1000',
            'prescription' => 'required|string|max:1000',
            'findings' => 'required|string|max:1000',
        ]);

        $medicalRecord = MedicalRecord::create($validated);
        $pdl = Pdl::findOrFail($validated['pdl_id']);

        NotificationService::medicalRecordCreated($medicalRecord, $pdl, Auth::user());

        return redirect()->route('medical-records.index')
            ->with('success', 'Medical record created successfully');
    }

    public function edit($id)
    {
        $record = MedicalRecord::findOrFail($id);
        return Inertia::render('records-officer/pdl-management/edit-medical-record', [
            'record' => $record
        ]);
    }

    public function update(Request $request, MedicalRecord $medicalRecord)
    {
        $validated = $request->validate([
            'pdl_id' => 'required|exists:pdl,id',
            'complaint' => 'required|string|max:1000',
            'date' => 'required|date',
            'prognosis' => 'required|string|max:1000',
            'prescription' => 'required|string|max:1000',
            'findings' => 'required|string|max:1000',
        ]);

        $medicalRecord->update($validated);

        return redirect()->route('medical-records.index')
            ->with('success', 'Medical record updated successfully');
    }

    public function destroy(MedicalRecord $medicalRecord)
    {
        $medicalRecord->delete();
        return redirect()->route('medical-records.index')
            ->with('success', 'Medical record deleted successfully');
    }
}
