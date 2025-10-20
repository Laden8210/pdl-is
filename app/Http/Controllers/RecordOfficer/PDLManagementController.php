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
use App\Models\Court;

class PDLManagementController extends Controller
{
    public function personal_information()
    {

        $agency = Auth::user()->agency;

        $pdls = Pdl::with([
            'personnel:id,fname,lname,agency',
            'verifications:verification_id,status,pdl_id,reviewed_by,reviewed_at',
            'physicalCharacteristics',
            'courtOrders',
            'medicalRecords',
            'cases'
        ])
            ->whereHas('personnel', function ($query) use ($agency) {
                $query->where('agency', $agency);
            })
            ->whereDoesntHave('verifications', function ($q) {
                $q->where('status', 'approved');
            })
            ->latest()
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
                    'mugshot_path' => $pdl->mugshot_path,
                    'mugshot_original_filename' => $pdl->mugshot_original_filename,
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
                    'court_orders' => $pdl->courtOrders->map(function ($order) {
                        return [
                            'court_order_id' => $order->court_order_id,
                            'order_type' => $order->order_type,
                            'order_date' => $order->order_date->format('Y-m-d'),
                            'received_date' => $order->received_date->format('Y-m-d'),
                            'court_branch' => $order->court_branch->branch_code,
                            'document_path' => $order->document_path,
                        ];
                    }),
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
            'personnel:id,fname,lname,agency',
            'pdl' => function ($query) {
                $query->with([
                    'physicalCharacteristics',
                    'courtOrders',
                    'medicalRecords',
                    'cases',
                    'personnel:id,fname,lname,agency'
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
                        'mugshot_path' => $pdl->mugshot_path,
                        'mugshot_original_filename' => $pdl->mugshot_original_filename,
                        'age' => $pdl->age,
                        'gender' => $pdl->gender,
                        'ethnic_group' => $pdl->ethnic_group,
                        'civil_status' => $pdl->civil_status,
                        'brgy' => $pdl->brgy,
                        'city' => $pdl->city,
                        'province' => $pdl->province,
                        'personnel' => $pdl->personnel,
                        'physical_characteristics' => $pdl->physicalCharacteristics,
                        'court_orders' => $pdl->courtOrders->map(function ($order) {
                            return [
                                'court_order_id' => $order->court_order_id,
                                'order_type' => $order->order_type,
                                'order_date' => $order->order_date->format('Y-m-d'),
                                'received_date' => $order->received_date->format('Y-m-d'),
                                'court_branch' => $order->court_branch->branch_code,
                                'document_path' => $order->document_path,
                                'court_id' => $order->court_id,
                            ];
                        }),
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

        $agency = Auth::user()->agency;

        $pdls = Pdl::select('id', 'fname', 'lname', 'birthdate')->get();

        $orders = CourtOrder::with('pdl:id,fname,lname', 'court:court_id,branch_code,branch,station,court_type,location')
            ->when($search, function ($query, $search) {
                $query
                    ->where(function ($q) use ($search) {
                        $q->where('order_type', 'like', "%{$search}%")
                            ->orWhere('document_type', 'like', "%{$search}%")
                            ->orWhereHas('court_branch', function ($courtBranchQuery) use ($search) {
                                $courtBranchQuery->where('branch_code', 'like', "%{$search}%")
                                    ->orWhere('branch', 'like', "%{$search}%")
                                    ->orWhere('station', 'like', "%{$search}%")
                                    ->orWhere('court_type', 'like', "%{$search}%")
                                    ->orWhere('location', 'like', "%{$search}%");
                            })
                            ->orWhereHas('pdl', function ($pdlQuery) use ($search) {
                                $pdlQuery->where('fname', 'like', "%{$search}%")
                                    ->orWhere('lname', 'like', "%{$search}%");
                            });
                    });
            })
            ->whereHas('pdl', function ($pdlQuery) {
                $pdlQuery->whereNull('archive_status')
                    ->whereDoesntHave('verifications', function ($verificationQuery) {
                        $verificationQuery->where('status', 'approved');
                    });
            })
            ->whereHas('pdl', function ($pdlQuery) use ($agency) {
                $pdlQuery->whereHas('personnel', function ($personnelQuery) use ($agency) {
                    $personnelQuery->where('agency', $agency);
                });
            })
            ->orderBy('order_type', 'asc')
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
        $courts = Court::all();
        return Inertia::render('records-officer/pdl-management/create-pdl-information', [
            'courts' => $courts
        ]);
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


        $courts = Court::all();

        return Inertia::render('records-officer/pdl-management/update-pdl-information', [
            'pdl' => $pdl,
            'courts' => $courts
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
                'civil_status' => 'required|string|in:Single,Married,Widowed,Annulment',
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


            // Handle Court Orders Array
            if ($request->has('court_orders') && is_array($request->court_orders)) {
                // Delete existing court orders
                $pdl->courtOrders()->delete();

                foreach ($request->court_orders as $courtOrderData) {
                    $documentPath = null;
                    $documentFilename = null;

                    // Handle document upload for this court order
                    if (isset($courtOrderData['document_type']) && $courtOrderData['document_type'] instanceof \Illuminate\Http\UploadedFile) {
                        $file = $courtOrderData['document_type'];
                        $originalName = $file->getClientOriginalName();
                        $extension = $file->getClientOriginalExtension();
                        $filename = time() . '_' . uniqid() . '.' . $extension;
                        $documentPath = $file->storeAs('court_documents', $filename, 'public');
                        $documentFilename = $filename;
                    }

                    $courtOrderCreateData = [
                        'order_type' => $courtOrderData['order_type'],
                        'order_date' => $courtOrderData['order_date'],
                        'received_date' => $courtOrderData['received_date'],
                        'remarks' => $courtOrderData['cod_remarks'],
                        'court_id' => $courtOrderData['court_id'],
                    ];

                    // Add file fields if file was uploaded
                    if ($documentPath) {
                        $courtOrderCreateData['document_type'] = pathinfo($originalName, PATHINFO_FILENAME);
                        $courtOrderCreateData['document_path'] = $documentPath;
                        $courtOrderCreateData['original_filename'] = $originalName;
                    }

                    $pdl->courtOrders()->create($courtOrderCreateData);
                }
            }

            // Handle Medical Records Array
            if ($request->has('medical_records') && is_array($request->medical_records)) {
                // Delete existing medical records
                $pdl->medicalRecords()->delete();

                foreach ($request->medical_records as $medicalRecordData) {
                    $medicalRecordCreateData = [
                        'complaint' => $medicalRecordData['complaint'],
                        'date' => $medicalRecordData['date'],
                        'prognosis' => $medicalRecordData['prognosis'],
                        'prescription' => $medicalRecordData['prescription'],
                        'findings' => $medicalRecordData['findings'],
                    ];

                    // Handle medical file upload for this record
                    if (isset($medicalRecordData['medical_file']) && $medicalRecordData['medical_file'] instanceof \Illuminate\Http\UploadedFile) {
                        $file = $medicalRecordData['medical_file'];
                        $originalName = $file->getClientOriginalName();
                        $extension = $file->getClientOriginalExtension();
                        $filename = time() . '_' . uniqid() . '.' . $extension;
                        $medicalPath = $file->storeAs('medical_documents', $filename, 'public');

                        $medicalRecordCreateData['stored_filename'] = $originalName;
                        $medicalRecordCreateData['file_path'] = $medicalPath;

                    }

                    $pdl->medicalRecords()->create($medicalRecordCreateData);
                }
            }

            // Handle Cases Array
            if ($request->has('cases') && is_array($request->cases)) {

                foreach ($request->cases as $caseData) {
                    $pdl->cases()->updateOrCreate([
                        'case_id' => $caseData['case_id'],
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

            // Handle mugshot upload
            if ($request->hasFile('mugshot')) {
                $mugshotFile = $request->file('mugshot');
                $originalName = $mugshotFile->getClientOriginalName();
                $extension = $mugshotFile->getClientOriginalExtension();
                $filename = 'mugshot_' . time() . '_' . uniqid() . '.' . $extension;
                $mugshotPath = $mugshotFile->storeAs('mugshots', $filename, 'public');

                // Update PDL with mugshot information
                $pdl->update([
                    'mugshot_path' => $mugshotPath,
                    'mugshot_original_filename' => $originalName,
                ]);
            }

            // Handle document upload


            // Create Court Orders
            foreach ($request->court_orders as $index => $courtOrderData) {
                $documentPath = null;
                $documentFilename = null;
                $originalFilename = null;

                // Check if there's a file for this specific court order
                if ($request->hasFile("court_orders.{$index}.document_type")) {
                    $file = $request->file("court_orders.{$index}.document_type");
                    $originalName = $file->getClientOriginalName();
                    $extension = $file->getClientOriginalExtension();
                    $filename = time() . '_' . uniqid() . '.' . $extension;
                    $documentPath = $file->storeAs('court_documents', $filename, 'public');
                    $documentFilename = $filename;
                    $originalFilename = $originalName;
                }

                // Create Court Order
                $pdl->courtOrders()->create([
                    'order_type' => $courtOrderData['order_type'],
                    'order_date' => $courtOrderData['order_date'],
                    'received_date' => $courtOrderData['received_date'],
                    'remarks' => $courtOrderData['remarks'] ?? $courtOrderData['cod_remarks'] ?? null,
                    'cod_remarks' => $courtOrderData['cod_remarks'] ?? null,
                    'document_type' => $originalFilename ? pathinfo($originalFilename, PATHINFO_EXTENSION) : null,
                    'document_path' => $documentPath,
                    'original_filename' => $originalFilename,
                    'court_id' => $courtOrderData['court_id'],
                ]);
            }
            foreach ($request->medical_records as $index => $medicalRecordData) {
                $medicalRecordPath = null;
                $medicalRecordFilename = null;


                if ($request->hasFile("medical_records.{$index}.medical_file")) {
                    $file = $request->file("medical_records.{$index}.medical_file");
                    $originalName = $file->getClientOriginalName();
                    $extension = $file->getClientOriginalExtension();
                    $filename = time() . '_' . uniqid() . '.' . $extension;
                    $medicalRecordPath = $file->storeAs('medical_documents', $filename, 'public');
                    $medicalRecordFilename = $originalName;
                }

                $pdl->medicalRecords()->create([
                    'complaint' => $medicalRecordData['complaint'],
                    'date' => $medicalRecordData['date'],
                    'prognosis' => $medicalRecordData['prognosis'],
                    'prescription' => $medicalRecordData['prescription'],
                    'findings' => $medicalRecordData['findings'],
                    'stored_filename' => $medicalRecordFilename,
                    'file_path' => $medicalRecordPath,
                ]);
            }


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

            if ($user->position === 'admin' || $user->position === 'record-officer') {
                $pdl->verifications()->create([
                    'status' => 'approved',
                    'reason' => 'PDL created',
                    'feedback' => 'PDL created',
                    'reviewed_at' => now(),
                    'reviewed_by' => $user->id,
                    'personnel_id' => $user->id,
                ]);
            }

            DB::commit();

            NotificationService::pdlUpdated($pdl, $user);
            return redirect()->back()->with('success', 'PDL record updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to update PDL record: ' . $e->getMessage());
        }
    }
}
