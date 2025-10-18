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


        Schema::table('activity', function (Blueprint $table) {
            $table->enum('status', ['pending', 'completed', 'cancelled', 'rescheduled'])
                  ->default('pending');
            $table->text('reason')->nullable();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop status and reason columns from activity table
        Schema::table('activity', function (Blueprint $table) {
            $table->dropColumn('status');
            $table->dropColumn('reason');
        });
    }
};
