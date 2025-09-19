<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Pdl;
use App\Models\Personnel;

class SearchTestController extends Controller
{
    public function testSearch()
    {
        // Test basic search functionality
        $pdlCount = Pdl::whereNull('deleted_at')->count();
        $personnelCount = Personnel::whereNull('deleted_at')->count();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Search system is working',
            'data' => [
                'pdl_count' => $pdlCount,
                'personnel_count' => $personnelCount,
                'search_endpoints' => [
                    'global' => route('search.global'),
                    'quick' => route('search.quick')
                ]
            ]
        ]);
    }
}
