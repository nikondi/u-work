<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class EntranceResource
 *
 * @mixin \App\Models\EntranceIntercom
 * */
class EntranceIntercomResource extends JsonResource
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
            'entrance_id' => $this->entrance_id,
            'model' => $this->model,
            'version' => $this->version,
            'calling_panel' => $this->calling_panel,
            'door_type' => $this->door_type,
        ];
    }
}
