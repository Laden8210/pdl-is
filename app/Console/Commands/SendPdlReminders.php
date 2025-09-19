<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\NotificationService;
use App\Models\PdlAlert;

class SendPdlReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pdl:send-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send reminders for upcoming PDL alerts and appointments';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for due PDL reminders...');
        
        $notifications = NotificationService::sendDueReminders();
        
        if (empty($notifications)) {
            $this->info('No reminders to send at this time.');
            return;
        }
        
        $this->info("Sent {count($notifications)} reminder notifications.");
        
        // Log the reminders sent
        foreach ($notifications as $notification) {
            $this->line("- {$notification->title}: {$notification->message}");
        }
        
        $this->info('PDL reminder process completed successfully.');
    }
}
