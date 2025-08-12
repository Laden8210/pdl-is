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
        $verifications = Verifications::with('personnel', 'pdl')
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
            'verifications' => $verifications,
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
