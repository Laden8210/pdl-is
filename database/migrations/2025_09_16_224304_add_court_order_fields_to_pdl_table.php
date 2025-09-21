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
        // Schema::table('pdl', function (Blueprint $table) {
        //     $table->string('archive_court_order_path')->nullable()->after('archive_reason');
        //     $table->string('archive_case_number')->nullable()->after('archive_court_order_path');
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::table('pdl', function (Blueprint $table) {
        //     $table->dropColumn(['archive_court_order_path', 'archive_case_number']);
        // });
    }
};
