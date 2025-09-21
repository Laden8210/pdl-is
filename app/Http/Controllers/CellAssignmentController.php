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
        $pdls = Pdl::whereDoesntHave('assignments')->get();



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
            'pdl_ids' => 'required|array',
            'pdl_ids.*' => 'exists:pdl,id',
        ]);

        $cell = Cells::find($validated['cell_id']);
        $currentOccupancy = CellAssignment::where('cell_id', $validated['cell_id'])->count();
        $selectedPdlsCount = count($validated['pdl_ids']);

        // Check capacity
        if ($currentOccupancy + $selectedPdlsCount > $cell->capacity) {
            $availableSpots = $cell->capacity - $currentOccupancy;
            return back()->withErrors([
                'cell_id' => "This cell only has {$availableSpots} available spot(s). You selected {$selectedPdlsCount} PDL(s)."
            ]);
        }

        $errors = [];
        $successfulAssignments = 0;

        foreach ($validated['pdl_ids'] as $pdlId) {
            $pdl = Pdl::find($pdlId);

            // Check if PDL is already assigned
            $existingAssignment = CellAssignment::where('pdl_id', $pdlId)->first();
            if ($existingAssignment) {
                $errors[] = "PDL {$pdl->fname} {$pdl->lname} is already assigned to a cell";
                continue;
            }

            // Check gender compatibility
            if (strtolower($cell->gender) !== strtolower($pdl->gender)) {
                $errors[] = "PDL {$pdl->fname} {$pdl->lname} (Gender: {$pdl->gender}) cannot be assigned to {$cell->cell_name} (Gender: {$cell->gender})";
                continue;
            }

            CellAssignment::create([
                'cell_id' => $validated['cell_id'],
                'pdl_id' => $pdlId,
            ]);
            $successfulAssignments++;
        }

        if ($successfulAssignments > 0) {
            $message = "Successfully assigned {$successfulAssignments} PDL(s) to the cell.";
            if (!empty($errors)) {
                $message .= " Some assignments failed.";
            }

            return redirect()->route('cell-assignments.index')
                ->with('success', $message)
                ->withErrors($errors);
        }

        return back()->withErrors($errors);
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
