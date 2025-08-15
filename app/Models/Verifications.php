<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Verifications extends Model
{
    protected $primaryKey = 'verification_id';

    protected $fillable = [
        'reason',
        'personnel_id',
        'pdl_id',
        'status',
        'feedback',
        'reviewed_by',
        'reviewed_at',
    ];

    public function personnel()
    {
        return $this->belongsTo(Personnel::class, 'personnel_id');
    }

    public function pdl()
    {
        return $this->belongsTo(Pdl::class, 'pdl_id');
    }
    public function reviewer()
    {
        return $this->belongsTo(Personnel::class, 'reviewed_by');
    }
}
