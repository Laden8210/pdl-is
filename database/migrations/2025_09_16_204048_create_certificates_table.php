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
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->string('certificate_number')->unique();
            $table->enum('certificate_type', [
                'drug_clearing_status',
                'no_records',
                'good_standing',
                'release_clearance',
                'medical_clearance',
                'disciplinary_clearance'
            ]);
            $table->string('title');
            $table->text('content');
            $table->json('pdl_data'); // Store PDL information
            $table->json('issuer_data'); // Store issuer information
            $table->date('issue_date');
            $table->date('valid_until')->nullable();
            $table->string('status')->default('active'); // active, expired, revoked
            $table->text('purpose')->nullable();
            $table->text('remarks')->nullable();
            $table->string('file_path')->nullable(); // Path to generated PDF
            $table->foreignId('pdl_id')->nullable()->constrained('pdl', 'id')->onDelete('cascade');
            $table->foreignId('issued_by')->constrained('personnel', 'id')->onDelete('cascade');
            $table->foreignId('requested_by')->nullable()->constrained('personnel', 'id')->onDelete('set null');
            $table->timestamps();

            // Indexes for efficient querying
            $table->index(['certificate_type', 'status']);
            $table->index(['issue_date', 'valid_until']);
            $table->index(['pdl_id', 'certificate_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
