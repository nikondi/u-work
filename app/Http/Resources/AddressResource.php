<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /**
         * @var \App\Models\Address $this
        */
        return [
            'id' => $this->id,
            'city' => $this->city,
            'street' => $this->street,
            'house' => $this->house,
            'entrance' => $this->entrance,
            'full' => $this->city.', '.$this->street.', д. '.$this->house.($this->entrance?', п. '.$this->entrance:'')
        ];
    }
}
