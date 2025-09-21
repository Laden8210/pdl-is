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
        Schema::table('physical_characteristics', function (Blueprint $table) {
            // Add pc_remark field to match form
            if (!Schema::hasColumn('physical_characteristics', 'pc_remark')) {
                $table->text('pc_remark')->nullable()->after('remark');
            }

            // Make sure all fields are properly typed
            $table->decimal('height', 8, 2)->nullable()->change();
            $table->decimal('weight', 8, 2)->nullable()->change();
            $table->string('build')->nullable()->change();
            $table->string('complexion')->nullable()->change();
            $table->string('hair_color')->nullable()->change();
            $table->string('eye_color')->nullable()->change();
            $table->text('identification_marks')->nullable()->change();
            $table->text('mark_location')->nullable()->change();
            $table->text('remark')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('physical_characteristics', function (Blueprint $table) {
            $table->dropColumn('pc_remark');
        });
    }
};
