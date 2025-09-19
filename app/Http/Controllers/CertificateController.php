<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\Pdl;
use App\Models\Personnel;
use App\Services\CertificateService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CertificateController extends Controller
{
    protected CertificateService $certificateService;

    public function __construct(CertificateService $certificateService)
    {
        $this->certificateService = $certificateService;
    }

    /**
     * Display a listing of certificates
     */
    public function index(Request $request): Response
    {
        $query = Certificate::with(['pdl', 'issuer', 'requester']);

        // Apply filters
        if ($request->filled('type')) {
            $query->ofType($request->type);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('pdl_id')) {
            $query->forPdl($request->pdl_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('certificate_number', 'like', "%{$search}%")
                  ->orWhere('title', 'like', "%{$search}%")
                  ->orWhereHas('pdl', function ($pdlQuery) use ($search) {
                      $pdlQuery->where('fname', 'like', "%{$search}%")
                               ->orWhere('lname', 'like', "%{$search}%");
                  });
            });
        }

        $certificates = $query->latest()->paginate(15);

        return Inertia::render('certificates/index', [
            'certificates' => $certificates,
            'filters' => $request->only(['type', 'status', 'pdl_id', 'search']),
            'certificateTypes' => Certificate::CERTIFICATE_TYPES,
            'statuses' => Certificate::STATUSES,
        ]);
    }

    /**
     * Show the form for creating a new certificate
     */
    public function create(Request $request): Response
    {
        $pdlId = $request->get('pdl_id');
        $type = $request->get('type', 'drug_clearing_status');

        $pdls = Pdl::select('id', 'fname', 'lname')->get();
        $personnel = Personnel::select('id', 'fname', 'lname', 'position')->get();

        return Inertia::render('certificates/create', [
            'pdls' => $pdls,
            'personnel' => $personnel,
            'certificateTypes' => Certificate::CERTIFICATE_TYPES,
            'selectedPdlId' => $pdlId,
            'selectedType' => $type,
        ]);
    }

    /**
     * Store a newly created certificate
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'certificate_type' => 'required|in:' . implode(',', array_keys(Certificate::CERTIFICATE_TYPES)),
            'pdl_id' => 'required|exists:pdl,id',
            'issued_by' => 'required|exists:personnel,id',
            'issue_date' => 'required|date',
            'valid_until' => 'nullable|date|after:issue_date',
            'purpose' => 'nullable|string|max:500',
            'remarks' => 'nullable|string|max:1000',
            'requested_by_name' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
        ]);

        try {
            $certificate = match($validated['certificate_type']) {
                'drug_clearing_status' => $this->certificateService->generateDrugClearingStatusCertificate($validated),
                'no_records' => $this->certificateService->generateNoRecordsCertificate($validated),
                default => throw new \InvalidArgumentException('Unsupported certificate type')
            };

            return redirect()->route('certificates.show', $certificate)
                ->with('success', 'Certificate generated successfully.');

        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to generate certificate: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified certificate
     */
    public function show(Certificate $certificate): Response
    {
        $certificate->load(['pdl', 'issuer', 'requester']);

        return Inertia::render('certificates/show', [
            'certificate' => $certificate,
            'templateData' => $this->certificateService->getCertificateTemplateData($certificate),
        ]);
    }

    /**
     * Show the form for editing the specified certificate
     */
    public function edit(Certificate $certificate): Response
    {
        $certificate->load(['pdl', 'issuer', 'requester']);
        $personnel = Personnel::select('id', 'fname', 'lname', 'position')->get();

        return Inertia::render('certificates/edit', [
            'certificate' => $certificate,
            'personnel' => $personnel,
            'certificateTypes' => Certificate::CERTIFICATE_TYPES,
            'statuses' => Certificate::STATUSES,
        ]);
    }

    /**
     * Update the specified certificate
     */
    public function update(Request $request, Certificate $certificate): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:' . implode(',', array_keys(Certificate::STATUSES)),
            'remarks' => 'nullable|string|max:1000',
            'valid_until' => 'nullable|date|after:issue_date',
        ]);

        $certificate->update($validated);

        return redirect()->route('certificates.show', $certificate)
            ->with('success', 'Certificate updated successfully.');
    }

    /**
     * Revoke the specified certificate
     */
    public function revoke(Request $request, Certificate $certificate): RedirectResponse
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $this->certificateService->revokeCertificate($certificate, $validated['reason']);

        return redirect()->route('certificates.show', $certificate)
            ->with('success', 'Certificate revoked successfully.');
    }

    /**
     * Download the certificate PDF
     */
    public function download(Certificate $certificate)
    {
        if (!$certificate->file_path || !Storage::exists($certificate->file_path)) {
            return redirect()->back()
                ->with('error', 'Certificate file not found.');
        }

        return Storage::download($certificate->file_path, "certificate_{$certificate->certificate_number}.pdf");
    }

    /**
     * Print/Preview the certificate
     */
    public function print(Certificate $certificate): Response
    {
        $certificate->load(['pdl', 'issuer', 'requester']);

        return Inertia::render('certificates/print', [
            'certificate' => $certificate,
            'templateData' => $this->certificateService->getCertificateTemplateData($certificate),
        ]);
    }

    /**
     * Get certificates for a specific PDL
     */
    public function forPdl(Pdl $pdl): Response
    {
        $certificates = Certificate::forPdl($pdl->id)
            ->with(['issuer', 'requester'])
            ->latest()
            ->get();

        return Inertia::render('certificates/pdl-certificates', [
            'pdl' => $pdl,
            'certificates' => $certificates,
            'certificateTypes' => Certificate::CERTIFICATE_TYPES,
            'statuses' => Certificate::STATUSES,
        ]);
    }

    /**
     * Get expiring certificates
     */
    public function expiring(): Response
    {
        $certificates = $this->certificateService->getCertificatesExpiringSoon();

        return Inertia::render('certificates/expiring', [
            'certificates' => $certificates,
            'certificateTypes' => Certificate::CERTIFICATE_TYPES,
            'statuses' => Certificate::STATUSES,
        ]);
    }

    /**
     * Cleanup expired certificates
     */
    public function cleanup(): RedirectResponse
    {
        $count = $this->certificateService->cleanupExpiredCertificates();

        return redirect()->route('certificates.index')
            ->with('success', "Marked {$count} certificates as expired.");
    }
}
