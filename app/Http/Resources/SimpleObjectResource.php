<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SimpleObjectResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /* @var \App\Models\SimpleObject $this */

        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'city' => $this->city,
            'house' => $this->house,
            'street' => $this->street,
            'object' => new ObjectResource($this->object)
        ];
    }
}
