<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pdl extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'pdl';

    protected $fillable = [
        'fname',
        'lname',
        'mname',
        'alias',
        'birthdate',
        'suffix',
        'age',
        'gender',
        'ethnic_group',
        'civil_status',
        'brgy',
        'city',
        'province',
        'mugshot_path',
        'mugshot_original_filename',
        'personnel_id',
        'archive_status',
        'archive_reason',
        'archived_at',
        'archive_court_order_type',
        'archive_court_order_file',

        'archive_court_order_date',
    ];

    protected $casts = [
        'birthdate' => 'date',
    ];

    public function verifications()
    {
        return $this->hasMany(Verifications::class);
    }

    public function physicalCharacteristics()
    {
        return $this->hasMany(PhysicalCharacteristic::class);
    }

    public function courtOrders()
    {
        return $this->hasMany(CourtOrder::class);
    }

    public function medicalRecords()
    {
        return $this->hasMany(MedicalRecord::class);
    }

    public function personnel()
    {
        return $this->belongsTo(Personnel::class);
    }

    public function cases()
    {
        return $this->hasMany(CaseInformation::class);
    }

    public function timeAllowances()
    {
        return $this->hasMany(TimeAllowance::class);
    }
    public function assignments()
    {
        return $this->hasMany(CellAssignment::class);
    }

    // Get full name
    public function getFullNameAttribute()
    {
        return trim($this->fname . ' ' . $this->lname);
    }

    // Calculate years served based on admission date
    public function getYearsServedAttribute()
    {
        $admissionDate = $this->courtOrders()
            ->whereNotNull('admission_date')
            ->orderBy('admission_date', 'asc')
            ->first()?->admission_date;

        if (!$admissionDate) {
            return [
                'years' => 0,
                'months' => 0,
                'days' => 0,
                'total_days' => 0,
                'formatted' => '0 years 0 months 0 days'
            ];
        }

        $releaseDate = $this->courtOrders()
            ->whereNotNull('release_date')
            ->orderBy('release_date', 'desc')
            ->first()?->release_date ?? now();

        $totalDays = $admissionDate->diffInDays($releaseDate);

        // Calculate years as whole number
        $years = floor($totalDays / 365);

        // Calculate remaining days after years
        $remainingDays = $totalDays % 365;

        // Calculate months from remaining days
        $months = floor($remainingDays / 30);

        // Calculate remaining days after months
        $days = $remainingDays % 30;

        return [
            'years' => (int) $years,
            'months' => (int) $months,
            'days' => (int) $days,
            'total_days' => $totalDays,
            'formatted' => "{$years} years {$months} months {$days} days"
        ];
    }

    // Get default GCTA days based on years served
    public function getDefaultGctaDaysAttribute()
    {
        $yearsServed = $this->years_served;
        $years = is_array($yearsServed) ? $yearsServed['years'] : $yearsServed;

        if ($years >= 1 && $years <= 2) {
            return 20;
        } elseif ($years >= 3 && $years <= 5) {
            return 23;
        } elseif ($years >= 6 && $years <= 10) {
            return 25;
        } elseif ($years >= 11) {
            return 30;
        }

        return 0;
    }

    // Get default TASTM days (always 15)
    public function getDefaultTastmDaysAttribute()
    {
        return 15;
    }

    // Get archive status options
    public static function getArchiveStatusOptions()
    {
        return [
            'BONDED' => 'BONDED',
            'SERVED_SENTENCE' => 'SERVED SENTENCE',
            'BONDED' => 'BONDED',
            'TRANSFERRED_TO_OTHER_JAIL' => 'Transferred to Another Jail',
            'DISMISSED' => 'Dismissed',
        ];
    }

    // Get court order type options
    public static function getCourtOrderTypeOptions()
    {
        return [
            'RELEASE' => 'Release Order',
            'BAIL' => 'Bail Order',
            'SERVED_SENTENCE' => 'Served Sentence',
            'PROBATION' => 'Probation Order',
            'PAROLE' => 'Parole Order',
            'TRANSFER' => 'Transfer Order',
            'OTHER' => 'Other Court Order',
        ];
    }

    // Check if PDL is archived
    public function isArchived()
    {
        return !is_null($this->archive_status);
    }

    // Check if PDL can be archived based on case status
    public function canBeArchived()
    {
        $pendingCases = $this->cases()->whereIn('case_status', ['open', 'pending', 'on_trial'])->count();
        return $pendingCases === 0;
    }

    // Get cases that prevent archiving
    public function getBlockingCases()
    {
        return $this->cases()->whereIn('case_status', ['open', 'pending', 'on_trial', 'convicted'])->get();
    }
}
