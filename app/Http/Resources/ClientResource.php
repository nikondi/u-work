<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /**
         * @var \App\Models\Client $this
         */
        return [
            'id' => $this->id,
            'name' => $this->name,
            'phones' => $this->getPhones(),
            'status' => $this->getStatusName(),
            'address' => [
                'address_id' => $this->address->id,
                'city' => $this->address->city,
                'street' => $this->address->street,
                'house' => $this->address->house,
                'entrance' => $this->address->entrance,
                'floor' => $this->floor,
                'apartment' => $this->apartment,
                'full' => $this->getFullAddress(),
            ],
        ];
    }
}
