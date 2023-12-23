<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        if(!Auth::attempt($credentials, $request->get('remember'))) {
            return response(['message' => 'Логин или пароль заполнены неправильно'], 422);
        }
        /** @var User $user */
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;

        return response(compact('user', 'token'));
    }
    public function logout(Request $request)
    {
        //$request->user()->currentAccessToken()->delete();
        $token = request()->bearertoken();
        $tokenid = substr($token, 0, strpos($token, '|'));
        auth('sanctum')->user()->tokens()->where('id', $tokenid )->delete();

        return response('', 204);
    }
}
