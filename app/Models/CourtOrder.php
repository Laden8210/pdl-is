<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourtOrder extends Model
{
    use HasFactory;

    protected $primaryKey = 'court_order_id';

    protected $fillable = [
        'order_type',
        'order_date',
        'received_date',
        'remarks',
        'cod_remarks',
        'document_type',
        'document_path',
        'original_filename',
        'court_id',
        'pdl_id',
        'admission_date',
        'release_date',
    ];

    protected $casts = [
        'order_date' => 'date',
        'received_date' => 'date',
        'admission_date' => 'datetime',
        'release_date' => 'datetime',
    ];

    public function pdl()
    {
        return $this->belongsTo(Pdl::class, 'pdl_id');
    }


    public function court_branch()
    {
        return $this->belongsTo(Court::class, 'court_id')->select('branch_code');
    }

    public function court()
    {
        return $this->belongsTo(Court::class, 'court_id');
    }
}
