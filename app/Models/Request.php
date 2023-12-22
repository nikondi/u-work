<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    protected $fillable = [
        'client_id',
        'client_name', 'client_phone', 'client_phone_contact',
        'address_id', 'address',
        'content',
    ];
}
