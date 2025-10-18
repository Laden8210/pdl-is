<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Court extends Model
{

    protected $table = 'courts';
    protected $primaryKey = 'court_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'branch_code',
        'court_type',
        'location',
    ];
}
