<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Request extends Model
{
    use HasFactory;

    const STATUS_UNKNOWN = -1;
    const STATUS_NEW = 0;
    const STATUS_DONE = 1;
    const STATUS_IMPORTANT = 2;

    public function addressDB(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function getStatusLabel(): string
    {
        return match($this->status) {
            static::STATUS_NEW => 'new',
            static::STATUS_DONE => 'done',
            static::STATUS_IMPORTANT => 'important',
            default => 'unknown',
        };
    }

    protected $fillable = [
        'client_id',
        'client_name', 'client_phone', 'client_phone_contact',
        'address_id', 'address',
        'content',
        'status'
    ];

    protected $casts = [
        'status' => 'integer'
    ];
}
