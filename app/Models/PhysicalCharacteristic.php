<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhysicalCharacteristic extends Model
{
    use HasFactory;

    protected $primaryKey = 'characteristic_id';

    protected $fillable = [
        'height',
        'weight',
        'build',
        'complexion',
        'hair_color',
        'eye_color',
        'identification_marks',
        'mark_location',
        'remark',
        'pc_remark',
        'pdl_id',
    ];

    public function pdl()
    {
        return $this->belongsTo(Pdl::class, 'pdl_id');
    }
}
