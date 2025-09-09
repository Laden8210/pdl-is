<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Pdl;
use App\Models\CaseInformation;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Verifications;

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

    public function gctaTastmReport(Request $request)
    {
        $query = Verifications::with([
            'personnel:id,fname,lname',
            'pdl' => function ($query) {
                $query->with([
                    'physicalCharacteristics',
                    'courtOrders',
                    'medicalRecords',
                    'cases',
                    'personnel:id,fname,lname',
                    'timeAllowances'
                ]);
            },
            'reviewer:id,fname,lname'
        ])
            ->where('status', '=', 'approved');

        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->whereHas('pdl', function ($q) use ($searchTerm) {
                $q->where('fname', 'like', "%{$searchTerm}%")
                    ->orWhere('lname', 'like', "%{$searchTerm}%")
                    ->orWhere('alias', 'like', "%{$searchTerm}%")
                    ->orWhere('id', 'like', "%{$searchTerm}%");
            });
        }

        $verifications = $query->latest()->get();

        return Inertia::render('admin/report/gcta-tastm-report', [
            'verifications' => $verifications->map(function ($verification) {
                $pdl = $verification->pdl;

                $gcta = 0;
                $tastm = 0;

                if ($pdl && $pdl->timeAllowances) {
                    foreach ($pdl->timeAllowances as $allowance) {
                        if ($allowance->type === 'gcta') {
                            $gcta += $allowance->days;
                        } elseif ($allowance->type === 'tastm') {
                            $tastm += $allowance->days;
                        }
                    }
                }

                return [
                    'verification_id' => $verification->verification_id,
                    'reason' => $verification->reason,
                    'status' => $verification->status,
                    'feedback' => $verification->feedback,
                    'reviewed_at' => $verification->reviewed_at,
                    'personnel' => $verification->personnel,
                    'reviewer' => $verification->reviewer,
                    'created_at' => $verification->created_at,
                    'gcta_days' => $gcta,
                    'tastm_days' => $tastm,
                    'pdl' => $pdl ? [
                        'id' => $pdl->id,
                        'fname' => $pdl->fname,
                        'lname' => $pdl->lname,
                        'alias' => $pdl->alias,
                        'birthdate' => $pdl->birthdate,
                        'age' => $pdl->age,
                        'gender' => $pdl->gender,
                        'ethnic_group' => $pdl->ethnic_group,
                        'civil_status' => $pdl->civil_status,
                        'brgy' => $pdl->brgy,
                        'city' => $pdl->city,
                        'province' => $pdl->province,
                        'personnel' => $pdl->personnel,
                        'physical_characteristics' => $pdl->physicalCharacteristics,
                        'court_orders' => $pdl->courtOrders,
                        'medical_records' => $pdl->medicalRecords,
                        'cases' => $pdl->cases,
                    ] : null,
                ];
            }),
            'filters' => $request->only(['start_date', 'end_date', 'search']),
        ]);
    }


    public function generateGCTATASTM(Request $request)
    {
        $verificationId = $request->input('verification_id');

        $verification = Verifications::with([
            'personnel:id,fname,lname',
            'pdl' => function ($query) {
                $query->with([
                    'physicalCharacteristics',
                    'courtOrders',
                    'medicalRecords',
                    'cases',
                    'personnel:id,fname,lname',
                    'timeAllowances'
                ]);
            },
            'reviewer:id,fname,lname'
        ])->findOrFail($verificationId);

        $pdl = $verification->pdl;

        // Calculate GCTA and TASTM days
        $gcta = 0;
        $tastm = 0;

        if ($pdl && $pdl->timeAllowances) {
            foreach ($pdl->timeAllowances as $allowance) {
                if ($allowance->type === 'gcta') {
                    $gcta += $allowance->days;
                } elseif ($allowance->type === 'tastm') {
                    $tastm += $allowance->days;
                }
            }
        }

        // Calculate time served (this would need your actual logic)
        $commitmentDate = $pdl->created_at; // This should be replaced with actual commitment date
        $currentDate = now();
        $timeServed = $commitmentDate->diff($currentDate);

        // Convert days to years, months, days
        function convertDaysToYMD($days)
        {
            $years = floor($days / 365);
            $remainingDays = $days % 365;
            $months = floor($remainingDays / 30);
            $days = $remainingDays % 30;

            return [
                'years' => $years,
                'months' => $months,
                'days' => $days
            ];
        }

        $gctaYMD = convertDaysToYMD($gcta);
        $tastmYMD = convertDaysToYMD($tastm);

        $totalDaysServed = $commitmentDate->diffInDays($currentDate);
        $totalWithAllowances = $totalDaysServed + $gcta + $tastm;
        $totalYMD = convertDaysToYMD($totalWithAllowances);

        $data = [
            'verification' => $verification,
            'pdl' => $pdl,
            'gcta_days' => $gcta,
            'tastm_days' => $tastm,
            'gcta_ymd' => $gctaYMD,
            'tastm_ymd' => $tastmYMD,
            'commitment_date' => $commitmentDate->format('F j, Y'),
            'current_date' => $currentDate->format('F j, Y'),
            'time_served' => [
                'years' => $timeServed->y,
                'months' => $timeServed->m,
                'days' => $timeServed->d
            ],
            'total_with_allowances' => $totalYMD
        ];

        $html = view('reports.gcta-tastm', $data)->render();

        $dompdf = new \Dompdf\Dompdf();
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->loadHtml($html);
        $dompdf->render();

        return response($dompdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="gcta-tastm-report-' . $pdl->id . '.pdf"');
    }
}
