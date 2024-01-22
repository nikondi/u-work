<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RequestResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /* @var \App\Models\Request $this */

        return [
            'id' => $this->id,
            'type' => $this->type,
            'source' => $this->source,
            'client' => new ClientResource($this->client),
            'client_name' => $this->client_name,
            'client_phone' => $this->client_phone,
            'client_phone_contact' => $this->client_phone_contact,
            'addressDB' => new AddressResource($this->addressDB),
            'worker' => new UserResource($this->worker),
            'address' => $this->address,
            'email' => $this->email,
            'content' => $this->content,
            'status' => $this->getStatusLabel()
        ];
    }
}
