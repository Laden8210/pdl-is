<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\Personnel;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pdl', function (Blueprint $table) {
            $table->id();
            $table->string('fname');
            $table->string('lname');
            $table->string('alias')->nullable();
            $table->date('birthdate')->nullable();
            $table->integer('age')->nullable();
            $table->enum('gender', ['Male', 'Female'])->nullable();
            $table->string('ethnic_group')->nullable();
            $table->enum('civil_status', ['Single', 'Married', 'Widowed', 'Divorced'])->nullable();
            $table->string('brgy')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->unsignedBigInteger('personnel_id');
            $table->foreign('personnel_id')
                ->references('id')
                ->on('personnel')
                ->onDelete('cascade')
                ->onUpdate('cascade');
                
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personal_information');
    }
};
