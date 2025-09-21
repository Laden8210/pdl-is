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
        Schema::table('medical_records', function (Blueprint $table) {
            // Remove laboratory field if it exists (as per the migration that removes it)
            if (Schema::hasColumn('medical_records', 'laboratory')) {
                $table->dropColumn('laboratory');
            }

            // Make sure all required fields are present and properly typed
            $table->text('complaint')->change();
            $table->text('prognosis')->nullable()->change();
            $table->text('prescription')->nullable()->change();
            $table->text('findings')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('medical_records', function (Blueprint $table) {
            // Revert changes if needed
            $table->string('complaint')->change();
            $table->string('prognosis')->nullable()->change();
            $table->string('prescription')->nullable()->change();
            $table->string('findings')->nullable()->change();
        });
    }
};
