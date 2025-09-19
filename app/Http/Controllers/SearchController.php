<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Pdl;
use App\Models\Personnel;
use App\Models\CaseInformation;
use App\Models\CourtOrder;
use App\Models\MedicalRecord;
use App\Models\PhysicalCharacteristic;
use App\Models\TimeAllowance;
use App\Models\Verifications;
use App\Models\Cells;
use App\Models\CellAssignment;
use App\Models\Activity;

class SearchController extends Controller
{
    public function globalSearch(Request $request)
    {
        $query = $request->get('q', '');

        if (empty($query) || strlen($query) < 2) {
            return response()->json([
                'results' => [],
                'total' => 0,
                'message' => 'Please enter at least 2 characters to search'
            ]);
        }

        $searchTerm = '%' . $query . '%';
        $results = [];

        // Search PDL (Persons Deprived of Liberty)
        $pdlResults = Pdl::whereNull('deleted_at')
            ->where(function ($q) use ($searchTerm) {
                $q->where('fname', 'LIKE', $searchTerm)
                  ->orWhere('lname', 'LIKE', $searchTerm)
                  ->orWhere('alias', 'LIKE', $searchTerm)
                  ->orWhere(DB::raw("CONCAT(fname, ' ', lname)"), 'LIKE', $searchTerm)
                  ->orWhere('brgy', 'LIKE', $searchTerm)
                  ->orWhere('city', 'LIKE', $searchTerm)
                  ->orWhere('province', 'LIKE', $searchTerm);
            })
            ->limit(10)
            ->get()
            ->map(function ($pdl) use ($query) {
                return [
                    'type' => 'pdl',
                    'id' => $pdl->id,
                    'title' => "{$pdl->fname} {$pdl->lname}",
                    'subtitle' => "PDL #{$pdl->id} • {$pdl->gender} • Age: {$pdl->age}",
                    'description' => "{$pdl->brgy}, {$pdl->city}, {$pdl->province}",
                    'url' => route('search.results', ['q' => $query, 'category' => 'pdl', 'type' => 'pdl', 'id' => $pdl->id]),
                    'icon' => 'users',
                    'category' => 'Persons Deprived of Liberty'
                ];
            });

        // Search Personnel
        $personnelResults = Personnel::whereNull('deleted_at')
            ->where('status', 'active')
            ->where(function ($q) use ($searchTerm) {
                $q->where('fname', 'LIKE', $searchTerm)
                  ->orWhere('lname', 'LIKE', $searchTerm)
                  ->orWhere('username', 'LIKE', $searchTerm)
                  ->orWhere(DB::raw("CONCAT(fname, ' ', lname)"), 'LIKE', $searchTerm)
                  ->orWhere('position', 'LIKE', $searchTerm)
                  ->orWhere('agency', 'LIKE', $searchTerm);
            })
            ->limit(5)
            ->get()
            ->map(function ($personnel) use ($query) {
                return [
                    'type' => 'personnel',
                    'id' => $personnel->id,
                    'title' => "{$personnel->fname} {$personnel->lname}",
                    'subtitle' => "{$personnel->position} • {$personnel->agency}",
                    'description' => "Username: {$personnel->username}",
                    'url' => route('search.results', ['q' => $query, 'category' => 'personnel', 'type' => 'personnel', 'id' => $personnel->id]),
                    'icon' => 'user-check',
                    'category' => 'Personnel'
                ];
            });

        // Search Case Information
        $caseResults = CaseInformation::with('pdl')
            ->where(function ($q) use ($searchTerm) {
                $q->where('case_number', 'LIKE', $searchTerm)
                  ->orWhere('crime_committed', 'LIKE', $searchTerm)
                  ->orWhere('case_status', 'LIKE', $searchTerm)
                  ->orWhere('security_classification', 'LIKE', $searchTerm)
                  ->orWhereHas('pdl', function ($pdlQuery) use ($searchTerm) {
                      $pdlQuery->where('fname', 'LIKE', $searchTerm)
                               ->orWhere('lname', 'LIKE', $searchTerm)
                               ->orWhere(DB::raw("CONCAT(fname, ' ', lname)"), 'LIKE', $searchTerm);
                  });
            })
            ->limit(8)
            ->get()
            ->map(function ($case) use ($query) {
                return [
                    'type' => 'case',
                    'id' => $case->case_id,
                    'title' => $case->case_number ?: "Case #{$case->case_id}",
                    'subtitle' => $case->pdl ? "{$case->pdl->fname} {$case->pdl->lname}" : 'Unknown PDL',
                    'description' => "{$case->crime_committed} • {$case->case_status} • {$case->security_classification}",
                    'url' => route('search.results', ['q' => $query, 'category' => 'case', 'type' => 'case', 'id' => $case->case_id]),
                    'icon' => 'file-text',
                    'category' => 'Case Information'
                ];
            });

        // Search Court Orders
        $courtOrderResults = CourtOrder::with('pdl')
            ->where(function ($q) use ($searchTerm) {
                $q->where('order_type', 'LIKE', $searchTerm)
                  ->orWhere('court_branch', 'LIKE', $searchTerm)
                  ->orWhere('court_order_number', 'LIKE', $searchTerm)
                  ->orWhere('remarks', 'LIKE', $searchTerm)
                  ->orWhereHas('pdl', function ($pdlQuery) use ($searchTerm) {
                      $pdlQuery->where('fname', 'LIKE', $searchTerm)
                               ->orWhere('lname', 'LIKE', $searchTerm)
                               ->orWhere(DB::raw("CONCAT(fname, ' ', lname)"), 'LIKE', $searchTerm);
                  });
            })
            ->limit(5)
            ->get()
            ->map(function ($order) use ($query) {
                return [
                    'type' => 'court_order',
                    'id' => $order->court_order_id,
                    'title' => $order->order_type,
                    'subtitle' => $order->pdl ? "{$order->pdl->fname} {$order->pdl->lname}" : 'Unknown PDL',
                    'description' => "{$order->court_branch} • " . ($order->order_date ? $order->order_date->format('M d, Y') : 'No date'),
                    'url' => route('search.results', ['q' => $query, 'category' => 'court_order', 'type' => 'court_order', 'id' => $order->court_order_id]),
                    'icon' => 'gavel',
                    'category' => 'Court Orders'
                ];
            });

        // Search Medical Records
        $medicalResults = MedicalRecord::with('pdl')
            ->where(function ($q) use ($searchTerm) {
                $q->where('complaint', 'LIKE', $searchTerm)
                  ->orWhere('prognosis', 'LIKE', $searchTerm)
                  ->orWhere('findings', 'LIKE', $searchTerm)
                  ->orWhere('prescription', 'LIKE', $searchTerm)
                  ->orWhereHas('pdl', function ($pdlQuery) use ($searchTerm) {
                      $pdlQuery->where('fname', 'LIKE', $searchTerm)
                               ->orWhere('lname', 'LIKE', $searchTerm)
                               ->orWhere(DB::raw("CONCAT(fname, ' ', lname)"), 'LIKE', $searchTerm);
                  });
            })
            ->limit(5)
            ->get()
            ->map(function ($medical) use ($query) {
                return [
                    'type' => 'medical',
                    'id' => $medical->medical_record_id,
                    'title' => $medical->complaint,
                    'subtitle' => $medical->pdl ? "{$medical->pdl->fname} {$medical->pdl->lname}" : 'Unknown PDL',
                    'description' => "Date: " . ($medical->date ? $medical->date->format('M d, Y') : 'No date'),
                    'url' => route('search.results', ['q' => $query, 'category' => 'medical', 'type' => 'medical_record', 'id' => $medical->medical_record_id]),
                    'icon' => 'stethoscope',
                    'category' => 'Medical Records'
                ];
            });

        // Search Physical Characteristics
        $physicalResults = PhysicalCharacteristic::with('pdl')
            ->where(function ($q) use ($searchTerm) {
                $q->where('identification_marks', 'LIKE', $searchTerm)
                  ->orWhere('mark_location', 'LIKE', $searchTerm)
                  ->orWhere('remark', 'LIKE', $searchTerm)
                  ->orWhereHas('pdl', function ($pdlQuery) use ($searchTerm) {
                      $pdlQuery->where('fname', 'LIKE', $searchTerm)
                               ->orWhere('lname', 'LIKE', $searchTerm)
                               ->orWhere(DB::raw("CONCAT(fname, ' ', lname)"), 'LIKE', $searchTerm);
                  });
            })
            ->limit(5)
            ->get()
            ->map(function ($physical) use ($query) {
                return [
                    'type' => 'physical',
                    'id' => $physical->characteristic_id,
                    'title' => $physical->identification_marks ?: 'Physical Characteristics',
                    'subtitle' => $physical->pdl ? "{$physical->pdl->fname} {$physical->pdl->lname}" : 'Unknown PDL',
                    'description' => "Height: {$physical->height} • Weight: {$physical->weight} • Build: {$physical->build}",
                    'url' => route('search.results', ['q' => $query, 'category' => 'physical', 'type' => 'physical_characteristic', 'id' => $physical->characteristic_id]),
                    'icon' => 'eye',
                    'category' => 'Physical Characteristics'
                ];
            });

        // Search Cells
        $cellResults = Cells::where('status', 'active')
            ->where(function ($q) use ($searchTerm) {
                $q->where('cell_name', 'LIKE', $searchTerm)
                  ->orWhere('description', 'LIKE', $searchTerm);
            })
            ->limit(5)
            ->get()
            ->map(function ($cell) use ($query) {
                return [
                    'type' => 'cell',
                    'id' => $cell->cell_id,
                    'title' => $cell->cell_name,
                    'subtitle' => "Capacity: {$cell->capacity}",
                    'description' => $cell->description ?: 'Cell facility',
                    'url' => route('search.results', ['q' => $query, 'category' => 'cells', 'type' => 'cell', 'id' => $cell->cell_id]),
                    'icon' => 'building',
                    'category' => 'Cells'
                ];
            });

        // Combine all results
        $allResults = collect()
            ->merge($pdlResults)
            ->merge($personnelResults)
            ->merge($caseResults)
            ->merge($courtOrderResults)
            ->merge($medicalResults)
            ->merge($physicalResults)
            ->merge($cellResults);

        // Group results by category
        $groupedResults = $allResults->groupBy('category');

        return response()->json([
            'results' => $groupedResults,
            'total' => $allResults->count(),
            'query' => $query,
            'categories' => $groupedResults->keys()->toArray()
        ]);
    }

    public function quickSearch(Request $request)
    {
        $query = $request->get('q', '');

        if (empty($query) || strlen($query) < 2) {
            return response()->json([]);
        }

        $searchTerm = '%' . $query . '%';

        // Quick search focusing on most commonly searched items
        $results = collect();

        // PDL quick search
        $pdlQuick = Pdl::whereNull('deleted_at')
            ->where(function ($q) use ($searchTerm) {
                $q->where('fname', 'LIKE', $searchTerm)
                  ->orWhere('lname', 'LIKE', $searchTerm)
                  ->orWhere(DB::raw("CONCAT(fname, ' ', lname)"), 'LIKE', $searchTerm);
            })
            ->limit(5)
            ->get()
            ->map(function ($pdl) use ($query) {
                return [
                    'type' => 'pdl',
                    'id' => $pdl->id,
                    'title' => "{$pdl->fname} {$pdl->lname}",
                    'subtitle' => "PDL #{$pdl->id}",
                    'url' => route('search.results', ['q' => $query, 'category' => 'pdl', 'type' => 'pdl', 'id' => $pdl->id]),
                    'icon' => 'users'
                ];
            });

        // Court quick search
        $caseQuick = CaseInformation::with('pdl')
            ->where('case_number', 'LIKE', $searchTerm)
            ->limit(3)
            ->get()
            ->map(function ($case) use ($query) {
                return [
                    'type' => 'case',
                    'id' => $case->case_id,
                    'title' => $case->case_number,
                    'subtitle' => $case->pdl ? "{$case->pdl->fname} {$case->pdl->lname}" : 'Unknown PDL',
                    'url' => route('search.results', ['q' => $query, 'category' => 'case', 'type' => 'case', 'id' => $case->case_id]),
                    'icon' => 'file-text'
                ];
            });

        return response()->json([
            'pdl' => $pdlQuick,
            'cases' => $caseQuick,
            'total' => $pdlQuick->count() + $caseQuick->count()
        ]);
    }
}
