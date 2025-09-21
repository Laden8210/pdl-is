<?php

namespace App\Http\Controllers;

use App\Models\Pdl;
use App\Models\Personnel;
use App\Models\CaseInformation;
use App\Models\CourtOrder;
use App\Models\MedicalRecord;
use App\Models\PhysicalCharacteristic;
use App\Models\Cells;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SearchResultsController extends Controller
{
    public function show(Request $request)
    {
        $query = $request->get('q', '');
        $category = $request->get('category', '');
        $type = $request->get('type', '');
        $id = $request->get('id', '');

        if (empty($query)) {
            return redirect()->route('dashboard')->with('error', 'No search query provided.');
        }

        $searchTerm = '%' . $query . '%';
        $results = [];
        $totalResults = 0;

        // If specific category and type are provided, show detailed results for that type
        if (!empty($category) && !empty($type) && !empty($id)) {
            return $this->showDetailedResult($type, $id, $query);
        }

        // Otherwise, show all search results
        $results = $this->performGlobalSearch($searchTerm, $query);
        $totalResults = collect($results)->sum(fn($categoryResults) => count($categoryResults));

        return Inertia::render('search/results', [
            'query' => $query,
            'results' => $results,
            'totalResults' => $totalResults,
            'categories' => array_keys($results),
            'auth' => auth()->user()
        ]);
    }

    private function showDetailedResult($type, $id, $query)
    {
        $detailedResult = null;
        $relatedData = [];

        switch ($type) {
            case 'pdl':
                $detailedResult = Pdl::with(['personnel', 'cases', 'courtOrders', 'medicalRecords', 'physicalCharacteristics'])
                    ->find($id);
                if ($detailedResult) {
                    $relatedData = [
                        'cases' => $detailedResult->cases,
                        'courtOrders' => $detailedResult->courtOrders,
                        'medicalRecords' => $detailedResult->medicalRecords,
                        'physicalCharacteristics' => $detailedResult->physicalCharacteristics,
                    ];
                }
                break;

            case 'personnel':
                $detailedResult = Personnel::with(['pdls'])
                    ->find($id);
                if ($detailedResult) {
                    $relatedData = [
                        'pdls' => $detailedResult->pdls,
                    ];
                }
                break;

            case 'case':
                $detailedResult = CaseInformation::with(['pdl'])
                    ->find($id);
                if ($detailedResult) {
                    $relatedData = [
                        'pdl' => $detailedResult->pdl,
                    ];
                }
                break;

            case 'court_order':
                $detailedResult = CourtOrder::with(['pdl'])
                    ->find($id);
                if ($detailedResult) {
                    $relatedData = [
                        'pdl' => $detailedResult->pdl,
                    ];
                }
                break;

            case 'medical_record':
                $detailedResult = MedicalRecord::with(['pdl'])
                    ->find($id);
                if ($detailedResult) {
                    $relatedData = [
                        'pdl' => $detailedResult->pdl,
                    ];
                }
                break;

            case 'physical_characteristic':
                $detailedResult = PhysicalCharacteristic::with(['pdl'])
                    ->find($id);
                if ($detailedResult) {
                    $relatedData = [
                        'pdl' => $detailedResult->pdl,
                    ];
                }
                break;

            case 'cell':
                $detailedResult = Cells::find($id);
                break;
        }

        if (!$detailedResult) {
            return redirect()->route('search.results', ['q' => $query])
                ->with('error', 'Record not found.');
        }

        return Inertia::render('search/detail', [
            'query' => $query,
            'type' => $type,
            'result' => $detailedResult,
            'relatedData' => $relatedData,
            'auth' => auth()->user()
        ]);
    }

    private function performGlobalSearch($searchTerm, $query)
    {
        $results = [];

        // Search PDL
        $pdlResults = Pdl::where(function ($q) use ($searchTerm) {
            $q->where('fname', 'LIKE', $searchTerm)
              ->orWhere('lname', 'LIKE', $searchTerm)
              ->orWhere('alias', 'LIKE', $searchTerm)
              ->orWhere('brgy', 'LIKE', $searchTerm)
              ->orWhere('city', 'LIKE', $searchTerm)
              ->orWhere('province', 'LIKE', $searchTerm)
              ->orWhere(DB::raw("CONCAT(fname, ' ', lname)"), 'LIKE', $searchTerm);
        })
        ->with('personnel')
        ->limit(20)
        ->get();

        if ($pdlResults->count() > 0) {
            $results['Persons Deprived of Liberty'] = $pdlResults->map(function ($pdl) {
                return [
                    'id' => $pdl->id,
                    'type' => 'pdl',
                    'title' => "{$pdl->fname} {$pdl->lname}",
                    'subtitle' => $pdl->alias ? "Alias: {$pdl->alias}" : "No alias",
                    'description' => "{$pdl->brgy}, {$pdl->city}, {$pdl->province}",
                    'url' => route('search.results', ['q' => $query, 'category' => 'pdl', 'type' => 'pdl', 'id' => $pdl->id]),
                    'icon' => 'users',
                    'data' => $pdl
                ];
            });
        }

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
            ->limit(20)
            ->get();

        if ($personnelResults->count() > 0) {
            $results['Personnel'] = $personnelResults->map(function ($personnel) use ($query) {
                return [
                    'id' => $personnel->id,
                    'type' => 'personnel',
                    'title' => "{$personnel->fname} {$personnel->lname}",
                    'subtitle' => "{$personnel->position} • {$personnel->agency}",
                    'description' => "Username: {$personnel->username}",
                    'url' => route('search.results', ['q' => $query, 'category' => 'personnel', 'type' => 'personnel', 'id' => $personnel->id]),
                    'icon' => 'user-check',
                    'data' => $personnel
                ];
            });
        }

        // Search Case Information
        $caseResults = CaseInformation::with('pdl')
            ->where(function ($q) use ($searchTerm) {
                $q->where('case_number', 'LIKE', $searchTerm)
                  ->orWhere('crime_committed', 'LIKE', $searchTerm)
                  ->orWhere('case_status', 'LIKE', $searchTerm)
                  ->orWhere('case_remarks', 'LIKE', $searchTerm)
                  ->orWhereHas('pdl', function ($pdlQuery) use ($searchTerm) {
                      $pdlQuery->where('fname', 'LIKE', $searchTerm)
                               ->orWhere('lname', 'LIKE', $searchTerm)
                               ->orWhere(DB::raw("CONCAT(fname, ' ', lname)"), 'LIKE', $searchTerm);
                  });
            })
            ->limit(20)
            ->get();

        if ($caseResults->count() > 0) {
            $results['Case Information'] = $caseResults->map(function ($case) use ($query) {
                return [
                    'id' => $case->case_id,
                    'type' => 'case',
                    'title' => $case->case_number,
                    'subtitle' => $case->pdl ? "{$case->pdl->fname} {$case->pdl->lname}" : 'Unknown PDL',
                    'description' => "{$case->crime_committed} • {$case->case_status}",
                    'url' => route('search.results', ['q' => $query, 'category' => 'case', 'type' => 'case', 'id' => $case->case_id]),
                    'icon' => 'file-text',
                    'data' => $case
                ];
            });
        }

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
            ->limit(20)
            ->get();

        if ($courtOrderResults->count() > 0) {
            $results['Court Orders'] = $courtOrderResults->map(function ($order) use ($query) {
                return [
                    'id' => $order->court_order_id,
                    'type' => 'court_order',
                    'title' => $order->order_type,
                    'subtitle' => $order->pdl ? "{$order->pdl->fname} {$order->pdl->lname}" : 'Unknown PDL',
                    'description' => "{$order->court_branch} • " . ($order->order_date ? $order->order_date->format('M d, Y') : 'No date'),
                    'url' => route('search.results', ['q' => $query, 'category' => 'court_order', 'type' => 'court_order', 'id' => $order->court_order_id]),
                    'icon' => 'gavel',
                    'data' => $order
                ];
            });
        }

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
            ->limit(20)
            ->get();

        if ($medicalResults->count() > 0) {
            $results['Medical Records'] = $medicalResults->map(function ($medical) use ($query) {
                return [
                    'id' => $medical->medical_record_id,
                    'type' => 'medical_record',
                    'title' => $medical->complaint,
                    'subtitle' => $medical->pdl ? "{$medical->pdl->fname} {$medical->pdl->lname}" : 'Unknown PDL',
                    'description' => $medical->date ? $medical->date->format('M d, Y') : 'No date',
                    'url' => route('search.results', ['q' => $query, 'category' => 'medical', 'type' => 'medical_record', 'id' => $medical->medical_record_id]),
                    'icon' => 'stethoscope',
                    'data' => $medical
                ];
            });
        }

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
            ->limit(20)
            ->get();

        if ($physicalResults->count() > 0) {
            $results['Physical Characteristics'] = $physicalResults->map(function ($physical) use ($query) {
                return [
                    'id' => $physical->characteristic_id,
                    'type' => 'physical_characteristic',
                    'title' => $physical->identification_marks ?: 'Physical Characteristics',
                    'subtitle' => $physical->pdl ? "{$physical->pdl->fname} {$physical->pdl->lname}" : 'Unknown PDL',
                    'description' => $physical->mark_location ?: 'No location specified',
                    'url' => route('search.results', ['q' => $query, 'category' => 'physical', 'type' => 'physical_characteristic', 'id' => $physical->characteristic_id]),
                    'icon' => 'eye',
                    'data' => $physical
                ];
            });
        }

        // Search Cells
        $cellResults = Cells::where('status', 'active')
            ->where(function ($q) use ($searchTerm) {
                $q->where('cell_name', 'LIKE', $searchTerm)
                  ->orWhere('description', 'LIKE', $searchTerm);
            })
            ->limit(20)
            ->get();

        if ($cellResults->count() > 0) {
            $results['Cells'] = $cellResults->map(function ($cell) use ($query) {
                return [
                    'id' => $cell->cell_id,
                    'type' => 'cell',
                    'title' => $cell->cell_name,
                    'subtitle' => "Capacity: {$cell->capacity}",
                    'description' => $cell->description ?: 'Cell facility',
                    'url' => route('search.results', ['q' => $query, 'category' => 'cells', 'type' => 'cell', 'id' => $cell->cell_id]),
                    'icon' => 'building',
                    'data' => $cell
                ];
            });
        }

        return $results;
    }
}
