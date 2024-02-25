<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EntranceResource extends JsonResource
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
         * @var \App\Models\Entrance $this
        */
        return [
            'id' => $this->id,
            'entrance' => $this->entrance,
            'per_floor' => $this->per_floor,
            'worker' => new UserResource($this->worker),
        ];
    }
}
