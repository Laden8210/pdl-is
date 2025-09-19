<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TimeAllowance;
use App\Models\Pdl;
use App\Services\NotificationService;
use App\Models\Verifications;

class TimeAllowanceController extends Controller
{
    public function index()
    {
        $verifications = Verifications::with([
            'personnel:id,fname,lname',
            'pdl' => function ($query) {
                $query->with([
                    'physicalCharacteristics',
                    'courtOrders',
                    'medicalRecords',
                    'cases',
                    'personnel:id,fname,lname',
                    'timeAllowances' => function ($query) {
                        $query->with('awardedBy:id,fname,lname')->orderBy('awarded_at', 'desc');
                    }
                ]);
            },
            'reviewer:id,fname,lname'
        ])
            ->where('status', '=', 'approved')
            ->latest()
            ->get();

        return Inertia::render('admin/time-allowance/list', [
            'verifications' => $verifications->map(function ($verification) {
                $pdl = $verification->pdl;

                // Calculate GCTA and TASTM
                $gcta = 0;
                $tastm = 0;

                if ($pdl && $pdl->timeAllowances) {
                    foreach ($pdl->timeAllowances as $allowance) {
                        if ($allowance->type === 'gcta') {
                            $gcta += $allowance->days;
                        } elseif ($allowance->type === 'tastm') {
                            $tastm += $allowance->days;
                        }
                    }
                }

                return [
                    'verification_id' => $verification->verification_id,
                    'reason' => $verification->reason,
                    'status' => $verification->status,
                    'feedback' => $verification->feedback,
                    'reviewed_at' => $verification->reviewed_at,
                    'personnel' => $verification->personnel,
                    'reviewer' => $verification->reviewer,
                    'created_at' => $verification->created_at,
                    'gcta_days' => $gcta,
                    'tastm_days' => $tastm,
                    'pdl' => $pdl ? [
                        'id' => $pdl->id,
                        'fname' => $pdl->fname,
                        'lname' => $pdl->lname,
                        'alias' => $pdl->alias,
                        'birthdate' => $pdl->birthdate,
                        'age' => $pdl->age,
                        'gender' => $pdl->gender,
                        'ethnic_group' => $pdl->ethnic_group,
                        'civil_status' => $pdl->civil_status,
                        'brgy' => $pdl->brgy,
                        'city' => $pdl->city,
                        'province' => $pdl->province,
                        'personnel' => $pdl->personnel,
                        'physical_characteristics' => $pdl->physicalCharacteristics,
                        'court_orders' => $pdl->courtOrders,
                        'medical_records' => $pdl->medicalRecords,
                        'cases' => $pdl->cases,
                        'years_served' => $pdl->years_served,
                        'default_gcta_days' => $pdl->default_gcta_days,
                        'default_tastm_days' => $pdl->default_tastm_days,
                        'admission_date' => $pdl->courtOrders()->whereNotNull('admission_date')->orderBy('admission_date', 'asc')->first()?->admission_date,
                        'release_date' => $pdl->courtOrders()->whereNotNull('release_date')->orderBy('release_date', 'desc')->first()?->release_date,
                        'time_allowance_records' => $pdl->timeAllowances->map(function ($allowance) {
                            return [
                                'id' => $allowance->id,
                                'type' => $allowance->type,
                                'days' => $allowance->days,
                                'reason' => $allowance->reason,
                                'awarded_by' => $allowance->awarded_by,
                                'awarded_at' => $allowance->awarded_at,
                                'awardedBy' => $allowance->awardedBy ? [
                                    'id' => $allowance->awardedBy->id,
                                    'fname' => $allowance->awardedBy->fname,
                                    'lname' => $allowance->awardedBy->lname,
                                ] : null,
                            ];
                        }),
                    ] : null,
                ];
            }),
        ]);
    }

    public function updateTimeAllowance(Request $request, $pdlId)
    {
        $request->validate([
            'type' => 'required|in:gcta,tastm',
            'days' => 'required|integer|min:0',
            'reason' => 'required|string'
        ]);

        TimeAllowance::create([
            'pdl_id' => $pdlId,
            'type' => $request->type,
            'days' => $request->days,
            'reason' => $request->reason,
            'awarded_by' => auth()->id(),
            'awarded_at' => now()
        ]);

        $pdl = Pdl::findOrFail($pdlId);
        NotificationService::timeAllowanceUpdated($pdl, $request->type, auth()->user());

        return redirect()->back()->with('success', 'Time allowance updated successfully.');
    }

    public function updateRecord(Request $request, $recordId)
    {
        $request->validate([
            'type' => 'required|in:gcta,tastm',
            'days' => 'required|integer|min:0',
            'reason' => 'required|string'
        ]);

        $record = TimeAllowance::findOrFail($recordId);

        $record->update([
            'type' => $request->type,
            'days' => $request->days,
            'reason' => $request->reason,
        ]);

        $pdl = $record->pdl;
        NotificationService::timeAllowanceUpdated($pdl, $request->type, auth()->user());

        return redirect()->back()->with('success', 'Time allowance record updated successfully.');
    }

    public function revoke($recordId)
    {
        $record = TimeAllowance::findOrFail($recordId);
        $pdl = $record->pdl;
        $type = $record->type;

        $record->delete();

        NotificationService::timeAllowanceUpdated($pdl, $type, auth()->user());

        return redirect()->back()->with('success', 'Time allowance record revoked successfully.');
    }
}
