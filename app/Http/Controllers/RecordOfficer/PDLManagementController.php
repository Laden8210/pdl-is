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
use App\Services\NotificationService;
use App\Models\Verifications;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class PDLManagementController extends Controller
{
    public function personal_information()
    {
        $pdls = Pdl::with([
            'personnel:id,fname,lname',
            'verifications:verification_id,status,pdl_id,reviewed_by,reviewed_at',
            'physicalCharacteristics',
            'courtOrders',
            'medicalRecords',
            'cases'
        ])->latest()
        ->where('personnel_id', Auth::id())
        ->get();


        return Inertia::render('records-officer/pdl-management/personal-information', [
            'pdls' => $pdls->map(function ($pdl) {
                return [
                    'id' => $pdl->id,
                    'fname' => $pdl->fname,
                    'lname' => $pdl->lname,
                    'mname' => $pdl->mname,
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
                    'physical_characteristics' => $pdl->physicalCharacteristics,
                    'court_orders' => $pdl->courtOrders,
                    'medical_records' => $pdl->medicalRecords,
                    'cases' => $pdl->cases,
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
                ])->whereNull('archive_status'); 
            },
            'reviewer:id,fname,lname'
        ])
            ->where('status', '=', 'approved')
            ->whereHas('pdl', function ($query) {
                $query->whereNull('archive_status'); 
            })
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
                        'mname' => $pdl->mname,
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
                $query
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

    public function edit_court_order($id)
    {
        $order = CourtOrder::findOrFail($id);
        $pdls = Pdl::select('id', 'fname', 'lname')->get();
        return Inertia::render('records-officer/pdl-management/edit-court-order', [
            'order' => $order,
            'pdls' => $pdls
        ]);
    }

    public function update_court_order(Request $request, $courtOrderId)
    {


        $validated = $request->validate([

            'order_type' => 'required|string|max:255',
            'order_date' => 'required|date',
            'received_date' => 'required|date',
            'document_type' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png,txt|max:10240',
            'court_branch' => 'required|string|max:255',
            'pdl_id' => 'required|exists:pdl,id',
            'remarks' => 'nullable|string',
        ]);

        $courtOrder = CourtOrder::findOrFail($courtOrderId);

        // Handle document upload if provided
        if ($request->hasFile('document_type')) {
            $file = $request->file('document_type');
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $filename = time() . '_' . uniqid() . '.' . $extension;
            $documentPath = $file->storeAs('court_documents', $filename, 'public');

            $validated['document_type'] = pathinfo($originalName, PATHINFO_FILENAME);
            $validated['document_path'] = $documentPath;
            $validated['original_filename'] = $originalName;
        }

        $courtOrder->update($validated);

        return redirect()->back()->with('success', 'Court order updated successfully.');
    }

    public function destroy_court_order($courtOrderId)
    {
        $courtOrder = CourtOrder::findOrFail($courtOrderId);
        $courtOrder->delete();
        return redirect()->back()->with('success', 'Court order deleted successfully.');
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

        NotificationService::pdlUpdated($pdl, Auth::user());

        return redirect()->back()->with('success', 'PDL record updated successfully.');
    }

    public function transfer(TransferRequest $request)
    {
        $validated = $request->validated();
        $user = Auth::user();
        $pdl = Pdl::findOrFail($validated['pdl_id']);

        // check if pdl is already in verfication
        $verification = Verifications::where('pdl_id', $pdl->id)->where('status', 'pending')->first();
        if ($verification) {
            return redirect()->back()->with('error', 'PDL is already in verification.');
        }



        NotificationService::pdlTransferred($pdl, $validated['reason'], $user);

        $validated['personnel_id'] = $user->id;
        Verifications::create($validated);
        return redirect()->back()->with('success', 'PDL transferred successfully.');
    }

    public function view_create()
    {
        return Inertia::render('records-officer/pdl-management/create-pdl-information');
    }

    public function view_update($pdl_id)
    {
        $pdl = Pdl::with([
            'physicalCharacteristics',
            'courtOrders',
            'medicalRecords',
            'cases',
            'personnel:id,fname,lname,mname'
        ])->findOrFail($pdl_id);

        // Process medical records to include file information
        if ($pdl->medicalRecords) {
            $pdl->medicalRecords->transform(function ($record) {
                // Handle multiple files from original_filename and file_path
                if ($record->original_filename && $record->file_path) {
                    $record->files = array_map(function ($filename, $filePath) {
                        return [
                            'original_filename' => $filename,
                            'file_path' => $filePath,
                            'extension' => pathinfo($filename, PATHINFO_EXTENSION),
                            'size' => null, // We don't store file size in the current structure
                        ];
                    }, explode(',', $record->original_filename), explode(',', $record->file_path));
                } else {
                    $record->files = [];
                }

                // Handle single medical file from stored_filename
                if ($record->stored_filename && $record->file_path) {
                    $record->single_file = [
                        'original_filename' => $record->stored_filename,
                        'file_path' => $record->file_path,
                        'extension' => pathinfo($record->stored_filename, PATHINFO_EXTENSION),
                        'size' => null,
                    ];
                } else {
                    $record->single_file = null;
                }

                return $record;
            });
        }

        return Inertia::render('records-officer/pdl-management/update-pdl-information', [
            'pdl' => $pdl
        ]);
    }


    public function update_personal_information(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $user = Auth::user();

            // Fetch the PDL record
            $pdl = Pdl::findOrFail($id);
            $validated = $request->validate([
                'fname' => 'required|string|max:255|regex:/^[A-Za-z\s\-]+$/',
                'lname' => 'required|string|max:255|regex:/^[A-Za-z\s\-]+$/',
                'mname' => 'nullable|string|max:255|regex:/^[A-Za-z\s\-]+$/',
                'alias' => 'required|string|max:255|regex:/^[A-Za-z\s\-]+$/',
                'birthdate' => 'required|date',
                'age' => 'required|integer|min:18',
                'gender' => 'required|string|in:Male,Female',
                'ethnic_group' => 'required|string|max:255|regex:/^[A-Za-z\s\-]+$/',
                'civil_status' => 'required|string|in:Single,Married,Widowed,Divorced',
                'brgy' => 'required|string|max:255',
                'city' => 'required|string|max:255',
                'province' => 'required|string|max:255',
            ]);

            // Update main PDL info
            $pdl->update([
                'fname' => $request->fname,
                'lname' => $request->lname,
                'mname' => $request->mname ?? "",
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


            $documentPath = null;
            $documentFilename = null;
            if ($request->hasFile('document_type')) {
                $file = $request->file('document_type');
                $originalName = $file->getClientOriginalName();
                $extension = $file->getClientOriginalExtension();
                $filename = time() . '_' . uniqid() . '.' . $extension;
                $documentPath = $file->storeAs('court_documents', $filename, 'public');
                $documentFilename = $filename;
            }

            // Update or create Court Order
            if ($request->court_order_id) {
                $validated = $request->validate([
                    'order_type' => 'required|string|max:255',
                    'order_date' => 'required|date',
                    'received_date' => 'required|date',
                    'document_type' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png,txt|max:10240',
                    'court_branch' => 'required|string|max:255',

                    'remarks' => 'nullable|string',
                ]);
                $courtOrderData = [
                    'order_type' => $request->order_type,
                    'order_date' => $request->order_date,
                    'received_date' => $request->received_date,
                    'remarks' => $request->cod_remarks,
                    'court_branch' => $request->court_branch,
                ];

                // Only update document fields if new file was uploaded
                if ($documentPath) {
                    $courtOrderData['document_type'] = pathinfo($request->file('document_type')->getClientOriginalName(), PATHINFO_FILENAME);
                    $courtOrderData['document_path'] = $documentPath;
                    $courtOrderData['original_filename'] = $request->file('document_type')->getClientOriginalName();
                }

                $pdl->courtOrders()->updateOrCreate(
                    ['court_order_id' => $request->court_order_id],
                    $courtOrderData
                );
            } else {
                $validated = $request->validate([
                    'order_type' => 'required|string|max:255',
                    'order_date' => 'required|date',
                    'received_date' => 'required|date',
                    'document_type' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png,txt|max:10240',
                    'court_branch' => 'required|string|max:255',

                    'remarks' => 'nullable|string',
                ]);
                $courtOrderData = [
                    'order_type' => $request->order_type,
                    'order_date' => $request->order_date,
                    'received_date' => $request->received_date,
                    'remarks' => $request->cod_remarks,
                    'court_branch' => $request->court_branch,
                ];

                // Add file fields if file was uploaded
                if ($documentPath) {
                    $courtOrderData['document_type'] = pathinfo($request->file('document_type')->getClientOriginalName(), PATHINFO_FILENAME);
                    $courtOrderData['document_path'] = $documentPath;
                    $courtOrderData['original_filename'] = $request->file('document_type')->getClientOriginalName();
                }

                $pdl->courtOrders()->create($courtOrderData);
            }

            // Update or create Medical Record
            if ($request->medical_record_id) {
                $validated = $request->validate([
                    'complaint' => 'required|string',
                    'date' => 'required|date',
                    'prognosis' => 'required|string',

                    'prescription' => 'required|string',
                    'findings' => 'required|string',
                ]);
                $pdl->medicalRecords()->updateOrCreate(
                    ['medical_record_id' => $request->medical_record_id],
                    [
                        'complaint' => $request->complaint,
                        'date' => $request->date,
                        'prognosis' => $request->prognosis,

                        'prescription' => $request->prescription,
                        'findings' => $request->findings,
                    ]
                );
            } else {
                $validated = $request->validate([
                    'complaint' => 'required|string',
                    'date' => 'required|date',
                    'prognosis' => 'required|string',

                    'prescription' => 'required|string',
                    'findings' => 'required|string',
                ]);
                $medicalRecord = $pdl->medicalRecords()->create([
                    'complaint' => $request->complaint,
                    'date' => $request->date,
                    'prognosis' => $request->prognosis,

                    'prescription' => $request->prescription,
                    'findings' => $request->findings,
                ]);
            }

            // Handle Medical Document Uploads - only if new files are provided
            if ($request->hasFile('medical_files')) {
                // Get the medical record ID (either existing or newly created)
                $medicalRecordId = $request->medical_record_id ?: $pdl->medicalRecords()->latest()->first()?->medical_record_id;

                if ($medicalRecordId) {
                    $medicalRecord = $pdl->medicalRecords()->find($medicalRecordId);

                    // Handle multiple files
                    $filePaths = [];
                    $originalFilenames = [];

                    foreach ($request->file('medical_files') as $file) {
                        $originalName = $file->getClientOriginalName();
                        $extension = $file->getClientOriginalExtension();
                        $filename = time() . '_' . uniqid() . '.' . $extension;
                        $path = $file->storeAs('medical_documents', $filename, 'public');

                        $filePaths[] = $path;
                        $originalFilenames[] = $originalName;
                    }

                    // Update medical record with file information
                    $medicalRecord->update([
                        'stored_filename' => implode(',', $filePaths),
                        'file_path' => implode(',', $filePaths),
                        'original_filename' => implode(',', $originalFilenames),
                    ]);
                }
            }

            // Update or create Physical Characteristics
            if ($request->physical_characteristic_id) {
                $validated = $request->validate([
                    'height' => 'required|numeric',
                    'weight' => 'required|numeric',
                    'build' => 'required|string',
                    'complexion' => 'required|string',
                    'hair_color' => 'required|string',
                    'eye_color' => 'required|string',
                    'identification_marks' => 'required|string',
                    'mark_location' => 'required|string',
                    'pc_remark' => 'nullable|string',
                ]);
                $pdl->physicalCharacteristics()->updateOrCreate(
                    ['characteristic_id' => $request->physical_characteristic_id],
                    [
                        'height' => $request->height,
                        'weight' => $request->weight,
                        'build' => $request->build,
                        'complexion' => $request->complexion,
                        'hair_color' => $request->hair_color,
                        'eye_color' => $request->eye_color,
                        'identification_marks' => $request->identification_marks,
                        'mark_location' => $request->mark_location,
                        'remark' => $request->pc_remark,
                    ]
                );
            } else {
                $validated = $request->validate([
                    'height' => 'required|numeric',
                    'weight' => 'required|numeric',
                    'build' => 'required|string',
                    'complexion' => 'required|string',
                    'hair_color' => 'required|string',
                    'eye_color' => 'required|string',
                    'identification_marks' => 'required|string',
                    'mark_location' => 'required|string',
                    'pc_remark' => 'required|string',
                ]);
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
            }
            $validated = $request->validate([
                'cases.*.case_number' => 'required|string|max:255',
                'cases.*.crime_committed' => 'required|string',
                'cases.*.date_committed' => 'required|date',
                'cases.*.time_committed' => 'required',
            ]);
            $caseData = $validated;

            // Update or create Cases
            foreach ($request->cases as $caseData) {

                if (isset($caseData['case_id']) && $caseData['case_id']) {
                    $pdl->cases()->updateOrCreate(
                        ['case_id' => $caseData['case_id']],
                        [
                            'case_number' => $caseData['case_number'],
                            'crime_committed' => $caseData['crime_committed'],
                            'date_committed' => $caseData['date_committed'],
                            'time_committed' => $caseData['time_committed'],
                            'case_status' => $caseData['case_status'],
                            'case_remarks' => $caseData['case_remarks'],
                            'security_classification' => $caseData['security_classification'],
                            'drug_related' => $caseData['drug_related'] ?? false,
                        ]
                    );
                } else {
                    $pdl->cases()->create([
                        'case_number' => $caseData['case_number'],
                        'crime_committed' => $caseData['crime_committed'],
                        'date_committed' => $caseData['date_committed'],
                        'time_committed' => $caseData['time_committed'],
                        'case_status' => $caseData['case_status'],
                        'case_remarks' => $caseData['case_remarks'],
                        'security_classification' => $caseData['security_classification'],
                        'drug_related' => $caseData['drug_related'] ?? false,
                    ]);
                }
            }

            DB::commit();

            return redirect()->back()
                ->with('success', 'PDL record updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to update PDL record: ' . $e->getMessage());
        }
    }


    public function store_create(CreatePDLOnePageRequest $request)
    {
        DB::beginTransaction();
        $user = Auth::user();

        try {

            $pdl = Pdl::create([
                'fname' => $request->fname,
                'lname' => $request->lname,
                'mname' => $request->mname,
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

            // Handle document upload
            $documentPath = null;
            $documentFilename = null;
            if ($request->hasFile('document_type')) {
                $file = $request->file('document_type');
                $originalName = $file->getClientOriginalName();
                $extension = $file->getClientOriginalExtension();
                $filename = time() . '_' . uniqid() . '.' . $extension;
                $documentPath = $file->storeAs('court_documents', $filename, 'public');
                $documentFilename = $filename;
            }

            // Create Court Order
            $pdl->courtOrders()->create([

                'order_type' => $request->order_type,
                'order_date' => $request->order_date,
                'received_date' => $request->received_date,
                'remarks' => $request->cod_remarks,
                'cod_remarks' => $request->cod_remarks,
                'document_type' => $documentFilename ? pathinfo($request->file('document_type')->getClientOriginalName(), PATHINFO_FILENAME) : 'uploaded_document',
                'document_path' => $documentPath,
                'original_filename' => $documentFilename ? $request->file('document_type')->getClientOriginalName() : null,
                'court_branch' => $request->court_branch,
            ]);

            $medicalRecordPath = null;
            $medicalRecordFilename = null;

            if ($request->hasFile('medical_file')) {
                $file = $request->file('medical_file');
                $originalName = $file->getClientOriginalName();
                $extension = $file->getClientOriginalExtension();
                $filename = time() . '_' . uniqid() . '.' . $extension;
                $medicalRecordPath = $file->storeAs('medical_documents', $filename, 'public');
                $medicalRecordFilename = $filename;
            }

            $medicalRecord = $pdl->medicalRecords()->create([
                'complaint' => $request->complaint,
                'date' => $request->date,
                'prognosis' => $request->prognosis,
                'prescription' => $request->prescription,
                'findings' => $request->findings,
                'stored_filename' => $medicalRecordFilename,
                'file_path' => $medicalRecordPath,
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
                'pc_remark' => $request->pc_remark,
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
                    'drug_related' => $caseData['drug_related'] ?? false,
                ]);
            }

            // if($user->position === 'admin' || $user->position === 'record-officer'){
            //     $pdl->verifications()->create([
            //         'status' => 'approved',
            //         'reason' => 'PDL created',
            //         'feedback' => 'PDL created',
            //         'reviewed_at' => now(),
            //         'reviewed_by' => $user->id,
            //     ]);
            // }

            DB::commit();

            NotificationService::pdlUpdated($pdl, $user);
            return redirect()->back()->with('success', 'PDL record updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to update PDL record: ' . $e->getMessage());
        }
    }
}
