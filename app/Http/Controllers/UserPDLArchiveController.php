<?php

namespace App\Http\Controllers;

use App\Models\Personnel;
use App\Models\Pdl;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserPDLArchiveController extends Controller
{
    public function index()
    {
        $archivedPersonnel = Personnel::onlyTrashed()
            ->with(['pdls' => function($query) {
                $query->withTrashed();
            }])
            ->get()
            ->map(function($personnel) {
                return [
                    'id' => $personnel->id,
                    'name' => $personnel->fname . ' ' . $personnel->lname,
                    'username' => $personnel->username,
                    'position' => $personnel->position,
                    'agency' => $personnel->agency,
                    'deleted_at' => $personnel->deleted_at->format('Y-m-d H:i:s'),
                    'type' => 'personnel'
                ];
            });

        // Get archived PDLs using the new archive system (archive_status is not null)
        $archivedPdls = Pdl::whereNotNull('archive_status')
            ->with(['personnel:id,fname,lname'])
            ->get()
            ->map(function($pdl) {
                return [
                    'id' => $pdl->id,
                    'fname' => $pdl->fname,
                    'lname' => $pdl->lname,
                    'alias' => $pdl->alias,
                    'birthdate' => $pdl->birthdate,
                    'gender' => $pdl->gender,
                    'age' => $pdl->age,
                    'added_by' => $pdl->personnel ? $pdl->personnel->fname . ' ' . $pdl->personnel->lname : null,
                    'archive_status' => $pdl->archive_status,
                    'archive_reason' => $pdl->archive_reason,
                    'archive_court_order_type' => $pdl->archive_court_order_type,
                    'archive_court_order_file' => $pdl->archive_court_order_file,
                    'archive_case_number' => $pdl->archive_case_number,
                    'archive_court_order_date' => $pdl->archive_court_order_date ? (is_string($pdl->archive_court_order_date) ? $pdl->archive_court_order_date : $pdl->archive_court_order_date->format('Y-m-d H:i:s')) : null,
                    'archived_at' => $pdl->archived_at ? (is_string($pdl->archived_at) ? $pdl->archived_at : $pdl->archived_at->format('Y-m-d H:i:s')) : null,
                    'type' => 'pdl'
                ];
            });

        return Inertia::render('admin/archive/list', [
            'archivedUsers' => [
                'personnel' => $archivedPersonnel,
                'pdls' => $archivedPdls
            ],
            'userRole' => Auth::user()->position ?? 'admin'
        ]);
    }

    public function unarchivePdl(Request $request, Pdl $pdl)
    {

        try {
            Log::info('Unarchive request for PDL ID: ' . $pdl->id);
            Log::info('PDL before unarchive:', $pdl->toArray());

            // Validate the request data
            $validated = $request->validate([
                'unarchive_reason' => 'required|string|max:1000',
                'unarchive_remarks' => 'nullable|string|max:1000',
                'cases' => 'required|array|min:1',
                'cases.*.case_number' => 'required|string|max:255',
                'cases.*.crime_committed' => 'required|string|max:255',
                'cases.*.date_committed' => 'required|date',
                'cases.*.time_committed' => 'required',
                'cases.*.case_status' => 'required|string|in:open,pending,on_trial,convicted,dismissed',
                'cases.*.case_remarks' => 'nullable|string',
                'cases.*.security_classification' => 'required|string|in:low,medium,high,maximum',
                'cases.*.drug_related' => 'required|boolean',
                'physical_appearances' => 'required|array|min:1',
                'physical_appearances.*.height' => 'nullable|string|max:50',
                'physical_appearances.*.weight' => 'nullable|string|max:50',
                'physical_appearances.*.build' => 'nullable|string|max:100',
                'physical_appearances.*.complexion' => 'nullable|string|max:100',
                'physical_appearances.*.hair_color' => 'nullable|string|max:100',
                'physical_appearances.*.eye_color' => 'nullable|string|max:100',
                'physical_appearances.*.identification_marks' => 'nullable|string|max:1000',
                'physical_appearances.*.mark_location' => 'nullable|string|max:255',
                'physical_appearances.*.remark' => 'nullable|string|max:1000',
                'physical_appearances.*.pc_remark' => 'nullable|string|max:1000',
            ]);

            // Start database transaction
            DB::beginTransaction();

            // Clear archive information
            $pdl->update([
                'archive_status' => null,
                'archive_reason' => null,
                'archive_court_order_type' => null,
                'archive_court_order_file' => null,
                'archive_case_number' => null,
                'archive_court_order_date' => null,
                'archived_at' => null,
            ]);

            // Create new case records
            foreach ($validated['cases'] as $caseData) {
                $pdl->cases()->create([
                    'case_number' => $caseData['case_number'],
                    'crime_committed' => $caseData['crime_committed'],
                    'date_committed' => $caseData['date_committed'],
                    'time_committed' => $caseData['time_committed'],
                    'case_status' => $caseData['case_status'],
                    'case_remarks' => $caseData['case_remarks'] ?? '',
                    'security_classification' => $caseData['security_classification'],
                    'drug_related' => $caseData['drug_related'],
                ]);
            }

            // Create new physical characteristic records
            foreach ($validated['physical_appearances'] as $appearanceData) {
                $pdl->physicalCharacteristics()->create([
                    'height' => $appearanceData['height'] ?? null,
                    'weight' => $appearanceData['weight'] ?? null,
                    'build' => $appearanceData['build'] ?? null,
                    'complexion' => $appearanceData['complexion'] ?? null,
                    'hair_color' => $appearanceData['hair_color'] ?? null,
                    'eye_color' => $appearanceData['eye_color'] ?? null,
                    'identification_marks' => $appearanceData['identification_marks'] ?? null,
                    'mark_location' => $appearanceData['mark_location'] ?? null,
                    'remark' => $appearanceData['remark'] ?? null,
                    'pc_remark' => $appearanceData['pc_remark'] ?? null,
                ]);
            }

            // Log the unarchive reason and remarks
            Log::info('Unarchive reason: ' . $validated['unarchive_reason']);
            Log::info('Unarchive remarks: ' . ($validated['unarchive_remarks'] ?? 'None'));
            Log::info('Cases created: ' . count($validated['cases']));

            DB::commit();

            Log::info('PDL after unarchive:', $pdl->fresh()->toArray());

            return redirect()->back()->with('success', 'PDL record has been successfully unarchived with ' . count($validated['cases']) . ' new case(s).');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Unarchive error: ' . $e->getMessage());
            Log::error('Unarchive error trace: ' . $e->getTraceAsString());
            return redirect()->back()->withErrors(['error' => 'Failed to unarchive PDL: ' . $e->getMessage()]);
        }
    }
    public function restorePersonnel(Request $request, $personnelId)
    {
        try {
            Log::info('Restore request for Personnel ID: ' . $personnelId);

            // Use the route parameter, not request ID
            $personnel = Personnel::withTrashed()->find($personnelId);

            if (!$personnel) {
                Log::error('Personnel not found with ID: ' . $personnelId);
                return redirect()->back()->withErrors(['error' => 'Personnel not found']);
            }

            Log::info('Personnel before restore:', ['id' => $personnel->id, 'name' => $personnel->name, 'deleted_at' => $personnel->deleted_at]);

            $personnel->restore();

            Log::info('Personnel restored successfully:', ['id' => $personnel->id, 'deleted_at' => $personnel->fresh()->deleted_at]);

            return redirect()->back()->with('success', 'Personnel record has been successfully restored.');

        } catch (\Exception $e) {
            Log::error('Restore personnel error: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Failed to restore personnel: ' . $e->getMessage()]);
        }
    }
}
