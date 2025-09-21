<?php

namespace App\Http\Controllers;

use App\Models\Personnel;
use App\Models\Pdl;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

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
            'userRole' => auth()->user()->position ?? 'admin'
        ]);
    }

    public function unarchivePdl(Request $request, Pdl $pdl)
    {
        try {
            Log::info('Unarchive request for PDL ID: ' . $pdl->id);
            Log::info('PDL before unarchive:', $pdl->toArray());

            $pdl->update([
                'archive_status' => null,
                'archive_reason' => null,
                'archive_court_order_type' => null,
                'archive_court_order_file' => null,
                'archive_case_number' => null,
                'archive_court_order_date' => null,
                'archived_at' => null,
            ]);

            Log::info('PDL after unarchive:', $pdl->fresh()->toArray());

            return redirect()->back()->with('success', 'PDL record has been successfully unarchived.');
        } catch (\Exception $e) {
            Log::error('Unarchive error: ' . $e->getMessage());
            Log::error('Unarchive error trace: ' . $e->getTraceAsString());
            return redirect()->back()->withErrors(['error' => 'Failed to unarchive PDL: ' . $e->getMessage()]);
        }
    }

    public function restorePersonnel(Request $request, Personnel $personnel)
    {
        try {
            Log::info('Restore request for Personnel ID: ' . $personnel->id);
            Log::info('Personnel before restore:', $personnel->toArray());

            $personnel->restore();

            Log::info('Personnel after restore:', $personnel->fresh()->toArray());

            return redirect()->back()->with('success', 'Personnel record has been successfully restored.');
        } catch (\Exception $e) {
            Log::error('Restore personnel error: ' . $e->getMessage());
            Log::error('Restore personnel error trace: ' . $e->getTraceAsString());
            return redirect()->back()->withErrors(['error' => 'Failed to restore personnel: ' . $e->getMessage()]);
        }
    }
}
