<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SystemNotificationReadBy extends Model
{
    use HasFactory;

    protected $table = 'system_notifications_read_by';

    protected $fillable = [
        'notification_id',
        'personnel_id',
    ];

    public $timestamps = true;

    public function notification()
    {
        return $this->belongsTo(SystemNotification::class, 'notification_id', 'notification_id');
    }

    public function personnel()
    {
        return $this->belongsTo(Personnel::class, 'personnel_id');
    }
}
