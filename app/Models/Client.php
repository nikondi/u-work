<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Client extends Authenticatable
{
    public const STATUS_INVALID = 0; // Нет договора
    public const STATUS_ACTIVE = 1; // Действующий
    public const STATUS_UNKNOWN = 2; // Неизвестный
    public const STATUS_REJECT = 3; // Отказался
    public const STATUS_FIRST_CONTACT = 4; // Первичный контакт

    public function address(): BelongsTo
    {
        return $this->entrance->address();
    }

    public function entrance(): BelongsTo
    {
        return $this->belongsTo(Entrance::class);
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
        if(empty(trim($this->phone)))
            return [];

        $ex = explode(',', $this->phone);
        return empty($ex)?[]:array_map('intval', $ex);
    }

    public function getFullAddress(): string
    {
        return $this->address->city.', '.$this->address->street.', д. '.$this->address->house
            .($this->address->entrance?', п. '.$this->address->entrance:'').($this->apartment?', кв. '.$this->apartment:'')
            .($this->floor?', '.$this->floor.' этаж':'');
    }

    public function requests(): HasMany
    {
        return $this->hasMany(Request::class);
    }

    public function getAuthPassword()
    {
        return $this->password;
    }

    protected $fillable = [
        'id',
        'entrance_id', 'floor', 'apartment',
        'phone', 'email', 'password',
        'name',
        'status',
        'comment',
    ];

    protected $casts = [
        'apartment' => 'integer',
        'floor' => 'integer',
        'password' => 'hashed',
    ];

    protected $hidden = [
        'password'
    ];
}
