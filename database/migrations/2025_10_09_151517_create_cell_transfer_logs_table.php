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
        Schema::create('cell_transfer_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('assignment_id');
            $table->unsignedBigInteger('pdl_id');
            $table->unsignedBigInteger('from_cell_id');
            $table->unsignedBigInteger('to_cell_id');
            $table->unsignedBigInteger('transferred_by'); // personnel_id who performed the transfer
            $table->text('reason')->nullable();
            $table->timestamp('transferred_at');
            $table->timestamps();

            $table->foreign('assignment_id')->references('assignment_id')->on('cell_assignments')->onDelete('cascade');
            $table->foreign('pdl_id')->references('id')->on('pdl')->onDelete('cascade');
            $table->foreign('from_cell_id')->references('cell_id')->on('cells')->onDelete('cascade');
            $table->foreign('to_cell_id')->references('cell_id')->on('cells')->onDelete('cascade');
            $table->foreign('transferred_by')->references('id')->on('personnel')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cell_transfer_logs');
    }
};
