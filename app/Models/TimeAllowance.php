<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeAllowance extends Model
{
    use HasFactory;

    protected $fillable = [
        'pdl_id',
        'type',
        'days',
        'reason',
        'awarded_by',
        'awarded_at'
    ];

    protected $dates = ['awarded_at'];

    public function pdl()
    {
        return $this->belongsTo(Pdl::class);
    }

    public function awardedBy()
    {
        return $this->belongsTo(Personnel::class, 'awarded_by');
    }
}
