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
        Schema::table('pdl', function (Blueprint $table) {
            $table->enum('archive_court_order_type', [
                'RELEASE',
                'BAIL',
                'SERVED_SENTENCE',
                'PROBATION',
                'PAROLE',
                'TRANSFER',
                'OTHER'
            ])->nullable();

            $table->string('archive_court_order_file')->nullable();
            $table->string('archive_case_number')->nullable();
            $table->timestamp('archive_court_order_date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pdl', function (Blueprint $table) {
            $table->dropColumn([
                'archive_court_order_type',
                'archive_court_order_file',
                'archive_case_number',
                'archive_court_order_date'
            ]);
        });
    }
};
