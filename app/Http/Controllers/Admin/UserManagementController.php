<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
class UserManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/user-management/list');
    }
}
