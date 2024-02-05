<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
        /**
         * @var \App\Models\Client $this
         */
        $address_resource = (new AddressResource($this->address))->toArray($request);
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'phones' => $this->getPhones(),
            'status' => $this->getStatusName(),
            'address' => [
                ...$address_resource,
                'floor' => $this->floor,
                'apartment' => $this->apartment,
                'full' => $address_resource['full'].($this->apartment?', кв. '.$this->apartment:'').($this->floor?', этаж '.$this->floor:'')
            ],
        ];
    }
}
