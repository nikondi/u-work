<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/* @mixin  \App\Models\User */
class UserResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $roles = [];
        foreach($this->roles as $role)
            $roles[] = $role->slug;

        $roleLabels = [];
        foreach($this->roles as $role)
            $roleLabels[] = $role->name;

        return [
            'id' => $this->id,
            'login' => $this->login,
            'name' => $this->name,
            'email' => $this->email,
            'roles' => $roles,
            'roleLabels' => $roleLabels,
        ];
    }
}
