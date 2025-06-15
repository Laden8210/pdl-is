<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Auth\AuthController;
Route::get('/', [AuthController::class, 'index'])->name('home');

Route::get('/dashboard', [AuthController::class, 'dashboard'])->name('dashboard');
