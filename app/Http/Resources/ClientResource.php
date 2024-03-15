<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class ClientResource
 *
 * @mixin \App\Models\Client
 * */
class ClientResource extends JsonResource
{
    public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'phones' => $this->getPhones(),
            'status' => $this->getStatusName(),
            'floor' => $this->floor,
            'apartment' => $this->apartment,
            'comment' => $this->comment,
            'entrance_id' => $this->entrance_id,
            'address_id' => $this->entrance->address_id,
            'address' => $this->getFullAddress()
        ];
    }
}
