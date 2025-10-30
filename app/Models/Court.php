<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Court extends Model
{
    protected $table = 'courts';
    protected $primaryKey = 'court_id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'branch_code',
        'branch',
        'station',
        'court_type',
        'location',
    ];

    // Relationship with court orders
    public function courtOrders()
    {
        return $this->hasMany(CourtOrder::class, 'court_id');
    }

    // Relationship with PDls through court orders
    public function pdls()
    {
        return $this->hasManyThrough(
            Pdl::class,
            CourtOrder::class,
            'court_id',
            'pdl_id',
            'court_id',
            'pdl_id'
        );
    }

    // Get active PDls for this court
    public function activePdls()
    {
        return $this->pdls()
            ->whereNull('deleted_at')
            ->whereNull('archive_status');
    }

    // Get court types for dropdown
    public static function getCourtTypes()
    {
        return [
            'Regional Trial Court',
            'Municipal Trial Court',
            'Family Court',
            'Metropolitan Trial Court',
            'Municipal Circuit Trial Court',
            'Sharia Court',
            'Other'
        ];
    }

    // Get stations for dropdown
    public static function getStations()
    {
        return self::distinct()->pluck('station')->toArray();
    }

    // Format branch with code
    public function getBranchWithCodeAttribute()
    {
        return $this->branch_code ? "{$this->branch} ({$this->branch_code})" : $this->branch;
    }

    // Get full court name
    public function getFullCourtNameAttribute()
    {
        return "{$this->court_type} - {$this->branch} - {$this->station}";
    }
}
