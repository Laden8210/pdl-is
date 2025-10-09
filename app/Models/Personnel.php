<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;

class Personnel extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'fname',
        'mname',
        'lname',
        'contactnum',
        'avatar',
        'username',
        'password',
        'position',
        'agency',
    ];
    protected $hidden = [
        'password',
        'remember_token',
    ];
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    protected $table = 'personnel';
    protected $primaryKey = 'id';
    public $incrementing = true;
    public $timestamps = true;
    protected $keyType = 'int';
    protected $guarded = [];
    protected $attributes = [
        'fname' => '',
        'mname' => null,
        'lname' => '',
        'contactnum' => '',
        'avatar' => null,
        'username' => '',
        'password' => '',
        'position' => '',
        'agency' => '',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function pdls()
    {
        return $this->hasMany(Pdl::class);
    }

    public function scopeWithTrashed($query)
    {
        return $query->whereNotNull('deleted_at');
    }

    public function passwordResets()
    {
        return $this->hasMany(PasswordReset::class);
    }

    public function getActivePasswordResetAttribute()
    {
        return $this->passwordResets()
            ->where('is_used', false)
            ->where('created_at', '>', now()->subHours(24))
            ->first();
    }
}
