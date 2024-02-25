<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ObjectNet extends Model
{
    protected $fillable = [
        'id',
        'subnet',
        'wan',
        'pppoe_cred',
    ];
}
