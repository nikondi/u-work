<?php

use App\Http\Controllers\KanbanController;
use App\Http\Controllers\RequestsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::middleware('auth')->group(function () {
    Route::get('/', WelcomeController::class)->name('welcome');

    Route::resource('users', UserController::class);

    Route::get('/kanban', [KanbanController::class, 'index'])->name('kanban.index');

    Route::get('/kanban/{request}', [KanbanController::class, 'show'])->name('kanban.show');

    Route::put('/request/{request}', [RequestsController::class, 'update'])->name('requests.update');
});

require __DIR__ . '/auth.php';

