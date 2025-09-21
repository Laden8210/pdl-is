<?php

namespace App\Http\Controllers;

use App\Models\Pdl;
use App\Models\CaseInformation;
use App\Models\CourtOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
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
        ]);
    }

    /**
     * Archive a PDL record
     */
    public function archive(Request $request, Pdl $pdl)
    {
        try {
            // Check if PDL can be archived based on case status
            if (!$pdl->canBeArchived()) {
                $blockingCases = $pdl->getBlockingCases();
                $caseNumbers = $blockingCases->pluck('case_number')->join(', ');

                return redirect()->back()->withErrors([
                    'archive_error' => "Cannot archive PDL. There are still pending or open cases: {$caseNumbers}. Please update case status to 'convicted', 'deceased', or 'case closed' before archiving."
                ]);
            }

            $request->validate([
                'archive_status' => 'required|in:' . implode(',', array_keys(Pdl::getArchiveStatusOptions())),
                'archive_reason' => 'required|string|max:1000',
                'archive_court_order_type' => 'required|in:' . implode(',', array_keys(Pdl::getCourtOrderTypeOptions())),
                'archive_court_order_file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240', // 10MB max
            ]);

            // Handle file upload
            $file = $request->file('archive_court_order_file');
            $fileName = time() . '_' . $pdl->id . '_court_order.' . $file->getClientOriginalExtension();
            $filePath = $file->storeAs('archive/court_orders', $fileName, 'public');

            $pdl->update([
                'archive_status' => $request->archive_status,
                'archive_reason' => $request->archive_reason,
                'archive_court_order_type' => $request->archive_court_order_type,
                'archive_court_order_file' => $filePath,
                'archive_court_order_date' => now(),
                'archived_at' => now(),
            ]);

            return redirect()->back()->with('success', 'PDL record has been successfully archived with court order documentation.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors());
        } catch (\Exception $e) {
            Log::error('Archive error: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Failed to archive PDL: ' . $e->getMessage()]);
        }
    }

    /**
     * Unarchive a PDL record
     */
    public function unarchive(Pdl $pdl)
    {
        $pdl->update([
            'archive_status' => null,
            'archive_reason' => null,
            'archive_court_order_type' => null,
            'archive_court_order_file' => null,
            'archive_case_number' => null,
            'archive_court_order_date' => null,
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
