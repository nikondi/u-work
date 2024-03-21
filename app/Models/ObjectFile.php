<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ObjectFile extends Model
{
    protected $fillable = [
        'id',
        'path',
        'type',
        'objects_id',
    ];
}
