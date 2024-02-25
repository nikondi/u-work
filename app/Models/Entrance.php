<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Entrance extends Model
{
    public function worker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'worker_id', 'id');
    }
    public $timestamps = false;

    protected $fillable = [
        'id',
        'address_id',
        'entrance',
        'per_floor'
    ];
}
