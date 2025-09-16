<?php

namespace App\Console\Commands;

use App\Models\LoginAttempt;
use Illuminate\Console\Command;

class CleanupLoginAttempts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'login-attempts:cleanup {--days=30 : Number of days to keep login attempts}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up old login attempts from the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $days = $this->option('days');

        $this->info("Cleaning up login attempts older than {$days} days...");

        $deletedCount = LoginAttempt::clearOldAttempts($days);

        $this->info("Cleaned up {$deletedCount} old login attempts.");

        return Command::SUCCESS;
    }
}
