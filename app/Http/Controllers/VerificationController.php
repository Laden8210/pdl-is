<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class VerificationController extends Controller
{

    public function index()
    {
        return Inertia::render('verification/list');
    }
}
