<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Verifications;
use App\Models\TimeAllowance;

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
                    'timeAllowances' 
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

        return redirect()->back()->with('success', 'Time allowance updated successfully.');
    }
}
