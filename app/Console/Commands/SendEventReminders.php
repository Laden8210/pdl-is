<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Activity;
use App\Models\Personnel;
use App\Services\NotificationService;
use Carbon\Carbon;

class SendEventReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'events:send-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send reminders for upcoming events';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for upcoming events...');

        $now = Carbon::now();
        $next3Days = $now->copy()->addDays(3);

        // Find events happening in the next 3 days
        $upcomingEvents = Activity::where('activity_date', '>=', $now->format('Y-m-d'))
            ->where('activity_date', '<=', $next3Days->format('Y-m-d'))
            ->where(function($query) use ($now, $next3Days) {
                $query->where(function($q) use ($now, $next3Days) {
                    // Events today
                    $q->where('activity_date', $now->format('Y-m-d'))
                      ->where('activity_time', '>=', $now->format('H:i:s'));
                })->orWhere(function($q) use ($next3Days) {
                    // Events tomorrow
                    $q->where('activity_date', $next3Days->format('Y-m-d'))
                      ->where('activity_time', '<=', $next3Days->format('H:i:s'));
                });
            })
            ->get();

        $notificationsSent = 0;

        foreach ($upcomingEvents as $activity) {
            $eventDateTime = Carbon::parse($activity->activity_date . ' ' . $activity->activity_time);
            $hoursUntilEvent = $eventDateTime->diffInHours($now);

            // Send notification if event is within 3 days
            if ($hoursUntilEvent <= 3 && $hoursUntilEvent >= 0) {
                // Handle both array and JSON string cases
                $pdlIds = is_array($activity->pdl_ids) ? $activity->pdl_ids : json_decode($activity->pdl_ids, true);
                $pdlIds = $pdlIds ?: [];

                foreach ($pdlIds as $pdlId) {
                    if ($pdlId) {
                        $pdl = \App\Models\Pdl::find($pdlId);
                        if ($pdl) {
                            NotificationService::createNotification(
                                'Upcoming Event Reminder',
                                "Event '{$activity->activity_name}' for PDL {$pdl->fname} {$pdl->lname} is scheduled for {$eventDateTime->format('M d, Y \a\t g:i A')}",
                                'upcoming_event',
                                $pdlId
                            );
                            $notificationsSent++;
                        }
                    }
                }
            }
        }

        $this->info("Sent {$notificationsSent} event reminder notifications.");

        // Also send notifications to all admin users about upcoming events
        $adminUsers = Personnel::where('position', 'admin')->get();
        foreach ($adminUsers as $admin) {
            NotificationService::createNotification(
                'Upcoming Events Summary',
                "There are {$upcomingEvents->count()} events scheduled in the next 24 hours.",
                'upcoming_events_summary',
                null,
                null,
                $admin->id
            );
        }

        return Command::SUCCESS;
    }
}
