<?php

namespace App\Http\Controllers\LawEnforcement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfileManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/profile-management/profie');
    }

    
}
