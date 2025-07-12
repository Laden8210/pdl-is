<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pdl extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'pdl';

    protected $fillable = [
        'fname',
        'lname',
        'alias',
        'birthdate',
        'age',
        'gender',
        'ethnic_group',
        'civil_status',
        'brgy',
        'city',
        'province',
        'personnel_id',
    ];

    protected $casts = [
        'birthdate' => 'date',
    ];


    public function personnel()
    {
        return $this->belongsTo(Personnel::class);
    }
}
