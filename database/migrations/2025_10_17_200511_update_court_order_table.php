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
        // Schema::table('court_orders', function (Blueprint $table) {
        //     $table->foreignIdFor(\App\Models\Court::class, 'court_id')->constrained('courts');
        //     $table->dropColumn('court_branch');
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

    }
};
