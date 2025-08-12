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

    public function verifications()
    {
        return $this->hasMany(Verifications::class);
    }

    public function physicalCharacteristics()
    {
        return $this->hasMany(PhysicalCharacteristic::class);
    }

    public function courtOrders()
    {
        return $this->hasMany(CourtOrder::class);
    }

    public function medicalRecords()
    {
        return $this->hasMany(MedicalRecord::class);
    }

    public function personnel()
    {
        return $this->belongsTo(Personnel::class);
    }
}
