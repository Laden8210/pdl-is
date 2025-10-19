<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RequestLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'method',
        'url',
        'status_code',
        'request_headers',
        'request_body',
        'response_headers',
        'response_body',
        'success_message',
        'error_message',
        'ip_address',
        'user_agent',
        'personnel_id',
        'duration',
    ];

    protected $casts = [
        'request_headers' => 'array',
        'response_headers' => 'array',
        'duration' => 'float',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(Personnel::class, 'personnel_id', 'id');
    }


    public function scopeSuccessful($query)
    {
        return $query->where('status_code', '>=', 200)->where('status_code', '<', 300);
    }


    public function scopeErrors($query)
    {
        return $query->where('status_code', '>=', 400);
    }


    public function isSuccessful(): bool
    {
        return $this->status_code >= 200 && $this->status_code < 300;
    }
}
