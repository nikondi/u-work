<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;


/**
 * Class ObjectFileResource
 *
 * @mixin \App\Models\ObjectFile
 * */
class ObjectFileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'type' => $this->type,
            'path' => $this->path,
            'url' => Storage::url($this->path),
            'basename' => basename($this->path),
            'objects_id' => $this->objects_id,
        ];
    }
}
