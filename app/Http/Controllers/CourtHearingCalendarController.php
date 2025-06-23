<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class CourtHearingCalendarController extends Controller
{
      public function index()
    {
        return Inertia::render('court-hearing/calendar');
    }
}
