<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CellTransferLog extends Model
{
    use HasFactory;

    protected $table = 'cell_transfer_logs';

    protected $fillable = [
        'assignment_id',
        'pdl_id',
        'from_cell_id',
        'to_cell_id',
        'transferred_by',
        'reason',
        'transferred_at',
    ];

    protected $casts = [
        'transferred_at' => 'datetime',
    ];

    public function assignment()
    {
        return $this->belongsTo(CellAssignment::class, 'assignment_id', 'assignment_id');
    }

    public function pdl()
    {
        return $this->belongsTo(Pdl::class, 'pdl_id', 'id');
    }

    public function fromCell()
    {
        return $this->belongsTo(Cells::class, 'from_cell_id', 'cell_id');
    }

    public function toCell()
    {
        return $this->belongsTo(Cells::class, 'to_cell_id', 'cell_id');
    }

    public function transferredBy()
    {
        return $this->belongsTo(Personnel::class, 'transferred_by', 'id');
    }
}
