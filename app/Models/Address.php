<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Address extends Model
{
    public $timestamps = false;
    public function entrances(): HasMany
    {
        return $this->hasMany(Entrance::class, 'address_id')->orderBy('entrance');
    }

    public function object(): MorphOne
    {
        return $this->morphOne(Objects::class, 'objectable');
    }

    public function getFull(Entrance|int $entrance = null, $apartment = null, $floor = null): string
    {
        if($entrance instanceof Entrance)
            $entrance = $entrance->entrance;


        return $this->city.', '.$this->street.', д. '.$this->house.($entrance?", п. $entrance":'').($apartment?", кв. $apartment":'').($floor?", $floor этаж":'');
    }

    protected $fillable = [
        'city', 'street', 'house'
    ];
}
