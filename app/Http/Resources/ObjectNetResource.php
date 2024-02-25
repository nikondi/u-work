<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ObjectNetResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /* @var \App\Models\ObjectNet $this */
        return [
            'id' => $this->id,
            'subnet' => $this->subnet,
            'wan' => $this->wan,
            'pppoe_cred' => $this->pppoe_cred,
        ];
    }
}
