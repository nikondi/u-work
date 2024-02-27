<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Entrance extends Model
{
    public $timestamps = false;

    public function worker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'worker_id', 'id');
    }

    public function clients(): HasMany
    {
        return $this->hasMany(Client::class, 'address_id');
    }

    protected $fillable = [
        'id',
        'address_id',
        'entrance',
        'per_floor'
    ];
}
