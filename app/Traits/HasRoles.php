<?php

namespace App\Traits;

use App\Models\Role;

trait HasRoles
{
    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function roles(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Role::class,'users_roles');
    }

    /**
     * @param string[] | string ...$roles
     * @return bool
     */
    public function hasRole(...$roles): bool
    {
        foreach($roles as $role) {
            if($this->roles->contains('slug', $role))
                return true;
        }
        return false;
    }
}
