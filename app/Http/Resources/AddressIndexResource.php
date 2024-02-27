<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class AddressIndexResource
 *
 * @mixin \App\Models\Address
 * */
class AddressIndexResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full' => $this->city.', '.$this->street.', д. '.$this->house,
        ];
    }
}
