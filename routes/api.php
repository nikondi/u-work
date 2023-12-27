<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientsController;
use App\Http\Controllers\Api\RequestsController;
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
    Route::get('/user', [AuthController::class, 'getUserResource']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/clients/searchAny', [ClientsController::class, 'searchAny'])->middleware('role:manager');
    Route::resource('/clients', ClientsController::class)->middleware('role:manager');

    Route::get('/requests', [RequestsController::class, 'index']);
});

Route::middleware(['request.addJson', 'auth:sanctum', 'role:tomoru'])->group(function() {
    Route::post('/clients/search', [ClientsController::class, 'search']);
    Route::post('/requests', [RequestsController::class, 'store']);
});

Route::post('/login', [AuthController::class, 'login']);
