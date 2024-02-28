<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class EntranceResource
 *
 * @mixin \App\Models\Entrance
 * */
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
        return [
            'id' => $this->id,
            'entrance' => $this->entrance,
            'per_floor' => $this->per_floor,
            'clients' => [],
            'object' => new ObjectResource($this->object),
            'worker' => new UserResource($this->worker),
        ];
    }
}
