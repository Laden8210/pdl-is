<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\MedicalRecord;
use App\Models\Pdl;
use Illuminate\Support\Facades\Validator;

class MedicalRecordController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');

        $records = MedicalRecord::with('pdl:id,fname,lname')
            ->when($search, function ($query, $search) {
                $query->where('complaint', 'like', "%{$search}%")
                    ->orWhere('prognosis', 'like', "%{$search}%")
                    ->orWhere('laboratory', 'like', "%{$search}%")
                    ->orWhere('findings', 'like', "%{$search}%")
                    ->orWhereHas('pdl', function ($q) use ($search) {
                        $q->where('fname', 'like', "%{$search}%")
                          ->orWhere('lname', 'like', "%{$search}%");
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
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pdl_id' => 'required|exists:pdl,id',
            'complaint' => 'required|string|max:1000',
            'date' => 'required|date',
            'prognosis' => 'required|string|max:1000',
            'laboratory' => 'required|string|max:1000',
            'prescription' => 'required|string|max:1000',
            'findings' => 'required|string|max:1000',
        ]);

        MedicalRecord::create($validated);

        return redirect()->route('medical-records.index')
            ->with('success', 'Medical record created successfully');
    }

    public function update(Request $request, MedicalRecord $medicalRecord)
    {
        $validated = $request->validate([
            'pdl_id' => 'required|exists:pdl,id',
            'complaint' => 'required|string|max:1000',
            'date' => 'required|date',
            'prognosis' => 'required|string|max:1000',
            'laboratory' => 'required|string|max:1000',
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
