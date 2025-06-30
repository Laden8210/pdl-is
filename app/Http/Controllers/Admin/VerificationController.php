<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

class VerificationController extends Controller
{

    public function index()
    {
        return Inertia::render('admin/verification/list');
    }
}
