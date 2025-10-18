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
            $table->string('mugshot_path')->nullable()->after('province');
            $table->string('mugshot_original_filename')->nullable()->after('mugshot_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pdl', function (Blueprint $table) {
            $table->dropColumn(['mugshot_path', 'mugshot_original_filename']);
        });
    }
};
