<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SMSController;

Route::get('/sms', [SMSController::class, 'getPending']);
Route::post('/sms/{id}/mark-as-used', [SMSController::class, 'markAsUsed']);
