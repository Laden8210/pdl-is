<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Pdl;
use App\Models\Cells;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\CreateCellRequest;
use App\Http\Requests\EditCellRequest;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\StoreCellAssignmentRequest;
use App\Models\CellAssignment;
use App\Models\CellTransferLog;

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

        // Update this query to include classification
        $pdls = Pdl::whereDoesntHave('assignments')
            ->whereHas('verifications', function ($query) {
                $query->where('status', 'approved');
            })
            ->with(['cases'])
            ->get()
            ->map(function ($pdl) {
                $pdl->classification = $pdl->highest_classification;
                return $pdl;
            });


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

            // Check classification compatibility
            if (strtolower($cell->classification) !== strtolower($pdl->highest_classification)) {
                $errors[] = "PDL {$pdl->fname} {$pdl->lname} (Classification: {$pdl->highest_classification}) cannot be assigned to {$cell->cell_name} (Classification: {$cell->classification})";
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

            return redirect()->back()->with('success', $message);
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

    public function transfer(Request $request)
    {
        $validated = $request->validate([
            'assignment_id' => 'required|exists:cell_assignments,assignment_id',
            'to_cell_id' => 'required|exists:cells,cell_id',
            'reason' => 'nullable|string|max:500',
        ]);

        $assignment = CellAssignment::with(['cell', 'pdl'])->findOrFail($validated['assignment_id']);
        $toCell = Cells::findOrFail($validated['to_cell_id']);

        // Check if transferring to the same cell
        if ($assignment->cell_id === $validated['to_cell_id']) {
            return back()->withErrors(['to_cell_id' => 'Cannot transfer PDL to the same cell.']);
        }



        // Check gender compatibility
        if (strtolower($assignment->pdl->gender) !== strtolower($toCell->gender)) {
            return back()->withErrors(['to_cell_id' => "PDL gender ({$assignment->pdl->gender}) does not match destination cell gender ({$toCell->gender})."]);
        }

        // Check classification compatibility
        if (strtolower($assignment->pdl->highest_classification) !== strtolower($toCell->classification)) {
            return back()->withErrors(['to_cell_id' => "PDL classification ({$assignment->pdl->highest_classification}) does not match destination cell classification ({$toCell->classification})."]);
        }

        // Start database transaction
        DB::beginTransaction();
        try {
            // Log the transfer before updating assignment
            CellTransferLog::create([
                'assignment_id' => $assignment->assignment_id,
                'pdl_id' => $assignment->pdl_id,
                'from_cell_id' => $assignment->cell_id,
                'to_cell_id' => $validated['to_cell_id'],
                'transferred_by' => Auth::id(),
                'reason' => $validated['reason'],
                'transferred_at' => now(),
            ]);

            // Update the assignment
            $assignment->update(['cell_id' => $validated['to_cell_id']]);

            DB::commit();

            return redirect()->back()
                ->with('success', "PDL {$assignment->pdl->fname} {$assignment->pdl->lname} has been successfully transferred from {$assignment->cell->cell_name} to {$toCell->cell_name}.");
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Transfer failed. Please try again.']);
        }
    }

    public function activityLog(Request $request)
    {
        $search = $request->input('search');
        $cellId = $request->input('cell_id');
        $perPage = $request->input('perPage', 10);

        $query = CellTransferLog::with([
            'pdl',
            'fromCell',
            'toCell',
            'transferredBy'
        ]);

        // Filter by specific cell if cell_id is provided
        if ($cellId) {
            $query->where(function ($q) use ($cellId) {
                $q->where('from_cell_id', $cellId)
                    ->orWhere('to_cell_id', $cellId);
            });
        }

        // Apply search filter
        $query->when($search, function ($query, $search) {
            $query->whereHas('pdl', function ($q) use ($search) {
                $q->where('fname', 'like', "%{$search}%")
                    ->orWhere('lname', 'like', "%{$search}%");
            })
                ->orWhereHas('fromCell', function ($q) use ($search) {
                    $q->where('cell_name', 'like', "%{$search}%");
                })
                ->orWhereHas('toCell', function ($q) use ($search) {
                    $q->where('cell_name', 'like', "%{$search}%");
                })
                ->orWhereHas('transferredBy', function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%");
                });
        });

        $transferLogs = $query->latest('transferred_at')->paginate($perPage);

        // Get cell information if filtering by specific cell
        $cell = null;
        if ($cellId) {
            $cell = Cells::find($cellId);
        }

        return Inertia::render('records-officer/pdl-management/cell-activity-log', [
            'transferLogs' => $transferLogs->items(),
            'cell' => $cell,
            'filters' => [
                'search' => $search,
                'cell_id' => $cellId,
            ],
            'pagination' => [
                'current_page' => $transferLogs->currentPage(),
                'last_page' => $transferLogs->lastPage(),
                'total' => $transferLogs->total(),
            ]
        ]);
    }
}
