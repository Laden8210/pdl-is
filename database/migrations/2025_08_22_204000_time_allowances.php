<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('time_allowances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pdl_id')->constrained('pdl')->onDelete('cascade');
            $table->enum('type', ['gcta', 'tastm']);
            $table->integer('days');
            $table->text('reason');
            $table->foreignId('awarded_by')->constrained('personnel')->onDelete('cascade');
            $table->timestamp('awarded_at');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('time_allowances');
    }
};
