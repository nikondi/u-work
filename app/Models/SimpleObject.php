<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class SimpleObject extends Model
{
    public function object(): MorphOne
    {
        return $this->morphOne(Objects::class, 'objectable')->with('cameras')->with('nets');
    }

    public function delete(): void
    {
        $this->object->delete();
        parent::delete();
    }

    protected $fillable = [
        'name', 'type',
        'city', 'house', 'street'
    ];
}
