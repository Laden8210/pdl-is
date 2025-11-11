<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CaseInformation extends Model
{
    use HasFactory;

    protected $primaryKey = 'case_id';

    protected $fillable = [
        'case_number',
        'crime_committed',
        'date_committed',
        'time_committed',
        'case_status',
        'case_remarks',
        'pdl_id',
        'security_classification',
        'drug_related',
    ];

    protected $casts = [
        'date_committed' => 'date',
        'drug_related' => 'boolean',
    ];
    

    public function pdl()
    {
        return $this->belongsTo(Pdl::class, 'pdl_id');
    }
}
