<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return UserResource::collection(User::query()->orderBy('id', 'desc')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        DB::beginTransaction();
        $data = $request->validated();
        $user = User::create($data);
        $user->syncRoles($data['roles']);
        DB::commit();

        return response(new UserResource($user), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        DB::beginTransaction();
        $data = $request->validated();
        $user->update($data);
        $user->syncRoles($data['roles']);
        DB::commit();

        return new UserResource($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response('', 204);
    }

    public function search(Request $request) {
        $page = $request->exists('page')?intval($request->get('page')):1;
        $limit = $request->exists('limit')?intval($request->get('limit')):-1;
        $pagination = !$request->exists('pagination') || $request->get('pagination') == 'true';
        $word = strtolower($request->get('word'));

        $query = User::query();
        $columns = ['id', 'login', 'email', 'name'];
        foreach($columns as $column)
            $query->orWhere($column, 'like', '%'.$word.'%');

        if($request->exists('filter')) {
            foreach($request->get('filter') as $key => $value) {
                if($key == 'role') {
                    $role_id = Role::where('slug', $value)->first()->id;
                    $query->leftJoin('users_roles', function($leftJoin) use ($role_id) {
                        $leftJoin->on('users_roles.user_id', '=', 'users.id')
                            ->where('users_roles.role_id', '=', $role_id);
                    });
                }
                else
                    $query->where($key, $value);
            }
        }

        if($limit == -1)
            $result = $query->get();
        else {
            if($pagination)
                $result = $query->paginate($limit, ['*'], '', $page);
            else
                $result = $query->limit($limit)->get();
        }

        return UserResource::collection($result);
    }
}
