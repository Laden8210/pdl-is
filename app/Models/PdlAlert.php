<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PdlAlert extends Model
{
    use HasFactory;

    protected $fillable = [
        'pdl_id',
        'alert_type',
        'title',
        'description',
        'scheduled_date',
        'reminder_date',
        'location',
        'status',
        'created_by',
        'assigned_to',
        'reminder_sent_to',
    ];

    protected $casts = [
        'scheduled_date' => 'datetime',
        'reminder_date' => 'datetime',
        'reminder_sent_to' => 'array',
    ];

    // Relationships
    public function pdl()
    {
        return $this->belongsTo(Pdl::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(Personnel::class, 'created_by');
    }

    public function assignedTo()
    {
        return $this->belongsTo(Personnel::class, 'assigned_to');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeUpcoming($query, $days = 7)
    {
        return $query->where('scheduled_date', '>=', now())
                    ->where('scheduled_date', '<=', now()->addDays($days));
    }

    public function scopeDueForReminder($query)
    {
        return $query->where('reminder_date', '<=', now())
                    ->where('status', 'pending')
                    ->where(function($q) {
                        $q->whereNull('reminder_sent_to')
                          ->orWhereJsonLength('reminder_sent_to', 0);
                    });
    }

    // Alert types constants
    const ALERT_TYPES = [
        'parole_hearing' => 'Parole Hearing',
        'medical_appointment' => 'Medical Appointment',
        'court_appearance' => 'Court Appearance',
        'family_visit' => 'Family Visit',
        'medical_checkup' => 'Medical Checkup',
        'psychological_evaluation' => 'Psychological Evaluation',
        'educational_program' => 'Educational Program',
        'work_assignment' => 'Work Assignment',
        'disciplinary_hearing' => 'Disciplinary Hearing',
        'release_preparation' => 'Release Preparation',
    ];

    // Status constants
    const STATUSES = [
        'pending' => 'Pending',
        'completed' => 'Completed',
        'cancelled' => 'Cancelled',
        'rescheduled' => 'Rescheduled',
    ];
}
