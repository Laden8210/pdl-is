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
            $table->timestamp('archived_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pdl', function (Blueprint $table) {
            $table->dropColumn([
                'archive_status',
                'archive_reason',
                'archived_at'
            ]);
        });
    }
};
