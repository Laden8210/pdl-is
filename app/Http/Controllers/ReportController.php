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

    public function generatePDLReport(Request $request, Pdl $pdl, $type)
    {
        $validTypes = ['inmate-status', 'inmate-population', 'inmate-daily-status'];

        if (!in_array($type, $validTypes)) {
            return redirect()->back()->with('error', 'Invalid report type.');
        }

        $pdl->load(['cases', 'personnel', 'physicalCharacteristics', 'courtOrders', 'medicalRecords']);

        $data = [
            'pdl' => $pdl,
            'report_type' => $type,
            'generated_at' => now()->format('Y-m-d H:i:s')
        ];

        $fileName = strtolower(str_replace(' ', '_', $type)) . '_report_pdl_' . $pdl->id . '.pdf';

        $html = view('reports.pdl-report', $data)->render();

        $dompdf = new \Dompdf\Dompdf();
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->loadHtml($html);
        $dompdf->render();

        return response($dompdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="' . $fileName . '"');
    }

    /**
     * Population of Drug-Related Cases Monthly Report
     */
    public function drugRelatedCasesMonthlyReport(Request $request)
    {
        return Inertia::render('admin/report/drug-related-cases-monthly');
    }

    public function generateDrugRelatedCasesMonthly(Request $request)
    {
        $request->validate([
            'year' => 'required|integer|min:2020|max:' . (date('Y') + 1)
        ]);

        $year = $request->year;


        $monthlyData = [];
        $yearlyTotals = [
            'male_detainees' => 0,
            'female_detainees' => 0,
            'total_detainees' => 0,
            'total_committed' => 0,
            'total_discharged' => 0,
            'bonded' => 0,
            'served_sentence' => 0,
            'dismissed' => 0,
            'transferred' => 0,
            'dapecol' => 0,
            'probation' => 0,
            'deceased' => 0,
            'acquitted' => 0,
            'total_discharged_drug' => 0,
            'total_drug_cases' => 0
        ];

        $monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];

        foreach ($monthNames as $index => $monthName) {
            $monthNumber = $index + 1;
            $startDate = Carbon::create($year, $monthNumber, 1)->startOfMonth();
            $endDate = Carbon::create($year, $monthNumber, 1)->endOfMonth();

            // Get detainees count for the month
            $detainees = Pdl::whereBetween('created_at', [$startDate, $endDate])->get();
            $maleDetainees = $detainees->where('gender', 'Male')->count();
            $femaleDetainees = $detainees->where('gender', 'Female')->count();
            $totalDetainees = $maleDetainees + $femaleDetainees;

            // Get committed count (PDLs created in this month)
            $committed = Pdl::whereBetween('created_at', [$startDate, $endDate])->count();

            // Get discharged count (PDLs with discharge status)
            $discharged = Pdl::whereBetween('updated_at', [$startDate, $endDate])
                ->whereHas('cases', function ($query) {
                    $query->whereIn('case_status', ['SERVED SENTENCE', 'DISMISSED', 'TRANSFERRED', 'DECEASED', 'ACQUITTED']);
                })
                ->count();

            // Get drug-related cases for the month
            $drugCases = CaseInformation::with(['pdl'])
                ->where('drug_related', true)
                ->whereBetween('date_committed', [$startDate, $endDate])
                ->get();

            // Get discharge causes for drug-related cases
            $bonded = $drugCases->where('case_status', 'BONDED')->count();
            $servedSentence = $drugCases->where('case_status', 'SERVED SENTENCE')->count();
            $dismissed = $drugCases->whereIn('case_status', ['PROV. DISMISSED', 'DISMISSED'])->count();
            $transferred = $drugCases->where('case_status', 'TRANSFER TO OTHER FACILITY')->count();
            $dapecol = $drugCases->where('case_status', 'DAPECOL')->count();
            $probation = $drugCases->where('case_status', 'PROBATION')->count();
            $deceased = $drugCases->where('case_status', 'DECEASED')->count();
            $acquitted = $drugCases->where('case_status', 'ACQUITTED')->count();
            $totalDischargedDrug = $bonded + $servedSentence + $dismissed + $transferred + $dapecol + $probation + $deceased + $acquitted;

            // Calculate percentage of drug offenders from total population
            $totalPopulation = Pdl::where('created_at', '<=', $endDate)->count();
            $drugOffendersPercentage = $totalPopulation > 0 ? round(($drugCases->count() / $totalPopulation) * 100, 2) : 0;

            $monthlyData[] = [
                'month' => $monthName,
                'male_detainees' => $maleDetainees,
                'female_detainees' => $femaleDetainees,
                'total_detainees' => $totalDetainees,
                'total_committed' => $committed,
                'total_discharged' => $discharged,
                'bonded' => $bonded,
                'served_sentence' => $servedSentence,
                'dismissed' => $dismissed,
                'transferred' => $transferred,
                'dapecol' => $dapecol,
                'probation' => $probation,
                'deceased' => $deceased,
                'acquitted' => $acquitted,
                'total_discharged_drug' => $totalDischargedDrug,
                'drug_offenders_percentage' => $drugOffendersPercentage,
                'total_drug_cases' => $drugCases->count()
            ];

            // Add to yearly totals
            $yearlyTotals['male_detainees'] += $maleDetainees;
            $yearlyTotals['female_detainees'] += $femaleDetainees;
            $yearlyTotals['total_detainees'] += $totalDetainees;
            $yearlyTotals['total_committed'] += $committed;
            $yearlyTotals['total_discharged'] += $discharged;
            $yearlyTotals['bonded'] += $bonded;
            $yearlyTotals['served_sentence'] += $servedSentence;
            $yearlyTotals['dismissed'] += $dismissed;
            $yearlyTotals['transferred'] += $transferred;
            $yearlyTotals['dapecol'] += $dapecol;
            $yearlyTotals['probation'] += $probation;
            $yearlyTotals['deceased'] += $deceased;
            $yearlyTotals['acquitted'] += $acquitted;
            $yearlyTotals['total_discharged_drug'] += $totalDischargedDrug;
            $yearlyTotals['total_drug_cases'] += $drugCases->count();
        }

        // Add total row
        $monthlyData[] = [
            'month' => 'TOTAL',
            'male_detainees' => $yearlyTotals['male_detainees'],
            'female_detainees' => $yearlyTotals['female_detainees'],
            'total_detainees' => $yearlyTotals['total_detainees'],
            'total_committed' => $yearlyTotals['total_committed'],
            'total_discharged' => $yearlyTotals['total_discharged'],
            'bonded' => $yearlyTotals['bonded'],
            'served_sentence' => $yearlyTotals['served_sentence'],
            'dismissed' => $yearlyTotals['dismissed'],
            'transferred' => $yearlyTotals['transferred'],
            'dapecol' => $yearlyTotals['dapecol'],
            'probation' => $yearlyTotals['probation'],
            'deceased' => $yearlyTotals['deceased'],
            'acquitted' => $yearlyTotals['acquitted'],
            'total_discharged_drug' => $yearlyTotals['total_discharged_drug'],
            'drug_offenders_percentage' => $yearlyTotals['total_detainees'] > 0 ? round(($yearlyTotals['total_drug_cases'] / $yearlyTotals['total_detainees']) * 100, 2) : 0,
            'total_drug_cases' => $yearlyTotals['total_drug_cases']
        ];

        $data = [
            'title' => 'SOUTH COTABATO REHABILITATION AND DETENTION CENTER',
            'subtitle' => 'POPULATION OF DRUG-RELATED CASES MONTHLY REPORT',
            'year' => $year,
            'monthly_data' => $monthlyData,
            'yearly_totals' => $yearlyTotals,
            'facilities' => [
                'CBRP' => 'COMMUNITY BASE REHABILITATION CENTER',
                'SDATRC' => 'SOCCSARGEN DRUG ABUSE TREATMENT AND REHABILITATION CENTER',
                'BSRC' => 'BALAY SILANGAN REFORMATORY CENTER'
            ]
        ];


        return Inertia::render('admin/report/drug-related-cases-monthly', [
            'reportData' => $data,
            'filters' => [
                'year' => $year
            ]
        ]);
    }

    public function exportDrugCasesMonthlyPdf(Request $request)
    {

        $request->validate([
            'year' => 'required|integer|min:2020|max:' . (date('Y') + 1)
        ]);

        $year = $request->year;


        $monthlyData = [];
        $yearlyTotals = [
            'male_detainees' => 0,
            'female_detainees' => 0,
            'total_detainees' => 0,
            'total_committed' => 0,
            'total_discharged' => 0,
            'bonded' => 0,
            'served_sentence' => 0,
            'dismissed' => 0,
            'transferred' => 0,
            'dapecol' => 0,
            'probation' => 0,
            'deceased' => 0,
            'acquitted' => 0,
            'total_discharged_drug' => 0,
            'total_drug_cases' => 0
        ];

        $monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];

        foreach ($monthNames as $index => $monthName) {
            $monthNumber = $index + 1;
            $startDate = Carbon::create($year, $monthNumber, 1)->startOfMonth();
            $endDate = Carbon::create($year, $monthNumber, 1)->endOfMonth();

            // Get detainees count for the month
            $detainees = Pdl::whereBetween('created_at', [$startDate, $endDate])->get();
            $maleDetainees = $detainees->where('gender', 'Male')->count();
            $femaleDetainees = $detainees->where('gender', 'Female')->count();
            $totalDetainees = $maleDetainees + $femaleDetainees;

            // Get committed count (PDLs created in this month)
            $committed = Pdl::whereBetween('created_at', [$startDate, $endDate])->count();

            // Get discharged count (PDLs with discharge status)
            $discharged = Pdl::whereBetween('updated_at', [$startDate, $endDate])
                ->whereHas('cases', function ($query) {
                    $query->whereIn('case_status', ['SERVED SENTENCE', 'DISMISSED', 'TRANSFERRED', 'DECEASED', 'ACQUITTED']);
                })
                ->count();

            // Get drug-related cases for the month
            $drugCases = CaseInformation::with(['pdl'])
                ->where('drug_related', true)
                ->whereBetween('date_committed', [$startDate, $endDate])
                ->get();

            // Get discharge causes for drug-related cases
            $bonded = $drugCases->where('case_status', 'BONDED')->count();
            $servedSentence = $drugCases->where('case_status', 'SERVED SENTENCE')->count();
            $dismissed = $drugCases->whereIn('case_status', ['PROV. DISMISSED', 'DISMISSED'])->count();
            $transferred = $drugCases->where('case_status', 'TRANSFER TO OTHER FACILITY')->count();
            $dapecol = $drugCases->where('case_status', 'DAPECOL')->count();
            $probation = $drugCases->where('case_status', 'PROBATION')->count();
            $deceased = $drugCases->where('case_status', 'DECEASED')->count();
            $acquitted = $drugCases->where('case_status', 'ACQUITTED')->count();
            $totalDischargedDrug = $bonded + $servedSentence + $dismissed + $transferred + $dapecol + $probation + $deceased + $acquitted;

            // Calculate percentage of drug offenders from total population
            $totalPopulation = Pdl::where('created_at', '<=', $endDate)->count();
            $drugOffendersPercentage = $totalPopulation > 0 ? round(($drugCases->count() / $totalPopulation) * 100, 2) : 0;

            $monthlyData[] = [
                'month' => $monthName,
                'male_detainees' => $maleDetainees,
                'female_detainees' => $femaleDetainees,
                'total_detainees' => $totalDetainees,
                'total_committed' => $committed,
                'total_discharged' => $discharged,
                'bonded' => $bonded,
                'served_sentence' => $servedSentence,
                'dismissed' => $dismissed,
                'transferred' => $transferred,
                'dapecol' => $dapecol,
                'probation' => $probation,
                'deceased' => $deceased,
                'acquitted' => $acquitted,
                'total_discharged_drug' => $totalDischargedDrug,
                'drug_offenders_percentage' => $drugOffendersPercentage,
                'total_drug_cases' => $drugCases->count()
            ];

            // Add to yearly totals
            $yearlyTotals['male_detainees'] += $maleDetainees;
            $yearlyTotals['female_detainees'] += $femaleDetainees;
            $yearlyTotals['total_detainees'] += $totalDetainees;
            $yearlyTotals['total_committed'] += $committed;
            $yearlyTotals['total_discharged'] += $discharged;
            $yearlyTotals['bonded'] += $bonded;
            $yearlyTotals['served_sentence'] += $servedSentence;
            $yearlyTotals['dismissed'] += $dismissed;
            $yearlyTotals['transferred'] += $transferred;
            $yearlyTotals['dapecol'] += $dapecol;
            $yearlyTotals['probation'] += $probation;
            $yearlyTotals['deceased'] += $deceased;
            $yearlyTotals['acquitted'] += $acquitted;
            $yearlyTotals['total_discharged_drug'] += $totalDischargedDrug;
            $yearlyTotals['total_drug_cases'] += $drugCases->count();
        }

        // Add total row
        $monthlyData[] = [
            'month' => 'TOTAL',
            'male_detainees' => $yearlyTotals['male_detainees'],
            'female_detainees' => $yearlyTotals['female_detainees'],
            'total_detainees' => $yearlyTotals['total_detainees'],
            'total_committed' => $yearlyTotals['total_committed'],
            'total_discharged' => $yearlyTotals['total_discharged'],
            'bonded' => $yearlyTotals['bonded'],
            'served_sentence' => $yearlyTotals['served_sentence'],
            'dismissed' => $yearlyTotals['dismissed'],
            'transferred' => $yearlyTotals['transferred'],
            'dapecol' => $yearlyTotals['dapecol'],
            'probation' => $yearlyTotals['probation'],
            'deceased' => $yearlyTotals['deceased'],
            'acquitted' => $yearlyTotals['acquitted'],
            'total_discharged_drug' => $yearlyTotals['total_discharged_drug'],
            'drug_offenders_percentage' => $yearlyTotals['total_detainees'] > 0 ? round(($yearlyTotals['total_drug_cases'] / $yearlyTotals['total_detainees']) * 100, 2) : 0,
            'total_drug_cases' => $yearlyTotals['total_drug_cases']
        ];

        $data = [
            'title' => 'SOUTH COTABATO REHABILITATION AND DETENTION CENTER',
            'subtitle' => 'POPULATION OF DRUG-RELATED CASES MONTHLY REPORT',
            'year' => $year,
            'monthly_data' => $monthlyData,
            'yearly_totals' => $yearlyTotals,
            'facilities' => [
                'CBRP' => 'COMMUNITY BASE REHABILITATION CENTER',
                'SDATRC' => 'SOCCSARGEN DRUG ABUSE TREATMENT AND REHABILITATION CENTER',
                'BSRC' => 'BALAY SILANGAN REFORMATORY CENTER'
            ]
        ];

        $fileName = 'south_cotabato_drug_cases_monthly_' . $year . '.pdf';

        $html = view('reports.drug-cases-monthly', [
            'data' => $data,
            'year' => $year
        ])->render();

        $dompdf = new \Dompdf\Dompdf();
        $dompdf->setPaper('A4', 'landscape');
        $dompdf->loadHtml($html);
        $dompdf->render();

        return response($dompdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ]);
    }

    public function inmatesStatusReport(Request $request)
    {
        return Inertia::render('admin/report/inmates-status');
    }

    public function generateInmatesStatus(Request $request)
    {
        $request->validate([
            'as_of_date' => 'required|date',
            'export_pdf' => 'boolean'
        ]);

        $asOfDate = Carbon::parse($request->as_of_date);

        // Get all PDLs as of the specified date
        $pdls = Pdl::where('created_at', '<=', $asOfDate->endOfDay())
            ->whereNull('deleted_at')
            ->with(['cases'])
            ->get();

        // Group by court jurisdiction (we'll need to add court information to cases)
        $courtData = [];
        $totalMale = 0;
        $totalFemale = 0;
        $totalCICL = 0;

        // For now, we'll group by case status and create mock court data
        // In a real implementation, you'd have court information in your database
        $courtCategories = [
            'Regional Trial Court' => ['RTC Branch 1', 'RTC Branch 2', 'RTC Branch 3'],
            'Municipal Trial Court' => ['MTC Koronadal', 'MTC General Santos'],
            'Family Court' => ['Family Court Branch 1']
        ];

        foreach ($courtCategories as $courtType => $branches) {
            $courtData[$courtType] = [
                'stations' => []
            ];

            foreach ($branches as $branch) {
                // Mock data - in real implementation, you'd query actual court assignments
                $maleCount = $pdls->where('gender', 'Male')->count() / count($branches) / count($courtCategories);
                $femaleCount = $pdls->where('gender', 'Female')->count() / count($branches) / count($courtCategories);
                $ciclCount = 0; // CICL would be determined by age < 18

                $total = $maleCount + $femaleCount + $ciclCount;

                $courtData[$courtType]['stations'][] = [
                    'station' => 'Koronadal City',
                    'branch' => $branch,
                    'male' => round($maleCount),
                    'female' => round($femaleCount),
                    'cicl' => $ciclCount,
                    'total' => round($total)
                ];

                $totalMale += round($maleCount);
                $totalFemale += round($femaleCount);
                $totalCICL += $ciclCount;
            }
        }

        $data = [
            'title' => 'STATUS REPORT AS TO THE TOTAL NUMBER OF DETAINEES',
            'facility_name' => 'South Cotabato Rehabilitation and Detention Center',
            'location' => 'City of Koronadal',
            'contact' => [
                'tel' => '(083) 228-2445',
                'email' => 'socot.scrdcjail@gmail.com'
            ],
            'as_of_date' => $asOfDate->format('F d, Y'),
            'court_data' => $courtData,
            'totals' => [
                'male' => $totalMale,
                'female' => $totalFemale,
                'cicl' => $totalCICL,
                'total' => $totalMale + $totalFemale + $totalCICL
            ]
        ];



        return Inertia::render('admin/report/inmates-status', [
            'reportData' => $data,
            'filters' => [
                'as_of_date' => $request->as_of_date
            ]
        ]);
    }


    public function exportInmatesStatusPdf(Request $request)
    {
        $request->validate([
            'as_of_date' => 'required|date',
            'export_pdf' => 'boolean'
        ]);

        $asOfDate = Carbon::parse($request->as_of_date);

        // Get all PDLs as of the specified date
        $pdls = Pdl::where('created_at', '<=', $asOfDate->endOfDay())
            ->whereNull('deleted_at')
            ->with(['cases'])
            ->get();

        // Group by court jurisdiction (we'll need to add court information to cases)
        $courtData = [];
        $totalMale = 0;
        $totalFemale = 0;
        $totalCICL = 0;

        // For now, we'll group by case status and create mock court data
        // In a real implementation, you'd have court information in your database
        $courtCategories = [
            'Regional Trial Court' => ['RTC Branch 1', 'RTC Branch 2', 'RTC Branch 3'],
            'Municipal Trial Court' => ['MTC Koronadal', 'MTC General Santos'],
            'Family Court' => ['Family Court Branch 1']
        ];

        foreach ($courtCategories as $courtType => $branches) {
            $courtData[$courtType] = [
                'stations' => []
            ];

            foreach ($branches as $branch) {
                // Mock data - in real implementation, you'd query actual court assignments
                $maleCount = $pdls->where('gender', 'Male')->count() / count($branches) / count($courtCategories);
                $femaleCount = $pdls->where('gender', 'Female')->count() / count($branches) / count($courtCategories);
                $ciclCount = 0; // CICL would be determined by age < 18

                $total = $maleCount + $femaleCount + $ciclCount;

                $courtData[$courtType]['stations'][] = [
                    'station' => 'Koronadal City',
                    'branch' => $branch,
                    'male' => round($maleCount),
                    'female' => round($femaleCount),
                    'cicl' => $ciclCount,
                    'total' => round($total)
                ];

                $totalMale += round($maleCount);
                $totalFemale += round($femaleCount);
                $totalCICL += $ciclCount;
            }
        }

        $data = [
            'title' => 'STATUS REPORT AS TO THE TOTAL NUMBER OF DETAINEES',
            'facility_name' => 'South Cotabato Rehabilitation and Detention Center',
            'location' => 'City of Koronadal',
            'contact' => [
                'tel' => '(083) 228-2445',
                'email' => 'socot.scrdcjail@gmail.com'
            ],
            'as_of_date' => $asOfDate->format('F d, Y'),
            'court_data' => $courtData,
            'totals' => [
                'male' => $totalMale,
                'female' => $totalFemale,
                'cicl' => $totalCICL,
                'total' => $totalMale + $totalFemale + $totalCICL
            ]
        ];
        $fileName = 'inmates_status_report_' . date('Y-m-d') . '.pdf';

        $html = view('reports.inmates-status', [
            'data' => $data
        ])->render();

        $dompdf = new \Dompdf\Dompdf();
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->loadHtml($html);
        $dompdf->render();

        return response($dompdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ]);
    }

    public function inmatesStatusDailyReport(Request $request)
    {
        return Inertia::render('admin/report/inmates-status-daily');
    }

    public function generateInmatesStatusDaily(Request $request)
    {
        $request->validate([
            'report_date' => 'required|date',
            'export_pdf' => 'boolean'
        ]);

        $reportDate = Carbon::parse($request->report_date);
        $startOfDay = $reportDate->startOfDay();
        $endOfDay = $reportDate->endOfDay();

        // Get escorted PDL for court hearings
        $escortedPdls = Pdl::whereBetween('updated_at', [$startOfDay, $endOfDay])
            ->whereHas('cases', function($query) {
                $query->where('case_status', 'On Trial');
            })
            ->get();

        $escortedRtcCount = $escortedPdls->count();

        // Get released PDL from courts
        $releasedPdls = Pdl::whereBetween('updated_at', [$startOfDay, $endOfDay])
            ->whereHas('cases', function($query) {
                $query->whereIn('case_status', ['SERVED SENTENCE', 'DISMISSED', 'ACQUITTED']);
            })
            ->get();

        $releasedRtcCount = $releasedPdls->count();

        // Get committed PDL from courts/police stations
        $committedPdls = Pdl::whereBetween('created_at', [$startOfDay, $endOfDay])
            ->get();

        $committedRtcCount = $committedPdls->count();

        // Mock visitor data (in real implementation, you'd have a visitors table)
        $visitorsPadala = rand(5, 25); // Mock data
        $visitorsTransaction = rand(10, 40); // Mock data
        $totalVisitors = $visitorsPadala + $visitorsTransaction;

        // Mock greyhound operation data
        $greyhoundOperations = [
            'cell_operated' => 'NONE',
            'number_of_times' => 0,
            'conducted_by' => ''
        ];

        // Get total PDL confined at SCRDC
        $totalPdls = Pdl::whereNull('deleted_at')->get();
        $femalePdls = $totalPdls->where('gender', 'Female')->count();
        $malePdls = $totalPdls->where('gender', 'Male')->count();
        $totalConfinedPdls = $femalePdls + $malePdls;

        // Mock PDL confined at hospitals
        $hospitalPdls = [
            'female' => rand(0, 3),
            'male' => rand(0, 5),
            'house_arrest' => rand(0, 2)
        ];
        $totalHospitalPdls = $hospitalPdls['female'] + $hospitalPdls['male'] + $hospitalPdls['house_arrest'];

        $data = [
            'title' => 'Daily Status Report',
            'facility_name' => 'South Cotabato Rehabilitation and Detention Center',
            'location' => 'City of Koronadal',
            'recipient' => [
                'name' => 'JUAN R. LANZADERAS, JR., MPA',
                'position' => 'Provincial Warden'
            ],
            'report_date' => $reportDate->format('F d, Y'),
            'escorted_pdls' => [
                'rtc_count' => $escortedRtcCount,
                'total' => $escortedRtcCount
            ],
            'released_pdls' => [
                'rtc_count' => $releasedRtcCount,
                'total' => $releasedRtcCount
            ],
            'committed_pdls' => [
                'rtc_count' => $committedRtcCount,
                'total' => $committedRtcCount
            ],
            'visitors' => [
                'padala' => $visitorsPadala,
                'transaction' => $visitorsTransaction,
                'total' => $totalVisitors
            ],
            'greyhound_operation' => $greyhoundOperations,
            'confined_pdls' => [
                'female' => $femalePdls,
                'male' => $malePdls,
                'total' => $totalConfinedPdls
            ],
            'hospital_pdls' => [
                'female' => $hospitalPdls['female'],
                'male' => $hospitalPdls['male'],
                'house_arrest' => $hospitalPdls['house_arrest'],
                'total' => $totalHospitalPdls
            ],
            'remarks' => 'No untoward incident happened within 24 hours of the operation.',
            'submitted_by' => [
                'name' => 'PG11 FRANCISCO A. BALANSAG',
                'position' => 'Chief of Operations'
            ]
        ];

        if ($request->export_pdf) {
            return $this->exportInmatesStatusDailyPdf($request);
        }

        return Inertia::render('admin/report/inmates-status-daily', [
            'reportData' => $data,
            'filters' => [
                'report_date' => $request->report_date
            ]
        ]);
    }

    public function exportInmatesStatusDailyPdf(Request $request)
    {
        $request->validate([
            'report_date' => 'required|date'
        ]);

        $reportDate = Carbon::parse($request->report_date);
        $startOfDay = $reportDate->startOfDay();
        $endOfDay = $reportDate->endOfDay();

        // Get escorted PDL for court hearings
        $escortedPdls = Pdl::whereBetween('updated_at', [$startOfDay, $endOfDay])
            ->whereHas('cases', function($query) {
                $query->where('case_status', 'On Trial');
            })
            ->get();

        $escortedRtcCount = $escortedPdls->count();

        // Get released PDL from courts
        $releasedPdls = Pdl::whereBetween('updated_at', [$startOfDay, $endOfDay])
            ->whereHas('cases', function($query) {
                $query->whereIn('case_status', ['SERVED SENTENCE', 'DISMISSED', 'ACQUITTED']);
            })
            ->get();

        $releasedRtcCount = $releasedPdls->count();

        // Get committed PDL from courts/police stations
        $committedPdls = Pdl::whereBetween('created_at', [$startOfDay, $endOfDay])
            ->get();

        $committedRtcCount = $committedPdls->count();

        // Mock visitor data
        $visitorsPadala = rand(5, 25);
        $visitorsTransaction = rand(10, 40);
        $totalVisitors = $visitorsPadala + $visitorsTransaction;

        // Mock greyhound operation data
        $greyhoundOperations = [
            'cell_operated' => 'NONE',
            'number_of_times' => 0,
            'conducted_by' => ''
        ];

        // Get total PDL confined at SCRDC
        $totalPdls = Pdl::whereNull('deleted_at')->get();
        $femalePdls = $totalPdls->where('gender', 'Female')->count();
        $malePdls = $totalPdls->where('gender', 'Male')->count();
        $totalConfinedPdls = $femalePdls + $malePdls;

        // Mock PDL confined at hospitals
        $hospitalPdls = [
            'female' => rand(0, 3),
            'male' => rand(0, 5),
            'house_arrest' => rand(0, 2)
        ];
        $totalHospitalPdls = $hospitalPdls['female'] + $hospitalPdls['male'] + $hospitalPdls['house_arrest'];

        $data = [
            'title' => 'Daily Status Report',
            'facility_name' => 'South Cotabato Rehabilitation and Detention Center',
            'location' => 'City of Koronadal',
            'recipient' => [
                'name' => 'JUAN R. LANZADERAS, JR., MPA',
                'position' => 'Provincial Warden'
            ],
            'report_date' => $reportDate->format('F d, Y'),
            'escorted_pdls' => [
                'rtc_count' => $escortedRtcCount,
                'total' => $escortedRtcCount
            ],
            'released_pdls' => [
                'rtc_count' => $releasedRtcCount,
                'total' => $releasedRtcCount
            ],
            'committed_pdls' => [
                'rtc_count' => $committedRtcCount,
                'total' => $committedRtcCount
            ],
            'visitors' => [
                'padala' => $visitorsPadala,
                'transaction' => $visitorsTransaction,
                'total' => $totalVisitors
            ],
            'greyhound_operation' => $greyhoundOperations,
            'confined_pdls' => [
                'female' => $femalePdls,
                'male' => $malePdls,
                'total' => $totalConfinedPdls
            ],
            'hospital_pdls' => [
                'female' => $hospitalPdls['female'],
                'male' => $hospitalPdls['male'],
                'house_arrest' => $hospitalPdls['house_arrest'],
                'total' => $totalHospitalPdls
            ],
            'remarks' => 'No untoward incident happened within 24 hours of the operation.',
            'submitted_by' => [
                'name' => 'PG11 FRANCISCO A. BALANSAG',
                'position' => 'Chief of Operations'
            ]
        ];

        $fileName = 'inmates_status_daily_report_' . $reportDate->format('Y-m-d') . '.pdf';

        $html = view('reports.inmates-status-daily', [
            'data' => $data
        ])->render();

        $dompdf = new \Dompdf\Dompdf();
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->loadHtml($html);
        $dompdf->render();

        return response($dompdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ]);
    }

    public function drugClearingCertificate(Request $request)
    {
        // Get all PDLs with drug-related cases
        $pdls = Pdl::with(['cases'])
            ->whereHas('cases', function($query) {
                $query->where('drug_related', true);
            })
            ->get();

        return Inertia::render('admin/report/drug-clearing-certificate', [
            'pdls' => $pdls
        ]);
    }

    public function generateDrugClearingCertificate(Request $request)
    {
        $request->validate([
            'pdl_id' => 'required|exists:pdls,id',
            'export_pdf' => 'boolean'
        ]);

        $pdls = Pdl::with(['cases', 'physicalCharacteristics', 'medicalRecords'])
            ->whereIn('id', $request->pdl_ids)
            ->get();

        $certificates = [];

        foreach ($pdls as $pdl) {
            // Calculate detention period
            $commitmentDate = $pdl->created_at;
            $currentDate = now();
            $detentionPeriod = $commitmentDate->diff($currentDate);

            // Get drug-related case information
            $drugRelatedCase = $pdl->cases->where('drug_related', true)->first();

            // Get court information
            $courtInfo = $drugRelatedCase ? [
                'court' => 'Regional Trial Court Branch 26',
                'location' => 'Surallah, South Cotabato',
                'case_number' => $drugRelatedCase->case_number ?? 'N/A',
                'charge' => $drugRelatedCase->crime_committed ?? 'Drug-Related Offense'
            ] : [
                'court' => 'Regional Trial Court Branch 26',
                'location' => 'Surallah, South Cotabato',
                'case_number' => 'N/A',
                'charge' => 'Drug-Related Offense'
            ];

            $certificates[] = [
                'pdl_id' => $pdl->id,
                'title' => 'CERTIFICATE OF DRUG-CLEARING STATUS',
                'facility_name' => 'Province of South Cotabato',
                'office' => 'OFFICE OF THE PROVINCIAL GOVERNOR',
                'unit' => 'Provincial Jail Management Unit',
                'location' => 'Koronadal City',
                'contact' => [
                    'tel' => '(083) 228-2445',
                    'email' => 'socot.scrdcjail@gmail.com'
                ],
                'pdl' => [
                    'name' => $pdl->first_name . ' ' . $pdl->last_name,
                    'middle_name' => $pdl->middle_name,
                    'full_name' => trim($pdl->first_name . ' ' . ($pdl->middle_name ? $pdl->middle_name . ' ' : '') . $pdl->last_name),
                    'commitment_date' => $commitmentDate->format('F d, Y'),
                    'detention_period' => [
                        'years' => $detentionPeriod->y,
                        'months' => $detentionPeriod->m,
                        'days' => $detentionPeriod->d
                    ]
                ],
                'court_info' => $courtInfo,
                'issue_date' => $currentDate->format('F d, Y'),
                'issue_location' => 'City of Koronadal',
                'signed_by' => [
                    'name' => 'JUAN R. LANZADERAS, JR., MPA',
                    'position' => 'Provincial Warden'
                ]
            ];
        }

        if ($request->export_pdf) {
            return $this->exportDrugClearingCertificatePdf($request);
        }

        return Inertia::render('admin/report/drug-clearing-certificate', [
            'certificates' => $certificates,
            'filters' => [
                'pdl_ids' => $request->pdl_ids
            ]
        ]);
    }

    public function exportDrugClearingCertificatePdf(Request $request)
    {
        $request->validate([
            'pdl_ids' => 'required|array',
            'pdl_ids.*' => 'exists:pdl,id'
        ]);

        $pdls = Pdl::with(['cases', 'physicalCharacteristics', 'medicalRecords'])
            ->whereIn('id', $request->pdl_ids)
            ->get();

        if ($pdls->count() === 1) {
            // Single certificate
            $pdl = $pdls->first();
            $commitmentDate = $pdl->created_at;
            $currentDate = now();
            $detentionPeriod = $commitmentDate->diff($currentDate);

            $drugRelatedCase = $pdl->cases->where('drug_related', true)->first();

            $courtInfo = $drugRelatedCase ? [
                'court' => 'Regional Trial Court Branch 26',
                'location' => 'Surallah, South Cotabato',
                'case_number' => $drugRelatedCase->case_number ?? 'N/A',
                'charge' => $drugRelatedCase->crime_committed ?? 'Drug-Related Offense'
            ] : [
                'court' => 'Regional Trial Court Branch 26',
                'location' => 'Surallah, South Cotabato',
                'case_number' => 'N/A',
                'charge' => 'Drug-Related Offense'
            ];

            $data = [
                'title' => 'CERTIFICATE OF DRUG-CLEARING STATUS',
                'facility_name' => 'Province of South Cotabato',
                'office' => 'OFFICE OF THE PROVINCIAL GOVERNOR',
                'unit' => 'Provincial Jail Management Unit',
                'location' => 'Koronadal City',
                'contact' => [
                    'tel' => '(083) 228-2445',
                    'email' => 'socot.scrdcjail@gmail.com'
                ],
                'pdl' => [
                    'name' => $pdl->first_name . ' ' . $pdl->last_name,
                    'middle_name' => $pdl->middle_name,
                    'full_name' => trim($pdl->first_name . ' ' . ($pdl->middle_name ? $pdl->middle_name . ' ' : '') . $pdl->last_name),
                    'commitment_date' => $commitmentDate->format('F d, Y'),
                    'detention_period' => [
                        'years' => $detentionPeriod->y,
                        'months' => $detentionPeriod->m,
                        'days' => $detentionPeriod->d
                    ]
                ],
                'court_info' => $courtInfo,
                'issue_date' => $currentDate->format('F d, Y'),
                'issue_location' => 'City of Koronadal',
                'signed_by' => [
                    'name' => 'JUAN R. LANZADERAS, JR., MPA',
                    'position' => 'Provincial Warden'
                ]
            ];

            $fileName = 'drug_clearing_certificate_' . str_replace(' ', '_', $data['pdl']['full_name']) . '_' . date('Y-m-d') . '.pdf';

            $html = view('reports.drug-clearing-certificate', [
                'data' => $data
            ])->render();

            $dompdf = new \Dompdf\Dompdf();
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->loadHtml($html);
            $dompdf->render();

            return response($dompdf->output(), 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
            ]);
        } else {
            // Multiple certificates - create a ZIP file
            $zip = new \ZipArchive();
            $zipFileName = 'drug_clearing_certificates_' . date('Y-m-d') . '.zip';
            $zipPath = storage_path('app/temp/' . $zipFileName);

            // Ensure temp directory exists
            if (!file_exists(storage_path('app/temp'))) {
                mkdir(storage_path('app/temp'), 0755, true);
            }

            if ($zip->open($zipPath, \ZipArchive::CREATE) === TRUE) {
                foreach ($pdls as $pdl) {
                    $commitmentDate = $pdl->created_at;
                    $currentDate = now();
                    $detentionPeriod = $commitmentDate->diff($currentDate);

                    $drugRelatedCase = $pdl->cases->where('drug_related', true)->first();

                    $courtInfo = $drugRelatedCase ? [
                        'court' => 'Regional Trial Court Branch 26',
                        'location' => 'Surallah, South Cotabato',
                        'case_number' => $drugRelatedCase->case_number ?? 'N/A',
                        'charge' => $drugRelatedCase->crime_committed ?? 'Drug-Related Offense'
                    ] : [
                        'court' => 'Regional Trial Court Branch 26',
                        'location' => 'Surallah, South Cotabato',
                        'case_number' => 'N/A',
                        'charge' => 'Drug-Related Offense'
                    ];

                    $data = [
                        'title' => 'CERTIFICATE OF DRUG-CLEARING STATUS',
                        'facility_name' => 'Province of South Cotabato',
                        'office' => 'OFFICE OF THE PROVINCIAL GOVERNOR',
                        'unit' => 'Provincial Jail Management Unit',
                        'location' => 'Koronadal City',
                        'contact' => [
                            'tel' => '(083) 228-2445',
                            'email' => 'socot.scrdcjail@gmail.com'
                        ],
                        'pdl' => [
                            'name' => $pdl->first_name . ' ' . $pdl->last_name,
                            'middle_name' => $pdl->middle_name,
                            'full_name' => trim($pdl->first_name . ' ' . ($pdl->middle_name ? $pdl->middle_name . ' ' : '') . $pdl->last_name),
                            'commitment_date' => $commitmentDate->format('F d, Y'),
                            'detention_period' => [
                                'years' => $detentionPeriod->y,
                                'months' => $detentionPeriod->m,
                                'days' => $detentionPeriod->d
                            ]
                        ],
                        'court_info' => $courtInfo,
                        'issue_date' => $currentDate->format('F d, Y'),
                        'issue_location' => 'City of Koronadal',
                        'signed_by' => [
                            'name' => 'JUAN R. LANZADERAS, JR., MPA',
                            'position' => 'Provincial Warden'
                        ]
                    ];

                    $html = view('reports.drug-clearing-certificate', [
                        'data' => $data
                    ])->render();

                    $dompdf = new \Dompdf\Dompdf();
                    $dompdf->setPaper('A4', 'portrait');
                    $dompdf->loadHtml($html);
                    $dompdf->render();

                    $pdfContent = $dompdf->output();
                    $fileName = 'drug_clearing_certificate_' . str_replace(' ', '_', $data['pdl']['full_name']) . '_' . date('Y-m-d') . '.pdf';

                    $zip->addFromString($fileName, $pdfContent);
                }

                $zip->close();

                return response()->download($zipPath, $zipFileName)->deleteFileAfterSend(true);
            }
        }
    }

    public function noRecordsCertificate(Request $request)
    {
        return Inertia::render('admin/report/no-records-certificate');
    }

    public function generateNoRecordsCertificate(Request $request)
    {
        $request->validate([
            'person_names' => 'required|array|min:1',
            'person_names.*' => 'required|string|max:255',
            'requested_by' => 'required|string|max:255',
            'requesting_agency' => 'required|string|max:255',
            'export_pdf' => 'boolean'
        ]);

        $currentDate = now();

        $data = [
            'title' => 'CERTIFICATE OF NO RECORDS',
            'facility_name' => 'Province of South Cotabato',
            'office' => 'OFFICE OF THE PROVINCIAL GOVERNOR',
            'unit' => 'Provincial Jail Management Unit',
            'location' => 'Koronadal City',
            'contact' => [
                'tel' => '(083) 228-2445',
                'email' => 'socot.scrdcjail@gmail.com'
            ],
            'person_names' => $request->person_names,
            'requested_by' => $request->requested_by,
            'requesting_agency' => $request->requesting_agency,
            'issue_date' => $currentDate->format('F d, Y'),
            'issue_location' => 'City of Koronadal',
            'signed_by' => [
                'name' => 'JUAN R. LANZADERAS, JR., MPA',
                'position' => 'Provincial Warden'
            ]
        ];

        if ($request->export_pdf) {
            return $this->exportNoRecordsCertificatePdf($request);
        }

        return Inertia::render('admin/report/no-records-certificate', [
            'certificateData' => $data,
            'filters' => [
                'person_names' => $request->person_names,
                'requested_by' => $request->requested_by,
                'requesting_agency' => $request->requesting_agency
            ]
        ]);
    }

    public function exportNoRecordsCertificatePdf(Request $request)
    {
        $request->validate([
            'person_names' => 'required|array|min:1',
            'person_names.*' => 'required|string|max:255',
            'requested_by' => 'required|string|max:255',
            'requesting_agency' => 'required|string|max:255'
        ]);

        $currentDate = now();

        $data = [
            'title' => 'CERTIFICATE OF NO RECORDS',
            'facility_name' => 'Province of South Cotabato',
            'office' => 'OFFICE OF THE PROVINCIAL GOVERNOR',
            'unit' => 'Provincial Jail Management Unit',
            'location' => 'Koronadal City',
            'contact' => [
                'tel' => '(083) 228-2445',
                'email' => 'socot.scrdcjail@gmail.com'
            ],
            'person_names' => $request->person_names,
            'requested_by' => $request->requested_by,
            'requesting_agency' => $request->requesting_agency,
            'issue_date' => $currentDate->format('F d, Y'),
            'issue_location' => 'City of Koronadal',
            'signed_by' => [
                'name' => 'JUAN R. LANZADERAS, JR., MPA',
                'position' => 'Provincial Warden'
            ]
        ];

        $fileName = 'certificate_of_no_records_' . date('Y-m-d') . '.pdf';

        $html = view('reports.no-records-certificate', [
            'data' => $data
        ])->render();

        $dompdf = new \Dompdf\Dompdf();
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->loadHtml($html);
        $dompdf->render();

        return response($dompdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ]);
    }
}
