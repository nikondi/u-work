<?php

namespace App\Models;

use App\Traits\HasManySync;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Objects extends Model
{
    use HasManySync;

    /**
     * Get the parent objectable model (entrance or simple_object).
     */
    public function objectable(): MorphTo
    {
        return $this->morphTo();
    }

    public function cameras(): HasMany
    {
        return $this->hasMany(ObjectCamera::class);
    }
    public function nets(): HasMany
    {
        return $this->hasMany(ObjectNet::class);
    }

    protected $fillable = [
        'type',
        'router',
        'internet',
        'subnet', 'wan', 'pppoe_cred',
        'camera_ip', 'camera_model',
        'sip',
        'cubic_ip',
        'minipc_model',
        'intercom_model',
        'comment',
    ];
    protected $casts = [
        'internet' => 'boolean'
    ];
}
