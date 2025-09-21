<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicalRecord extends Model
{
    use HasFactory;

    protected $primaryKey = 'medical_record_id';

    protected $fillable = [
        'pdl_id',
        'complaint',
        'date',
        'prognosis',
        'prescription',
        'findings',
        'stored_filename',
        'file_path',
        'original_filename',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function pdl(): BelongsTo
    {
        return $this->belongsTo(Pdl::class, 'pdl_id');
    }
}
