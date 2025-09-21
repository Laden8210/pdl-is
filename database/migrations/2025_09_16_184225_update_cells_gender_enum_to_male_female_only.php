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
        // First, update any 'mixed' cells to 'male' as default
        DB::table('cells')->where('gender', 'mixed')->update(['gender' => 'male']);
        
        // Then modify the column to only allow 'male' and 'female'
        Schema::table('cells', function (Blueprint $table) {
            $table->enum('gender', ['male', 'female'])->default('male')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cells', function (Blueprint $table) {
            $table->enum('gender', ['male', 'female', 'mixed'])->default('mixed')->change();
        });
    }
};
