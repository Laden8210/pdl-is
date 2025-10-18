<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pdl', function (Blueprint $table) {
            $table->enum('civil_status', ['Single', 'Married', 'Widowed', 'Annulment', 'Divorced'])->nullable()->change();
        });
        // Step 1: Fix existing invalid data
        DB::statement("UPDATE pdl SET civil_status = 'Annulment' WHERE civil_status = 'Divorced'");

        // Step 2: Force invalid entries to null (as fallback)
        DB::statement("UPDATE pdl SET civil_status = NULL WHERE civil_status NOT IN ('Single', 'Married', 'Widowed', 'Annulment')");

        // Step 3: Modify column
        Schema::table('pdl', function (Blueprint $table) {
            $table->enum('civil_status', ['Single', 'Married', 'Widowed', 'Annulment'])->nullable()->change();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void {}
};
