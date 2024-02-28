<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Address extends Model
{
    public function entrances(): HasMany
    {
        return $this->hasMany(Entrance::class, 'address_id')->orderBy('entrance');
    }

    public function object(): MorphOne
    {
        return $this->morphOne(Objects::class, 'objectable');
    }

    protected $fillable = [
        'city', 'street', 'house'
    ];
}
