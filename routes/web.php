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
use App\Http\Controllers\PdlAlertController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SearchResultsController;
use App\Http\Controllers\CourtController;
use App\Http\Controllers\AgencyController;
use App\Http\Controllers\RequestLogController;

Route::get('/', [AuthController::class, 'index'])->name('home');

// Admin Routes - Protected by auth and admin middleware
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {

    Route::get('/request-logs', [RequestLogController::class, 'index'])->name('request-logs.index');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/profile-management', [ProfileManagementController::class, 'index'])->name('profile-management.index');


    Route::get('/user-management', [UserManagementController::class, 'index'])->name('user-management.index');
    Route::get('/user-management/create', [UserManagementController::class, 'create'])->name('user-management.create');
    Route::delete('/user-management/{id}', [UserManagementController::class, 'destroy'])
        ->name('user-management.destroy');
    Route::put('/user-management/{id}', [UserManagementController::class, 'update'])
        ->name('user-management.update');
    Route::post('/user-management/reset-password/{id}', [UserManagementController::class, 'resetPassword'])->name('user-management.reset-password');
    Route::post('/user-management', [UserManagementController::class, 'store'])->name('user-management.store');

    Route::get('/pdl-management/personal-information', [PDLManagementController::class, 'personal_information_admin'])->name('pdl-management.personal-information');
    Route::get('/pdl-management/health-assessment', [PDLManagementController::class, 'health_assessment'])->name('pdl-management.health-assessment');
    Route::get('/pdl-management/medical-records', [PDLManagementController::class, 'medical_records'])->name('pdl-management.medical-records');

    Route::get('/cell-management', [CellAssignmentController::class, 'cell_management'])->name('cell-assignments.cell-management');
    Route::post('/cell-management/create', [CellAssignmentController::class, 'create'])->name('cell.create');
    Route::post('/cell-management/update', [CellAssignmentController::class, 'update'])->name('cell.update');
    Route::post('/cell-management/assign', [CellAssignmentController::class, 'assign'])->name('cell.assign');



    Route::get('/report/list-of-pdl-reports', [ReportController::class, 'index'])->name('reports.pdl-list');
    Route::get('/report/list-of-pdl-reports/export', [ReportController::class, 'export'])->name('reports.pdl-list.export');

    Route::get('/report/inmate-population', [ReportController::class, 'populationReport'])->name('reports.population');
    Route::get('/report/inmate-population/generate', [ReportController::class, 'generatePopulationReport'])->name('reports.population.generate');
    Route::post('/report/inmate-population/generate', [ReportController::class, 'generatePopulationReport'])->name('reports.population.generate');

    Route::get('/report/gcta-and-tastm', [ReportController::class, 'gctaTastmReport'])->name('reports.gcta-tastm');
    Route::get('/report/gcta-and-tastm/generate', [ReportController::class, 'generateGCTATASTM'])->name('reports.gcta-tastm.export');

    Route::get('/report/drug-related-cases-monthly', [ReportController::class, 'drugRelatedCasesMonthlyReport'])->name('reports.drug-cases-monthly');
    Route::post('/report/drug-related-cases-monthly/generate', [ReportController::class, 'generateDrugRelatedCasesMonthly'])->name('reports.drug-cases-monthly.generate');
    Route::get('/report/drug-related-cases-monthly/export', [ReportController::class, 'exportDrugCasesMonthlyPdf'])->name('reports.drug-cases-monthly.export');

    Route::get('/report/inmates-status', [ReportController::class, 'inmatesStatusReport'])->name('reports.inmates-status');
    Route::post('/report/inmates-status/generate', [ReportController::class, 'generateInmatesStatus'])->name('reports.inmates-status.generate');
    Route::get('/report/inmates-status/export', [ReportController::class, 'exportInmatesStatusPdf'])->name('reports.inmates-status.export');

    Route::get('/report/inmates-status-daily', [ReportController::class, 'inmatesStatusDailyReport'])->name('reports.inmates-status-daily');
    Route::post('/report/inmates-status-daily/generate', [ReportController::class, 'generateInmatesStatusDaily'])->name('reports.inmates-status-daily.generate');
    Route::get('/report/inmates-status-daily/export', [ReportController::class, 'exportInmatesStatusDailyPdf'])->name('reports.inmates-status-daily.export');

    Route::get('/report/drug-clearing-certificate', [ReportController::class, 'drugClearingCertificate'])->name('reports.drug-clearing-certificate');
    Route::post('/report/drug-clearing-certificate/generate', [ReportController::class, 'generateDrugClearingCertificate'])->name('reports.drug-clearing-certificate.generate');
    Route::get('/report/drug-clearing-certificate/export', [ReportController::class, 'exportDrugClearingCertificatePdf'])->name('reports.drug-clearing-certificate.export');

    Route::get('/report/no-records-certificate', [ReportController::class, 'noRecordsCertificate'])->name('reports.no-records-certificate');
    Route::post('/report/no-records-certificate/generate', [ReportController::class, 'generateNoRecordsCertificate'])->name('reports.no-records-certificate.generate');
    Route::get('/report/no-records-certificate/export', [ReportController::class, 'exportNoRecordsCertificatePdf'])->name('reports.no-records-certificate.export');

    Route::get('/report/certificate-of-detention', [ReportController::class, 'certificateOfDetention'])->name('reports.certificate-of-detention');
    Route::get('/report/certificate-of-detention/generate', [ReportController::class, 'generateCertificateOfDetention'])->name('reports.certificate-of-detention.generate');

    Route::get('/report/pdl/{pdl}/report/{type}', [ReportController::class, 'generatePDLReport'])->name('reports.pdl.report');

    Route::get('/court-hearing-calendar', [CourtHearingCalendarController::class, 'index'])->name('court-hearing.calendar');
    Route::get('/verification', [VerificationController::class, 'index'])->name('verification.index');


    Route::get('/pdl-management/time-allowance', [TimeAllowanceController::class, 'index'])->name('admin.pdl-management.time-allowance');

    // PDL Archiving Routes
    Route::get('/pdl/{pdl}/archive', [App\Http\Controllers\PdlArchiveController::class, 'showArchiveForm'])->name('pdl.archive.show');

    Route::get('/pdl/archived', [App\Http\Controllers\PdlArchiveController::class, 'archived'])->name('pdl.archived');
    Route::get('/pdl/archive-stats', [App\Http\Controllers\PdlArchiveController::class, 'getArchiveStats'])->name('pdl.archive-stats');


    Route::get('/user-pdl-archive', [UserPDLArchiveController::class, 'index'])->name('user-pdl-archive.index');

    Route::get('/pdl-management/cell-assignment', [CellAssignmentController::class, 'index'])->name('cell-assignments.index');
    Route::post('/pdl-management/cell-assignment', [CellAssignmentController::class, 'assign'])->name('cell-assignments.store');
    Route::post('/pdl-management/cell-assignment/transfer', [CellAssignmentController::class, 'transfer'])->name('cell-assignments.transfer');
    Route::get('/pdl-management/cell-activity-log', [CellAssignmentController::class, 'activityLog'])->name('cell-assignments.activity-log');
    Route::post('/pdl-management/create', [PDLManagementController::class, 'create'])->name('pdl-management.create');
    Route::put('/pdl-management/{pdl}', [PDLManagementController::class, 'update'])->name('pdl-management.update');

    // Additional PDL Management routes for notifications
    Route::get('/pdl-management/case-information', [CaseInformationController::class, 'index'])->name('case-information.index');

    Route::get('/pdl-management/case-information/{case}/edit', [CaseInformationController::class, 'edit'])->name('case-information.edit');
    Route::put('/pdl-management/case-information/{case}', [CaseInformationController::class, 'update'])->name('case-information.update');

    Route::delete('/pdl-management/case-information/{case}', [CaseInformationController::class, 'destroy'])->name('case-information.destroy');

    Route::get('/pdl-management/court-order', [PDLManagementController::class, 'court_order'])->name('pdl-management.court-order');
    Route::post('/pdl-management/court-order', [PDLManagementController::class, 'store_court_order'])->name('court-orders.store');
    Route::get('/pdl-management/court-order/{courtOrder}/edit', [PDLManagementController::class, 'edit_court_order'])->name('court-orders.edit');

    Route::delete('/pdl-management/court-order/{courtOrder}', [PDLManagementController::class, 'destroy_court_order'])->name('court-orders.destroy');

    Route::get('/pdl-management/physical-characteristics', [PhysicalCharacteristicController::class, 'index'])->name('physical-characteristics.index');
    Route::post('/pdl-management/physical-characteristics', [PhysicalCharacteristicController::class, 'store'])->name('physical-characteristics.store');


    Route::get('/jail-events', [JailEventsController::class, 'index'])->name('admin.jail-events.index');


    // PDL Alerts and Reminders
    Route::get('/pdl-management/alerts', [PdlAlertController::class, 'index'])->name('pdl-alerts.index');
    Route::get('/pdl-management/alerts/create', [PdlAlertController::class, 'create'])->name('pdl-alerts.create');
    Route::post('/pdl-management/alerts', [PdlAlertController::class, 'store'])->name('pdl-alerts.store');
    Route::get('/pdl-management/alerts/{alert}', [PdlAlertController::class, 'show'])->name('pdl-alerts.show');
    Route::get('/pdl-management/alerts/{alert}/edit', [PdlAlertController::class, 'edit'])->name('pdl-alerts.edit');
    Route::put('/pdl-management/alerts/{alert}', [PdlAlertController::class, 'update'])->name('pdl-alerts.update');
    Route::delete('/pdl-management/alerts/{alert}', [PdlAlertController::class, 'destroy'])->name('pdl-alerts.destroy');
    Route::get('/pdl-management/alerts/upcoming', [PdlAlertController::class, 'upcoming'])->name('pdl-alerts.upcoming');
    Route::post('/pdl-management/alerts/{alert}/complete', [PdlAlertController::class, 'markCompleted'])->name('pdl-alerts.complete');

    // Certificate Management
    Route::get('/certificates', [CertificateController::class, 'index'])->name('certificates.index');
    Route::get('/certificates/create', [CertificateController::class, 'create'])->name('certificates.create');
    Route::post('/certificates', [CertificateController::class, 'store'])->name('certificates.store');
    Route::get('/certificates/{certificate}', [CertificateController::class, 'show'])->name('certificates.show');
    Route::get('/certificates/{certificate}/edit', [CertificateController::class, 'edit'])->name('certificates.edit');
    Route::put('/certificates/{certificate}', [CertificateController::class, 'update'])->name('certificates.update');
    Route::post('/certificates/{certificate}/revoke', [CertificateController::class, 'revoke'])->name('certificates.revoke');
    Route::get('/certificates/{certificate}/download', [CertificateController::class, 'download'])->name('certificates.download');
    Route::get('/certificates/{certificate}/print', [CertificateController::class, 'print'])->name('certificates.print');
    Route::get('/certificates/expiring', [CertificateController::class, 'expiring'])->name('certificates.expiring');
    Route::post('/certificates/cleanup', [CertificateController::class, 'cleanup'])->name('certificates.cleanup');
});

// Record Officer Routes - Protected by auth and record.officer middleware
Route::middleware(['auth', 'record.officer'])->prefix('record-officer')->group(function () {

    Route::get('/court-list', [CourtController::class, 'index'])->name('court-list.index');
    Route::post('/court-list/create', [CourtController::class, 'create'])->name('court-list.create');
    Route::put('/court-list/{id}', [CourtController::class, 'update'])->name('court-list.update');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.record-officer');
    Route::get('/jail-events', [JailEventsController::class, 'index'])->name('record-officer.jail-events.index');

    Route::get('/pdl-management/personal-information/{pdl_id}', [PDLManagementController::class, 'view_update'])->name('pdl-management.personal-information.view');


    Route::get('/pdl-archives', [UserPDLArchiveController::class, 'index'])->name('user-pdl-archive.index');
    Route::get('/profile-management', [ProfileManagementController::class, 'index'])->name('profile-management.index');
    Route::get('/verification', [VerificationController::class, 'index'])->name('verification.index');
    Route::patch('/verification/{verification}/update', [VerificationController::class, 'update'])->name('record-officer.verification.update');
    Route::get('/pdl-management/personal-information', [PDLManagementController::class, 'personal_information_admin'])->name('pdl-management.personal-information');
    Route::get('/pdl-management/health-assessment', [PDLManagementController::class, 'health_assessment'])->name('pdl-management.health-assessment');
    Route::get('/pdl-management/medical-records', [PDLManagementController::class, 'medical_records'])->name('pdl-management.medical-records');

    Route::get('/pdl-management/time-allowance', [TimeAllowanceController::class, 'index'])->name('record-officer.pdl-management.time-allowance');
    Route::post('/pdl-management/time-allowance/{pdl}', [TimeAllowanceController::class, 'updateTimeAllowance'])->name('record-officer.time-allowance.update');

    // Additional PDL Management routes for notifications
    Route::get('/pdl-management/case-information', [CaseInformationController::class, 'index'])->name('case-information.index');

    Route::get('/pdl-management/case-information/{case}/edit', [CaseInformationController::class, 'edit'])->name('case-information.edit');
    Route::put('/pdl-management/case-information/{case}', [CaseInformationController::class, 'update'])->name('case-information.update');

    Route::delete('/pdl-management/case-information/{case}', [CaseInformationController::class, 'destroy'])->name('case-information.destroy');
    Route::get('/pdl-management/cell-assignment', [CellAssignmentController::class, 'index'])->name('cell-assignments.index');

    Route::get('/pdl-management/cell-activity-log', [CellAssignmentController::class, 'activityLog'])->name('cell-assignments.activity-log');
    Route::get('/pdl-management/court-order', [PDLManagementController::class, 'court_order'])->name('pdl-management.court-order');
    Route::post('/pdl-management/court-order', [PDLManagementController::class, 'store_court_order'])->name('court-orders.store');
    Route::get('/pdl-management/court-order/{courtOrder}/edit', [PDLManagementController::class, 'edit_court_order'])->name('court-orders.edit');
    Route::put('/pdl-management/court-order/{courtOrder}', [PDLManagementController::class, 'update_court_order'])->name('court-orders.update');
    Route::delete('/pdl-management/court-order/{courtOrder}', [PDLManagementController::class, 'destroy_court_order'])->name('court-orders.destroy');

    Route::get('/pdl-management/physical-characteristics', [PhysicalCharacteristicController::class, 'index'])->name('physical-characteristics.index');
    Route::post('/pdl-management/physical-characteristics', [PhysicalCharacteristicController::class, 'store'])->name('physical-characteristics.store');
    Route::get('/pdl-management/physical-characteristics/{characteristic}/edit', [PhysicalCharacteristicController::class, 'edit'])->name('physical-characteristics.edit');
    Route::put('/pdl-management/physical-characteristics/{characteristic}', [PhysicalCharacteristicController::class, 'update'])->name('physical-characteristics.update');
    Route::delete('/pdl-management/physical-characteristics/{characteristic}', [PhysicalCharacteristicController::class, 'destroy'])->name('physical-characteristics.destroy');
});

// Law Enforcement Routes - Protected by auth and law.enforcement middleware
Route::middleware(['auth', 'law.enforcement'])->prefix('law-enforcement')->group(function () {
    Route::get('/profile-management', [ProfileManagementController::class, 'index'])->name('profile-management.index');
    Route::get('/dashboard', [DashboardController::class, 'lawEnforcementDashboard'])->name('dashboard.law-enforcement');
    Route::get('/pdl-management/personal-information', [PDLManagementController::class, 'personal_information'])->name('pdl-management.personal-information');
    Route::post('/pdl-management/personal-information/transfer/', [PDLManagementController::class, 'transfer'])->name('pdl-management.transfer');


    Route::get('/pdl-management/personal-information/{pdl_id}', [PDLManagementController::class, 'view_update'])->name('pdl-management.personal-information.view');

    Route::get('/pdl-management/court-order', [PDLManagementController::class, 'court_order'])->name('pdl-management.court-order');
    Route::post('/pdl-management/court-order', [PDLManagementController::class, 'store_court_order'])->name('court-orders.store');
    Route::get('/pdl-management/court-order/{courtOrder}/edit', [PDLManagementController::class, 'edit_court_order'])->name('court-orders.edit');
    Route::put('/pdl-management/court-order/{courtOrder}', [PDLManagementController::class, 'update_court_order'])->name('court-orders.update');
    Route::delete('/pdl-management/court-order/{courtOrder}', [PDLManagementController::class, 'destroy_court_order'])->name('court-orders.destroy');
    Route::get('/pdl-management/case-information', [CaseInformationController::class, 'index'])->name('case-information.index');

    Route::get('/pdl-management/case-information/{case}/edit', [CaseInformationController::class, 'edit'])->name('case-information.edit');
    Route::put('/pdl-management/case-information/{case}', [CaseInformationController::class, 'update'])->name('case-information.update');

    Route::delete('/pdl-management/case-information/{case}', [CaseInformationController::class, 'destroy'])->name('case-information.destroy');

    Route::get('/pdl-management/medical-records', [MedicalRecordController::class, 'index'])
        ->name('medical-records.index');

    Route::post('/medical-records', [MedicalRecordController::class, 'store'])
        ->name('medical-records.store');

    Route::get('/medical-records/{medicalRecord}/edit', [MedicalRecordController::class, 'edit'])
        ->name('medical-records.edit');

    Route::put('/medical-records/{medicalRecord}', [MedicalRecordController::class, 'update'])
        ->name('medical-records.update');

    Route::delete('/medical-records/{medicalRecord}', [MedicalRecordController::class, 'destroy'])
        ->name('medical-records.destroy');

    Route::get('/pdl-management/physical-characteristics', [PhysicalCharacteristicController::class, 'index'])
        ->name('physical-characteristics.index');

    Route::post('/pdl-management/physical-characteristics', [PhysicalCharacteristicController::class, 'store'])
        ->name('physical-characteristics.store');

    Route::put('/pdl-management/physical-characteristics/{characteristic}', [PhysicalCharacteristicController::class, 'update'])
        ->name('physical-characteristics.update');

    Route::delete('/pdl-management/physical-characteristics/{characteristic}', [PhysicalCharacteristicController::class, 'destroy'])
        ->name('physical-characteristics.destroy');

    // Additional PDL Management routes for notifications


    Route::get('/pdl-management/time-allowance', [TimeAllowanceController::class, 'index'])->name('law-enforcement.pdl-management.time-allowance');
    Route::post('/pdl-management/time-allowance/{pdl}', [TimeAllowanceController::class, 'updateTimeAllowance'])->name('law-enforcement.time-allowance.update');

    Route::get('/jail-events', [JailEventsController::class, 'index'])->name('law-enforcement.jail-events.index');
    Route::post('/jail-events', [JailEventsController::class, 'store'])->name('law-enforcement.jail-events.store');

    // Certificate Management
    Route::get('/certificates', [CertificateController::class, 'index'])->name('certificates.index');
    Route::get('/certificates/create', [CertificateController::class, 'create'])->name('certificates.create');
    Route::post('/certificates', [CertificateController::class, 'store'])->name('certificates.store');
    Route::get('/certificates/{certificate}', [CertificateController::class, 'show'])->name('certificates.show');
    Route::get('/certificates/{certificate}/edit', [CertificateController::class, 'edit'])->name('certificates.edit');
    Route::put('/certificates/{certificate}', [CertificateController::class, 'update'])->name('certificates.update');
    Route::post('/certificates/{certificate}/revoke', [CertificateController::class, 'revoke'])->name('certificates.revoke');
    Route::get('/certificates/{certificate}/download', [CertificateController::class, 'download'])->name('certificates.download');
    Route::get('/certificates/{certificate}/print', [CertificateController::class, 'print'])->name('certificates.print');
    Route::get('/certificates/expiring', [CertificateController::class, 'expiring'])->name('certificates.expiring');
    Route::post('/certificates/cleanup', [CertificateController::class, 'cleanup'])->name('certificates.cleanup');
});

// Shared routes that require authentication but no specific role
Route::middleware(['auth'])->group(function () {
    Route::post('/pdl-management/case-information', [CaseInformationController::class, 'store'])->name('case-information.store');
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
});

// Global Search Routes - Available to all authenticated users
Route::middleware(['auth'])->group(function () {
    Route::post('/pdl-management/case-information/{caseId}/status', [CaseInformationController::class, 'updateCaseStatus'])->name('case-information.update-status');
    Route::get('/pdl-management/personal-information/create', [PDLManagementController::class, 'view_create'])->name('pdl-management.personal-information.create');
    Route::post('/pdl-management/personal-information/create', [PDLManagementController::class, 'store_create'])->name('pdl-management.personal-information.create');
    Route::get('/search', [SearchController::class, 'globalSearch'])->name('search.global');
    Route::get('/search/quick', [SearchController::class, 'quickSearch'])->name('search.quick');
    Route::get('/search/test', [App\Http\Controllers\SearchTestController::class, 'testSearch'])->name('search.test');
    Route::post('/pdl-management/time-allowance/{pdl}', [TimeAllowanceController::class, 'updateTimeAllowance'])->name('admin.time-allowance.update');
    Route::put('/pdl-management/time-allowance/record/{record}', [TimeAllowanceController::class, 'updateRecord'])->name('admin.time-allowance.update-record');
    Route::delete('/pdl-management/time-allowance/record/{record}', [TimeAllowanceController::class, 'revoke'])->name('admin.time-allowance.revoke');
    Route::post('/pdl-management/custody/{pdl}', [App\Http\Controllers\CustodyController::class, 'update'])->name('admin.custody.update');
    // Search Results Pages
    Route::get('/search/results', [SearchResultsController::class, 'show'])->name('search.results');
    Route::post('/pdl-management/personal-information/{pdl_id}', [PDLManagementController::class, 'update_personal_information'])->name('pdl-management.personal-information.update');
    Route::post('/pdl/{pdl}/archive', [App\Http\Controllers\PdlArchiveController::class, 'archive'])->name('pdl.archive');
    Route::post('/pdl/{pdl}/unarchive', [App\Http\Controllers\PdlArchiveController::class, 'unarchive'])->name('pdl.unarchive');
    Route::post('/pdl/{pdl}/custody-dates', [App\Http\Controllers\PdlArchiveController::class, 'updateCustodyDates'])->name('pdl.custody-dates');
    Route::post('/user-pdl-archive/{pdl}/unarchive', [UserPDLArchiveController::class, 'unarchivePdl'])->name('user-pdl-archive.unarchive');
    Route::post('/user-personnel-archive/{personnelId}/restore', [UserPDLArchiveController::class, 'restorePersonnel'])->name('user-personnel-archive.restore');
    Route::patch('/admin/verification/{verification}/update', [VerificationController::class, 'update'])
        ->name('admin.verification.update');
    Route::post('/profile/update', [ProfileManagementController::class, 'update'])->name('admin.profile.update');
    Route::put('/pdl-management/case-information/{case}', [CaseInformationController::class, 'update'])->name('case-information.update');
    Route::get('/pdl-management/physical-characteristics/{characteristic}/edit', [PhysicalCharacteristicController::class, 'edit'])->name('physical-characteristics.edit');
    Route::put('/pdl-management/physical-characteristics/{characteristic}', [PhysicalCharacteristicController::class, 'update'])->name('physical-characteristics.update');
    Route::delete('/pdl-management/physical-characteristics/{characteristic}', [PhysicalCharacteristicController::class, 'destroy'])->name('physical-characteristics.destroy');
    Route::put('/pdl-management/court-order/{courtOrder}', [PDLManagementController::class, 'update_court_order'])->name('court-orders.update');
    Route::post('/pdl-management/cell-assignment', [CellAssignmentController::class, 'assign'])->name('cell-assignments.store');

    Route::post('/admin/jail-events', [JailEventsController::class, 'store'])->name('admin.jail-events.store');
    Route::post('/jail-events', [JailEventsController::class, 'store'])->name('record-officer.jail-events.store');

    Route::post('/admin/jail-events/reschedule', [JailEventsController::class, 'reschedule'])->name('admin.jail-events.reschedule');
    Route::patch('/admin/jail-events/cancel', [JailEventsController::class, 'cancel'])->name('admin.jail-events.cancel');
    Route::post('/pdl-management/cell-assignment/transfer', [CellAssignmentController::class, 'transfer'])->name('cell-assignments.transfer');

    Route::post('/agency', [AgencyController::class, 'create'])->name('agency.create');
// Change the route to accept query parameter
Route::get('/report/pdl-information', [ReportController::class, 'pdlInformationReport'])
    ->name('pdl-management.download');
});

Route::get('storage/profile_images/{filename}', function ($filename) {
    $path = storage_path('app/public/profile_images/' . $filename);

    if (!file_exists($path)) {
        abort(404);
    }

    return response()->file($path);
});


Route::get('storage/archive/court_orders/{filename}', function ($filename) {
    $path = storage_path('app/public/archive/court_orders/' . $filename);

    if (!file_exists($path)) {
        abort(404);
    }

    return response()->file($path);
});


Route::get('storage/court_documents/{filename}', function ($filename) {
    $path = storage_path('app/public/court_documents/' . $filename);

    if (!file_exists($path)) {
        abort(404);
    }

    return response()->file($path);
});

Route::get('storage/mugshots/{filename}', function ($filename) {
    $path = storage_path('app/public/mugshots/' . $filename);

    if (!file_exists($path)) {
        abort(404);
    }

    return response()->file($path);
});


Route::get('storage/medical_documents/{filename}', function ($filename) {
    $path = storage_path('app/public/medical_documents/' . $filename);

    if (!file_exists($path)) {
        abort(404);
    }

    return response()->file($path);
});

require __DIR__ . '/auth.php';
