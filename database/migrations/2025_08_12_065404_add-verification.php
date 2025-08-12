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
        Schema::create('verifications', function (Blueprint $table) {
            $table->id('verification_id');
            $table->string('reason');
            $table->foreignIdFor(\App\Models\Personnel::class, 'personnel_id')
                ->constrained('personnel', 'id')
                ->onDelete('cascade');
            $table->foreignIdFor(\App\Models\Pdl::class, 'pdl_id')
                ->constrained('pdl', 'id')
                ->onDelete('cascade');
            $table->string('status')->default('pending');

            $table->text('feedback')->nullable();
            $table->foreignIdFor(\App\Models\Personnel::class, 'reviewed_by')
                ->nullable()
                ->constrained('personnel', 'id')
                ->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('verifications');
    }
};
