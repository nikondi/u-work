<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Model::reguard();

        $admin = Role::bySlug('admin');
        $tomoru = Role::bySlug('tomoru');

        $users = [
            ['name' => 'Никита', 'email' => 'nikondi@narod.ru', 'login' => 'nikondi', 'password' => '123', 'role' => $admin],
            ['name' => 'Владимир', 'email' => 'vova@vova.ru', 'login' => 'vova', 'password' => '123', 'role' => $admin],
            ['name' => 'Tomoru', 'email' => 'tomoru@tomoru.ru', 'login' => 'tomoru', 'password' => 'Hc5537[eA*bj', 'role' => $tomoru],
        ];

        foreach($users as $user) {
            if(User::where('email', $user['email'])->exists())
                continue;

            $_user = User::create($user);
            if(isset($user['role']))
                $_user->roles()->attach($user['role']);
        }

    }
}
