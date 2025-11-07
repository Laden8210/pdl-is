<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sms', function (Blueprint $table) {
            $table->id();
            $table->string('recipient_number');
            $table->text('message');
            $table->string('otp_code')->nullable();
            $table->dateTime('otp_expires_at')->nullable();
            $table->foreignId('personnel_id')->nullable()->constrained('personnel')->onDelete('set null');
            $table->boolean('is_used')->default(false);
            $table->boolean('is_sent')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sms');
    }
};
