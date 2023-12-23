<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientsController;
use App\Http\Controllers\Api\RequestsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function() {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::middleware('role:tomoru')->prefix('clients')->group(function() {
        Route::post('search', [ClientsController::class, 'search']);
    });
    Route::middleware('role:tomoru')->prefix('requests')->group(function() {
        Route::post('/', [RequestsController::class, 'store']);
    });
});

Route::post('/login', [AuthController::class, 'login']);
