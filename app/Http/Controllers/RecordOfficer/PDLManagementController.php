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
use App\Models\MedicalDocument;
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
                ])->whereNull('archive_status'); // Exclude archived PDLs
            },
            'reviewer:id,fname,lname'
        ])
            ->where('status', '=', 'approved')
            ->whereHas('pdl', function ($query) {
                $query->whereNull('archive_status'); // Ensure PDL exists and is not archived
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

        NotificationService::pdlUpdated($pdl, Auth::user());

        return redirect()->back()->with('success', 'PDL record updated successfully.');
    }

    public function transfer(TransferRequest $request)
    {
        $validated = $request->validated();
        $user = Auth::user();
        $pdl = Pdl::findOrFail($validated['pdl_id']);

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
            'personnel:id,fname,lname'
        ])->findOrFail($pdl_id);
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

            // Update main PDL info
            $pdl->update([
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

            // Update or create Court Order
            if ($request->court_order_id) {
                $courtOrderData = [
                    'court_order_number' => $request->court_order_number,
                    'order_type' => $request->order_type,
                    'order_date' => $request->order_date,
                    'received_date' => $request->received_date,
                    'remarks' => $request->cod_remarks,
                    'document_type' => $documentFilename ? pathinfo($request->file('document_type')->getClientOriginalName(), PATHINFO_FILENAME) : ($request->document_type ?? 'uploaded_document'),
                    'court_branch' => $request->court_branch,
                ];

                // Add file fields if file was uploaded
                if ($documentPath) {
                    $courtOrderData['document_path'] = $documentPath;
                    $courtOrderData['original_filename'] = $request->file('document_type')->getClientOriginalName();
                }

                $pdl->courtOrders()->updateOrCreate(
                    ['court_order_id' => $request->court_order_id],
                    $courtOrderData
                );
            } else {
                $courtOrderData = [
                    'court_order_number' => $request->court_order_number,
                    'order_type' => $request->order_type,
                    'order_date' => $request->order_date,
                    'received_date' => $request->received_date,
                    'remarks' => $request->cod_remarks,
                    'document_type' => $documentFilename ? pathinfo($request->file('document_type')->getClientOriginalName(), PATHINFO_FILENAME) : ($request->document_type ?? 'uploaded_document'),
                    'court_branch' => $request->court_branch,
                ];

                // Add file fields if file was uploaded
                if ($documentPath) {
                    $courtOrderData['document_path'] = $documentPath;
                    $courtOrderData['original_filename'] = $request->file('document_type')->getClientOriginalName();
                }

                $pdl->courtOrders()->create($courtOrderData);
            }

            // Update or create Medical Record
            if ($request->medical_record_id) {
                $pdl->medicalRecords()->updateOrCreate(
                    ['medical_record_id' => $request->medical_record_id],
                    [
                        'complaint' => $request->complaint,
                        'date' => $request->date,
                        'prognosis' => $request->prognosis,
                        'laboratory' => $request->laboratory,
                        'prescription' => $request->prescription,
                        'findings' => $request->findings,
                    ]
                );
            } else {
                $medicalRecord = $pdl->medicalRecords()->create([
                    'complaint' => $request->complaint,
                    'date' => $request->date,
                    'prognosis' => $request->prognosis,
                    'laboratory' => $request->laboratory,
                    'prescription' => $request->prescription,
                    'findings' => $request->findings,
                ]);
            }

            // Handle Medical Document Uploads
            if ($request->hasFile('medical_files')) {
                foreach ($request->file('medical_files') as $file) {
                    $originalName = $file->getClientOriginalName();
                    $extension = $file->getClientOriginalExtension();
                    $filename = time() . '_' . uniqid() . '.' . $extension;
                    $path = $file->storeAs('medical_documents', $filename, 'public');

                    // Determine document type based on file extension
                    $documentType = match(strtolower($extension)) {
                        'jpg', 'jpeg', 'png', 'gif', 'bmp' => 'image',
                        'pdf' => 'pdf',
                        'doc', 'docx' => 'document',
                        'txt' => 'text',
                        default => 'other'
                    };

                    MedicalDocument::create([
                        'medical_record_medical_record_id' => $medicalRecord->medical_record_id,
                        'document_type' => $documentType,
                        'original_filename' => $originalName,
                        'stored_filename' => $filename,
                        'file_path' => $path,
                        'mime_type' => $file->getMimeType(),
                        'file_size' => $file->getSize(),
                        'description' => 'Medical document uploaded during PDL update',
                        'uploaded_by' => $user->id,
                    ]);
                }
            }

            // Update or create Physical Characteristics
            if ($request->physical_characteristic_id) {
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
                'court_order_number' => $request->court_order_number,
                'order_type' => $request->order_type,
                'order_date' => $request->order_date,
                'received_date' => $request->received_date,
                'remarks' => $request->cod_remarks,
                'document_type' => $documentFilename ? pathinfo($request->file('document_type')->getClientOriginalName(), PATHINFO_FILENAME) : 'uploaded_document',
                'document_path' => $documentPath,
                'original_filename' => $documentFilename ? $request->file('document_type')->getClientOriginalName() : null,
                'court_branch' => $request->court_branch,
            ]);

            // Create Medical Record
            $medicalRecord = $pdl->medicalRecords()->create([
                'complaint' => $request->complaint,
                'date' => $request->date,
                'prognosis' => $request->prognosis,
                'laboratory' => $request->laboratory,
                'prescription' => $request->prescription,
                'findings' => $request->findings,
            ]);

            // Handle Medical Document Uploads
            if ($request->hasFile('medical_files')) {
                foreach ($request->file('medical_files') as $file) {
                    $originalName = $file->getClientOriginalName();
                    $extension = $file->getClientOriginalExtension();
                    $filename = time() . '_' . uniqid() . '.' . $extension;
                    $path = $file->storeAs('medical_documents', $filename, 'public');

                    // Determine document type based on file extension
                    $documentType = match(strtolower($extension)) {
                        'jpg', 'jpeg', 'png', 'gif', 'bmp' => 'image',
                        'pdf' => 'pdf',
                        'doc', 'docx' => 'document',
                        'txt' => 'text',
                        default => 'other'
                    };

                    MedicalDocument::create([
                        'medical_record_medical_record_id' => $medicalRecord->medical_record_id,
                        'document_type' => $documentType,
                        'original_filename' => $originalName,
                        'stored_filename' => $filename,
                        'file_path' => $path,
                        'mime_type' => $file->getMimeType(),
                        'file_size' => $file->getSize(),
                        'description' => 'Medical document uploaded during PDL creation',
                        'uploaded_by' => $user->id,
                    ]);
                }
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

            DB::commit();

            NotificationService::pdlUpdated($pdl, $user);
            return redirect()->back()->with('success', 'PDL record updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to update PDL record: ' . $e->getMessage());
        }
    }
}
