<?php

namespace App\Http\Controllers;

use App\Models\Pdl;
use App\Models\CaseInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PdlArchiveController extends Controller
{
    /**
     * Show the archive form for a specific PDL
     */
    public function showArchiveForm(Pdl $pdl)
    {

        return Inertia::render('admin/pdl/archive', [
            'pdl' => $pdl->load(['personnel', 'cases', 'physicalCharacteristics', 'medicalRecords', 'courtOrders']),
            'archiveStatusOptions' => Pdl::getArchiveStatusOptions(),
            'existingCaseNumbers' => $pdl->cases->pluck('case_number')->filter()->toArray()
        ]);
    }

    /**
     * Archive a PDL record
     */
    public function archive(Request $request, Pdl $pdl)
    {


        $request->validate([
            'archive_status' => 'required|in:' . implode(',', array_keys(Pdl::getArchiveStatusOptions())),
            'archive_reason' => 'required|string|max:1000',
            'archive_case_number' => 'required|string|max:255',
            'archive_court_order' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240', // 10MB max
            'archive_notes' => 'nullable|string|max:1000',
            'admission_date' => 'nullable|date',
            'release_date' => 'nullable|date|after_or_equal:admission_date',
        ]);

        // Validate case number exists in PDL's cases
        $pdl = Pdl::with('cases')->findOrFail($pdl->id);
        $existingCaseNumbers = $pdl->cases->pluck('case_number')->filter()->toArray();

        if (!in_array($request->archive_case_number, $existingCaseNumbers)) {
            return redirect()->back()->withErrors([
                'archive_case_number' => 'The case number must match one of the existing case numbers for this PDL.'
            ]);
        }

        // Handle court order file upload
        $courtOrderPath = null;
        if ($request->hasFile('archive_court_order')) {
            $file = $request->file('archive_court_order');
            $fileName = 'court_order_' . $pdl->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $courtOrderPath = $file->storeAs('court_orders', $fileName, 'public');
        }

        $pdl->update([
            'archive_status' => $request->archive_status,
            'archive_reason' => $request->archive_reason,
            'archive_case_number' => $request->archive_case_number,
            'archive_court_order_path' => $courtOrderPath,
            'archive_notes' => $request->archive_notes,
            'archived_at' => now(),
            'admission_date' => $request->admission_date,
            'release_date' => $request->release_date,
        ]);

        return redirect()->back()->with('success', 'PDL record has been successfully archived.');
    }

    /**
     * Unarchive a PDL record
     */
    public function unarchive(Pdl $pdl)
    {


        $pdl->update([
            'archive_status' => null,
            'archive_reason' => null,
            'archive_notes' => null,
            'archived_at' => null,
        ]);

        return redirect()->back()->with('success', 'PDL record has been successfully unarchived.');
    }

    /**
     * Update custody dates for a PDL
     */
    public function updateCustodyDates(Request $request, Pdl $pdl)
    {

        dd($request->all());
        $request->validate([
            'admission_date' => 'nullable|date',
            'release_date' => 'nullable|date|after_or_equal:admission_date',
        ]);

        $pdl->update([
            'admission_date' => $request->admission_date,
            'release_date' => $request->release_date,
        ]);

        return redirect()->back()->with('success', 'Custody dates have been updated successfully.');
    }

    /**
     * Get archived PDLs
     */
    public function archived()
    {


        $archivedPdls = Pdl::whereNotNull('archived_at')
            ->with(['personnel', 'cases'])
            ->orderBy('archived_at', 'desc')
            ->paginate(20);

        return Inertia::render('admin/pdl/archived', [
            'archivedPdls' => $archivedPdls
        ]);
    }

    /**
     * Get archive status statistics
     */
    public function getArchiveStats()
    {


        $stats = [
            'total_active' => Pdl::whereNull('archived_at')->count(),
            'total_archived' => Pdl::whereNotNull('archived_at')->count(),
            'by_status' => Pdl::whereNotNull('archived_at')
                ->selectRaw('archive_status, COUNT(*) as count')
                ->groupBy('archive_status')
                ->pluck('count', 'archive_status')
                ->toArray(),
        ];

        return response()->json($stats);
    }
}
