<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {

    Route::get('/forgot-password', [AuthController::class, 'forgot_password'])->name('password.request');
    Route::post('/forgot-password', [AuthController::class, 'handle_forgot_password'])->name('password.request');
    Route::post('login', [AuthController::class, 'store'])->name('login');
    Route::get('login', [AuthController::class, 'index'])->name('login');
});

Route::middleware('auth')->group(function () {


    Route::post('logout', [AuthController::class, 'logout'])
        ->name('logout');

    Route::get('logout', [AuthController::class, 'logout'])
        ->name('logout');
});
