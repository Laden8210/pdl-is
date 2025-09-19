<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MedicalRecord extends Model
{
    use HasFactory;

    protected $primaryKey = 'medical_record_id';

    protected $fillable = [
        'pdl_id',
        'complaint',
        'date',
        'prognosis',
        'laboratory',
        'prescription',
        'findings',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function pdl(): BelongsTo
    {
        return $this->belongsTo(Pdl::class, 'pdl_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(MedicalDocument::class, 'medical_record_medical_record_id', 'medical_record_id');
    }
}
