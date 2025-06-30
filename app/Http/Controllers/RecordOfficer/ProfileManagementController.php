<?php

namespace App\Http\Controllers\RecordOfficer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('records-officer/profile-management/profile-management');
    }
}
