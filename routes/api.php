<?php

use App\Http\Controllers\ClientsController;
use App\Http\Controllers\RequestsController;
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
    Route::middleware('role:tomoru')->prefix('clients')->group(function() {
        Route::post('search', [ClientsController::class, 'search']);
    });
    Route::middleware('role:tomoru')->prefix('requests')->group(function() {
        Route::post('/', [RequestsController::class, 'store']);
    });
});
