<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Model::reguard();

        $roles = [
            ['slug' => 'admin', 'name' => 'Администратор'],
            ['slug' => 'tomoru', 'name' => 'Tomoru'],
            ['slug' => 'worker', 'name' => 'Рабочий'],
            ['slug' => 'manager', 'name' => 'Менеджер']
        ];

        foreach($roles as $role)
            Role::create($role);
    }
}
