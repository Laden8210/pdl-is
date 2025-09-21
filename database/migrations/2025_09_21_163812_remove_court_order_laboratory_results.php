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
            $table->dropColumn('laboratory');
        });

        Schema::table('court_orders', function (Blueprint $table) {
            $table->dropColumn('court_order_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('medical_records', function (Blueprint $table) {
            $table->string('laboratory')->nullable();
        });

        Schema::table('court_orders', function (Blueprint $table) {
            $table->string('court_order_number')->nullable();
        });
    }
};
