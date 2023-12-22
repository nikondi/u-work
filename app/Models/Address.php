<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'worker_id',
        'city', 'street', 'house', 'entrance',
    ];

    protected $casts = [
        'entrance' => 'integer',
    ];
}
