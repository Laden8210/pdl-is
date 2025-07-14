<?php

namespace App\Http\Controllers\RecordOfficer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\PDL\CreatePdlRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\Pdl;

class PDLManagementController extends Controller
{
    public function personal_information()
    {
        $pdls = Pdl::with('personnel:id,fname,lname')->latest()->get();

        return Inertia::render('records-officer/pdl-management/personal-information', [
            'pdls' => $pdls,
        ]);
    }

    public function health_assessment()
    {
        return Inertia::render('records-officer/pdl-management/health-assessment');
    }
    public function medical_records()
    {
        return Inertia::render('records-officer/pdl-management/medical-records');
    }

    public function create(CreatePdlRequest $request)
    {
        $validated = $request->validated();
        $user = Auth::user();
        $validated['personnel_id'] = $user->id;
        Pdl::create($validated);

        return redirect()->back()->with('success', 'PDL record created successfully.');
    }

    public function update(CreatePdlRequest $request, Pdl $pdl)
    {
        $pdl->update($request->validated());

        return redirect()->back()->with('success', 'PDL record updated successfully.');
    }
}
