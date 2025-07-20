<?php

namespace App\Http\Controllers\RecordOfficer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\PDL\CreatePdlRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\Pdl;
use App\Models\CourtOrder;

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

    public function court_order(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('perPage', 10);

        $pdls = Pdl::select('id', 'fname', 'lname', 'birthdate')->get();

        $orders = CourtOrder::with('pdl:id,fname,lname')
            ->when($search, function ($query, $search) {
                $query->where('court_order_number', 'like', "%{$search}%")
                    ->orWhere('order_type', 'like', "%{$search}%")
                    ->orWhere('document_type', 'like', "%{$search}%")
                    ->orWhere('court_branch', 'like', "%{$search}%")
                    ->orWhereHas('pdl', function ($q) use ($search) {
                        $q->where('fname', 'like', "%{$search}%")
                            ->orWhere('lname', 'like', "%{$search}%");
                    });
            })
            ->latest()
            ->paginate($perPage);

        return Inertia::render('records-officer/pdl-management/court-order', [
            'courtOrders' => $orders->items(),
            'pdls' => $pdls,
            'filters' => [
                'search' => $search,
            ],
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'total' => $orders->total(),
            ]
        ]);
    }

    public function store_court_order(Request $request)
    {
        $validated = $request->validate([
            'court_order_number' => 'required|string|max:255',
            'order_type' => 'required|string|max:255',
            'order_date' => 'required|date',
            'received_date' => 'required|date',
            'document_type' => 'required|string|max:255',
            'court_branch' => 'required|string|max:255',
            'pdl_id' => 'required|exists:pdl,id',
            'remarks' => 'nullable|string',
        ]);

        CourtOrder::create($validated);

        return redirect()->back()->with('success', 'Court order created successfully.');
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
