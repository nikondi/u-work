<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Address extends Model
{
    public function worker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'worker_id', 'id');
    }

    protected $fillable = [
        'worker_id',
        'city', 'street', 'house', 'entrance',
    ];

    protected $casts = [
        'entrance' => 'integer',
    ];
}
