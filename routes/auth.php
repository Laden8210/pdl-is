<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {

    Route::get('/forgot-password', [AuthController::class, 'forgot_password'])->name('password.request');
    Route::post('/forgot-password', [AuthController::class, 'handle_forgot_password'])->name('password.request');
    Route::post('login', [AuthController::class, 'store'])->name('login');
    Route::get('login', [AuthController::class, 'index'])->name('login');
    Route::post('/verify-otp', [AuthController::class, 'verify_otp'])->name('verify.otp');
    Route::post('/resend-otp', [AuthController::class, 'resend_otp'])->name('resend.otp');
    Route::post('/reset-password', [AuthController::class, 'reset_password'])->name('password.reset');
    Route::get('/reset-password', [AuthController::class, 'show_reset_password'])->name('password.reset.show');
});

Route::middleware('auth')->group(function () {


    Route::post('logout', [AuthController::class, 'logout'])
        ->name('logout');

    Route::get('logout', [AuthController::class, 'logout'])
        ->name('logout');
});
