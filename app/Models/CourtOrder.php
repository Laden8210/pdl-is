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
        'document_path',
        'original_filename',
        'court_branch',
        'pdl_id',
        'archive_status',
        'archive_reason',
        'archive_court_order_path',
        'archived_at',
        'archive_notes',
        'admission_date',
        'release_date',
    ];

    protected $casts = [
        'order_date' => 'date',
        'received_date' => 'date',
        'archived_at' => 'datetime',
        'admission_date' => 'datetime',
        'release_date' => 'datetime',
    ];

    public function pdl()
    {
        return $this->belongsTo(Pdl::class, 'pdl_id');
    }

    // Archive status constants
    const ARCHIVE_STATUS_BONDED = 'BONDED';
    const ARCHIVE_STATUS_SERVED_SENTENCE = 'SERVED_SENTENCE';
    const ARCHIVE_STATUS_PROV_DISMISSED = 'PROV_DISMISSED';
    const ARCHIVE_STATUS_DISMISSED = 'DISMISSED';
    const ARCHIVE_STATUS_TRANSFER_TO_OTHER_FACILITY = 'TRANSFER_TO_OTHER_FACILITY';
    const ARCHIVE_STATUS_DAPECOL = 'DAPECOL';
    const ARCHIVE_STATUS_PROBATION = 'PROBATION';
    const ARCHIVE_STATUS_DECEASED = 'DECEASED';
    const ARCHIVE_STATUS_ACQUITTED = 'ACQUITTED';

    // Get all archive status options
    public static function getArchiveStatusOptions()
    {
        return [
            self::ARCHIVE_STATUS_BONDED => 'BONDED',
            self::ARCHIVE_STATUS_SERVED_SENTENCE => 'SERVED SENTENCE',
            self::ARCHIVE_STATUS_PROV_DISMISSED => 'PROV. DISMISSED',
            self::ARCHIVE_STATUS_DISMISSED => 'DISMISSED',
            self::ARCHIVE_STATUS_TRANSFER_TO_OTHER_FACILITY => 'TRANSFER TO OTHER FACILITY',
            self::ARCHIVE_STATUS_DAPECOL => 'DAPECOL',
            self::ARCHIVE_STATUS_PROBATION => 'PROBATION',
            self::ARCHIVE_STATUS_DECEASED => 'DECEASED',
            self::ARCHIVE_STATUS_ACQUITTED => 'ACQUITTED',
        ];
    }

    // Check if court order is archived
    public function isArchived()
    {
        return !is_null($this->archived_at);
    }
}
