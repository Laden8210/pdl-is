<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransferReason extends Model
{
    protected $fillable = [
        'reason',
        'usage_count',
    ];

    protected $casts = [
        'usage_count' => 'integer',
    ];
}
