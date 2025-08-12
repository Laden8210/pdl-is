<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cells extends Model
{
    use HasFactory;

    protected $table = 'cells';
    protected $primaryKey = 'cell_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'cell_name',
        'capacity',
        'description',
        'status',
    ];

    public function assignments()
    {
        return $this->hasMany(CellAssignment::class, 'cell_id', 'cell_id');
    }
}
