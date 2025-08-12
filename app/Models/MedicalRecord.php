<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    public function pdl()
    {
        return $this->belongsTo(Pdl::class, 'pdl_id');
    }
}
