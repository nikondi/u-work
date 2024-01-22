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

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
    }

    public function addressDB(): BelongsTo
    {
        return $this->belongsTo(Address::class, 'address_id', 'id');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function worker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'worker_id', 'id');
    }

    public function getStatusLabel(): string
    {
        return static::getStatuses($this->status);
    }

    private static function getStatuses($status = null): array|string
    {
        $statuses = [
            static::STATUS_UNKNOWN => 'unknown',
            static::STATUS_NEW => 'new',
            static::STATUS_DONE => 'done',
            static::STATUS_IMPORTANT => 'important',
        ];

        return $statuses[$status] ?? $statuses;
    }

    public static function getStatusOrder(): array
    {
        return [
            static::STATUS_UNKNOWN,
            static::STATUS_DONE,
            static::STATUS_NEW,
            static::STATUS_IMPORTANT,
        ];
    }

    public static function convertStatusLabel($label):int
    {
        return ($a = array_search($label, static::getStatuses())) !== false?$a:static::STATUS_UNKNOWN;
    }

    protected $fillable = [
        'type', 'source',
        'client_id', 'worker_id',
        'client_name',
        'client_phone', 'client_phone_contact',
        'email',
        'address_id', 'address',
        'subject', 'content',
        'status'
    ];

    protected $casts = [
        'status' => 'integer'
    ];
}
