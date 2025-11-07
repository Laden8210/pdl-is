<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sms extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'recipient_number',
        'message',
        'otp_code',
        'otp_expires_at',
        'personnel_id',
        'is_used',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'otp_expires_at' => 'datetime',
        'is_used' => 'boolean',
    ];

    /**
     * Get the personnel that owns the SMS.
     */
    public function personnel()
    {
        return $this->belongsTo(Personnel::class);
    }

    /**
     * Check if OTP is expired.
     */
    public function isExpired(): bool
    {
        return $this->otp_expires_at && $this->otp_expires_at->isPast();
    }

    /**
     * Check if OTP is valid (not used and not expired).
     */
    public function isValid(): bool
    {
        return !$this->is_used && !$this->isExpired();
    }

    /**
     * Mark OTP as used.
     */
    public function markAsUsed(): bool
    {
        return $this->update(['is_used' => true]);
    }

    /**
     * Scope a query to only include valid OTPs.
     */
    public function scopeValid($query)
    {
        return $query->where('is_used', false)
                    ->where('otp_expires_at', '>', now());
    }

    /**
     * Scope a query to only include expired OTPs.
     */
    public function scopeExpired($query)
    {
        return $query->where('otp_expires_at', '<=', now())
                    ->orWhere('is_used', true);
    }
}
