<?php

namespace App\Services;

use App\Models\Certificate;
use App\Models\Pdl;
use App\Models\Personnel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class CertificateService
{
    /**
     * Generate a Drug Clearing Status Certificate
     */
    public function generateDrugClearingStatusCertificate(array $data): Certificate
    {
        $pdl = Pdl::findOrFail($data['pdl_id']);
        $issuer = Personnel::findOrFail($data['issued_by']);

        $certificateData = [
            'certificate_number' => Certificate::generateCertificateNumber('DRUG'),
            'certificate_type' => 'drug_clearing_status',
            'title' => 'CERTIFICATE OF DRUG CLEARING STATUS',
            'content' => $this->generateDrugClearingContent($pdl, $data),
            'pdl_data' => $this->formatPdlData($pdl),
            'issuer_data' => $this->formatIssuerData($issuer),
            'issue_date' => isset($data['issue_date']) ? $data['issue_date'] : now(),
            'valid_until' => isset($data['valid_until']) ? $data['valid_until'] : null,
            'status' => 'active',
            'purpose' => isset($data['purpose']) ? $data['purpose'] : 'For legal and official purposes',
            'remarks' => isset($data['remarks']) ? $data['remarks'] : null,
            'pdl_id' => $pdl->id,
            'issued_by' => $issuer->id,
            'requested_by' => isset($data['requested_by']) ? $data['requested_by'] : Auth::id(),
        ];

        $certificate = Certificate::create($certificateData);

        // Generate PDF file
        $this->generatePdf($certificate);

        return $certificate;
    }

    /**
     * Generate a Certificate of No Records
     */
    public function generateNoRecordsCertificate(array $data): Certificate
    {
        $pdl = Pdl::findOrFail($data['pdl_id']);
        $issuer = Personnel::findOrFail($data['issued_by']);

        $certificateData = [
            'certificate_number' => Certificate::generateCertificateNumber('NOR'),
            'certificate_type' => 'no_records',
            'title' => 'CERTIFICATE OF NO RECORDS',
            'content' => $this->generateNoRecordsContent($pdl, $data),
            'pdl_data' => $this->formatPdlData($pdl),
            'issuer_data' => $this->formatIssuerData($issuer),
            'issue_date' => isset($data['issue_date']) ? $data['issue_date'] : now(),
            'valid_until' => isset($data['valid_until']) ? $data['valid_until'] : null,
            'status' => 'active',
            'purpose' => isset($data['purpose']) ? $data['purpose'] : 'For legal and official purposes',
            'remarks' => isset($data['remarks']) ? $data['remarks'] : null,
            'pdl_id' => $pdl->id,
            'issued_by' => $issuer->id,
            'requested_by' => isset($data['requested_by']) ? $data['requested_by'] : Auth::id(),
        ];

        $certificate = Certificate::create($certificateData);

        // Generate PDF file
        $this->generatePdf($certificate);

        return $certificate;
    }

    /**
     * Generate Drug Clearing Status content
     */
    public function generateDrugClearingContent(Pdl $pdl, array $data): string
    {
        $issueDate = Carbon::parse(isset($data['issue_date']) ? $data['issue_date'] : now())->format('jS \of F Y');
        $location = isset($data['location']) ? $data['location'] : 'City of Koronadal';

        return "
TO WHOM IT MAY CONCERN:

THIS IS TO CERTIFY that {$pdl->fname} {$pdl->lname}, a Person Deprived of Liberty (PDL) under our custody, has been cleared of any drug-related charges and has maintained a clean record during their detention period.

The above-named person has:
- Completed all required drug rehabilitation programs
- Passed all mandatory drug tests
- Maintained good conduct and discipline
- Shown no involvement in any drug-related activities

This certification is issued upon the request of " . (isset($data['requested_by_name']) ? $data['requested_by_name'] : 'the concerned party') . " for whatever legal purpose it may serve.

Issued this {$issueDate}, {$location}.

This certificate is valid for one (1) year from the date of issuance unless revoked earlier.
        ";
    }

    /**
     * Generate No Records content
     */
    public function generateNoRecordsContent(Pdl $pdl, array $data): string
    {
        $issueDate = Carbon::parse(isset($data['issue_date']) ? $data['issue_date'] : now())->format('jS \of F Y');
        $location = isset($data['location']) ? $data['location'] : 'City of Koronadal';

        return "
TO WHOM IT MAY CONCERN:

THIS IS TO CERTIFY that this office has no records, whatsoever affecting the following person:

1. {$pdl->fname} {$pdl->lname} (PDL ID: {$pdl->id})

This certification is issued upon the request of " . (isset($data['requested_by_name']) ? $data['requested_by_name'] : 'the concerned party') . " for whatever legal purpose it may serve him best.

Issued this {$issueDate}, {$location}.
        ";
    }

    /**
     * Format PDL data for storage
     */
    public function formatPdlData(Pdl $pdl): array
    {
        return [
            'id' => $pdl->id,
            'name' => "{$pdl->fname} {$pdl->lname}",
            'fname' => $pdl->fname,
            'lname' => $pdl->lname,
            'alias' => $pdl->alias,
            'birthdate' => $pdl->birthdate,
            'age' => $pdl->age,
            'gender' => $pdl->gender,
            'ethnic_group' => $pdl->ethnic_group,
            'civil_status' => $pdl->civil_status,
            'address' => "{$pdl->brgy}, {$pdl->city}, {$pdl->province}",
            'brgy' => $pdl->brgy,
            'city' => $pdl->city,
            'province' => $pdl->province,
        ];
    }

    /**
     * Format issuer data for storage
     */
    public function formatIssuerData(Personnel $personnel): array
    {
        return [
            'id' => $personnel->id,
            'name' => "{$personnel->fname} {$personnel->lname}",
            'fname' => $personnel->fname,
            'lname' => $personnel->lname,
            'position' => $personnel->position,
            'title' => $this->getPersonnelTitle($personnel->position),
        ];
    }

    /**
     * Get personnel title based on position
     */
    public function getPersonnelTitle(string $position): string
    {
        return match($position) {
            'admin' => 'Provincial Administrator',
            'record-officer' => 'Records Officer',
            'law-enforcement' => 'Provincial Warden',
            default => 'Authorized Personnel'
        };
    }

    /**
     * Generate PDF file for certificate
     */
    public function generatePdf(Certificate $certificate): void
    {
        // This would integrate with a PDF generation library like DomPDF or TCPDF
        // For now, we'll just set a placeholder path
        $filename = "certificate_{$certificate->certificate_number}.pdf";
        $filePath = "certificates/{$filename}";

        // In a real implementation, you would generate the PDF here
        // $pdf = PDF::loadView('certificates.template', compact('certificate'));
        // Storage::put($filePath, $pdf->output());

        $certificate->update(['file_path' => $filePath]);
    }

    /**
     * Get certificate template data
     */
    public function getCertificateTemplateData(Certificate $certificate): array
    {
        return [
            'certificate' => $certificate,
            'pdl' => $certificate->pdl,
            'issuer' => $certificate->issuer,
            'requester' => $certificate->requester,
            'issue_date_formatted' => $certificate->getFormattedIssueDate(),
            'valid_until_formatted' => $certificate->getFormattedValidUntilDate(),
            'certificate_type_name' => $certificate->getCertificateTypeName(),
            'status_name' => $certificate->getStatusName(),
        ];
    }

    /**
     * Revoke certificate
     */
    public function revokeCertificate(Certificate $certificate, string $reason): Certificate
    {
        $certificate->revoke($reason);

        // Delete PDF file if exists
        if ($certificate->file_path && Storage::exists($certificate->file_path)) {
            Storage::delete($certificate->file_path);
        }

        return $certificate;
    }

    /**
     * Get certificates expiring soon
     */
    public function getCertificatesExpiringSoon(int $days = 30): \Illuminate\Database\Eloquent\Collection
    {
        return Certificate::active()
            ->where('valid_until', '<=', now()->addDays($days))
            ->where('valid_until', '>', now())
            ->orderBy('valid_until')
            ->get();
    }

    /**
     * Clean up expired certificates
     */
    public function cleanupExpiredCertificates(): int
    {
        $expiredCertificates = Certificate::expired()->get();

        foreach ($expiredCertificates as $certificate) {
            $certificate->markAsExpired();
        }

        return $expiredCertificates->count();
    }
}
