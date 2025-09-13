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

class DashboardController extends Controller
{
    public function index()
    {
        // Get PDL demographics by gender
        $pdlByGender = Pdl::select('gender', DB::raw('count(*) as value'))
            ->whereNull('deleted_at')
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

        // Get time allowances distribution
        $timeAllowanceData = TimeAllowance::select('type', DB::raw('count(*) as count'))
            ->groupBy('type')
            ->get()
            ->map(function ($item) {
                return [
                    'type' => strtoupper($item->type),
                    'count' => $item->count,
                    'color' => $item->type === 'gcta' ? '#10b981' : '#f59e0b'
                ];
            });

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
        $totalPDL = Pdl::whereNull('deleted_at')->count();
        $activeCases = CaseInformation::where('case_status', 'Active')->count();
        $totalCapacity = Cells::where('status', 'active')->sum('capacity');
        $totalOccupied = CellAssignment::whereHas('pdl', function ($query) {
            $query->whereNull('deleted_at');
        })->count();
        $overallUtilization = $totalCapacity > 0 ? round(($totalOccupied / $totalCapacity) * 100) : 0;
        $pendingVerifications = Verifications::where('status', 'pending')->count();
        $totalTimeAllowances = TimeAllowance::count();
        $totalCourtOrders = CourtOrder::count();
        $totalMedicalRecords = MedicalRecord::count();
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
                        'badge' => 'Medical',
                        'color' => 'orange'
                    ];
                })
        ])->sortByDesc('created_at')->take(5)->values();

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
}
