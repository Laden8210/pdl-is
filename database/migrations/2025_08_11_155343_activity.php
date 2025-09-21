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


        Schema::create('activity', function (Blueprint $table) {
            $table->id('activity_id');

            $table->string('category');
            $table->string('activity_name');
            $table->date('activity_date');
            $table->time('activity_time');
            $table->timestamps();
            $table->foreignIdFor(\App\Models\Pdl::class, 'pdl_id')
                ->constrained('pdl', 'id')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity');
    }
};
