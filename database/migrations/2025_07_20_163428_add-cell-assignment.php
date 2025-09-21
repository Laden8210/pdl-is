<?php

use App\Models\Pdl;
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
        Schema::create('cells', function (Blueprint $table) {
            $table->id('cell_id');
            $table->string('cell_name');
            $table->integer('capacity');
            $table->string('description')->nullable(); // Optional: make nullable if not always filled
            $table->string('status')->default('active');
            $table->timestamps();
        });

        Schema::create('cell_assignments', function (Blueprint $table) {
            $table->id('assignment_id');
            $table->unsignedBigInteger('cell_id');
            $table->unsignedBigInteger('pdl_id');

            $table->foreign('cell_id')->references('cell_id')->on('cells')->onDelete('cascade');
            $table->foreign('pdl_id')->references('id')->on('pdl')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
