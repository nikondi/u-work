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

    Route::middleware('role:manager')->prefix('clients')->group(function() {
        Route::get('/searchAny', [ClientsController::class, 'searchAny']);
        Route::get('/searchNotInAddress/{address_id}', [ClientsController::class, 'searchNotInAddress']);
        Route::get('/getNotInAddress/{address_id}', [ClientsController::class, 'indexNotInAddress']);
    });
    Route::resource('/clients', ClientsController::class);


    Route::prefix('addresses')->group(function() {
        Route::middleware('role:manager')->group(function() {
            Route::get('/search', [AddressesController::class, 'search']);
            Route::get('', [AddressesController::class, 'index']);
            Route::get('/worker', [AddressesController::class, 'indexWorker']);
        });
        Route::get('/getCities', [AddressesController::class, 'getCities']);
        Route::get('/{address}', [AddressesController::class, 'show']);
        Route::get('/{address_id}/getClients', [AddressesController::class, 'getClients']);
        Route::post('/{address_id}/saveClients', [AddressesController::class, 'saveClients']);

        Route::put('/{address}/object', [ObjectsController::class, 'updateAddress']);
        Route::post('/{address}/object', [ObjectsController::class, 'storeAddress']);
    });


    Route::prefix('entrances')->group(function() {
        Route::post('/addClients', [EntranceController::class, 'addClients']);

        Route::put('/{entrance}/object', [ObjectsController::class, 'updateEntrance']);
        Route::post('/{entrance}/object', [ObjectsController::class, 'storeEntrance']);

        Route::get('/{entrance}/clients', [EntranceController::class, 'getClients']);
    });
    Route::resource('/entrances', EntranceController::class);



    Route::resource('/simple_objects', SimpleObjectController::class);
    Route::get('/objects/update_statuses', [ObjectsController::class, 'updateStatuses']);
    Route::resource('/objects', SimpleObjectController::class);


    Route::prefix('requests')->group(function() {
        Route::get('', [RequestsController::class, 'index']);
        Route::get('/export', [RequestsController::class, 'export']);
        Route::put('/{request}', [RequestsController::class, 'update']);
        Route::get('/{request}', [RequestsController::class, 'view']);
        Route::post('/updateOrder', [RequestsController::class, 'updateOrder']);
    });
});

Route::middleware(['request.addJson', 'auth:sanctum', 'role:tomoru,manager'])->group(function() {
    Route::post('/clients/search', [ClientsController::class, 'search']);
    Route::post('/requests', [RequestsController::class, 'store']);
});

Route::post('/login', [AuthController::class, 'login']);
