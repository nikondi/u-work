<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Address extends Model
{
    public function entrances(): HasMany
    {
        return $this->hasMany(Entrance::class, 'address_id');
    }

    protected $fillable = [
        'city', 'street', 'house'
    ];

    protected $casts = [
        'entrance' => 'integer',
    ];
}
