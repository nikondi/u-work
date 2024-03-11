<?php

use App\Http\Controllers\Api\AddressesController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientsController;
use App\Http\Controllers\Api\EntranceController;
use App\Http\Controllers\Api\ObjectsController;
use App\Http\Controllers\Api\RequestsController;
use App\Http\Controllers\Api\SimpleObjectController;
use App\Http\Controllers\Api\UserController;
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

    Route::get('/users/search', [UserController::class, 'search']);
    Route::resource('/users', UserController::class);
    Route::post('/users/add', [UserController::class, 'store']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/clients/searchAny', [ClientsController::class, 'searchAny'])->middleware('role:manager');
    Route::resource('/clients', ClientsController::class)->middleware('role:manager');

    Route::get('/addresses/search', [AddressesController::class, 'search'])->middleware('role:manager');
    Route::get('/addresses', [AddressesController::class, 'index'])->middleware('role:manager');
    Route::get('/addresses/worker', [AddressesController::class, 'indexWorker'])->middleware('role:manager');
    Route::get('/addresses/getCities', [AddressesController::class, 'getCities']);
    Route::get('/addresses/{address}', [AddressesController::class, 'show']);

    Route::put('/addresses/{address}/object', [ObjectsController::class, 'updateAddress']);
    Route::post('/addresses/{address}/object', [ObjectsController::class, 'storeAddress']);

    Route::put('/entrances/{entrance}/object', [ObjectsController::class, 'updateEntrance']);
    Route::post('/entrances/{entrance}/object', [ObjectsController::class, 'storeEntrance']);

    Route::resource('/simple_objects', SimpleObjectController::class);
    Route::get('/objects/update_statuses', [ObjectsController::class, 'updateStatuses']);
    Route::resource('/objects', SimpleObjectController::class);

    Route::get('/entrances/{entrance}/clients', [EntranceController::class, 'getClients']);


    Route::get('/requests', [RequestsController::class, 'index']);
    Route::get('/requests/export', [RequestsController::class, 'export']);
    Route::put('/requests/{request}', [RequestsController::class, 'update']);
    Route::get('/requests/{request}', [RequestsController::class, 'view']);
    Route::post('/requests/updateOrder', [RequestsController::class, 'updateOrder']);
});

Route::middleware(['request.addJson', 'auth:sanctum', 'role:tomoru,manager'])->group(function() {
    Route::post('/clients/search', [ClientsController::class, 'search']);
    Route::post('/requests', [RequestsController::class, 'store']);
});

Route::post('/login', [AuthController::class, 'login']);
