<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SystemNotification extends Model
{
    use HasFactory;

    protected $primaryKey = 'notification_id';

    protected $fillable = [
        'title',
        'message',
        'notification_type',
        'action_url',
        'personnel_id',
        'pdl_id',
    ];


    public function personnel()
    {
        return $this->belongsTo(Personnel::class, 'personnel_id');
    }

    public function pdl()
    {
        return $this->belongsTo(Pdl::class, 'pdl_id');
    }

    public function readBy()
    {
        return $this->hasMany(SystemNotificationReadBy::class, 'notification_id');
    }

    public function sender()
    {
        return $this->belongsTo(Personnel::class, 'personnel_id');
    }

}
