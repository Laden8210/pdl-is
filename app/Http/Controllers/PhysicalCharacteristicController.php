<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\NotificationService;
use App\Models\Pdl;
use Illuminate\Support\Facades\Validator;
use App\Models\PhysicalCharacteristic;


class PhysicalCharacteristicController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');

        $characteristics = PhysicalCharacteristic::with('pdl:id,fname,lname')
            ->when($search, function ($query, $search) {
                $searchTerm = strtolower(trim($search));
                $query->where(function ($q) use ($searchTerm) {
                    $q->whereRaw('LOWER(build) LIKE ?', ["%{$searchTerm}%"])
                        ->orWhereRaw('LOWER(complexion) LIKE ?', ["%{$searchTerm}%"])
                        ->orWhereRaw('LOWER(hair_color) LIKE ?', ["%{$searchTerm}%"])
                        ->orWhereRaw('LOWER(eye_color) LIKE ?', ["%{$searchTerm}%"])
                        ->orWhereRaw('LOWER(identification_marks) LIKE ?', ["%{$searchTerm}%"])
                        ->orWhereRaw('LOWER(mark_location) LIKE ?', ["%{$searchTerm}%"])
                        ->orWhereRaw('LOWER(remark) LIKE ?', ["%{$searchTerm}%"])
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

        return Inertia::render('records-officer/pdl-management/physical-characteristics', [
            'characteristics' => $characteristics,
            'pdls' => $pdls,
            'filters' => [
                'search' => $search,
            ],
            'searchPerformed' => !empty($search),
            'totalResults' => $characteristics->count(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pdl_id' => 'required|exists:pdl,id',
            'height' => 'required|numeric|min:100|max:250',
            'weight' => 'required|numeric|min:30|max:300',
            'build' => 'required|string|max:50',
            'complexion' => 'required|string|max:50',
            'hair_color' => 'required|string|max:50',
            'eye_color' => 'required|string|max:50',
            'identification_marks' => 'required|string|max:255',
            'mark_location' => 'required|string|max:255',
            'remark' => 'nullable|string|max:1000',
        ]);

        $physicalCharacteristic = PhysicalCharacteristic::create($validated);
        $pdl = Pdl::findOrFail($validated['pdl_id']);

        NotificationService::physicalCharacteristicCreated($physicalCharacteristic, $pdl, auth()->user());

        return redirect()->route('physical-characteristics.index')
            ->with('success', 'Physical characteristic created successfully');
    }

    public function update(Request $request, PhysicalCharacteristic $characteristic)
    {
        $validated = $request->validate([
            'pdl_id' => 'required|exists:pdl,id',
            'height' => 'required|numeric|min:100|max:250',
            'weight' => 'required|numeric|min:30|max:300',
            'build' => 'required|string|max:50',
            'complexion' => 'required|string|max:50',
            'hair_color' => 'required|string|max:50',
            'eye_color' => 'required|string|max:50',
            'identification_marks' => 'required|string|max:255',
            'mark_location' => 'required|string|max:255',
            'remark' => 'nullable|string|max:1000',
        ]);

        $characteristic->update($validated);

        return redirect()->route('physical-characteristics.index')
            ->with('success', 'Physical characteristic updated successfully');
    }

    public function destroy(PhysicalCharacteristic $characteristic)
    {
        $characteristic->delete();
        return redirect()->route('physical-characteristics.index')
            ->with('success', 'Physical characteristic deleted successfully');
    }
}
