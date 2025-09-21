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
        Schema::table('court_orders', function (Blueprint $table) {
            // Add document_path and original_filename if they don't exist
            if (!Schema::hasColumn('court_orders', 'document_path')) {
                $table->string('document_path')->nullable()->after('document_type');
            }
            if (!Schema::hasColumn('court_orders', 'original_filename')) {
                $table->string('original_filename')->nullable()->after('document_path');
            }

            // Add cod_remarks field to match form
            if (!Schema::hasColumn('court_orders', 'cod_remarks')) {
                $table->text('cod_remarks')->nullable()->after('remarks');
            }

            // Make sure received_date is nullable
            $table->date('received_date')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('court_orders', function (Blueprint $table) {
            $table->dropColumn(['document_path', 'original_filename', 'cod_remarks']);
        });
    }
};
