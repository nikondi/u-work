<?php

namespace App\Models;

use App\Traits\HasManySync;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Entrance extends Model
{
    use HasManySync;

    public $timestamps = false;

    public function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }

    public function clients(): HasMany
    {
        return $this->hasMany(Client::class);
    }

    public function object(): MorphOne
    {
        return $this->morphOne(Objects::class, 'objectable');
    }

    public function intercoms(): HasMany
    {
        return $this->hasMany(EntranceIntercom::class);
    }

    public function getFull($apartment = null, $floor = null): string
    {
        return $this->address->getFull($this->entrance, $apartment, $floor);
    }

    protected $fillable = [
        'id',
        'address_id',
        'entrance',
        'per_floor'
    ];

    protected $casts = [
        'address_id' => 'int'
    ];
}
