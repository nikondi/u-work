<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class EntranceIntercom extends Model
{
    public function entrance(): HasOne
    {
        return $this->hasOne(Entrance::class);
    }

    protected $fillable = [
        'entrance_id',
        'model',
        'version',
        'calling_panel',
    ];
}
