<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\ProfileManagementController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\CourtHearingCalendarController;
use App\Http\Controllers\Admin\VerificationController;
use App\Http\Controllers\RecordOfficer\PDLArchiveController;
use App\Http\Controllers\RecordOfficer\JailEventsController;
use App\Http\Controllers\RecordOfficer\PDLManagementController;

Route::get('/', [AuthController::class, 'index'])->name('home');

Route::get('/admin/dashboard', [AuthController::class, 'dashboard'])->name('dashboard');

Route::get('/admin/profile-management', [ProfileManagementController::class, 'index'])->name('profile-management.index');
Route::post('/admin/profile/update', [ProfileManagementController::class, 'update'])->name('admin.profile.update');


Route::get('/admin/user-management', [UserManagementController::class, 'index'])->name('user-management.index');
Route::get('/admin/user-management/create', [UserManagementController::class, 'create'])->name('user-management.create');
Route::post('/admin/user-management', [UserManagementController::class, 'store'])->name('user-management.store');


Route::get('/admin/court-hearing-calendar', [CourtHearingCalendarController::class, 'index'])->name('court-hearing.calendar');
Route::get('/admin/verification', [VerificationController::class, 'index'])->name('verification.index');

// Record Officer Routes
Route::get('/record-officer/dashboard', [AuthController::class, 'dashboard'])->name('dashboard.record-officer');
Route::get('/record-officer/jail-events', [JailEventsController::class, 'index'])->name('jail-events.index');
Route::get('/record-officer/pdl-archives', [PDLArchiveController::class, 'index'])->name('pdl-archives.index');
Route::get('/record-officer/profile-management', [ProfileManagementController::class, 'index'])->name('profile-management.index');
Route::get('/record-officer/verification', [VerificationController::class, 'index'])->name('verification.index');
Route::get('/record-officer/pdl-management/personal-information', [PDLManagementController::class, 'personal_information'])->name('pdl-management.personal-information');
Route::get('/record-officer/pdl-management/health-assessment', [PDLManagementController::class, 'health_assessment'])->name('pdl-management.health-assessment');
Route::get('/record-officer/pdl-management/medical-records', [PDLManagementController::class, 'medical_records'])->name('pdl-management.medical-records');


require __DIR__.'/auth.php';
