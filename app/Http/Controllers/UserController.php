<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Resources\UserResource;
use App\Models\Address;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();

        return page()
            ->title('Пользователи')->h1()
            ->render('Users/Index', [
                'users' => UserResource::collection($users),
            ]);
    }

    public function show(User $user) {

    }

    public function store(StoreUserRequest $request) {
        DB::beginTransaction();
        $data = $request->validated();
        $user = User::create($data);
        $user->syncRoles($data['roles']);
        if(isset($data['addresses']))
            Address::whereIn('id', $data['addresses'])->update(['worker_id' => $user->id]);

        DB::commit();
        return to_route('users.edit', [$user->id]);
    }
    public function create() {
        return page()
            ->title('Создать пользователя')->h1()
            ->render('Users/Create');
    }

    public function edit(User $user) {
        return page()
            ->title($user->name)
            ->h1('Редактировать '.$user->name)
            ->render('Users/Edit', [
                'user' => new UserResource($user)
            ]);
    }
    public function update(User $user) {

    }

    public function destroy(User $user) {
        $user->delete();
        return back();
    }
}
