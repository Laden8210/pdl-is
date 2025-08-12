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
        Schema::create('court_orders', function (Blueprint $table) {
            $table->id('court_order_id');
            $table->string('court_order_number')->unique();
            $table->string('order_type');
            $table->date('order_date');
            $table->date('received_date')->nullable();
            $table->string('remarks')->nullable();
            $table->string('document_type')->nullable();
            $table->string('court_branch');
            $table->foreignIdFor(\App\Models\Pdl::class, 'pdl_id')
                ->constrained('pdl', 'id')
                ->onDelete('cascade');
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
