<?php

namespace App\Http\Controllers\RecordOfficer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JailEventsController extends Controller
{
    public function index()
    {
        return Inertia::render('records-officer/jail-events/jail-events');
    }
}
