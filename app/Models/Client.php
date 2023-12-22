<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Client extends Model
{
    use HasFactory;

    public const STATUS_INVALID = 0; // Нет договора
    public const STATUS_ACTIVE = 1; // Действующий
    public const STATUS_UNKNOWN = 2; // Неизвестный
    public const STATUS_REJECT = 3; // Отказался
    public const STATUS_FIRST_CONTACT = 4; // Первичный контакт

    public function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }

    public function getStatusName(): string
    {
        return match ($this->status) {
            static::STATUS_INVALID => 'invalid',
            static::STATUS_ACTIVE => 'active',
            static::STATUS_REJECT => 'reject',
            static::STATUS_FIRST_CONTACT => 'first_contact',
            default => 'unknown',
        };
    }

    public function getPhones(): array {
        return array_map('intval', explode(',', $this->phone));
    }

    public function getFullAddress(): string
    {
        return $this->address->city.', '.$this->address->street.', д. '.$this->address->house
            .($this->address->entrance?', п. '.$this->address->entrance:'').($this->apartment?', кв. '.$this->apartment:'')
            .($this->floor?', '.$this->floor.' этаж':'');
    }

    protected $fillable = [
        'id',
        'address_id', 'floor', 'apartment',
        'phone',
        'name',
        'status',
        'comment',
    ];

    protected $casts = [
        'apartment' => 'integer',
        'floor' => 'integer',
    ];
}
