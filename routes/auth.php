<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {


    Route::post('login', [AuthController::class, 'store'])->name('login');
    Route::get('login', [AuthController::class, 'index'])->name('login');

});

Route::middleware('auth')->group(function () {


    Route::post('logout', [AuthController::class, 'logout'])
        ->name('logout');

    Route::get('logout', [AuthController::class, 'logout'])
        ->name('logout');
});
