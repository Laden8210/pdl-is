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

        'pdl_ids',
        'status',
        'reason',
    ];

    protected $casts = [
        'pdl_ids' => 'array',
    ];

    public function pdls()
    {
        if ($this->pdl_ids) {
            // Handle both array and JSON string cases
            $pdlIds = is_array($this->pdl_ids) ? $this->pdl_ids : json_decode($this->pdl_ids, true);
            if (is_array($pdlIds) && !empty($pdlIds)) {
                return Pdl::whereIn('id', $pdlIds)->get();
            }
        }
        return collect();
    }

    public function getPdlsAttribute()
    {
        return $this->pdls();
    }
}
