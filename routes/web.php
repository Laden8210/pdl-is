<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ProfileManagementController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\CourtHearingCalendarController;
use App\Http\Controllers\VerificationController;

Route::get('/', [AuthController::class, 'index'])->name('home');

Route::get('/dashboard', [AuthController::class, 'dashboard'])->name('dashboard');

Route::get('/profile-management', [ProfileManagementController::class, 'index'])->name('profile-management.index');
Route::get('/user-management', [UserManagementController::class, 'index'])->name('user-management.index');
Route::get('/court-hearing-calendar', [CourtHearingCalendarController::class, 'index'])->name('court-hearing.calendar');
Route::get('/verification', [VerificationController::class, 'index'])->name('verification.index');
