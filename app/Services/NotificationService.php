<?php

namespace App\Services;

use App\Models\SystemNotification;
use App\Models\Personnel;
use App\Models\PdlAlert;
use Illuminate\Support\Facades\Auth;

class NotificationService
{
    /**
     * Generate role-based URL for specific notification types
     */
    private static function getNotificationUrl(string $type, int $pdlId, ?int $personnelId = null): string
    {
        $personnelId = $personnelId ?? Auth::id();
        $user = Personnel::find($personnelId);

        if (!$user) {
            $baseUrl = "/admin";
        } else {
            // Determine base URL based on user role
            switch ($user->position) {
                case 'admin':
                    $baseUrl = "/admin";
                    break;
                case 'record-officer':
                    $baseUrl = "/record-officer";
                    break;
                case 'law-enforcement':
                    $baseUrl = "/law-enforcement";
                    break;
                default:
                    $baseUrl = "/admin";
            }
        }

        // Map notification types to specific URLs
        switch ($type) {
            case 'pdl_created':
            case 'pdl_updated':
            case 'pdl_transferred':
                return "{$baseUrl}/pdl-management/personal-information?pdl_id={$pdlId}";

            case 'case_created':
            case 'case_updated':
                return "{$baseUrl}/pdl-management/case-information?pdl_id={$pdlId}";

            case 'court_order_created':
            case 'court_order_updated':
                return "{$baseUrl}/pdl-management/court-order?pdl_id={$pdlId}";

            case 'medical_record_created':
            case 'medical_record_updated':
                return "{$baseUrl}/pdl-management/medical-records?pdl_id={$pdlId}";

            case 'physical_characteristic_created':
            case 'physical_characteristic_updated':
                return "{$baseUrl}/pdl-management/physical-characteristics?pdl_id={$pdlId}";

            case 'time_allowance_updated':
                return "{$baseUrl}/pdl-management/time-allowance?pdl_id={$pdlId}";

            case 'cell_assigned':
                return "{$baseUrl}/pdl-management/cell-assignment?pdl_id={$pdlId}";

            case 'jail_event_created':
                return "{$baseUrl}/jail-events?pdl_id={$pdlId}";

            case 'verification_status_changed':
                return "{$baseUrl}/pdl-management/personal-information?pdl_id={$pdlId}";

            case 'parole_hearing':
            case 'medical_appointment':
            case 'court_appearance':
            case 'family_visit':
            case 'medical_checkup':
            case 'psychological_evaluation':
            case 'educational_program':
            case 'work_assignment':
            case 'disciplinary_hearing':
            case 'release_preparation':
                return "{$baseUrl}/pdl-management/personal-information?pdl_id={$pdlId}";

            default:
                return "{$baseUrl}/pdl-management/personal-information?pdl_id={$pdlId}";
        }
    }
    public static function createNotification(
        string $title,
        string $message,
        string $type,
        ?int $pdlId = null,
        ?string $actionUrl = null,
        ?int $personnelId = null
    ): SystemNotification {
        $personnelId = $personnelId ?? Auth::id();

        return SystemNotification::create([
            'title' => $title,
            'message' => $message,
            'notification_type' => $type,
            'action_url' => $actionUrl, // Only store custom URLs, not generated ones
            'personnel_id' => $personnelId,
            'pdl_id' => $pdlId,
        ]);
    }

    /**
     * Create notification for PDL creation
     */
    public static function pdlCreated($pdl, $user = null): SystemNotification
    {
        $user = $user ?? Auth::user();
        return self::createNotification(
            'New PDL Created',
            "PDL {$pdl->fname} {$pdl->lname} (ID: {$pdl->id}) has been created by {$user->fname} {$user->lname}",
            'pdl_created',
            $pdl->id,
            null, // URL will be generated dynamically
            $user->id
        );
    }

    /**
     * Create notification for PDL update
     */
    public static function pdlUpdated($pdl, $user = null): SystemNotification
    {
        $user = $user ?? Auth::user();
        return self::createNotification(
            'PDL Information Updated',
            "PDL {$pdl->fname} {$pdl->lname} (ID: {$pdl->id}) information has been updated by {$user->fname} {$user->lname}",
            'pdl_updated',
            $pdl->id,
            self::getNotificationUrl('pdl_updated', $pdl->id, $user->id),
            $user->id
        );
    }

    /**
     * Create notification for PDL transfer
     */
    public static function pdlTransferred($pdl, $reason, $user = null): SystemNotification
    {
        $user = $user ?? Auth::user();
        return self::createNotification(
            'PDL Transferred',
            "PDL {$pdl->fname} {$pdl->lname} (ID: {$pdl->id}) has been transferred. Reason: {$reason}",
            'pdl_transferred',
            $pdl->id,
            self::getNotificationUrl('pdl_transferred', $pdl->id, $user->id),
            $user->id
        );
    }

    /**
     * Create notification for case information creation
     */
    public static function caseCreated($case, $pdl, $user = null): SystemNotification
    {
        $user = $user ?? Auth::user();
        return self::createNotification(
            'New Case Information Added',
            "New case '{$case->case_number}' has been added for PDL {$pdl->fname} {$pdl->lname}",
            'case_created',
            $pdl->id,
            self::getNotificationUrl('case_created', $pdl->id, $user->id),
            $user->id
        );
    }

    /**
     * Create notification for case information update
     */
    public static function caseUpdated($case, $pdl, $user = null): SystemNotification
    {
        $user = $user ?? Auth::user();
        return self::createNotification(
            'Case Information Updated',
            "Case '{$case->case_number}' for PDL {$pdl->fname} {$pdl->lname} has been updated",
            'case_updated',
            $pdl->id,
            null, // URL will be generated dynamically
            $user->id
        );
    }

    /**
     * Create notification for court order creation
     */
    public static function courtOrderCreated($courtOrder, $pdl, $user = null): SystemNotification
    {
        $user = $user ?? Auth::user();
        return self::createNotification(
            'New Court Order Added',
            "New court order '{$courtOrder->order_type}' has been added for PDL {$pdl->fname} {$pdl->lname}",
            'court_order_created',
            $pdl->id,
            null, // URL will be generated dynamically
            $user->id
        );
    }

    /**
     * Create notification for court order update
     */
    public static function courtOrderUpdated($courtOrder, $pdl, $user = null): SystemNotification
    {
        $user = $user ?? Auth::user();
        return self::createNotification(
            'Court Order Updated',
            "Court order '{$courtOrder->order_type}' for PDL {$pdl->fname} {$pdl->lname} has been updated",
            'court_order_updated',
            $pdl->id,
            self::getNotificationUrl('court_order_updated', $pdl->id, $user->id),
            $user->id
        );
    }

    /**
     * Create notification for medical record creation
     */
    public static function medicalRecordCreated($medicalRecord, $pdl, $user = null): SystemNotification
    {
        $user = $user ?? Auth::user();
        return self::createNotification(
            'New Medical Record Added',
            "New medical record for complaint '{$medicalRecord->complaint}' has been added for PDL {$pdl->fname} {$pdl->lname}",
            'medical_record_created',
            $pdl->id,
            null, // URL will be generated dynamically
            $user->id
        );
    }

    /**
     * Create notification for medical record update
     */
    public static function medicalRecordUpdated($medicalRecord, $pdl, $user = null): SystemNotification
    {
        $user = $user ?? Auth::user();
        return self::createNotification(
            'Medical Record Updated',
            "Medical record for complaint '{$medicalRecord->complaint}' for PDL {$pdl->fname} {$pdl->lname} has been updated",
            'medical_record_updated',
            $pdl->id,
            self::getNotificationUrl('medical_record_updated', $pdl->id, $user->id),
            $user->id
        );
    }

    /**
     * Create notification for physical characteristic creation
     */
    public static function physicalCharacteristicCreated($physicalCharacteristic, $pdl, $user = null): SystemNotification
    {
        $user = $user ?? Auth::user();
        return self::createNotification(
            'Physical Characteristics Added',
            "Physical characteristics have been added for PDL {$pdl->fname} {$pdl->lname}",
            'physical_characteristic_created',
            $pdl->id,
            null, // URL will be generated dynamically
            $user->id
        );
    }

    /**
     * Create notification for physical characteristic update
     */
    public static function physicalCharacteristicUpdated($physicalCharacteristic, $pdl, $user = null): SystemNotification
    {
        $user = $user ?? Auth::user();
        return self::createNotification(
            'Physical Characteristics Updated',
            "Physical characteristics for PDL {$pdl->fname} {$pdl->lname} have been updated",
            'physical_characteristic_updated',
            $pdl->id,
            self::getNotificationUrl('physical_characteristic_updated', $pdl->id, $user->id),
            $user->id
        );
    }

    /**
     * Create notification for cell assignment
     */
    public static function cellAssigned($pdl, $cell, $user = null): SystemNotification
    {
        $user = $user ?? Auth::user();
        return self::createNotification(
            'PDL Cell Assignment',
            "PDL {$pdl->fname} {$pdl->lname} has been assigned to cell '{$cell->cell_name}'",
            'cell_assigned',
            $pdl->id,
            null, // URL will be generated dynamically
            $user->id
        );
    }

    /**
     * Create notification for time allowance update
     */
    public static function timeAllowanceUpdated($pdl, $type, $user = null): SystemNotification
    {
        $user = $user ?? Auth::user();
        $typeName = $type === 'gcta' ? 'Good Conduct Time Allowance' : 'Time Allowance for Study, Teaching and Mentoring';
        return self::createNotification(
            'Time Allowance Updated',
            "{$typeName} has been updated for PDL {$pdl->fname} {$pdl->lname}",
            'time_allowance_updated',
            $pdl->id,
            self::getNotificationUrl('time_allowance_updated', $pdl->id, $user->id),
            $user->id
        );
    }

    /**
     * Create notification for jail event
     */
    public static function jailEventCreated($jailEvent, $pdl, $user = null): SystemNotification
    {
        $user = $user ?? Auth::user();
        return self::createNotification(
            'Jail Event Recorded',
            "Jail event '{$jailEvent->activity_name}' has been recorded for PDL {$pdl->fname} {$pdl->lname}",
            'jail_event_created',
            $pdl->id,
            self::getNotificationUrl('jail_event_created', $pdl->id, $user->id),
            $user->id
        );
    }

    /**
     * Create notification for verification status change
     */
    public static function verificationStatusChanged($verification, $pdl, $status, $user = null): SystemNotification
    {
        $user = $user ?? Auth::user();
        return self::createNotification(
            'Verification Status Changed',
            "Verification for PDL {$pdl->fname} {$pdl->lname} has been {$status}",
            'verification_status_changed',
            $pdl->id,
            self::getNotificationUrl('verification_status_changed', $pdl->id, $user->id),
            $user->id
        );
    }

    // ==================== PDL ALERTS AND REMINDERS ====================

    /**
     * Create notification for PDL alert/reminder
     */
    public static function pdlAlertCreated($alert, $user = null): SystemNotification
    {
        $user = $user ?? Auth::user();
        $alertTypeName = PdlAlert::ALERT_TYPES[$alert->alert_type] ?? ucfirst(str_replace('_', ' ', $alert->alert_type));

        return self::createNotification(
            "PDL {$alertTypeName} Scheduled",
            "{$alertTypeName} scheduled for PDL {$alert->pdl->fname} {$alert->pdl->lname} on {$alert->scheduled_date->format('M d, Y \a\t g:i A')}" .
            ($alert->location ? " at {$alert->location}" : ""),
            $alert->alert_type,
            $alert->pdl_id,
            null, // URL will be generated dynamically
            $user->id
        );
    }

    /**
     * Create reminder notification for upcoming PDL alert
     */
    public static function pdlAlertReminder($alert, $user = null): SystemNotification
    {
        $user = $user ?? Auth::user();
        $alertTypeName = PdlAlert::ALERT_TYPES[$alert->alert_type] ?? ucfirst(str_replace('_', ' ', $alert->alert_type));
        $timeUntil = $alert->scheduled_date->diffForHumans();

        return self::createNotification(
            "Reminder: {$alertTypeName}",
            "{$alertTypeName} for PDL {$alert->pdl->fname} {$alert->pdl->lname} is {$timeUntil}" .
            ($alert->location ? " at {$alert->location}" : ""),
            $alert->alert_type,
            $alert->pdl_id,
            null, // URL will be generated dynamically
            $user->id
        );
    }

    /**
     * Create notification for PDL alert status change
     */
    public static function pdlAlertStatusChanged($alert, $oldStatus, $newStatus, $user = null): SystemNotification
    {
        $user = $user ?? Auth::user();
        $alertTypeName = PdlAlert::ALERT_TYPES[$alert->alert_type] ?? ucfirst(str_replace('_', ' ', $alert->alert_type));

        return self::createNotification(
            "PDL {$alertTypeName} Status Updated",
            "{$alertTypeName} for PDL {$alert->pdl->fname} {$alert->pdl->lname} status changed from {$oldStatus} to {$newStatus}",
            $alert->alert_type,
            $alert->pdl_id,
            null, // URL will be generated dynamically
            $user->id
        );
    }

    /**
     * Send reminders for all due alerts
     */
    public static function sendDueReminders(): array
    {
        $alerts = PdlAlert::dueForReminder()->with(['pdl', 'assignedTo'])->get();
        $notifications = [];

        foreach ($alerts as $alert) {
            // Send to assigned personnel if available
            if ($alert->assigned_to) {
                $notifications[] = self::pdlAlertReminder($alert, $alert->assignedTo);
            }

            // Send to all admin users
            $adminUsers = Personnel::where('position', 'admin')->get();
            foreach ($adminUsers as $admin) {
                $notifications[] = self::pdlAlertReminder($alert, $admin);
            }

            // Update reminder_sent_to to track who received reminders
            $sentTo = $alert->reminder_sent_to ?? [];
            if ($alert->assigned_to) {
                $sentTo[] = $alert->assigned_to;
            }
            foreach ($adminUsers as $admin) {
                $sentTo[] = $admin->id;
            }
            $alert->update(['reminder_sent_to' => array_unique($sentTo)]);
        }

        return $notifications;
    }

    /**
     * Create specific alert type methods for convenience
     */
    public static function paroleHearingScheduled($pdl, $scheduledDate, $location = null, $user = null): PdlAlert
    {
        $user = $user ?? Auth::user();
        $alert = PdlAlert::create([
            'pdl_id' => $pdl->id,
            'alert_type' => 'parole_hearing',
            'title' => "Parole Hearing - {$pdl->fname} {$pdl->lname}",
            'description' => "Parole hearing scheduled for PDL {$pdl->fname} {$pdl->lname}",
            'scheduled_date' => $scheduledDate,
            'reminder_date' => $scheduledDate->subDays(1), // Remind 1 day before
            'location' => $location,
            'created_by' => $user->id,
        ]);

        self::pdlAlertCreated($alert, $user);
        return $alert;
    }

    public static function medicalAppointmentScheduled($pdl, $scheduledDate, $location = null, $user = null): PdlAlert
    {
        $user = $user ?? Auth::user();
        $alert = PdlAlert::create([
            'pdl_id' => $pdl->id,
            'alert_type' => 'medical_appointment',
            'title' => "Medical Appointment - {$pdl->fname} {$pdl->lname}",
            'description' => "Medical appointment scheduled for PDL {$pdl->fname} {$pdl->lname}",
            'scheduled_date' => $scheduledDate,
            'reminder_date' => $scheduledDate->subHours(2), // Remind 2 hours before
            'location' => $location,
            'created_by' => $user->id,
        ]);

        self::pdlAlertCreated($alert, $user);
        return $alert;
    }

    public static function courtAppearanceScheduled($pdl, $scheduledDate, $location = null, $user = null): PdlAlert
    {
        $user = $user ?? Auth::user();
        $alert = PdlAlert::create([
            'pdl_id' => $pdl->id,
            'alert_type' => 'court_appearance',
            'title' => "Court Appearance - {$pdl->fname} {$pdl->lname}",
            'description' => "Court appearance scheduled for PDL {$pdl->fname} {$pdl->lname}",
            'scheduled_date' => $scheduledDate,
            'reminder_date' => $scheduledDate->subDays(1), // Remind 1 day before
            'location' => $location,
            'created_by' => $user->id,
        ]);

        self::pdlAlertCreated($alert, $user);
        return $alert;
    }
}
