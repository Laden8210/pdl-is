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
        Schema::create('case_information', function (Blueprint $table) {
            $table->id('case_id');
            $table->string('case_number')->unique();
            $table->string('crime_committed');
            $table->date('date_committed');
            $table->string('time_committed');
            $table->string('case_status');
            $table->string('case_remarks')->nullable();
            $table->foreignIdFor(\App\Models\Pdl::class, 'pdl_id')
                ->constrained('pdl', 'id')
                ->onDelete('cascade');
            $table->string('security_classification')->nullable();

            $table->timestamps();
        });

        Schema::create('medical_records', function (Blueprint $table) {
            $table->id('medical_record_id');
            $table->foreignIdFor(\App\Models\Pdl::class, 'pdl_id')
                ->constrained('pdl', 'id')
                ->onDelete('cascade');
            $table->string('complaint');
            $table->date('date');
            $table->text('prognosis')->nullable();
            $table->text('laboratory')->nullable();
            $table->text('prescription')->nullable();
            $table->text('findings')->nullable();
            $table->timestamps();
        });

        Schema::create('physical_characteristics', function (Blueprint $table) {
            $table->id('characteristic_id');
            $table->double('height')->nullable();
            $table->double('weight')->nullable();
            $table->string('build')->nullable();
            $table->string('complexion')->nullable();
            $table->string('hair_color')->nullable();
            $table->string('eye_color')->nullable();
            $table->string('identification_marks')->nullable();
            $table->string('mark_location')->nullable();

            $table->string('remark')->nullable();
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
