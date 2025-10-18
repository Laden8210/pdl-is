<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Agency;
class AgencyController extends Controller
{
    public function create(Request $request)
    {



        $validated = $request->validate([
            'agency_name' => 'required|string|max:255|unique:agency,agency_name',
        ]);


        Agency::create([
            'agency_name' => $validated['agency_name'],
        ]);


        return redirect()->back()->with('success', 'Agency created successfully');
    }
}
