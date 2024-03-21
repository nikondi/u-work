<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class ObjectResource
 *
 * @mixin \App\Models\Objects
 * */
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
//        dd($this->files);
        $schemas = $this->files->where('type', 'schema');
        $photos = $this->files->where('type', 'photo');

        return [
            'id' => $this->id,
            'type' => $this->type,
            'router' => $this->router,
            'worker' => new WorkerResource($this->worker),
            'internet' => $this->internet,
            'nets' => $this->nets?ObjectNetResource::collection($this->nets):[],
            'cameras' => $this->cameras?ObjectCameraResource::collection($this->cameras):[],
            'sip' => $this->sip,
            'status' => $this->status,
            'last_online' => $this->last_online,
            'minipc_model' => $this->minipc_model,
            'intercom_model' => $this->intercom_model,
            'comment' => $this->comment,
            'cubic_ip' => $this->cubic_ip,
            'check_date' => $this->check_date,
            'schemas' => $schemas?ObjectFileResource::collection($schemas):[],
            'photos' => $photos?ObjectFileResource::collection($photos):[],
        ];
    }
}
