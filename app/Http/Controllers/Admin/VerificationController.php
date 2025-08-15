<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Verifications;
use Illuminate\Support\Facades\Auth;

class VerificationController extends Controller
{
    public function index(Request $request)
    {
        $verifications = Verifications::with([
            'personnel:id,fname,lname',
            'pdl' => function ($query) {
                $query->with([
                    'physicalCharacteristics',
                    'courtOrders',
                    'medicalRecords',
                    'cases',
                    'personnel:id,fname,lname'
                ]);
            },
            'reviewer:id,fname,lname'
        ])
            ->where('status', '!=', 'approved')
            ->latest();

        if ($request->search) {
            $search = $request->search;
            $verifications->where(function ($query) use ($search) {
                $query->where('reason', 'like', "%{$search}%")
                    ->orWhereHas('pdl', function ($q) use ($search) {
                        $q->where('fname', 'like', "%{$search}%")
                            ->orWhere('lname', 'like', "%{$search}%");
                    });
            });
        }

        $verifications = $verifications->get();

        return Inertia::render('admin/verification/list', [
            'verifications' => $verifications->map(function ($verification) {
                return [
                    'verification_id' => $verification->verification_id,
                    'reason' => $verification->reason,
                    'status' => $verification->status,
                    'feedback' => $verification->feedback,
                    'reviewed_at' => $verification->reviewed_at,
                    'personnel' => $verification->personnel,
                    'reviewer' => $verification->reviewer,
                    'pdl' => $verification->pdl ? [
                        'id' => $verification->pdl->id,
                        'fname' => $verification->pdl->fname,
                        'lname' => $verification->pdl->lname,
                        'alias' => $verification->pdl->alias,
                        'birthdate' => $verification->pdl->birthdate,
                        'personnel' => $verification->pdl->personnel,
                        'physical_characteristics' => $verification->pdl->physicalCharacteristics,
                        'court_orders' => $verification->pdl->courtOrders,
                        'medical_records' => $verification->pdl->medicalRecords,
                        'cases' => $verification->pdl->cases,
                    ] : null,
                    'created_at' => $verification->created_at,
                ];
            }),
            'filters' => $request->only(['search']),
        ]);
    }

    public function update(Request $request, Verifications $verification)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected,pending',
            'feedback' => 'required_if:status,rejected|string|max:500',
        ]);

        $user = Auth::user();

        $verification->update([
            'status' => $validated['status'],
            'feedback' => $validated['feedback'] ?? null,
            'reviewed_by' => $user->id,
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'Verification status updated successfully');
    }
}
