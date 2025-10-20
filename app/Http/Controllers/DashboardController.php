<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Pdl;
use App\Models\CaseInformation;

use App\Models\CellAssignment;
use App\Models\Cells;
use App\Models\TimeAllowance;
use App\Models\CourtOrder;

use App\Models\Personnel;
use App\Models\MedicalRecord;
use App\Models\Verifications;
use App\Models\Activity;
use App\Models\SystemNotification;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        // Get PDL demographics by gender and accepted in verifications
        $pdlByGender = Pdl::select('gender', DB::raw('count(*) as value'))
            ->whereNull('deleted_at')
            ->whereHas('verifications', function ($query) {
                $query->where('status', 'approved');
            })
            ->where('archive_status', '=', null)
            ->groupBy('gender')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->gender,
                    'value' => $item->value,
                    'color' => $item->gender === 'Male' ? '#3b82f6' : '#ec4899'
                ];
            });

        // Get case status distribution
        $caseStatusData = CaseInformation::select('case_status', DB::raw('count(*) as value'))
            ->groupBy('case_status')
            ->get()
            ->map(function ($item) {
                $colors = [
                    'Active' => '#3b82f6',
                    'Closed' => '#10b981',
                    'Pending' => '#f59e0b',
                    'On Trial' => '#8b5cf6',
                    'Appealed' => '#ef4444'
                ];
                return [
                    'name' => $item->case_status,
                    'value' => $item->value,
                    'color' => $colors[$item->case_status] ?? '#6b7280'
                ];
            });

        // Get monthly admissions and releases (last 6 months)
        $monthlyData = collect();
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthName = $date->format('M');

            $admissions = Pdl::whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->whereNull('deleted_at')
                ->count();

            // Assuming releases are represented by soft deletes
            $releases = Pdl::whereMonth('deleted_at', $date->month)
                ->whereYear('deleted_at', $date->year)
                ->onlyTrashed()
                ->count();

            $monthlyData->push([
                'month' => $monthName,
                'admissions' => $admissions,
                'releases' => $releases
            ]);
        }

        // Get cell occupancy data
        $cellOccupancy = Cells::where('status', 'active')
            ->with('assignments.pdl')
            ->get()
            ->map(function ($cell) {
                $occupied = $cell->assignments->where('pdl.deleted_at', null)->count();
                return [
                    'cell' => $cell->cell_name,
                    'capacity' => $cell->capacity,
                    'occupied' => $occupied,
                    'utilization' => $cell->capacity > 0 ? round(($occupied / $cell->capacity) * 100) : 0
                ];
            });

        // Get time allowances distribution - separate GCTA and TASTM
        $gctaCount = TimeAllowance::where('type', 'gcta')->count();
        $tastmCount = TimeAllowance::where('type', 'tastm')->count();

        $timeAllowanceData = collect([
            [
                'type' => 'GCTA',
                'count' => $gctaCount,
                'color' => '#10b981',
                'description' => 'Good Conduct Time Allowance'
            ],
            [
                'type' => 'TASTM',
                'count' => $tastmCount,
                'color' => '#f59e0b',
                'description' => 'Time Allowance for Study, Teaching, and Mentoring'
            ]
        ]);

        // Get security classification distribution
        $securityClassificationData = CaseInformation::select('security_classification', DB::raw('count(*) as count'))
            ->whereNotNull('security_classification')
            ->groupBy('security_classification')
            ->get()
            ->map(function ($item) {
                $colors = [
                    'Maximum' => '#ef4444',
                    'Medium' => '#f59e0b',
                    'Minimum' => '#10b981'
                ];
                return [
                    'classification' => $item->security_classification,
                    'count' => $item->count,
                    'color' => $colors[$item->security_classification] ?? '#6b7280'
                ];
            });

        // Get court order types
        $courtOrderTypes = CourtOrder::select('order_type', DB::raw('count(*) as count'))
            ->groupBy('order_type')
            ->get()
            ->map(function ($item) {
                $colors = [
                    'Commitment' => '#3b82f6',
                    'Release' => '#10b981',
                    'Hearing' => '#f59e0b',
                    'Transfer' => '#8b5cf6',
                    'Other' => '#6b7280'
                ];
                return [
                    'type' => $item->order_type,
                    'count' => $item->count,
                    'color' => $colors[$item->order_type] ?? '#6b7280'
                ];
            });

        // Get verification status data
        $verificationStatusData = Verifications::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                $colors = [
                    'pending' => '#f59e0b',
                    'approved' => '#10b981',
                    'rejected' => '#ef4444'
                ];
                return [
                    'status' => ucfirst($item->status),
                    'count' => $item->count,
                    'color' => $colors[$item->status] ?? '#6b7280'
                ];
            });

        // Get personnel distribution by position
        $personnelByPosition = Personnel::select('position', DB::raw('count(*) as count'))
            ->where('status', 1)
            ->whereNull('deleted_at')
            ->groupBy('position')
            ->get()
            ->map(function ($item) {
                $colors = [
                    'Correctional Officer' => '#3b82f6',
                    'Administrative Staff' => '#8b5cf6',
                    'Medical Staff' => '#ec4899',
                    'Supervisor' => '#f59e0b'
                ];
                return [
                    'position' => $item->position,
                    'count' => $item->count,
                    'color' => $colors[$item->position] ?? '#6b7280'
                ];
            });

        // Calculate key metrics
        $totalPDL = Pdl::whereNull('deleted_at')
            ->where('archive_status', '=', null)
            ->whereHas('verifications', function ($query) {
                $query->where('status', 'approved');
            })
            ->count();

        $activeCases = CaseInformation::where('case_status', 'Active')->count();
        $totalCapacity = Cells::where('status', 'active')->sum('capacity');
        $totalOccupied = CellAssignment::whereHas('pdl', function ($query) {
            $query->whereNull('deleted_at');
        })->count();
        $overallUtilization = $totalCapacity > 0 ? round(($totalOccupied / $totalCapacity) * 100) : 0;
        $pendingVerifications = Verifications::where('status', 'pending')->count();
        $totalTimeAllowances = TimeAllowance::count();

        // filter by verification status
        $totalCourtOrders = CourtOrder::whereHas('pdl', function ($query) {
            $query->whereHas('verifications', function ($query) {
                $query->where('status', 'approved');
            });
        })->count();
        $totalMedicalRecords = MedicalRecord::whereHas('pdl', function ($query) {
            $query->whereHas('verifications', function ($query) {
                $query->where('status', 'approved');
            });
        })->count();
        $activePersonnel = Personnel::where('status', 1)->whereNull('deleted_at')->count();

        // Get recent activities (last 10 activities)
        $recentActivities = collect([
            // Recent PDL admissions
            ...Pdl::whereNull('deleted_at')
                ->latest()
                ->limit(3)
                ->get()
                ->map(function ($pdl) {
                    return [
                        'type' => 'admission',
                        'title' => "New PDL admission - {$pdl->fname} {$pdl->lname}",
                        'description' => $pdl->created_at->diffForHumans() . " • Cell Assignment pending",
                        'timestamp' => $pdl->created_at->format('M d, Y H:i'),
                        'badge' => 'Admission',
                        'color' => 'blue'
                    ];
                }),

            // Recent time allowances
            ...TimeAllowance::with('pdl')
                ->latest('awarded_at')
                ->limit(2)
                ->get()
                ->map(function ($allowance) {
                    return [
                        'type' => 'time_allowance',
                        'title' => strtoupper($allowance->type) . " approved for {$allowance->pdl->fname} {$allowance->pdl->lname}",
                        'description' => \Carbon\Carbon::parse($allowance->awarded_at)->diffForHumans() . " • {$allowance->days} days awarded",
                        'timestamp' => $allowance->created_at->format('M d, Y H:i'),
                        'badge' => 'Time Allowance',
                        'color' => 'green'
                    ];
                }),

            // Recent court orders
            ...CourtOrder::with('pdl')
                ->latest('order_date')
                ->limit(2)
                ->get()
                ->map(function ($order) {
                    return [
                        'type' => 'court_order',
                        'title' => "Court order processed for {$order->pdl->fname} {$order->pdl->lname}",
                        'description' => $order->created_at->diffForHumans() . " • {$order->order_type}",
                        'timestamp' => $order->created_at->format('M d, Y H:i'),
                        'badge' => 'Court Order',
                        'color' => 'purple'
                    ];
                }),

            // Recent verifications
            ...Verifications::with('pdl')
                ->where('status', 'pending')
                ->latest()
                ->limit(2)
                ->get()
                ->map(function ($verification) {
                    return [
                        'type' => 'verification',
                        'title' => "Verification request for {$verification->pdl->fname} {$verification->pdl->lname}",
                        'description' => $verification->created_at->diffForHumans() . " • Awaiting review",
                        'timestamp' => $verification->created_at->format('M d, Y H:i'),
                        'badge' => 'Verification',
                        'color' => 'red'
                    ];
                }),

            // Recent medical records
            ...MedicalRecord::with('pdl')
                ->latest()
                ->limit(1)
                ->get()
                ->map(function ($medical) {
                    return [
                        'type' => 'medical',
                        'title' => "Medical examination for {$medical->pdl->fname} {$medical->pdl->lname}",
                        'description' => $medical->created_at->diffForHumans() . " • {$medical->complaint}",
                        'timestamp' => $medical->created_at->format('M d, Y H:i'),
                        'badge' => 'Medical',
                        'color' => 'orange'
                    ];
                })
        ])->sortByDesc('created_at')->take(5)->values();

        // count upcaming events for 2 week
        $upcomingEvents = Activity::where('activity_date', '>=', now())
            ->where('activity_date', '<=', now()->addDays(14))
            ->count();

        // get unread notifications
        $personnelId = auth()->user()->id;

        $unreadCount = SystemNotification::where('personnel_id', '!=', $personnelId)
            ->whereDoesntHave('readBy', function ($query) use ($personnelId) {
                $query->where('personnel_id', $personnelId);
            })
            ->count();



        return Inertia::render('dashboard', [
            'dashboardData' => [
                'pdlByGender' => $pdlByGender,
                'caseStatusData' => $caseStatusData,
                'monthlyAdmissions' => $monthlyData,
                'cellOccupancy' => $cellOccupancy,
                'timeAllowanceData' => $timeAllowanceData,
                'securityClassificationData' => $securityClassificationData,
                'courtOrderTypes' => $courtOrderTypes,
                'verificationStatusData' => $verificationStatusData,
                'personnelByPosition' => $personnelByPosition,
                'recentActivities' => $recentActivities,
                'upcomingEvents' => $upcomingEvents,
                'unreadCount' => $unreadCount,
                'metrics' => [
                    'totalPDL' => $totalPDL,
                    'activeCases' => $activeCases,
                    'totalCases' => CaseInformation::count(),
                    'totalCapacity' => $totalCapacity,
                    'totalOccupied' => $totalOccupied,
                    'overallUtilization' => $overallUtilization,
                    'pendingVerifications' => $pendingVerifications,
                    'totalTimeAllowances' => $totalTimeAllowances,
                    'totalCourtOrders' => $totalCourtOrders,
                    'totalMedicalRecords' => $totalMedicalRecords,
                    'activePersonnel' => $activePersonnel
                ]
            ]
        ]);
    }

    public function lawEnforcementDashboard()
    {
        // Get PDL demographics by gender for law enforcement view

        $agency = Auth::user()->agency;

        $pdlByGender = Pdl::select('gender', DB::raw('count(*) as value'))
            ->whereNull('deleted_at')
            ->whereHas('personnel', function ($query) use ($agency) {
                $query->where('agency', $agency);
            })
            ->whereDoesntHave('verifications', function ($q) {
                $q->where('status', 'approved');
            })
            ->groupBy('gender')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->gender,
                    'value' => $item->value,
                    'color' => $item->gender === 'Male' ? '#3b82f6' : '#ec4899',
                ];
            });

        // Get case status distribution for law enforcement
        $caseStatusData = CaseInformation::select('case_status', DB::raw('count(*) as value'))
            ->whereHas('pdl', function ($query) use ($agency) {
                $query->whereHas('personnel', function ($query) use ($agency) {
                    $query->where('agency', $agency);
                });
            })
            ->groupBy('case_status')
            ->get()
            ->map(function ($item) {
                $colors = [
                    'Active' => '#3b82f6',
                    'Closed' => '#10b981',
                    'Pending' => '#f59e0b',
                    'On Trial' => '#8b5cf6',
                    'Appealed' => '#ef4444'
                ];
                return [
                    'name' => $item->case_status,
                    'value' => $item->value,
                    'color' => $colors[$item->case_status] ?? '#6b7280'
                ];
            });

        // Get monthly admissions (last 6 months) - law enforcement focus
        $monthlyData = collect();
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthName = $date->format('M');

            $admissions = Pdl::whereMonth('created_at', $date->month)
                ->whereHas('personnel', function ($query) use ($agency) {
                    $query->where('agency', $agency);
                })
                ->whereYear('created_at', $date->year)
                ->whereNull('deleted_at')
                ->count();

            $monthlyData->push([
                'month' => $monthName,
                'admissions' => $admissions
            ]);
        }

        // Get court order types - important for law enforcement
        $courtOrderTypes = CourtOrder::select('order_type', DB::raw('count(*) as count'))
            ->whereHas('pdl', function ($query) use ($agency) {
                $query->whereHas('personnel', function ($query) use ($agency) {
                    $query->where('agency', $agency);
                });
            })
            ->groupBy('order_type')
            ->get()
            ->map(function ($item) {
                $colors = [
                    'Commitment' => '#3b82f6',
                    'Release' => '#10b981',
                    'Hearing' => '#f59e0b',
                    'Transfer' => '#8b5cf6',
                    'Other' => '#6b7280'
                ];
                return [
                    'type' => $item->order_type,
                    'count' => $item->count,
                    'color' => $colors[$item->order_type] ?? '#6b7280'
                ];
            });

        // Get security classification distribution - critical for law enforcement
        $securityClassificationData = CaseInformation::select('security_classification', DB::raw('count(*) as count'))
            ->whereHas('pdl', function ($query) use ($agency) {
                $query->whereHas('personnel', function ($query) use ($agency) {
                    $query->where('agency', $agency);
                });
            })
            ->whereNotNull('security_classification')
            ->groupBy('security_classification')
            ->get()
            ->map(function ($item) {
                $colors = [
                    'Maximum' => '#ef4444',
                    'Medium' => '#f59e0b',
                    'Minimum' => '#10b981'
                ];
                return [
                    'classification' => $item->security_classification,
                    'count' => $item->count,
                    'color' => $colors[$item->security_classification] ?? '#6b7280'
                ];
            });

        // Get recent PDL admissions - law enforcement perspective
        $recentAdmissions = Pdl::whereNull('deleted_at')
            ->whereHas('personnel', function ($query) use ($agency) {
                $query->where('agency', $agency);
            })
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($pdl) {
                return [
                    'id' => $pdl->id,
                    'name' => "{$pdl->fname} {$pdl->lname}",
                    'admission_date' => $pdl->created_at->format('M d, Y'),
                    'age' => $pdl->age ?? 'N/A',
                    'gender' => $pdl->gender ?? 'N/A',
                    'status' => 'Active'
                ];
            });

        // Get pending court orders - important for law enforcement workflow
        $pendingCourtOrders = CourtOrder::with('pdl')
            ->whereHas('pdl', function ($query) use ($agency) {
                $query->whereHas('personnel', function ($query) use ($agency) {
                    $query->where('agency', $agency);
                });
            })
            ->where('order_date', '>=', now()->subDays(30))
            ->latest('order_date')
            ->limit(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'pdl_name' => "{$order->pdl->fname} {$order->pdl->lname}",
                    'order_type' => $order->order_type,
                    'order_date' => $order->order_date ? \Carbon\Carbon::parse($order->order_date)->format('M d, Y') : 'N/A',
                    'court' => $order->court_name ?? 'N/A',
                    'status' => 'Pending'
                ];
            });

        // Get recent case information updates
        $recentCaseUpdates = CaseInformation::with('pdl')
            ->whereHas('pdl', function ($query) use ($agency) {
                $query->whereHas('personnel', function ($query) use ($agency) {
                    $query->where('agency', $agency);
                });
            })
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($case) {
                return [
                    'id' => $case->id,
                    'pdl_name' => "{$case->pdl->fname} {$case->pdl->lname}",
                    'case_number' => $case->case_number ?? 'N/A',
                    'case_status' => $case->case_status ?? 'N/A',
                    'security_classification' => $case->security_classification ?? 'N/A',
                    'updated_at' => $case->updated_at->format('M d, Y')
                ];
            });

        // Calculate key metrics for law enforcement
        $totalPDL = Pdl::whereNull('deleted_at')
            ->whereHas('personnel', function ($query) use ($agency) {
                $query->where('agency', $agency);
            })
            ->whereDoesntHave('verifications', function ($q) {
                $q->where('status', 'approved'); // exclude those with approved verification
            })

            ->count();
        $activeCases = CaseInformation::whereBetween('case_status', ['on_trial', 'pending', 'active', 'on t'])
            ->whereHas('pdl', function ($query) use ($agency) {
                $query->whereHas('personnel', function ($query) use ($agency) {
                    $query->where('agency', $agency);
                });
            })
            ->count();
        $totalCases = CaseInformation::whereBetween('case_status', ['on_trial', 'pending', 'active', 'on trial'])
        ->whereHas('pdl', function ($query) use ($agency) {
            $query->whereHas('personnel', function ($query) use ($agency) {
                $query->where('agency', $agency);
            });
        })
        ->count();
        $pendingCourtOrdersCount = CourtOrder::where('order_date', '>=', now()->subDays(30))
        ->whereHas('pdl', function ($query) use ($agency) {
            $query->whereHas('personnel', function ($query) use ($agency) {
                $query->where('agency', $agency);
            });
        })
        ->whereHas('pdl', function ($query) use ($agency) {
            $query->whereDoesntHave('verifications', function ($q) {
                $q->where('status', 'approved');
            });
        })
        ->count();
        $totalCourtOrders = CourtOrder::whereHas('pdl', function ($query) use ($agency) {
            $query->whereHas('personnel', function ($query) use ($agency) {
                $query->where('agency', $agency);
            });
        })
        ->whereHas('pdl', function ($query) use ($agency) {
            $query->whereDoesntHave('verifications', function ($q) {
                $q->where('status', 'approved');
            });
        })
        ->count();
        $highSecurityPDL = CaseInformation::where('security_classification', 'Maximum')
            ->whereHas('pdl', function ($query) use ($agency) {
                $query->whereHas('personnel', function ($query) use ($agency) {
                    $query->where('agency', $agency);
                });
            })
            ->count();
        $mediumSecurityPDL = CaseInformation::where('security_classification', 'Medium')
            ->whereHas('pdl', function ($query) use ($agency) {
                $query->whereHas('personnel', function ($query) use ($agency) {
                    $query->where('agency', $agency);
                });
            })
            ->count();
        $lowSecurityPDL = CaseInformation::where('security_classification', 'Minimum')
            ->whereHas('pdl', function ($query) use ($agency) {
                $query->whereHas('personnel', function ($query) use ($agency) {
                    $query->where('agency', $agency);
                });
            })
            ->count();

        // Get recent activities specific to law enforcement
        $recentActivities = collect([
            // Recent PDL admissions
            ...Pdl::whereNull('deleted_at')
                ->whereHas('personnel', function ($query) use ($agency) {
                    $query->where('agency', $agency);
                })
                ->latest()
                ->limit(3)
                ->get()
                ->map(function ($pdl) {
                    return [
                        'type' => 'admission',
                        'title' => "New PDL admission - {$pdl->fname} {$pdl->lname}",
                        'description' => $pdl->created_at->diffForHumans() . " • Processing required",
                        'timestamp' => $pdl->created_at->format('M d, Y H:i'),
                        'badge' => 'New Admission',
                        'color' => 'blue'
                    ];
                }),

            // Recent court orders
            ...CourtOrder::with('pdl')
                ->whereHas('pdl', function ($query) use ($agency) {
                    $query->whereHas('personnel', function ($query) use ($agency) {
                        $query->where('agency', $agency);
                    });
                })
                ->latest('order_date')
                ->limit(2)
                ->get()
                ->map(function ($order) {
                    return [
                        'type' => 'court_order',
                        'title' => "Court order processed for {$order->pdl->fname} {$order->pdl->lname}",
                        'description' => "{$order->order_type} • {$order->created_at->diffForHumans()}",
                        'badge' => 'Court Order',
                        'timestamp' => $order->created_at->format('M d, Y H:i'),
                        'color' => 'purple'
                    ];
                }),

            // Recent case updates
            ...CaseInformation::with('pdl')
                ->whereHas('pdl', function ($query) use ($agency) {
                    $query->whereHas('personnel', function ($query) use ($agency) {
                        $query->where('agency', $agency);
                    });
                })
                ->latest()
                ->limit(2)
                ->get()
                ->map(function ($case) {
                    return [
                        'type' => 'case_update',
                        'title' => "Case update for {$case->pdl->fname} {$case->pdl->lname}",
                        'description' => $case->updated_at->diffForHumans() . " • {$case->case_status}",
                        'badge' => 'Case Update',
                        'color' => 'orange'
                    ];
                })
        ])->sortByDesc('created_at')->take(5)->values();

        return Inertia::render('law-enforcement/dashboard/dashboard', [
            'dashboardData' => [
                'pdlByGender' => $pdlByGender,
                'caseStatusData' => $caseStatusData,
                'monthlyAdmissions' => $monthlyData,
                'courtOrderTypes' => $courtOrderTypes,
                'securityClassificationData' => $securityClassificationData,
                'recentAdmissions' => $recentAdmissions,
                'pendingCourtOrders' => $pendingCourtOrders,
                'recentCaseUpdates' => $recentCaseUpdates,
                'recentActivities' => $recentActivities,
                'metrics' => [
                    'totalPDL' => $totalPDL,
                    'activeCases' => $activeCases,
                    'totalCases' => $totalCases,
                    'pendingCourtOrders' => $pendingCourtOrdersCount,
                    'totalCourtOrders' => $totalCourtOrders,
                    'highSecurityPDL' => $highSecurityPDL,
                    'mediumSecurityPDL' => $mediumSecurityPDL,
                    'lowSecurityPDL' => $lowSecurityPDL
                ]
            ]
        ]);
    }

    public function dashboard()
    {
        // Records Officer Dashboard - Focus on verification and record management

        // Get pending verifications count and details
        $agency = Auth::user()->agency;

        $pendingVerifications = Verifications::where('status', 'pending')
            ->whereHas('pdl', function ($query) use ($agency) {
                $query->whereHas('personnel', function ($query) use ($agency) {
                    $query->where('agency', $agency);
                });
            })
            ->with('pdl')
            ->latest()
            ->get()
            ->map(function ($verification) {
                return [
                    'id' => $verification->id,
                    'pdl_id' => $verification->pdl_id,
                    'pdl_name' => "{$verification->pdl->fname} {$verification->pdl->lname}",
                    'verification_type' => $verification->verification_type ?? 'General',
                    'submitted_at' => $verification->created_at->format('M d, Y'),
                    'days_pending' => $verification->created_at->diffInDays(now()),
                    'priority' => $verification->created_at->diffInDays(now()) > 7 ? 'High' : 'Normal'
                ];
            });

        // Get verification status distribution
        $verificationStatusData = Verifications::select('status', DB::raw('count(*) as count'))
            ->whereHas('pdl', function ($query) use ($agency) {
                $query->whereHas('personnel', function ($query) use ($agency) {
                    $query->where('agency', $agency);
                });
            })
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                $colors = [
                    'pending' => '#f59e0b',
                    'approved' => '#10b981',
                    'rejected' => '#ef4444'
                ];
                return [
                    'status' => ucfirst($item->status),
                    'count' => $item->count,
                    'color' => $colors[$item->status] ?? '#6b7280'
                ];
            });

        // Get recent PDL records created (last 30 days)
        $recentPDLRecords = Pdl::whereNull('deleted_at')
            ->whereHas('personnel', function ($query) use ($agency) {
                $query->where('agency', $agency);
            })
            ->where('created_at', '>=', now()->subDays(30))
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($pdl) {
                return [
                    'id' => $pdl->id,
                    'name' => "{$pdl->fname} {$pdl->lname}",
                    'created_at' => $pdl->created_at->format('M d, Y'),
                    'age' => $pdl->age ?? 'N/A',
                    'gender' => $pdl->gender ?? 'N/A',
                    'status' => 'Active'
                ];
            });

        // Get incomplete PDL records (missing required information)
        $incompleteRecords = Pdl::whereNull('deleted_at')
            ->whereHas('personnel', function ($query) use ($agency) {
                $query->where('agency', $agency);
            })
            ->where(function ($query) {
                $query->whereNull('fname')
                    ->orWhereNull('lname')
                    ->orWhereNull('birthdate')
                    ->orWhereNull('gender')
                    ->orWhereNull('ethnic_group')
                    ->orWhereNull('civil_status');
            })
            ->limit(10)
            ->get()
            ->map(function ($pdl) {
                $missingFields = [];
                if (!$pdl->fname) $missingFields[] = 'First Name';
                if (!$pdl->lname) $missingFields[] = 'Last Name';
                if (!$pdl->birthdate) $missingFields[] = 'Birth Date';
                if (!$pdl->gender) $missingFields[] = 'Gender';
                if (!$pdl->ethnic_group) $missingFields[] = 'Ethnic Group';
                if (!$pdl->civil_status) $missingFields[] = 'Civil Status';

                return [
                    'id' => $pdl->id,
                    'name' => "{$pdl->fname} {$pdl->lname}",
                    'missing_fields' => implode(', ', $missingFields),
                    'created_at' => $pdl->created_at->format('M d, Y')
                ];
            });

        // Get case information status
        $caseStatusData = CaseInformation::select('case_status', DB::raw('count(*) as count'))
            ->whereHas('pdl', function ($query) use ($agency) {
                $query->whereHas('personnel', function ($query) use ($agency) {
                    $query->where('agency', $agency);
                });
            })
            ->groupBy('case_status')
            ->get()
            ->map(function ($item) {
                $colors = [
                    'Active' => '#3b82f6',
                    'Closed' => '#10b981',
                    'Pending' => '#f59e0b',
                    'On Trial' => '#8b5cf6',
                    'Appealed' => '#ef4444'
                ];
                return [
                    'status' => $item->case_status,
                    'count' => $item->count,
                    'color' => $colors[$item->case_status] ?? '#6b7280'
                ];
            });

        // Get monthly record processing (last 6 months)
        $monthlyProcessing = collect();
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthName = $date->format('M');

            $recordsCreated = Pdl::whereMonth('created_at', $date->month)
                ->whereHas('personnel', function ($query) use ($agency) {
                    $query->where('agency', $agency);
                })
                ->whereYear('created_at', $date->year)
                ->whereNull('deleted_at')
                ->count();

            $verificationsProcessed = Verifications::whereMonth('updated_at', $date->month)
                ->whereHas('pdl', function ($query) use ($agency) {
                    $query->whereHas('personnel', function ($query) use ($agency) {
                        $query->where('agency', $agency);
                    });
                })
                ->whereYear('updated_at', $date->year)
                ->whereIn('status', ['approved', 'rejected'])
                ->count();

            $monthlyProcessing->push([
                'month' => $monthName,
                'records_created' => $recordsCreated,
                'verifications_processed' => $verificationsProcessed
            ]);
        }

        // Get recent activities for records officer
        $recentActivities = collect([
            // Recent verifications
            ...Verifications::with('pdl')
                ->where('status', 'pending')
                ->whereHas('pdl', function ($query) use ($agency) {
                    $query->whereHas('personnel', function ($query) use ($agency) {
                        $query->where('agency', $agency);
                    });
                })
                ->latest()
                ->limit(3)
                ->get()
                ->map(function ($verification) {
                    return [
                        'type' => 'verification',
                        'title' => "Verification request for {$verification->pdl->fname} {$verification->pdl->lname}",
                        'description' => $verification->created_at->diffForHumans() . " • Awaiting review",
                        'badge' => 'Verification',
                        'color' => 'orange',
                        'priority' => $verification->created_at->diffInDays(now()) > 7 ? 'High' : 'Normal'
                    ];
                }),

            // Recent PDL records
            ...Pdl::whereNull('deleted_at')
                ->whereHas('personnel', function ($query) use ($agency) {
                    $query->where('agency', $agency);
                })
                ->latest()
                ->limit(2)
                ->get()
                ->map(function ($pdl) {
                    return [
                        'type' => 'pdl_record',
                        'title' => "New PDL record created - {$pdl->fname} {$pdl->lname}",
                        'description' => $pdl->created_at->diffForHumans() . " • Record ID: {$pdl->id}",
                        'badge' => 'New Record',
                        'color' => 'blue'
                    ];
                }),

            // Recent case information updates
            ...CaseInformation::with('pdl')
                ->whereHas('pdl', function ($query) use ($agency) {
                    $query->whereHas('personnel', function ($query) use ($agency) {
                        $query->where('agency', $agency);
                    });
                })
                ->latest()
                ->limit(2)
                ->get()
                ->map(function ($case) {
                    return [
                        'type' => 'case_update',
                        'title' => "Case information updated for {$case->pdl->fname} {$case->pdl->lname}",
                        'description' => $case->updated_at->diffForHumans() . " • {$case->case_status}",
                        'badge' => 'Case Update',
                        'color' => 'green'
                    ];
                })
        ])->sortByDesc('created_at')->take(5)->values();

        // Calculate key metrics for records officer
        $totalPDL = Pdl::whereNull('deleted_at')
            ->whereHas('personnel', function ($query) use ($agency) {
                $query->where('agency', $agency);
            })
            ->whereHas('verifications', function ($query) {
                $query->where('status', 'approved');
            })
            ->count();
        $pendingVerificationsCount = Verifications::where('status', 'pending')->count();
        $approvedVerificationsCount = Verifications::where('status', 'approved')->count();
        $rejectedVerificationsCount = Verifications::where('status', 'rejected')->count();
        $totalVerifications = Verifications::count();
        $incompleteRecordsCount = Pdl::whereNull('deleted_at')
            ->whereHas('personnel', function ($query) use ($agency) {
                $query->where('agency', $agency);
            })
            ->where(function ($query) {
                $query->whereNull('fname')
                    ->orWhereNull('lname')
                    ->orWhereNull('birthdate')
                    ->orWhereNull('gender')
                    ->orWhereNull('ethnic_group')
                    ->orWhereNull('civil_status');
            })
            ->count();
        $totalCases = CaseInformation::whereHas('pdl', function ($query) use ($agency) {
            $query->whereHas('personnel', function ($query) use ($agency) {
                $query->where('agency', $agency);
            });
        })
        ->whereHas('pdl', function ($query) use ($agency) {
            $query->whereDoesntHave('verifications', function ($q) {
                $q->where('status', 'approved');
            });
        })
        ->count();
        $activeCases = CaseInformation::whereBetween('case_status', ['on_trial', 'pending', 'active', 'on trial'])
            ->whereHas('pdl', function ($query) use ($agency) {
                $query->whereHas('personnel', function ($query) use ($agency) {
                    $query->where('agency', $agency);
                });
            })
            ->whereHas('pdl', function ($query) use ($agency) {
                $query->whereDoesntHave('verifications', function ($q) {
                    $q->where('status', 'approved');
                });
            })

            ->count();
        $recordsCreatedThisMonth = Pdl::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->whereNull('deleted_at')
            ->count();

        // Get time allowances distribution - separate GCTA and TASTM for records officer
        $gctaCount = TimeAllowance::where('type', 'gcta')
            ->whereHas('pdl', function ($query) use ($agency) {
                $query->whereHas('personnel', function ($query) use ($agency) {
                    $query->where('agency', $agency);
                });
            })
            ->count();
        $tastmCount = TimeAllowance::where('type', 'tastm')
            ->whereHas('pdl', function ($query) use ($agency) {
                $query->whereHas('personnel', function ($query) use ($agency) {
                    $query->where('agency', $agency);
                });
            })
            ->count();

        $timeAllowanceData = collect([
            [
                'type' => 'GCTA',
                'count' => $gctaCount,
                'color' => '#10b981',
                'description' => 'Good Conduct Time Allowance'
            ],
            [
                'type' => 'TASTM',
                'count' => $tastmCount,
                'color' => '#f59e0b',
                'description' => 'Time Allowance for Study, Teaching, and Mentoring'
            ]
        ]);

        return Inertia::render('records-officer/dashboard/dashboard', [
            'dashboardData' => [
                'pendingVerifications' => $pendingVerifications,
                'verificationStatusData' => $verificationStatusData,
                'recentPDLRecords' => $recentPDLRecords,
                'incompleteRecords' => $incompleteRecords,
                'caseStatusData' => $caseStatusData,
                'monthlyProcessing' => $monthlyProcessing,
                'recentActivities' => $recentActivities,
                'timeAllowanceData' => $timeAllowanceData,
                'metrics' => [
                    'totalPDL' => $totalPDL,
                    'pendingVerifications' => $pendingVerificationsCount,
                    'approvedVerifications' => $approvedVerificationsCount,
                    'rejectedVerifications' => $rejectedVerificationsCount,
                    'totalVerifications' => $totalVerifications,
                    'incompleteRecords' => $incompleteRecordsCount,
                    'totalCases' => $totalCases,
                    'activeCases' => $activeCases,
                    'recordsCreatedThisMonth' => $recordsCreatedThisMonth
                ]
            ]
        ]);
    }
}
