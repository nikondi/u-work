<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login()
    {
        return page()
            ->title('Авторизация')
            ->render('Login/LoginForm');
    }
    public function login_handler(LoginRequest $request)
    {
        $credentials = $request->validated();
        if(!Auth::attempt($credentials, $request->get('remember'))) {
            throw ValidationException::withMessages([
                'auth' => [trans('auth.failed')],
            ]);
        }

        return to_route('welcome');
    }
    public function logout()
    {
        Auth::logout();
        return to_route('login');
    }
}
