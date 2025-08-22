<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Pdl;
use App\Models\CaseInformation;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $pdls = Pdl::with(['cases', 'personnel'])
            ->when($startDate && $endDate, function ($query) use ($startDate, $endDate) {
                return $query->whereHas('cases', function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('date_committed', [
                        Carbon::parse($startDate)->startOfDay(),
                        Carbon::parse($endDate)->endOfDay()
                    ]);
                });
            })
            ->orderBy('lname')
            ->get()
            ->map(function ($pdl) {
                $mainCase = $pdl->cases->first();

                return [
                    'id' => $pdl->id,
                    'name' => $pdl->fname . ' ' . $pdl->lname,
                    'case_no' => $mainCase->case_number ?? 'N/A',
                    'crime_committed' => $mainCase->crime_committed ?? 'N/A',
                    'date_of_birth' => $pdl->birthdate?->format('Y-m-d'),
                    'date_committed' => ($mainCase && $mainCase->date_committed) ? Carbon::parse($mainCase->date_committed)->format('Y-m-d') : '',
                    'no_of_cases' => $pdl->cases->count(),
                    'tribe' => $pdl->ethnic_group ?? 'N/A',
                    'years' => $mainCase ? $this->calculateYears($mainCase->date_committed) : 'N/A',
                    'case_status' => $mainCase->case_status ?? 'N/A',
                    'rtc' => $mainCase ? ($mainCase->security_classification ?? 'N/A') : 'N/A'
                ];
            });

        return Inertia::render('admin/report/list-of-pdl-reports', [
            'pdls' => $pdls,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate
            ]
        ]);
    }

    private function calculateYears($dateCommitted)
    {
        if (!$dateCommitted) return 'N/A';

        $now = Carbon::now();
        $committed = Carbon::parse($dateCommitted);

        return $now->diffInYears($committed);
    }

    public function export(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date'
        ]);

        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $pdls = Pdl::with(['cases', 'personnel'])
            ->when($startDate && $endDate, function ($query) use ($startDate, $endDate) {
                return $query->whereHas('cases', function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('date_committed', [
                        Carbon::parse($startDate)->startOfDay(),
                        Carbon::parse($endDate)->endOfDay()
                    ]);
                });
            })
            ->orderBy('lname')
            ->get()
            ->map(function ($pdl) {
                $mainCase = $pdl->cases->first();

                return [
                    'Name' => $pdl->fname . ' ' . $pdl->lname,
                    'CaseNo' => $mainCase->case_number ?? 'N/A',
                    'CrimeCommitted' => $mainCase->crime_committed ?? 'N/A',
                    'Date of Birth' => $pdl->birthdate?->format('Y-m-d'),
                    'Date Committed' => ($mainCase && $mainCase->date_committed) ? Carbon::parse($mainCase->date_committed)->format('Y-m-d') : '',
                    'NoOfCases' => $pdl->cases->count(),
                    'Tribe' => $pdl->ethnic_group ?? 'N/A',
                    'Years' => $mainCase ? $this->calculateYears($mainCase->date_committed) : 'N/A',
                    'CaseStatus' => $mainCase->case_status ?? 'N/A',
                    'RTC' => $mainCase ? ($mainCase->security_classification ?? 'N/A') : 'N/A'
                ];
            });

        if ($pdls->isEmpty()) {
            return redirect()->back()->with('error', 'No records found for the selected date range.');
        }

        // Generate PDF instead of CSV
        $fileName = 'pdl_report_' . ($startDate ? $startDate : 'all') . '_to_' . ($endDate ? $endDate : 'all') . '.pdf';

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('reports.pdl-list', [
            'pdls' => $pdls,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'generatedAt' => now()->format('Y-m-d H:i:s')
        ])->setPaper('a4', 'landscape');

        return $pdf->download($fileName);
    }

      public function populationReport()
    {
        return Inertia::render('admin/report/population-report');
    }

    public function generatePopulationReport(Request $request)
    {
        $request->validate([
            'report_date' => 'required|date',
            'report_type' => 'required|in:age_sex,case_status,case_load'
        ]);

        $reportDate = Carbon::parse($request->report_date);
        $reportType = $request->report_type;

        switch ($reportType) {
            case 'age_sex':
                $data = $this->generateAgeSexReport($reportDate);
                break;
            case 'case_status':
                $data = $this->generateCaseStatusReport($reportDate);
                break;
            case 'case_load':
                $data = $this->generateCaseLoadReport($reportDate);
                break;
            default:
                $data = [];
        }

        if ($request->export_pdf) {
            return $this->exportPdfReport($data, $reportType, $reportDate);
        }

        // Return Inertia response instead of JSON
        return Inertia::render('admin/report/population-report', [
            'reportData' => $data,
            'filters' => [
                'report_date' => $request->report_date,
                'report_type' => $request->report_type
            ]
        ]);
    }

    private function generateAgeSexReport($reportDate)
    {
        $pdls = Pdl::with('cases')
            ->whereHas('cases', function ($query) use ($reportDate) {
                $query->where('date_committed', '<=', $reportDate);
            })
            ->get();

        $ageGroups = [
            '18-21' => ['min' => 18, 'max' => 21],
            '22-30' => ['min' => 22, 'max' => 30],
            '31-40' => ['min' => 31, 'max' => 40],
            '41-50' => ['min' => 41, 'max' => 50],
            '51-59' => ['min' => 51, 'max' => 59],
            '60-UP' => ['min' => 60, 'max' => 200],
            'UNKNOWN' => ['min' => null, 'max' => null]
        ];

        $reportData = [];
        $totalMale = 0;
        $totalFemale = 0;

        foreach ($ageGroups as $group => $range) {
            $maleCount = 0;
            $femaleCount = 0;

            if ($group === 'UNKNOWN') {
                $maleCount = $pdls->where('gender', 'Male')->whereNull('birthdate')->count();
                $femaleCount = $pdls->where('gender', 'Female')->whereNull('birthdate')->count();
            } else {
                $minDate = $reportDate->copy()->subYears($range['max']);
                $maxDate = $reportDate->copy()->subYears($range['min']);

                $maleCount = $pdls->where('gender', 'Male')
                    ->whereNotNull('birthdate')
                    ->where('birthdate', '<=', $maxDate)
                    ->where('birthdate', '>=', $minDate)
                    ->count();

                $femaleCount = $pdls->where('gender', 'Female')
                    ->whereNotNull('birthdate')
                    ->where('birthdate', '<=', $maxDate)
                    ->where('birthdate', '>=', $minDate)
                    ->count();
            }

            $total = $maleCount + $femaleCount;
            $totalMale += $maleCount;
            $totalFemale += $femaleCount;

            $reportData[] = [
                'age' => $group,
                'male' => $maleCount,
                'female' => $femaleCount,
                'total' => $total
            ];
        }

        // Add total row
        $reportData[] = [
            'age' => 'TOTAL',
            'male' => $totalMale,
            'female' => $totalFemale,
            'total' => $totalMale + $totalFemale
        ];

        return [
            'title' => 'INMATES POPULATION BY AGE AND SEX',
            'headers' => ['AGE', 'Male', 'Female', 'Total'],
            'data' => $reportData,
            'report_date' => $reportDate->format('F d, Y')
        ];
    }

    private function generateCaseStatusReport($reportDate)
    {
        $cases = CaseInformation::with('pdl')
            ->where('date_committed', '<=', $reportDate)
            ->get();

        $statusGroups = [
            'SERVED SENTENCE',
            'ARRAIGNMENT',
            'PRE-TRIAL',
            'ON TRIAL',
            'BONDED',
            'ARCHIVED',
            'DISMISSED',
            'PROBATION',
            'TRANSFERRED',
            'DECEASED',
            'CONVICTED',
            'HOUSE ARREST',
            'ACQUITTED',
            'ESCAPE'
        ];

        $reportData = [];
        $totalMale = 0;
        $totalFemale = 0;

        foreach ($statusGroups as $status) {
            $maleCount = $cases->filter(function ($case) use ($status) {
                return $case->case_status === $status &&
                       $case->pdl &&
                       $case->pdl->gender === 'Male';
            })->count();

            $femaleCount = $cases->filter(function ($case) use ($status) {
                return $case->case_status === $status &&
                       $case->pdl &&
                       $case->pdl->gender === 'Female';
            })->count();

            $total = $maleCount + $femaleCount;
            $totalMale += $maleCount;
            $totalFemale += $femaleCount;

            $reportData[] = [
                'status' => $status,
                'male' => $maleCount,
                'female' => $femaleCount,
                'total' => $total
            ];
        }

        // Add total row
        $reportData[] = [
            'status' => 'TOTAL',
            'male' => $totalMale,
            'female' => $totalFemale,
            'total' => $totalMale + $totalFemale
        ];

        return [
            'title' => 'CASE STATUS',
            'headers' => ['STATUS', 'Male', 'Female', 'Total'],
            'data' => $reportData,
            'report_date' => $reportDate->format('F d, Y')
        ];
    }

    private function generateCaseLoadReport($reportDate)
    {
        $cases = CaseInformation::with('pdl')
            ->where('date_committed', '<=', $reportDate)
            ->get();

        // Group by crime type
        $crimeStats = $cases->groupBy('crime_committed')->map(function ($groupedCases) {
            $maleCount = $groupedCases->filter(function ($case) {
                return $case->pdl && $case->pdl->gender === 'Male';
            })->count();

            $femaleCount = $groupedCases->filter(function ($case) {
                return $case->pdl && $case->pdl->gender === 'Female';
            })->count();

            return [
                'male' => $maleCount,
                'female' => $femaleCount,
                'total' => $maleCount + $femaleCount
            ];
        });

        $reportData = [];
        $totalMale = 0;
        $totalFemale = 0;

        foreach ($crimeStats as $crime => $stats) {
            $reportData[] = [
                'crime' => $crime,
                'male' => $stats['male'],
                'female' => $stats['female'],
                'total' => $stats['total']
            ];

            $totalMale += $stats['male'];
            $totalFemale += $stats['female'];
        }

        // Add total row
        $reportData[] = [
            'crime' => 'TOTAL',
            'male' => $totalMale,
            'female' => $totalFemale,
            'total' => $totalMale + $totalFemale
        ];

        return [
            'title' => 'CASE LOAD',
            'headers' => ['CRIME', 'Male', 'Female', 'Total'],
            'data' => $reportData,
            'report_date' => $reportDate->format('F d, Y')
        ];
    }

    private function exportPdfReport($data, $reportType, $reportDate)
    {
        $fileName = str_replace(' ', '_', strtolower($data['title'])) . '_' . $reportDate->format('Y_m_d') . '.pdf';

        $html = view('reports.population-report', [
            'data' => $data,
            'reportType' => $reportType,
            'reportDate' => $reportDate
        ])->render();

        $dompdf = new \Dompdf\Dompdf();
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->loadHtml($html);
        $dompdf->render();

        return $dompdf->stream($fileName);
    }
}
