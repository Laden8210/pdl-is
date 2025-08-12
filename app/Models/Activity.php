<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $table = 'activity';

    protected $primaryKey = 'activity_id';

    protected $fillable = [
        'category',
        'activity_name',
        'activity_date',
        'activity_time',
        'pdl_id',
    ];

    public function pdl()
    {
        return $this->belongsTo(\App\Models\Pdl::class, 'pdl_id', 'id');
    }
}
