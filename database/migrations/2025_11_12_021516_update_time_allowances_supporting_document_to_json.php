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
        Schema::table('time_allowances', function (Blueprint $table) {
            // Change supporting_document from string to text to store JSON array
            $table->text('supporting_document')->nullable()->change();
        });

        // Convert existing single file paths to JSON array format
        DB::table('time_allowances')
            ->whereNotNull('supporting_document')
            ->where('supporting_document', '!=', '')
            ->get()
            ->each(function ($record) {
                $filePath = $record->supporting_document;
                DB::table('time_allowances')
                    ->where('id', $record->id)
                    ->update([
                        'supporting_document' => json_encode([$filePath])
                    ]);
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Convert JSON arrays back to single file paths (take first element)
        DB::table('time_allowances')
            ->whereNotNull('supporting_document')
            ->where('supporting_document', '!=', '')
            ->get()
            ->each(function ($record) {
                $documents = json_decode($record->supporting_document, true);
                $firstDocument = is_array($documents) && !empty($documents) ? $documents[0] : $record->supporting_document;
                DB::table('time_allowances')
                    ->where('id', $record->id)
                    ->update([
                        'supporting_document' => $firstDocument
                    ]);
            });

        Schema::table('time_allowances', function (Blueprint $table) {
            // Convert back to string
            $table->string('supporting_document')->nullable()->change();
        });
    }
};
