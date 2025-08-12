<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Pdl;
use App\Models\Cells;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\CreateCellRequest;
use App\Http\Requests\EditCellRequest;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\StoreCellAssignmentRequest;
use App\Models\CellAssignment;

class CellAssignmentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('perPage', 10);

        $assignments = CellAssignment::with(['cell', 'pdl'])
            ->when($search, function ($query, $search) {
                $query->whereHas('cell', function ($q) use ($search) {
                    $q->where('cell_name', 'like', "%{$search}%");
                })
                    ->orWhereHas('pdl', function ($q) use ($search) {
                        $q->where('fname', 'like', "%{$search}%")
                            ->orWhere('lname', 'like', "%{$search}%");
                    });
            })
            ->latest()
            ->paginate($perPage);

        $cells = Cells::all();
        $pdls = Pdl::all();

        return Inertia::render('records-officer/pdl-management/cell-assignment', [
            'assignments' => $assignments->items(),
            'cells' => $cells,
            'pdls' => $pdls,
            'filters' => [
                'search' => $search,
            ],

            'pagination' => [
                'current_page' => $assignments->currentPage(),
                'last_page' => $assignments->lastPage(),
                'total' => $assignments->total(),
            ]
        ]);
    }

    public function assign(Request $request)
    {
        $validated = $request->validate([
            'cell_id' => 'required|exists:cells,cell_id',
            'pdl_id' => 'required|exists:pdl,id',
        ]);


        $cell = Cells::find($validated['cell_id']);
        $currentOccupancy = CellAssignment::where('cell_id', $validated['cell_id'])->count();

        if ($currentOccupancy >= $cell->capacity) {
            return back()->withErrors([
                'cell_id' => 'This cell has reached its capacity'
            ]);
        }

        $existingAssignment = CellAssignment::where('pdl_id', $validated['pdl_id'])->first();
        if ($existingAssignment) {
            return back()->withErrors([
                'pdl_id' => 'This PDL is already assigned to a cell'
            ]);
        }

        $assignment = CellAssignment::create([
            'cell_id' => $validated['cell_id'],
            'pdl_id' => $validated['pdl_id'],
        ]);

        return redirect()->route('cell-assignments.index')
            ->with('success', 'Cell assignment created successfully');
    }


    public function cell_management(Request $request)
    {

        $search = $request->input('search');

        $cells = Cells::withCount('assignments')
            ->when($search, function ($query, $search) {
                $query->where('cell_name', 'like', "%{$search}%");
            })
            ->get();

        return Inertia::render('records-officer/pdl-management/cell-management', [
            'cells' => $cells,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(CreateCellRequest $request)
    {
        $validated = $request->validated();
        $user = Auth::user();
        $validated['personnel_id'] = $user->id;
        Cells::create($validated);

        return redirect()->back()->with('success', 'Cell record created successfully.');
    }

    public function update(EditCellRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $cell = Cells::findOrFail($validated['cell_id']);

        $cell->update($validated);

        return redirect()->back()->with('success', 'Cell updated successfully.');
    }
}
