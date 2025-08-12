<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\PhysicalCharacteristic;
use App\Models\Pdl;
use Illuminate\Support\Facades\Validator;

class PhysicalCharacteristicController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');

        $characteristics = PhysicalCharacteristic::with('pdl:id,fname,lname')
            ->when($search, function ($query, $search) {
                $query->where('build', 'like', "%{$search}%")
                    ->orWhere('complexion', 'like', "%{$search}%")
                    ->orWhere('hair_color', 'like', "%{$search}%")
                    ->orWhere('eye_color', 'like', "%{$search}%")
                    ->orWhereHas('pdl', function ($q) use ($search) {
                        $q->where('fname', 'like', "%{$search}%")
                          ->orWhere('lname', 'like', "%{$search}%");
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

        PhysicalCharacteristic::create($validated);

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
