<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'certificate_number',
        'certificate_type',
        'title',
        'content',
        'pdl_data',
        'issuer_data',
        'issue_date',
        'valid_until',
        'status',
        'purpose',
        'remarks',
        'file_path',
        'pdl_id',
        'issued_by',
        'requested_by',
    ];

    protected $casts = [
        'pdl_data' => 'array',
        'issuer_data' => 'array',
        'issue_date' => 'date',
        'valid_until' => 'date',
    ];

    // Certificate types constants
    const CERTIFICATE_TYPES = [
        'drug_clearing_status' => 'Drug Clearing Status',
        'no_records' => 'Certificate of No Records',
        'good_standing' => 'Certificate of Good Standing',
        'release_clearance' => 'Release Clearance Certificate',
        'medical_clearance' => 'Medical Clearance Certificate',
        'disciplinary_clearance' => 'Disciplinary Clearance Certificate',
    ];

    // Status constants
    const STATUSES = [
        'active' => 'Active',
        'expired' => 'Expired',
        'revoked' => 'Revoked',
    ];

    /**
     * Generate a unique certificate number
     */
    public static function generateCertificateNumber(string $type = 'CERT'): string
    {
        $year = date('Y');
        $month = date('m');
        $prefix = strtoupper(substr($type, 0, 4));

        // Get the last certificate number for this type and year
        $lastCertificate = self::where('certificate_number', 'like', "{$prefix}-{$year}-{$month}-%")
            ->orderBy('certificate_number', 'desc')
            ->first();

        if ($lastCertificate) {
            $lastNumber = (int) substr($lastCertificate->certificate_number, -4);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return sprintf('%s-%s-%s-%04d', $prefix, $year, $month, $newNumber);
    }

    /**
     * Check if certificate is expired
     */
    public function isExpired(): bool
    {
        if (!$this->valid_until) {
            return false;
        }

        return $this->valid_until->isPast();
    }

    /**
     * Check if certificate is valid
     */
    public function isValid(): bool
    {
        return $this->status === 'active' && !$this->isExpired();
    }

    /**
     * Get certificate type name
     */
    public function getCertificateTypeName(): string
    {
        return self::CERTIFICATE_TYPES[$this->certificate_type] ?? $this->certificate_type;
    }

    /**
     * Get status name
     */
    public function getStatusName(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }

    /**
     * Scope for active certificates
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope for expired certificates
     */
    public function scopeExpired($query)
    {
        return $query->where(function ($q) {
            $q->where('status', 'expired')
              ->orWhere(function ($subQ) {
                  $subQ->where('status', 'active')
                       ->where('valid_until', '<', now());
              });
        });
    }

    /**
     * Scope for certificates by type
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('certificate_type', $type);
    }

    /**
     * Scope for certificates issued to a specific PDL
     */
    public function scopeForPdl($query, int $pdlId)
    {
        return $query->where('pdl_id', $pdlId);
    }

    /**
     * Relationship with PDL
     */
    public function pdl(): BelongsTo
    {
        return $this->belongsTo(Pdl::class);
    }

    /**
     * Relationship with issuer (Personnel)
     */
    public function issuer(): BelongsTo
    {
        return $this->belongsTo(Personnel::class, 'issued_by');
    }

    /**
     * Relationship with requester (Personnel)
     */
    public function requester(): BelongsTo
    {
        return $this->belongsTo(Personnel::class, 'requested_by');
    }

    /**
     * Get formatted issue date
     */
    public function getFormattedIssueDate(): string
    {
        return $this->issue_date->format('F j, Y');
    }

    /**
     * Get formatted valid until date
     */
    public function getFormattedValidUntilDate(): string
    {
        if (!$this->valid_until) {
            return 'N/A';
        }

        return $this->valid_until->format('F j, Y');
    }

    /**
     * Get days until expiration
     */
    public function getDaysUntilExpiration(): ?int
    {
        if (!$this->valid_until) {
            return null;
        }

        return Carbon::now()->diffInDays($this->valid_until, false);
    }

    /**
     * Mark certificate as expired
     */
    public function markAsExpired(): void
    {
        $this->update(['status' => 'expired']);
    }

    /**
     * Revoke certificate
     */
    public function revoke(string $reason = null): void
    {
        $this->update([
            'status' => 'revoked',
            'remarks' => $reason ? "Revoked: {$reason}" : 'Certificate revoked'
        ]);
    }
}
