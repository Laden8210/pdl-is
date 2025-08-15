<?php

namespace App\Http\Controllers\RecordOfficer;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreatePDLOnePageRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\PDL\CreatePdlRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\Pdl;
use App\Models\CourtOrder;
use App\Http\Requests\PDL\TransferRequest;
use App\Models\SystemNotification;
use App\Models\Verifications;
use Illuminate\Support\Facades\DB;

class PDLManagementController extends Controller
{
    public function personal_information()
    {
        $pdls = Pdl::with([
            'personnel:id,fname,lname',
            'verifications:verification_id,status,pdl_id,reviewed_by,reviewed_at'
        ])->latest()->get();

        return Inertia::render('records-officer/pdl-management/personal-information', [
            'pdls' => $pdls->map(function ($pdl) {
                return [
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
                    'created_at' => $pdl->created_at,
                    'personnel' => $pdl->personnel,
                    'verifications' => $pdl->verifications->map(function ($verification) {
                        return [
                            'verification_id' => $verification->verification_id,
                            'status' => $verification->status,
                            'reviewed_at' => $verification->reviewed_at,
                            'reviewed_by' => $verification->reviewed_by,
                        ];
                    }),
                ];
            }),
        ]);
    }
    public function personal_information_admin()
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
            ->where('status', '=', 'approved')
            ->latest()
            ->get();

        return Inertia::render('records-officer/pdl-management/personal-information-admin', [
            'verifications' => $verifications->map(function ($verification) {
                $pdl = $verification->pdl;

                return [
                    'verification_id' => $verification->verification_id,
                    'reason' => $verification->reason,
                    'status' => $verification->status,
                    'feedback' => $verification->feedback,
                    'reviewed_at' => $verification->reviewed_at,
                    'personnel' => $verification->personnel,
                    'reviewer' => $verification->reviewer,
                    'created_at' => $verification->created_at,
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

    public function transfer(TransferRequest $request)
    {
        $validated = $request->validated();
        $user = Auth::user();

        SystemNotification::create([
            'title'        => 'PDL Transfer',
            'message'      => 'PDL with ID ' . $validated['pdl_id'] . ' has been transferred. Reason: ' . $validated['reason'],
            'personnel_id' => $user->id,
            'pdl_id'       => $validated['pdl_id'],
        ]);

        $validated['personnel_id'] = $user->id;
        Verifications::create($validated);
        return redirect()->back()->with('success', 'PDL transferred successfully.');
    }

    public function view_create()
    {
        return Inertia::render('records-officer/pdl-management/create-pdl-information');
    }

    public function store_create(CreatePDLOnePageRequest $request)
    {
        DB::beginTransaction();
        $user = Auth::user();

        try {

            $pdl = Pdl::create([
                'fname' => $request->fname,
                'lname' => $request->lname,
                'alias' => $request->alias,
                'birthdate' => $request->birthdate,
                'age' => $request->age,
                'gender' => $request->gender,
                'ethnic_group' => $request->ethnic_group,
                'civil_status' => $request->civil_status,
                'brgy' => $request->brgy,
                'city' => $request->city,
                'province' => $request->province,
                'personnel_id' => $user->id,
            ]);

            // Create Court Order
            $pdl->courtOrders()->create([
                'court_order_number' => $request->court_order_number,
                'order_type' => $request->order_type,
                'order_date' => $request->order_date,
                'received_date' => $request->received_date,
                'remarks' => $request->cod_remarks,
                'document_type' => $request->document_type,
                'court_branch' => $request->court_branch,
            ]);

            // Create Medical Record
            $pdl->medicalRecords()->create([
                'complaint' => $request->complaint,
                'date' => $request->date,
                'prognosis' => $request->prognosis,
                'laboratory' => $request->laboratory,
                'prescription' => $request->prescription,
                'findings' => $request->findings,
            ]);

            // Create Physical Characteristics
            $pdl->physicalCharacteristics()->create([
                'height' => $request->height,
                'weight' => $request->weight,
                'build' => $request->build,
                'complexion' => $request->complexion,
                'hair_color' => $request->hair_color,
                'eye_color' => $request->eye_color,
                'identification_marks' => $request->identification_marks,
                'mark_location' => $request->mark_location,
                'remark' => $request->pc_remark,
            ]);

            // Create Cases
            foreach ($request->cases as $caseData) {
                $pdl->cases()->create([
                    'case_number' => $caseData['case_number'],
                    'crime_committed' => $caseData['crime_committed'],
                    'date_committed' => $caseData['date_committed'],
                    'time_committed' => $caseData['time_committed'],
                    'case_status' => $caseData['case_status'],
                    'case_remarks' => $caseData['case_remarks'],
                    'security_classification' => $caseData['security_classification'],
                ]);
            }

            DB::commit();

            SystemNotification::create([
                'title'        => 'PDL ',
                'message'      => 'PDL with ID ' . $pdl->id . ' (' . $pdl->fname . ' ' . $pdl->lname . ') has been created. Court Order: ' . $request->court_order_number . ', Case Count: ' . count($request->cases),
                'personnel_id' => $user->id,
                'pdl_id'       => $pdl->id,
            ]);
            return redirect()->back()->with('success', 'PDL record created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to create PDL record: ' . $e->getMessage());
        }
    }
}
