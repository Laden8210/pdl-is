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
        // Add archiving fields to case_information table
        Schema::table('case_information', function (Blueprint $table) {
            $table->enum('archive_status', [
                'BONDED',
                'SERVED_SENTENCE',
                'PROV_DISMISSED',
                'DISMISSED',
                'TRANSFER_TO_OTHER_FACILITY',
                'DAPECOL',
                'PROBATION',
                'DECEASED',
                'ACQUITTED'
            ])->nullable();

            $table->text('archive_reason')->nullable();
            $table->string('archive_court_order_path')->nullable();
            $table->timestamp('archived_at')->nullable();
            $table->text('archive_notes')->nullable();
            $table->timestamp('admission_date')->nullable();
            $table->timestamp('release_date')->nullable();
        });

        // Remove archiving fields from pdl table
        Schema::table('pdl', function (Blueprint $table) {
            $table->dropColumn([
                'archive_status',
                'archive_reason',
                'archive_court_order_path',
                'archive_case_number',
                'archived_at',
                'archive_notes',
                'admission_date',
                'release_date'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Add archiving fields back to pdl table
        Schema::table('pdl', function (Blueprint $table) {
            $table->enum('archive_status', [
                'BONDED',
                'SERVED_SENTENCE',
                'PROV_DISMISSED',
                'DISMISSED',
                'TRANSFER_TO_OTHER_FACILITY',
                'DAPECOL',
                'PROBATION',
                'DECEASED',
                'ACQUITTED'
            ])->nullable();

            $table->text('archive_reason')->nullable();
            $table->string('archive_court_order_path')->nullable();
            $table->string('archive_case_number')->nullable();
            $table->timestamp('archived_at')->nullable();
            $table->text('archive_notes')->nullable();
            $table->timestamp('admission_date')->nullable();
            $table->timestamp('release_date')->nullable();
        });

        // Remove archiving fields from case_information table
        Schema::table('case_information', function (Blueprint $table) {
            $table->dropColumn([
                'archive_status',
                'archive_reason',
                'archive_court_order_path',
                'archived_at',
                'archive_notes',
                'admission_date',
                'release_date'
            ]);
        });
    }
};
