<?php

namespace App\Http\Resources;

use App\Models\Address;
use Illuminate\Http\Request;

class WorkerResource extends UserResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /* @var \App\Models\User $this */
        return [...parent::toArray($request),
            'addresses' => AddressResource::collection(Address::where('worker_id', $this->id)->get())
        ];
    }
}
