<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\ProfileManagementController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\CourtHearingCalendarController;
use App\Http\Controllers\Admin\VerificationController;
use App\Http\Controllers\CaseInformationController;
use App\Http\Controllers\RecordOfficer\PDLArchiveController;
use App\Http\Controllers\RecordOfficer\JailEventsController;
use App\Http\Controllers\RecordOfficer\PDLManagementController;
use App\Http\Controllers\CellAssignmentController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\PhysicalCharacteristicController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TimeAllowanceController;
use App\Http\Controllers\UserPDLArchiveController;
use App\Http\Controllers\ReportController;

Route::get('/', [AuthController::class, 'index'])->name('home');

Route::get('/admin/dashboard', [AuthController::class, 'dashboard'])->name('dashboard');

Route::get('/admin/profile-management', [ProfileManagementController::class, 'index'])->name('profile-management.index');
Route::post('/admin/profile/update', [ProfileManagementController::class, 'update'])->name('admin.profile.update');


Route::get('/admin/user-management', [UserManagementController::class, 'index'])->name('user-management.index');
Route::get('/admin/user-management/create', [UserManagementController::class, 'create'])->name('user-management.create');
Route::delete('/user-management/{id}', [UserManagementController::class, 'destroy'])
    ->name('user-management.destroy');
Route::put('/user-management/{id}', [UserManagementController::class, 'update'])
    ->name('user-management.update');
Route::post('/admin/user-management', [UserManagementController::class, 'store'])->name('user-management.store');
Route::get('/admin/pdl-management/personal-information', [PDLManagementController::class, 'personal_information_admin'])->name('pdl-management.personal-information');
Route::get('/admin/pdl-management/health-assessment', [PDLManagementController::class, 'health_assessment'])->name('pdl-management.health-assessment');
Route::get('/admin/pdl-management/medical-records', [PDLManagementController::class, 'medical_records'])->name('pdl-management.medical-records');

Route::get('/admin/cell-management', [CellAssignmentController::class, 'cell_management'])->name('cell-assignments.cell-management');
Route::post('/admin/cell-management/create', [CellAssignmentController::class, 'create'])->name('cell.create');
Route::post('/admin/cell-management/update', [CellAssignmentController::class, 'update'])->name('cell.update');

Route::post('/admin/cell-management/assign', [CellAssignmentController::class, 'assign'])->name('cell.assign');


Route::get('/admin/report/list-of-pdl-reports', [ReportController::class, 'index'])->name('reports.pdl-list');
Route::get('admin/report/list-of-pdl-reports/export', [ReportController::class, 'export'])->name('reports.pdl-list.export');

Route::get('/admin/report/inmate-population', [ReportController::class, 'populationReport'])->name('reports.population');
Route::get('/admin/report/inmate-population/generate', [ReportController::class, 'generatePopulationReport'])->name('reports.population.generate');
Route::post('/admin/report/inmate-population/generate', [ReportController::class, 'generatePopulationReport'])->name('reports.population.generate');

Route::get('/admin/court-hearing-calendar', [CourtHearingCalendarController::class, 'index'])->name('court-hearing.calendar');
Route::get('/admin/verification', [VerificationController::class, 'index'])->name('verification.index');
Route::patch('/admin/verification/{verification}/update', [VerificationController::class, 'update'])
    ->name('admin.verification.update');

Route::get('admin/pdl-management/time-allowance', [TimeAllowanceController::class, 'index'])->name('pdl-management.time-allowance');

Route::post('admin/pdl-management/time-allowance/{pdl}', [TimeAllowanceController::class, 'updateTimeAllowance'])->name('time-allowance.update');

Route::get('/admin/user-pdl-archive', [UserPDLArchiveController::class, 'index'])->name('user-pdl-archive.index');

// Record Officer Routes
Route::get('/record-officer/dashboard', [AuthController::class, 'dashboard'])->name('dashboard.record-officer');
Route::get('/record-officer/jail-events', [JailEventsController::class, 'index'])->name('jail-events.index');
Route::post('/record-officer/jail-events', [JailEventsController::class, 'store'])->name('jail-events.store');

Route::get('/record-officer/pdl-archives', [PDLArchiveController::class, 'index'])->name('pdl-archives.index');
Route::get('/record-officer/profile-management', [ProfileManagementController::class, 'index'])->name('profile-management.index');
Route::get('/record-officer/verification', [VerificationController::class, 'index'])->name('verification.index');
Route::get('/record-officer/pdl-management/personal-information', [PDLManagementController::class, 'personal_information'])->name('pdl-management.personal-information');
Route::get('/record-officer/pdl-management/health-assessment', [PDLManagementController::class, 'health_assessment'])->name('pdl-management.health-assessment');
Route::get('/record-officer/pdl-management/medical-records', [PDLManagementController::class, 'medical_records'])->name('pdl-management.medical-records');
Route::get('/record-officer/pdl-management/cell-assignment', [CellAssignmentController::class, 'index'])->name('cell-assignments.index');
Route::get('/record-officer/pdl-management/time-allowance', [TimeAllowanceController::class, 'index'])->name('pdl-management.time-allowance');


// Law Enforcement Routes
Route::get('/law-enforcement/profile-management', [ProfileManagementController::class, 'index'])->name('profile-management.index');
Route::get('/law-enforcement/dashboard', [AuthController::class, 'dashboard'])->name('dashboard.law-enforcement');
Route::get('/law-enforcement/pdl-management/personal-information', [PDLManagementController::class, 'personal_information'])->name('pdl-management.personal-information');
Route::post('/law-enforcement/pdl-management/personal-information/transfer/', [PDLManagementController::class, 'transfer'])->name('pdl-management.transfer');
Route::get('/law-enforcement/pdl-management/personal-information/create', [PDLManagementController::class, 'view_create'])->name('pdl-management.personal-information.create');
Route::post('/law-enforcement/pdl-management/personal-information/create', [PDLManagementController::class, 'store_create'])->name('pdl-management.personal-information.create');

Route::get('/law-enforcement/pdl-management/personal-information/{pdl_id}', [PDLManagementController::class, 'view_update'])->name('pdl-management.personal-information.update');
Route::put('/law-enforcement/pdl-management/personal-information/{pdl_id}', [PDLManagementController::class, 'update_personal_information'])->name('pdl-management.personal-information.update');


Route::get('/law-enforcement/pdl-management/court-order', [PDLManagementController::class, 'court_order'])->name('pdl-management.court-order');
Route::post('/law-enforcement/pdl-management/court-order', [PDLManagementController::class, 'store_court_order'])->name('court-orders.store');
Route::get('/law-enforcement/pdl-management/case-information', [CaseInformationController::class, 'index'])->name('case-information.index');
Route::post('/law-enforcement/pdl-management/case-information', [CaseInformationController::class, 'store'])->name('case-information.store');

Route::get('/admin/pdl-management/cell-assignment', [CellAssignmentController::class, 'index'])->name('cell-assignments.index');

Route::get('/law-enforcement/pdl-management/medical-records', [MedicalRecordController::class, 'index'])
    ->name('medical-records.index');

Route::post('/law-enforcement/medical-records', [MedicalRecordController::class, 'store'])
    ->name('medical-records.store');

Route::put('/law-enforcement/medical-records/{medicalRecord}', [MedicalRecordController::class, 'update'])
    ->name('medical-records.update');

Route::delete('/law-enforcement/medical-records/{medicalRecord}', [MedicalRecordController::class, 'destroy'])
    ->name('medical-records.destroy');

Route::get('/law-enforcement/pdl-management/physical-characteristics', [PhysicalCharacteristicController::class, 'index'])
    ->name('physical-characteristics.index');

Route::post('/law-enforcement/pdl-management/physical-characteristics', [PhysicalCharacteristicController::class, 'store'])
    ->name('physical-characteristics.store');

Route::put('/law-enforcement/pdl-management/physical-characteristics/{characteristic}', [PhysicalCharacteristicController::class, 'update'])
    ->name('physical-characteristics.update');

Route::delete('/law-enforcement/pdl-management/physical-characteristics/{characteristic}', [PhysicalCharacteristicController::class, 'destroy'])
    ->name('physical-characteristics.destroy');

Route::post('/admin/pdl-management/cell-assignment', [CellAssignmentController::class, 'assign'])->name('cell-assignments.store');
Route::post('/admin/pdl-management/create', [PDLManagementController::class, 'create'])->name('pdl-management.create');
Route::put('/admin/pdl-management/{pdl}', [PDLManagementController::class, 'update'])->name('pdl-management.update');

Route::get('/notifications', [NotificationController::class, 'index']);
Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);

require __DIR__ . '/auth.php';
