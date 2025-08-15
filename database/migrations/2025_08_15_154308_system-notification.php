<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('system_notifications', function (Blueprint $table) {
            $table->id('notification_id');
            $table->string('title');
            $table->text('message');
            $table->foreignIdFor(\App\Models\Personnel::class, 'personnel_id')
                ->constrained('personnel', 'id')
                ->onDelete('cascade');
            $table->foreignIdFor(\App\Models\Pdl::class, 'pdl_id')
                ->constrained('pdl', 'id')
                ->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('system_notifications_read_by', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\SystemNotification::class, 'notification_id')
                ->constrained('system_notifications', 'notification_id')
                ->onDelete('cascade');
            $table->foreignIdFor(\App\Models\Personnel::class, 'personnel_id')
                ->constrained('personnel', 'id')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_notifications_read_by');
        Schema::dropIfExists('system_notifications');
    }
};
