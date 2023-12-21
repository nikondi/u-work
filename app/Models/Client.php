<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    public const STATUS_INVALID = 0; // Нет договора
    public const STATUS_ACTIVE = 1; // Действующий
    public const STATUS_UNKNOWN = 2; // Неизвестный
    public const STATUS_REJECT = 3; // Отказался
    public const STATUS_FIRST_CONTACT = 4; // Первичный контакт

    protected $fillable = [
        'id',
        'address_id', 'floor', 'apartment',
        'phone',
        'name',
        'status',
        'comment',
    ];
}
