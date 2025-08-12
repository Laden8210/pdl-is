<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CellAssignment extends Model
{
    use HasFactory;

    protected $table = 'cell_assignments';
    protected $primaryKey = 'assignment_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'cell_id',
        'pdl_id',
    ];

    public function cell()
    {
        return $this->belongsTo(Cells::class, 'cell_id', 'cell_id');
    }

    public function pdl()
    {
        return $this->belongsTo(Pdl::class, 'pdl_id', 'id');
    }
}
