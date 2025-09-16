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
        Schema::create('pdl_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\Pdl::class)->constrained('pdl', 'id')->onDelete('cascade');
            $table->string('alert_type'); // parole_hearing, medical_appointment, scheduled_activity, etc.
            $table->string('title');
            $table->text('description');
            $table->datetime('scheduled_date');
            $table->datetime('reminder_date')->nullable(); // When to send reminder
            $table->string('location')->nullable();
            $table->string('status')->default('pending'); // pending, completed, cancelled, rescheduled
            $table->foreignIdFor(\App\Models\Personnel::class, 'created_by')->constrained('personnel', 'id')->onDelete('cascade');
            $table->foreignIdFor(\App\Models\Personnel::class, 'assigned_to')->nullable()->constrained('personnel', 'id')->onDelete('set null');
            $table->json('reminder_sent_to')->nullable(); // Track who received reminders
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pdl_alerts');
    }
};
