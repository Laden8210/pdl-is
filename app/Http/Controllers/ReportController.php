<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Pdl;
use App\Models\CaseInformation;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Verifications;
use Illuminate\Support\Facades\Validator;
use App\Models\Court;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\CourtOrder;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $pdls = Pdl::with(['cases', 'personnel', 'courtOrders'])
            ->when($startDate && $endDate, function ($query) use ($startDate, $endDate) {
                return $query->whereHas('cases', function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('date_committed', [
                        Carbon::parse($startDate)->startOfDay(),
                        Carbon::parse($endDate)->endOfDay()
                    ]);
                });
            })
            ->whereHas('verifications', function ($query) {
                $query->where('status', 'approved');
            })
            ->where('archive_status', '=', null)
            ->orderBy('lname')
            ->get()
            ->flatMap(function ($pdl) {
                $cases = $pdl->cases;

                // If no cases, return at least one record for the PDL
                if ($cases->isEmpty()) {
                    return $this->formatPdlRecord($pdl, null);
                }

                // Return one record per case
                return $cases->map(function ($case) use ($pdl) {
                    return $this->formatPdlRecord($pdl, $case);
                });
            });

        return Inertia::render('admin/report/list-of-pdl-reports', [
            'pdls' => $pdls,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate
            ]
        ]);
    }


    public function export(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date'
        ]);

        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $pdls = Pdl::with(['cases', 'personnel', 'courtOrders'])
            ->when($startDate && $endDate, function ($query) use ($startDate, $endDate) {
                return $query->whereHas('cases', function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('date_committed', [
                        Carbon::parse($startDate)->startOfDay(),
                        Carbon::parse($endDate)->endOfDay()
                    ]);
                });
            })
            ->whereHas('verifications', function ($query) {
                $query->where('status', 'approved');
            })
            ->where('archive_status', '=', null)
            ->orderBy('lname')
            ->get()
            ->flatMap(function ($pdl) {
                $cases = $pdl->cases;

                // If no cases, return at least one record for the PDL
                if ($cases->isEmpty()) {
                    return [$this->formatPdlRecord($pdl, null)];
                }

                // Return one record per case
                return $cases->map(function ($case) use ($pdl) {
                    return $this->formatPdlRecord($pdl, $case);
                });
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

    private function formatPdlRecord($pdl, $case)
    {
        $courtOrder = $pdl->courtOrders->first();

        // Calculate age
        $age = $pdl->birthdate ? $pdl->birthdate->diffInYears(now()) : 'N/A';

        // Build address
        $address = trim(($pdl->brgy ?? '') . ', ' . ($pdl->city ?? '') . ', ' . ($pdl->province ?? ''));
        $address = $address === ', , ' ? 'N/A' : $address;

        $caseStatus = $case->case_status ?? 'N/A';
        $caseStatusMap = [
            'open' => 'On-Trial',
            'closed' => 'Convicted',
            'dismissed' => 'Dismissed',
            'deceased' => 'Deceased',
            'convicted' => 'Convicted',
            'on-trial' => 'On-Trial',
            'dismissed' => 'Dismissed',
            'deceased' => 'Deceased'
        ];
        $caseStatus = $caseStatusMap[strtolower($caseStatus)] ?? $caseStatus;

        if ($courtOrder && $courtOrder->admission_date && $courtOrder->release_date) {
            $totalYear = $courtOrder->admission_date->diffInYears($courtOrder->release_date);
        } else {
            $totalYear = 0;
        }

        return [
            'id' => $pdl->id . '-' . ($case ? $case->id : 'no-case'),
            'pdl_id' => $pdl->id,
            'name' => $pdl->fname . ' ' . $pdl->lname,
            'case_no' => $case->case_number ?? 'N/A',
            'crime_committed' => $case->crime_committed ?? 'N/A',
            'date_of_birth' => $pdl->birthdate?->format('Y-m-d'),
            'date_committed' => $case ? ($case->date_committed ? Carbon::parse($case->date_committed)->format('Y-m-d') : '') : '',
            'age' => $age,
            'address' => $address,
            'tribe' => $pdl->ethnic_group ?? 'N/A',
            'years' => $totalYear,
            'case_status' => $caseStatus,
            'rtc' => $courtOrder?->court?->branch_code ?? 'N/A'
        ];
    }

    private function calculateYears($dateCommitted)
    {
        if (!$dateCommitted) return 'N/A';

        $now = Carbon::now();
        $committed = Carbon::parse($dateCommitted);

        return $now->diffInYears($committed);
    }

    /**
     * Certificate of Detention - Show form
     */
    public function certificateOfDetention()
    {
        $pdls = Pdl::with(['cases', 'personnel'])
            ->whereHas('cases')
            ->whereHas('verifications', function ($query) {
                $query->where('status', 'approved');
            })
            ->where('archive_status', '=', null)
            ->orderBy('lname')
            ->get()
            ->map(function ($pdl) {
                $mainCase = $pdl->cases->first();
                return [
                    'id' => $pdl->id,
                    'name' => $pdl->fname . ' ' . $pdl->lname,
                    'case_number' => $mainCase->case_number ?? 'N/A',
                    'crime_committed' => $mainCase->crime_committed ?? 'N/A',
                    'date_committed' => $mainCase->date_committed ?? null,
                ];
            });

        return Inertia::render('admin/report/certificate-of-detention', [
            'pdls' => $pdls
        ]);
    }

    /**
     * Certificate of Detention - Generate PDF
     */
    public function generateCertificateOfDetention(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pdl_id' => 'required|exists:pdl,id',
            'issue_date' => 'required|date',
            'officer_name' => 'required|string|max:255',
            'officer_position' => 'required|string|max:255'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $pdl = Pdl::with(['cases', 'personnel'])->findOrFail($request->pdl_id);
        $mainCase = $pdl->cases->first();

        if (!$mainCase) {
            return back()->withErrors(['error' => 'No case information found for this PDL.']);
        }

        // Calculate detention period
        $dateCommitted = Carbon::parse($mainCase->date_committed);
        $issueDate = Carbon::parse($request->issue_date);
        $detentionPeriod = $dateCommitted->diff($issueDate);

        $years = $detentionPeriod->y;
        $months = $detentionPeriod->m;
        $days = $detentionPeriod->d;

        // Format detention period text
        $detentionText = '';
        if ($years > 0) {
            $detentionText .= $years . ' (' . $this->numberToWords($years) . ') year' . ($years > 1 ? 's' : '');
        }
        if ($months > 0) {
            if ($detentionText) $detentionText .= ', ';
            $detentionText .= $months . ' (' . $this->numberToWords($months) . ') month' . ($months > 1 ? 's' : '');
        }
        if ($days > 0) {
            if ($detentionText) $detentionText .= ', and ';
            $detentionText .= $days . ' (' . $this->numberToWords($days) . ') day' . ($days > 1 ? 's' : '');
        }

        $data = [
            'pdl_name' => strtoupper($pdl->fname . ' ' . $pdl->lname),
            'date_committed' => $dateCommitted->format('F j, Y'),
            'court_branch' => 'Regional Court Branch 26, Surallah, South Cotabato',
            'crime_committed' => strtoupper($mainCase->crime_committed),
            'case_number' => $mainCase->case_number,
            'detention_period' => $detentionText,
            'issue_date' => $issueDate->format('jS \d\a\y \o\f F Y'),
            'issue_city' => 'City of Koronadal',
            'officer_name' => $request->officer_name,
            'officer_position' => $request->officer_position
        ];

        $pdf = Pdf::loadView('reports.certificate-of-detention', $data);
        $pdf->setPaper('A4', 'portrait');



        return response($pdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="certificate-of-detention-' . $pdl->id . '.pdf"',
        ]);
    }

    /**
     * Convert number to words (basic implementation)
     */
    private function numberToWords($number)
    {
        $ones = [
            0 => '',
            1 => 'One',
            2 => 'Two',
            3 => 'Three',
            4 => 'Four',
            5 => 'Five',
            6 => 'Six',
            7 => 'Seven',
            8 => 'Eight',
            9 => 'Nine',
            10 => 'Ten',
            11 => 'Eleven',
            12 => 'Twelve',
            13 => 'Thirteen',
            14 => 'Fourteen',
            15 => 'Fifteen',
            16 => 'Sixteen',
            17 => 'Seventeen',
            18 => 'Eighteen',
            19 => 'Nineteen'
        ];

        $tens = [
            20 => 'Twenty',
            30 => 'Thirty',
            40 => 'Forty',
            50 => 'Fifty',
            60 => 'Sixty',
            70 => 'Seventy',
            80 => 'Eighty',
            90 => 'Ninety'
        ];

        if ($number < 20) {
            return $ones[$number];
        } elseif ($number < 100) {
            $ten = intval($number / 10) * 10;
            $one = $number % 10;
            return $tens[$ten] . ($one > 0 ? '-' . $ones[$one] : '');
        } else {
            return 'More than 99'; // For simplicity, handle only up to 99
        }
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
            ->whereHas('verifications', function ($query) {
                $query->where('status', 'approved');
            })
            ->where('created_at', '<=', $reportDate)
            ->where('archive_status', '=', null)
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
                // Count PDLs with null age
                $maleCount = $pdls->where('gender', 'Male')
                    ->whereNull('age')
                    ->count();

                $femaleCount = $pdls->where('gender', 'Female')
                    ->whereNull('age')
                    ->count();
            } else {
                // Use the age column directly with whereBetween
                $maleCount = $pdls->where('gender', 'Male')
                    ->whereNotNull('age')
                    ->whereBetween('age', [$range['min'], $range['max']])
                    ->count();

                $femaleCount = $pdls->where('gender', 'Female')
                    ->whereNotNull('age')
                    ->whereBetween('age', [$range['min'], $range['max']])
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
            ->whereHas('pdl', function ($query) {
                $query->whereHas('verifications', function ($query) {
                    $query->where('status', 'approved');
                })
                    ->where('archive_status', '=', null);
            })
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
            ->whereHas('pdl', function ($query) {
                $query->whereHas('verifications', function ($query) {
                    $query->where('status', 'approved');
                })
                    ->where('archive_status', '=', null);
            })

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
            ->where('status', '=', 'approved')
            ->whereHas('pdl', function ($query) {
                $query->whereNull('archive_status');
            });

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
        $full_name = $request->input('full_name');
        $position = $request->input('position');
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

        // Get commitment date from the first case
        $commitmentDate = $pdl->cases->first()?->date_committed ?? $pdl->created_at;
        $currentDate = now();

        // Generate year-by-year computation
        $computationData = $this->generateGCTATASTMComputation($commitmentDate, $currentDate);

        // Calculate total GCTA and TASTM
        $totalGCTA = array_sum(array_column($computationData, 'gcta_total'));
        $totalTASTM = array_sum(array_column($computationData, 'tastm_total'));

        // Calculate time served
        $timeServed = $commitmentDate->diff($currentDate);

        // Calculate total detention in days
        $totalDetentionDays = $commitmentDate->diffInDays($currentDate);

        // Calculate the new required variables
        $net_gcta_ymd = $this->convertDaysToYMDWithoutExtension($totalGCTA);
        $net_tastm_ymd = $this->convertDaysToYMDWithoutExtension($totalTASTM);

        // Calculate total detention with GCTA
        $total_detention_gcta_days = $totalDetentionDays + $totalGCTA;
        $total_detention_gcta_ymd = $this->convertDaysToYMDWithoutExtension($total_detention_gcta_days);

        // Calculate total detention with GCTA and TASTM
        $total_detention_gcta_tastm_days = $totalDetentionDays + $totalGCTA + $totalTASTM;
        $total_detention_gcta_tastm_ymd = $this->convertDaysToYMDWithoutExtension($total_detention_gcta_tastm_days);

        $data = [
            'verification' => $verification,
            'pdl' => $pdl,
            'commitment_date' => $commitmentDate->format('F j, Y'),
            'current_date' => $currentDate->format('F j, Y'),
            'commitmentDate' => $commitmentDate,
            'currentDate' => $currentDate,
            'time_served' => [
                'years' => $timeServed->y,
                'months' => $timeServed->m,
                'days' => $timeServed->d
            ],
            'computation_data' => $computationData,
            'total_gcta' => $totalGCTA,
            'total_tastm' => $totalTASTM,
            'total_allowances' => $totalGCTA + $totalTASTM,
            'convertDaysToYMD' => [$this, 'convertDaysToYMD'],
            'full_name' => $full_name,
            'position' => $position,
            // New variables for the updated template
            'net_gcta_ymd' => $net_gcta_ymd,
            'net_tastm_ymd' => $net_tastm_ymd,
            'total_detention_gcta_ymd' => $total_detention_gcta_ymd,
            'total_detention_gcta_tastm_ymd' => $total_detention_gcta_tastm_ymd
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

    private function generateGCTATASTMComputation($commitmentDate, $currentDate)
    {
        $data = [];
        $commitmentYear = $commitmentDate->year;
        $commitmentMonth = $commitmentDate->month;
        $commitmentDay = $commitmentDate->day;

        $currentYear = $currentDate->year;
        $currentMonth = $currentDate->month;
        $currentDay = $currentDate->day;

        // Calculate total years from commitment to current date
        $totalYears = $currentYear - $commitmentYear;

        // If we haven't reached the anniversary date this year, subtract 1
        if ($currentMonth < $commitmentMonth || ($currentMonth == $commitmentMonth && $currentDay < $commitmentDay)) {
            $totalYears = $totalYears - 1;
        }

        // Generate rows for each year from commitment to current
        for ($yearOffset = 0; $yearOffset <= $totalYears; $yearOffset++) {
            $currentYearDate = $commitmentYear + $yearOffset;

            // First column: commitment date for this year
            $firstColumnDate = Carbon::create($currentYearDate, $commitmentMonth, $commitmentDay);

            // Second column: one year after commitment date for this year
            $secondColumnDate = Carbon::create($currentYearDate + 1, $commitmentMonth, $commitmentDay);

            // For the last year, use current date if we've reached it
            if ($yearOffset == $totalYears) {
                $secondColumnDate = $currentDate;
            }

            // Calculate years served to determine GCTA rate
            $yearsServed = $yearOffset + 1;

            // Determine GCTA rate based on years served
            $gctaRate = 20; // Default for 1-2 years
            if ($yearsServed >= 3 && $yearsServed <= 5) {
                $gctaRate = 23;
            } elseif ($yearsServed >= 6 && $yearsServed <= 10) {
                $gctaRate = 25;
            } elseif ($yearsServed >= 11) {
                $gctaRate = 30;
            }

            // Calculate months for the year
            $months = 12;
            if ($yearOffset == $totalYears) {
                // Calculate partial year for the current year
                $startOfYear = Carbon::create($currentYearDate, $commitmentMonth, $commitmentDay);
                $months = $startOfYear->diffInMonths($currentDate);

                // Add partial month calculation
                $lastMonthStart = $startOfYear->copy()->addMonths($months);
                $daysInLastMonth = $currentDate->diffInDays($lastMonthStart);
                $partialMonth = $daysInLastMonth / 30;
                $months += $partialMonth;
            }

            $gctaTotal = $gctaRate * $months;
            $tastmTotal = 15 * 12; // TASTM is always 15 days per month

            $data[] = [
                'year' => $currentYearDate,
                'first_column_date' => $firstColumnDate->format('Y n j'),
                'second_column_date' => $secondColumnDate->format('Y n j'),
                'gcta_rate' => $gctaRate,
                'months' => $months,
                'gcta_calculation' => $gctaRate . 'X' . number_format($months, 1),
                'gcta_total' => round($gctaTotal),
                'tastm_calculation' => '15X12',
                'tastm_total' => $tastmTotal
            ];
        }

        return $data;
    }

    
    public function convertDaysToYMDWithoutExtension($days)
    {
        $years = floor($days / 365);
        $remainingDays = $days % 365;
        $months = floor($remainingDays / 30);
        $days = $remainingDays % 30;

        $result = '';
        if ($years > 0) {
            $result .= $years . '' . ($years > 1 ? '' : '');
        }
        if ($months > 0) {
            if ($result) $result .= ' ';
            $result .= $months . '' . ($months > 1 ? '' : '');
        }
        if ($days > 0) {
            if ($result) $result .= '  ';
            $result .= $days . '' . ($days > 1 ? '' : '');
        }

        return $result ?: '0';
    }

    public function convertDaysToYMD($days)
    {
        $years = floor($days / 365);
        $remainingDays = $days % 365;
        $months = floor($remainingDays / 30);
        $days = $remainingDays % 30;

        $result = '';
        if ($years > 0) {
            $result .= $years . ' year' . ($years > 1 ? 's' : '');
        }
        if ($months > 0) {
            if ($result) $result .= ', ';
            $result .= $months . ' month' . ($months > 1 ? 's' : '');
        }
        if ($days > 0) {
            if ($result) $result .= ', and ';
            $result .= $days . ' day' . ($days > 1 ? 's' : '');
        }

        return $result ?: '0 days';
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
            'year' => 'required|integer|min:' . (date('Y') - 10) . '|max:' . (date('Y') + 1)
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

        // Pre-load all approved drug-related PDLs for the year to optimize queries
        $allDrugPdls = Pdl::with(['cases' => function ($query) {
            $query->where('drug_related', true);
        }])
            ->whereHas('verifications', function ($query) {
                $query->where('status', 'approved');
            })
            ->whereHas('cases', function ($query) {
                $query->where('drug_related', true);
            })
            ->whereYear('created_at', '<=', $year)
            ->get();

        foreach ($monthNames as $index => $monthName) {
            $monthNumber = $index + 1;
            $startDate = Carbon::create($year, $monthNumber, 1)->startOfMonth();
            $endDate = Carbon::create($year, $monthNumber, 1)->endOfMonth();

            // Filter PDLs that were ACTIVE during this specific month
            $activeDrugPdls = $allDrugPdls->filter(function ($pdl) use ($startDate, $endDate) {
                // PDL must be created on or before the end of this month
                if ($pdl->created_at > $endDate) {
                    return false;
                }

                // If PDL is not archived, they are active
                if ($pdl->archive_status === null) {
                    return true;
                }

                // If archived, check if they were archived AFTER this month ended
                // If archived after month end, they were active during this month
                if ($pdl->archived_at && $pdl->archived_at > $endDate) {
                    return true;
                }

                return false;
            });

            // PDLs committed (created) in this month
            $committedPdls = $allDrugPdls->filter(function ($pdl) use ($startDate, $endDate) {
                return $pdl->created_at->between($startDate, $endDate);
            });

            // PDLs discharged (archived) in this month
            $dischargedPdls = $allDrugPdls->filter(function ($pdl) use ($startDate, $endDate) {
                return $pdl->archive_status !== null &&
                    $pdl->archived_at &&
                    $pdl->archived_at->between($startDate, $endDate);
            });

            // Counts for active detainees
            $maleDetainees = Pdl::where('gender', 'Male')->where('archive_status', null)
                ->whereHas('verifications', function ($query) {
                    $query->where('status', 'approved');
                })->whereBetween('created_at', [$startDate, $endDate])
                ->count();
            $femaleDetainees = Pdl::where('gender', 'Female')->where('archive_status', null)
                ->whereHas('verifications', function ($query) {
                    $query->where('status', 'approved');
                })
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count();
            $totalDetainees = $maleDetainees + $femaleDetainees;

            // Committed and discharged counts
            $committed = $committedPdls->count();
            $discharged = $dischargedPdls->count();

            // Breakdown of discharge reasons for this month
            $bonded = $dischargedPdls->where('archive_status', 'BONDED')->count();
            $servedSentence = $dischargedPdls->where('archive_status', 'SERVED_SENTENCE')->count();
            $dismissed = $dischargedPdls->whereIn('archive_status', ['PROV_DISMISSED', 'DISMISSED'])->count();
            $transferred = $dischargedPdls->where('archive_status', 'TRANSFER_TO_OTHER_FACILITY')->count();
            $dapecol = $dischargedPdls->where('archive_status', 'DAPECOL')->count();
            $probation = $dischargedPdls->where('archive_status', 'PROBATION')->count();
            $deceased = $dischargedPdls->where('archive_status', 'DECEASED')->count();
            $acquitted = $dischargedPdls->where('archive_status', 'ACQUITTED')->count();

            $totalDischargedDrug = $bonded + $servedSentence + $dismissed + $transferred + $dapecol + $probation + $deceased + $acquitted;

            // Calculate total population for percentage (all active PDLs, not just drug-related)
            $totalPopulation = Pdl::whereHas('verifications', function ($query) {
                $query->where('status', 'approved');
            })
                ->where('created_at', '<=', $endDate)
                ->where(function ($query) use ($endDate) {
                    $query->where('archive_status', null)
                        ->orWhere('archived_at', '>', $endDate);
                })
                ->count();

            $drugOffendersPercentage = $totalPopulation > 0 ? round(($totalDetainees / $totalPopulation) * 100, 2) : 0;

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
                'total_drug_cases' => $totalDetainees
            ];

            // Add to yearly totals (only add actual monthly values, not cumulative)
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
            // Don't add total_drug_cases to yearly total - it's already represented by total_detainees
        }

        // For yearly total drug cases, use the sum of monthly detainees (which should be correct)
        $yearlyTotals['total_drug_cases'] = $yearlyTotals['total_detainees'];

        // Calculate correct percentage for total row (year-end snapshot)
        $yearEndDate = Carbon::create($year, 12, 31)->endOfDay();
        $totalPopulationYearEnd = Pdl::whereHas('verifications', function ($query) {
            $query->where('status', 'approved');
        })
            ->where('created_at', '<=', $yearEndDate)
            ->where(function ($query) use ($yearEndDate) {
                $query->where('archive_status', null)
                    ->orWhere('archived_at', '>', $yearEndDate);
            })
            ->count();

        // For total row, we want the percentage based on year-end active population
        $yearEndActiveDrugPdls = $allDrugPdls->filter(function ($pdl) use ($yearEndDate) {
            if ($pdl->created_at > $yearEndDate) {
                return false;
            }
            if ($pdl->archive_status === null) {
                return true;
            }
            if ($pdl->archived_at && $pdl->archived_at > $yearEndDate) {
                return true;
            }
            return false;
        });

        $totalDrugCasesYearEnd = $yearEndActiveDrugPdls->count();
        $totalPercentage = $totalPopulationYearEnd > 0 ?
            round(($totalDrugCasesYearEnd / $totalPopulationYearEnd) * 100, 2) : 0;

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
            'drug_offenders_percentage' => $totalPercentage,
            'total_drug_cases' => $totalDrugCasesYearEnd
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
            'year' => 'required|integer|min:' . (date('Y') - 10) . '|max:' . (date('Y') + 1)
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

        // Pre-load all approved drug-related PDLs for the year to optimize queries
        $allDrugPdls = Pdl::with(['cases' => function ($query) {
            $query->where('drug_related', true);
        }])
            ->whereHas('verifications', function ($query) {
                $query->where('status', 'approved');
            })
            ->whereHas('cases', function ($query) {
                $query->where('drug_related', true);
            })
            ->whereYear('created_at', '<=', $year)
            ->get();

        foreach ($monthNames as $index => $monthName) {
            $monthNumber = $index + 1;
            $startDate = Carbon::create($year, $monthNumber, 1)->startOfMonth();
            $endDate = Carbon::create($year, $monthNumber, 1)->endOfMonth();

            // Filter PDLs that were ACTIVE during this specific month
            $activeDrugPdls = $allDrugPdls->filter(function ($pdl) use ($startDate, $endDate) {
                // PDL must be created on or before the end of this month
                if ($pdl->created_at > $endDate) {
                    return false;
                }

                // If PDL is not archived, they are active
                if ($pdl->archive_status === null) {
                    return true;
                }

                // If archived, check if they were archived AFTER this month ended
                // If archived after month end, they were active during this month
                if ($pdl->archived_at && $pdl->archived_at > $endDate) {
                    return true;
                }

                return false;
            });

            // PDLs committed (created) in this month
            $committedPdls = $allDrugPdls->filter(function ($pdl) use ($startDate, $endDate) {
                return $pdl->created_at->between($startDate, $endDate);
            });

            // PDLs discharged (archived) in this month
            $dischargedPdls = $allDrugPdls->filter(function ($pdl) use ($startDate, $endDate) {
                return $pdl->archive_status !== null &&
                    $pdl->archived_at &&
                    $pdl->archived_at->between($startDate, $endDate);
            });

            // Counts for active detainees
            $maleDetainees = Pdl::where('gender', 'Male')->where('archive_status', null)
                ->whereHas('verifications', function ($query) {
                    $query->where('status', 'approved');
                })->whereBetween('created_at', [$startDate, $endDate])
                ->count();
            $femaleDetainees = Pdl::where('gender', 'Female')->where('archive_status', null)
                ->whereHas('verifications', function ($query) {
                    $query->where('status', 'approved');
                })
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count();
            $totalDetainees = $maleDetainees + $femaleDetainees;

            // Committed and discharged counts
            $committed = $committedPdls->count();
            $discharged = $dischargedPdls->count();

            // Breakdown of discharge reasons for this month
            $bonded = $dischargedPdls->where('archive_status', 'BONDED')->count();
            $servedSentence = $dischargedPdls->where('archive_status', 'SERVED_SENTENCE')->count();
            $dismissed = $dischargedPdls->whereIn('archive_status', ['PROV_DISMISSED', 'DISMISSED'])->count();
            $transferred = $dischargedPdls->where('archive_status', 'TRANSFER_TO_OTHER_FACILITY')->count();
            $dapecol = $dischargedPdls->where('archive_status', 'DAPECOL')->count();
            $probation = $dischargedPdls->where('archive_status', 'PROBATION')->count();
            $deceased = $dischargedPdls->where('archive_status', 'DECEASED')->count();
            $acquitted = $dischargedPdls->where('archive_status', 'ACQUITTED')->count();

            $totalDischargedDrug = $bonded + $servedSentence + $dismissed + $transferred + $dapecol + $probation + $deceased + $acquitted;

            // Calculate total population for percentage (all active PDLs, not just drug-related)
            $totalPopulation = Pdl::whereHas('verifications', function ($query) {
                $query->where('status', 'approved');
            })
                ->where('created_at', '<=', $endDate)
                ->where(function ($query) use ($endDate) {
                    $query->where('archive_status', null)
                        ->orWhere('archived_at', '>', $endDate);
                })
                ->count();

            $drugOffendersPercentage = $totalPopulation > 0 ? round(($totalDetainees / $totalPopulation) * 100, 2) : 0;

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
                'total_drug_cases' => $totalDetainees
            ];

            // Add to yearly totals (only add actual monthly values, not cumulative)
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
            // Don't add total_drug_cases to yearly total - it's already represented by total_detainees
        }

        // For yearly total drug cases, use the sum of monthly detainees (which should be correct)
        $yearlyTotals['total_drug_cases'] = $yearlyTotals['total_detainees'];

        // Calculate correct percentage for total row (year-end snapshot)
        $yearEndDate = Carbon::create($year, 12, 31)->endOfDay();
        $totalPopulationYearEnd = Pdl::whereHas('verifications', function ($query) {
            $query->where('status', 'approved');
        })
            ->where('created_at', '<=', $yearEndDate)
            ->where(function ($query) use ($yearEndDate) {
                $query->where('archive_status', null)
                    ->orWhere('archived_at', '>', $yearEndDate);
            })
            ->count();

        // For total row, we want the percentage based on year-end active population
        $yearEndActiveDrugPdls = $allDrugPdls->filter(function ($pdl) use ($yearEndDate) {
            if ($pdl->created_at > $yearEndDate) {
                return false;
            }
            if ($pdl->archive_status === null) {
                return true;
            }
            if ($pdl->archived_at && $pdl->archived_at > $yearEndDate) {
                return true;
            }
            return false;
        });

        $totalDrugCasesYearEnd = $yearEndActiveDrugPdls->count();
        $totalPercentage = $totalPopulationYearEnd > 0 ?
            round(($totalDrugCasesYearEnd / $totalPopulationYearEnd) * 100, 2) : 0;

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
            'drug_offenders_percentage' => $totalPercentage,
            'total_drug_cases' => $totalDrugCasesYearEnd
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
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'export_pdf' => 'boolean',
            'prepared_by' => 'required|string|max:255',
            'noted_by' => 'required|string|max:255',
        ]);

        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        $preparedBy = $request->prepared_by;
        $notedBy = $request->noted_by;
        // Get all PDLs with their court orders and court information
        $pdls = Pdl::whereBetween('created_at', [$startDate, $endDate])

            ->whereNull('deleted_at')
            ->with(['cases', 'courtOrders.court'])
            ->get();

        $courtData = [];
        $totalMale = 0;
        $totalFemale = 0;
        $totalCICL = 0;

        // Get all courts grouped by court_type unique by pdl_id
        $courts = Court::withCount([
            'courtOrders as male_count' => function ($query) use ($startDate, $endDate) {
                $query->whereHas('pdl', function ($q) {
                    $q->where('gender', 'Male')
                        ->whereHas('verifications', function ($query) {
                            $query->where('status', 'approved');
                        });
                })
                    ->whereBetween('order_date', [$startDate, $endDate])
                    ->select(DB::raw('COUNT(DISTINCT pdl_id)')); // Count distinct PDls
            },
            'courtOrders as female_count' => function ($query) use ($startDate, $endDate) {
                $query->whereHas('pdl', function ($q) {
                    $q->where('gender', 'Female')
                        ->whereHas('verifications', function ($query) {
                            $query->where('status', 'approved');
                        });
                })
                    ->whereBetween('order_date', [$startDate, $endDate])
                    ->select(DB::raw('COUNT(DISTINCT pdl_id)')); // Count distinct PDls
            },
            'courtOrders as cicl_count' => function ($query) use ($startDate, $endDate) {
                $query->whereHas('pdl', function ($q) {
                    $q->where('age', '<', 18)
                        ->whereHas('verifications', function ($query) {
                            $query->where('status', 'approved');
                        });
                })
                    ->whereBetween('order_date', [$startDate, $endDate])
                    ->select(DB::raw('COUNT(DISTINCT pdl_id)')); // Count distinct PDls
            }
        ])->get();

        // Group courts by court_type
        $courtsByType = $courts->groupBy('court_type');

        foreach ($courtsByType as $courtType => $courtsInType) {
            $courtData[$courtType] = [
                'stations' => []
            ];

            foreach ($courtsInType as $court) {
                $maleCount = $court->male_count;
                $femaleCount = $court->female_count;
                $ciclCount = $court->cicl_count;

                $total = $maleCount + $femaleCount + $ciclCount;

                $courtData[$courtType]['stations'][] = [
                    'station' => $court->station,
                    'branch' => $court->branch,
                    'branch_code' => $court->branch_code,
                    'location' => $court->location,
                    'male' => $maleCount,
                    'female' => $femaleCount,
                    'cicl' => $ciclCount,
                    'total' => $total
                ];

                $totalMale += $maleCount;
                $totalFemale += $femaleCount;
                $totalCICL += $ciclCount;
            }
        }

        // Alternative approach: Count PDLs by their court assignments
        // This ensures we count each PDL only once (based on their most recent court order)
        $uniquePdlsByCourt = Pdl::whereBetween('created_at', [$startDate, $endDate])
            ->whereNull('deleted_at')
            ->with(['courtOrders' => function ($query) {
                $query->latest('order_date')->first();
            }, 'courtOrders.court'])
            ->get()
            ->groupBy(function ($pdl) {
                return $pdl->courtOrders->first()->court->court_type ?? 'Unassigned';
            });



        $data = [
            'title' => 'STATUS REPORT AS TO THE TOTAL NUMBER OF DETAINEES',
            'facility_name' => 'South Cotabato Rehabilitation and Detention Center',
            'location' => 'City of Koronadal',
            'contact' => [
                'tel' => '(083) 228-2445',
                'email' => 'socot.scrdcjail@gmail.com'
            ],
            'start_date' => $startDate->format('F d, Y'),
            'end_date' => $endDate->format('F d, Y'),
            'prepared_by' => $preparedBy,
            'noted_by' => $notedBy,
            'court_data' => $courtData,
            'totals' => [
                'male' => $totalMale,
                'female' => $totalFemale,
                'cicl' => $totalCICL,
                'total' => $totalMale + $totalFemale + $totalCICL
            ],
            'summary' => [
                'total_courts' => $courts->count(),
                'total_court_types' => $courtsByType->count(),
                'report_generated_at' => now()->format('F d, Y g:i A')
            ]
        ];



        return Inertia::render('admin/report/inmates-status', [
            'reportData' => $data,
            'filters' => [
                'start_date' => $request->start_date,
                'end_date' => $request->end_date
            ]
        ]);
    }


    public function exportInmatesStatusPdf(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'export_pdf' => 'boolean',
            'prepared_by' => 'required|string|max:255',
            'noted_by' => 'required|string|max:255',
        ]);

        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        $preparedBy = $request->prepared_by;
        $notedBy = $request->noted_by;

        // Get all PDLs with their court orders and court information
        $pdls = Pdl::whereBetween('created_at', [$startDate, $endDate])
            ->whereNull('deleted_at')
            ->with(['cases', 'courtOrders.court'])
            ->get();

        $courtData = [];
        $totalMale = 0;
        $totalFemale = 0;
        $totalCICL = 0;

        // Get all courts grouped by court_type
        $courts = Court::withCount([
            'courtOrders as male_count' => function ($query) use ($startDate, $endDate) {
                $query->whereHas('pdl', function ($q) {
                    $q->where('gender', 'Male')
                        ->whereHas('verifications', function ($query) {
                            $query->where('status', 'approved');
                        });
                })
                    ->whereBetween('order_date', [$startDate, $endDate]);
            },
            'courtOrders as female_count' => function ($query) use ($startDate, $endDate) {
                $query->whereHas('pdl', function ($q) {
                    $q->where('gender', 'Female')
                        ->whereHas('verifications', function ($query) {
                            $query->where('status', 'approved');
                        });
                })->whereBetween('order_date', [$startDate, $endDate]);
            },
            'courtOrders as cicl_count' => function ($query) use ($startDate, $endDate) {
                $query->whereHas('pdl', function ($q) {
                    $q->where('age', '<', 18) // CICL - Children in Conflict with the Law
                        ->whereHas('verifications', function ($query) {
                            $query->where('status', 'approved');
                        });
                })->whereBetween('order_date', [$startDate, $endDate]);
            }
        ])->get();

        // Group courts by court_type
        $courtsByType = $courts->groupBy('court_type');

        foreach ($courtsByType as $courtType => $courtsInType) {
            $courtData[$courtType] = [
                'stations' => []
            ];

            foreach ($courtsInType as $court) {
                $maleCount = $court->male_count;
                $femaleCount = $court->female_count;
                $ciclCount = $court->cicl_count;

                $total = $maleCount + $femaleCount + $ciclCount;

                $courtData[$courtType]['stations'][] = [
                    'station' => $court->station,
                    'branch' => $court->branch,
                    'branch_code' => $court->branch_code,
                    'location' => $court->location,
                    'male' => $maleCount,
                    'female' => $femaleCount,
                    'cicl' => $ciclCount,
                    'total' => $total
                ];

                $totalMale += $maleCount;
                $totalFemale += $femaleCount;
                $totalCICL += $ciclCount;
            }
        }

        // Alternative approach: Count PDLs by their court assignments
        // This ensures we count each PDL only once (based on their most recent court order)
        $uniquePdlsByCourt = Pdl::whereBetween('created_at', [$startDate, $endDate])
            ->whereNull('deleted_at')
            ->with(['courtOrders' => function ($query) {
                $query->latest('order_date')->first();
            }, 'courtOrders.court'])
            ->get()
            ->groupBy(function ($pdl) {
                return $pdl->courtOrders->first()->court->court_type ?? 'Unassigned';
            });

        $data = [
            'title' => 'STATUS REPORT AS TO THE TOTAL NUMBER OF DETAINEES',
            'facility_name' => 'South Cotabato Rehabilitation and Detention Center',
            'location' => 'City of Koronadal',
            'contact' => [
                'tel' => '(083) 228-2445',
                'email' => 'socot.scrdcjail@gmail.com'
            ],
            'start_date' => $startDate->format('F d, Y'),
            'end_date' => $endDate->format('F d, Y'),
            'prepared_by' => $preparedBy,
            'noted_by' => $notedBy,
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
            ->whereHas('cases', function ($query) {
                $query->where('case_status', 'On Trial');
            })
            ->get();

        $escortedRtcCount = $escortedPdls->count();

        // Get released PDL from courts
        $releasedPdls = Pdl::whereBetween('updated_at', [$startOfDay, $endOfDay])
            ->whereHas('cases', function ($query) {
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
            ->whereHas('cases', function ($query) {
                $query->where('case_status', 'On Trial');
            })
            ->get();

        $escortedRtcCount = $escortedPdls->count();

        // Get released PDL from courts
        $releasedPdls = Pdl::whereBetween('updated_at', [$startOfDay, $endOfDay])
            ->whereHas('cases', function ($query) {
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
            ->whereHas('cases', function ($query) {
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

        $currentDate = now();
        $officer_name = $request->input('officer_name');
        $officer_position = $request->input('officer_position');
        // Format person names for display
        $formattedPersons = collect($request->persons)->map(function ($person) {
            $name = trim($person['fname']);
            if (!empty($person['mname'])) {
                $name .= ' ' . trim($person['mname']);
            }
            $name .= ' ' . trim($person['lname']);
            return [
                'fname' => $person['fname'],
                'mname' => $person['mname'],
                'lname' => $person['lname'],
                'suffix' => $person['suffix'],
                'full_name' => trim($name)
            ];
        });

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
            'persons' => $formattedPersons->toArray(),
            'requested_by' => $request->requested_by,
            'requesting_agency' => $request->requesting_agency,
            'issue_date' => $currentDate->format('F d, Y'),
            'issue_location' => 'City of Koronadal',
            'signed_by' => [
                'name' => 'JUAN R. LANZADERAS, JR., MPA',
                'position' => 'Provincial Warden'
            ],
            'officer_name' => $officer_name,
            'officer_position' => $officer_position
        ];

        if ($request->export_pdf) {
            return $this->exportNoRecordsCertificatePdf($request);
        }

        return Inertia::render('admin/report/no-records-certificate', [
            'certificateData' => $data,
            'filters' => [
                'persons' => $request->persons,
                'requested_by' => $request->requested_by,
                'requesting_agency' => $request->requesting_agency
            ]
        ]);
    }

    public function exportNoRecordsCertificatePdf(Request $request)
    {
        $request->validate([
            'persons' => 'required|array|min:1',
            'persons.*.fname' => 'required|string|max:255',
            'persons.*.mname' => 'nullable|string|max:255',
            'persons.*.lname' => 'required|string|max:255',
            'persons.*.suffix' => 'nullable|string|max:255',
            'requested_by' => 'required|string|max:255',
            'requesting_agency' => 'required|string|max:255',
            'officer_name' => 'required|string|max:255',
            'officer_position' => 'required|string|max:255'
        ]);

        $currentDate = now();

        // Format person names for display
        $formattedPersons = collect($request->persons)->map(function ($person) {
            $name = trim($person['fname']);
            if (!empty($person['mname'])) {
                $name .= ' ' . trim($person['mname']);
            }
            $name .= ' ' . trim($person['lname']);
            if (!empty($person['suffix'])) {
                $name .= ' ' . trim($person['suffix']);
            }
            return [
                'fname' => $person['fname'],
                'mname' => $person['mname'],
                'lname' => $person['lname'],
                'suffix' => $person['suffix'],
                'full_name' => trim($name)
            ];
        });

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
            'persons' => $formattedPersons->toArray(),
            'requested_by' => $request->requested_by,
            'requesting_agency' => $request->requesting_agency,
            'issue_date' => $currentDate->format('F d, Y'),
            'issue_location' => 'City of Koronadal',
            'officer_name' => $request->officer_name,
            'officer_position' => $request->officer_position
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
    public function pdlInformationReport(Request $request)
    {

        $pdl = Pdl::with('cases')->find($request->pdl_id);
        $courtOrder = CourtOrder::with('court')->where('pdl_id', $request->pdl_id)->latest()->first();

        if (!$pdl) {

            return redirect()->back()->with('error', 'PDL not found.');
        }



        $fileName = 'pdl-information_' . $pdl->id . '_' . now()->format('Y-m-d') . '.pdf';
        $imageBase64 = $this->getPdlMugshotBase64($pdl);

        try {
            $html = view('reports.pdl-information', [
                'pdl' => $pdl,
                'courtOrder' => $courtOrder,
                'image' => $imageBase64,
                'hasImage' => !is_null($imageBase64)
            ])->render();



            return $this->generatePDF($html, $fileName);
        } catch (\Exception $e) {

            return redirect()->back()->with('error', 'Failed to generate report view.');
        }
    }

    private function getPdlMugshotBase64(Pdl $pdl): ?string
    {
        if (!$pdl->mugshot_path) {
            Log::warning('No mugshot path for PDL ' . $pdl->id);
            return $this->getDefaultAvatarBase64();
        }

        try {
            // Try using Storage facade first
            if (Storage::disk('public')->exists($pdl->mugshot_path)) {
                $imageData = Storage::disk('public')->get($pdl->mugshot_path);
                return base64_encode($imageData);
            }

            // Fallback to direct path
            $publicPath = public_path('storage/' . $pdl->mugshot_path);
            if (file_exists($publicPath)) {
                $imageData = file_get_contents($publicPath);
                return base64_encode($imageData);
            }

            Log::warning('Mugshot not found for PDL ' . $pdl->id . ' at path: ' . $pdl->mugshot_path);
            return $this->getDefaultAvatarBase64();
        } catch (\Exception $e) {
            Log::error('Error loading mugshot for PDL ' . $pdl->id . ': ' . $e->getMessage());
            return $this->getDefaultAvatarBase64();
        }
    }

    private function getDefaultAvatarBase64(): ?string
    {
        try {
            $placeholderPaths = [
                public_path('images/default-avatar.jpg'),
                public_path('images/default-avatar.png'),
                public_path('default-avatar.jpg'),
                base_path('public/images/default-avatar.jpg'),
            ];

            foreach ($placeholderPaths as $path) {
                if (file_exists($path)) {
                    $imageData = file_get_contents($path);
                    return base64_encode($imageData);
                }
            }

            // Create a simple placeholder image programmatically
            return $this->createSimplePlaceholder();
        } catch (\Exception $e) {
            Log::error('Failed to load placeholder image: ' . $e->getMessage());
            return null;
        }
    }

    private function createSimplePlaceholder(): string
    {
        // Create a simple 1x1 transparent pixel as fallback
        $transparentPixel = base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
        return base64_encode($transparentPixel);
    }

    private function generatePDF(string $html, string $fileName)
    {
        try {
            $dompdf = new \Dompdf\Dompdf();

            // Enhanced PDF configuration for server compatibility
            $options = new \Dompdf\Options();
            $options->set([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
                'isPhpEnabled' => false,
                'defaultFont' => 'DejaVu Sans', // Better font compatibility
                'tempDir' => storage_path('temp'), // Ensure temp directory exists
                'fontDir' => storage_path('fonts'),
                'fontCache' => storage_path('fonts'),
                'logOutputFile' => storage_path('logs/dompdf.html'),
                'defaultMediaType' => 'print',
                'defaultPaperSize' => 'A4',
                'defaultPaperOrientation' => 'portrait',
            ]);

            $dompdf->setOptions($options);
            $dompdf->setPaper('A4', 'portrait');

            $dompdf->loadHtml($html, 'UTF-8');
            $dompdf->render();

            return response($dompdf->output(), 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
            ]);
        } catch (\Exception $e) {
            Log::error('PDF generation failed: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to generate PDF report. Please try again.');
        }
    }
}
