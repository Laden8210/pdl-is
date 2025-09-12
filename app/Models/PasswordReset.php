<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordReset extends Model
{


    protected $table = 'password_resets';
    public $timestamps = false;
    protected $fillable = [
        'personnel_id',
        'is_used',
        'created_at',
    ];
    public function personnel()
    {
        return $this->belongsTo(Personnel::class, 'personnel_id');
    }

}
