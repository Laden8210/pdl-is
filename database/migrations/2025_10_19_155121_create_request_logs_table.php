<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('request_logs', function (Blueprint $table) {
            $table->id();
            $table->string('method', 10);
            $table->string('url');
            $table->integer('status_code')->nullable();
            $table->text('request_headers')->nullable();
            $table->text('request_body')->nullable();
            $table->text('response_headers')->nullable();
            $table->text('response_body')->nullable();
            $table->text('success_message')->nullable();
            $table->text('error_message')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->foreignId('personnel_id')->nullable()->constrained('personnel')->onDelete('set null');
            $table->float('duration')->default(0);
            $table->timestamps();

            $table->index('method');
            $table->index('status_code');
            $table->index('personnel_id');
            $table->index('created_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('request_logs');
    }
};
