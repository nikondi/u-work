<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class ClientEntranceResource
 *
 * @mixin \App\Models\Client
 * */
class ClientEntranceResource extends JsonResource
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
            'floor' => $this->floor,
            'apartment' => $this->apartment,
            'entrance' => $this->entrance->entrance,
            'entrance_id' => $this->entrance_id
        ];
    }
}
