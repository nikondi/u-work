<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ObjectResource extends JsonResource
{
    public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /* @var \App\Models\Objects $this */
        return [
            'id' => $this->id,
            'type' => $this->type,
            'router' => $this->router,
            'internet' => $this->internet,
            'nets' => $this->nets?ObjectNetResource::collection($this->nets):[],
            'cameras' => $this->cameras?ObjectCameraResource::collection($this->cameras):[],
            'sip' => $this->sip,
            'minipc_model' => $this->minipc_model,
            'intercom_model' => $this->intercom_model,
            'comment' => $this->comment,
        ];
    }
}
