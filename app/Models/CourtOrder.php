<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourtOrder extends Model
{
    use HasFactory;

    protected $primaryKey = 'court_order_id';

    protected $fillable = [
        'court_order_number',
        'order_type',
        'order_date',
        'received_date',
        'remarks',
        'document_type',
        'court_branch',
        'pdl_id',
    ];

    protected $casts = [
        'order_date' => 'date',
        'received_date' => 'date',
    ];

    public function pdl()
    {
        return $this->belongsTo(Pdl::class, 'pdl_id');
    }
}
