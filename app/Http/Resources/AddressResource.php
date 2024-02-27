<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class AddressResource
 *
 * @mixin \App\Models\Address
 * */
class AddressResource extends JsonResource
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
            'city' => $this->city,
            'street' => $this->street,
            'house' => $this->house,
            'object' => new ObjectResource($this->object),
            'entrances' => EntranceResource::collection($this->entrances),
            'full' => $this->city.', '.$this->street.', д. '.$this->house,
        ];
    }
}
