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
        // Use raw SQL to handle the foreign key constraint
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        Schema::table('activity', function (Blueprint $table) {
            // Drop old column
            $table->dropColumn('pdl_id');
        });

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('activity', function (Blueprint $table) {
            $table->dropColumn('pdl_ids');
            $table->unsignedBigInteger('pdl_id')->nullable();
            $table->foreign('pdl_id')->references('id')->on('pdl')->onDelete('cascade');
        });
    }
};
