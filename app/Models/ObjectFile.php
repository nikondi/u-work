<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ObjectFile extends Model
{
    protected $fillable = [
        'id',
        'title',
        'path',
        'type',
        'objects_id',
    ];
}
