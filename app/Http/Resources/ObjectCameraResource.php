<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ObjectCameraResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /* @var \App\Models\ObjectCamera $this */
        return [
            'id' => $this->id,
            'ip' => $this->ip,
            'model' => $this->model,
        ];
    }
}
