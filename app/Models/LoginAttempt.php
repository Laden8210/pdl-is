<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class LoginAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'ip_address',
        'success',
        'attempted_at',
    ];

    protected $casts = [
        'attempted_at' => 'datetime',
        'success' => 'boolean',
    ];

    /**
     * Check if an email is locked due to too many failed attempts
     */
    public static function isEmailLocked(string $email, int $maxAttempts = 3, int $lockoutMinutes = 10): bool
    {
        $lockoutTime = Carbon::now()->subMinutes($lockoutMinutes);

        $failedAttempts = self::where('email', $email)
            ->where('success', false)
            ->where('attempted_at', '>=', $lockoutTime)
            ->count();

        return $failedAttempts >= $maxAttempts;
    }

    /**
     * Check if an IP address is locked due to too many failed attempts
     */
    public static function isIpLocked(string $ipAddress, int $maxAttempts = 5, int $lockoutMinutes = 10): bool
    {
        $lockoutTime = Carbon::now()->subMinutes($lockoutMinutes);

        $failedAttempts = self::where('ip_address', $ipAddress)
            ->where('success', false)
            ->where('attempted_at', '>=', $lockoutTime)
            ->count();

        return $failedAttempts >= $maxAttempts;
    }

    /**
     * Get the number of failed attempts for an email in the last X minutes
     */
    public static function getFailedAttemptsCount(string $email, int $minutes = 10): int
    {
        $lockoutTime = Carbon::now()->subMinutes($minutes);

        return self::where('email', $email)
            ->where('success', false)
            ->where('attempted_at', '>=', $lockoutTime)
            ->count();
    }

    /**
     * Get the number of failed attempts for an IP in the last X minutes
     */
    public static function getFailedAttemptsCountForIp(string $ipAddress, int $minutes = 10): int
    {
        $lockoutTime = Carbon::now()->subMinutes($minutes);

        return self::where('ip_address', $ipAddress)
            ->where('success', false)
            ->where('attempted_at', '>=', $lockoutTime)
            ->count();
    }

    /**
     * Record a login attempt
     */
    public static function recordAttempt(string $email, string $ipAddress, bool $success = false): self
    {
        return self::create([
            'email' => $email,
            'ip_address' => $ipAddress,
            'success' => $success,
            'attempted_at' => Carbon::now(),
        ]);
    }

    /**
     * Clear old login attempts (cleanup method)
     */
    public static function clearOldAttempts(int $daysOld = 30): int
    {
        $cutoffDate = Carbon::now()->subDays($daysOld);

        return self::where('attempted_at', '<', $cutoffDate)->delete();
    }

    /**
     * Get lockout time remaining for an email
     */
    public static function getLockoutTimeRemaining(string $email, int $maxAttempts = 3, int $lockoutMinutes = 10): ?int
    {
        if (!self::isEmailLocked($email, $maxAttempts, $lockoutMinutes)) {
            return null;
        }

        $lockoutTime = Carbon::now()->subMinutes($lockoutMinutes);

        $oldestFailedAttempt = self::where('email', $email)
            ->where('success', false)
            ->where('attempted_at', '>=', $lockoutTime)
            ->orderBy('attempted_at', 'asc')
            ->first();

        if (!$oldestFailedAttempt) {
            return null;
        }

        $unlockTime = $oldestFailedAttempt->attempted_at->addMinutes($lockoutMinutes);
        $remainingSeconds = Carbon::now()->diffInSeconds($unlockTime, false);

        return max(0, $remainingSeconds);
    }
}
