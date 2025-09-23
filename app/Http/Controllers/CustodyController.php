<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pdl;
use App\Models\CourtOrder;
use App\Models\TimeAllowance;
use Carbon\Carbon;

class CustodyController extends Controller
{
    public function update(Request $request, $pdlId)
    {
        $request->validate([
            'admission_date' => 'required|date',
            'release_date' => 'nullable|date|after:admission_date',
        ]);

        $pdl = Pdl::findOrFail($pdlId);

        // Update the admission_date and release_date in the court_orders table
        // We'll update the earliest court order with admission_date
        $courtOrder = $pdl->courtOrders()
            ->whereNotNull('admission_date')
            ->orderBy('admission_date', 'asc')
            ->first();

        if (!$courtOrder) {
            // If no court order exists with admission_date, get the first one
            $courtOrder = $pdl->courtOrders()->first();
        }

        if ($courtOrder) {
            $courtOrder->update([
                'admission_date' => $request->admission_date,
                'release_date' => $request->release_date,
            ]);
        } else {
            // If no court orders exist, create a new one
            CourtOrder::create([
                'pdl_id' => $pdlId,
                'court_order_number' => 'CUSTODY-' . $pdlId . '-' . now()->format('Ymd'),
                'order_type' => 'CUSTODY_MANAGEMENT',
                'court_branch' => 'CUSTODY_MANAGEMENT',
                'order_date' => now(),
                'received_date' => now(),
                'remarks' => 'Custody management entry',
                'admission_date' => $request->admission_date,
                'release_date' => $request->release_date,
            ]);
        }

        // Record monthly time allowances for GCTA and TASTM
        $this->recordMonthlyTimeAllowances($pdl, $request->admission_date, $request->release_date);

        return redirect()->back()->with('success', 'Custody dates updated successfully with monthly time allowances recorded.');
    }

    /**
     * Record monthly GCTA and TASTM time allowances for each month served
     */
    private function recordMonthlyTimeAllowances(Pdl $pdl, $admissionDate, $releaseDate = null)
    {
        $admissionDate = Carbon::parse($admissionDate);
        $endDate = $releaseDate ? Carbon::parse($releaseDate) : now();

        // Clear existing time allowances for this PDL to avoid duplicates
        TimeAllowance::where('pdl_id', $pdl->id)->delete();

        // Start from the first day of admission month
        $currentMonth = $admissionDate->copy()->startOfMonth();
        $monthsServed = 0;

        while ($currentMonth->lessThanOrEqualTo($endDate)) {
            $monthsServed++;
            $yearsServed = floor($monthsServed / 12);

            // Calculate GCTA days for this period
            $gctaDays = $this->calculateGctaDays($yearsServed);

            // TASTM is always 15 days per month
            $tastmDays = 15;

            // Create GCTA record for this month
            TimeAllowance::create([
                'pdl_id' => $pdl->id,
                'type' => 'GCTA',
                'days' => $gctaDays,
                'reason' => "GCTA for " . $currentMonth->format('F Y') . " ({$yearsServed} years served)",
                'awarded_by' => auth()->id() ?? 1,
                'awarded_at' => $currentMonth->copy()->endOfMonth(), // Award at end of month
            ]);

            // Create TASTM record for this month
            TimeAllowance::create([
                'pdl_id' => $pdl->id,
                'type' => 'TASTM',
                'days' => $tastmDays,
                'reason' => "TASTM for " . $currentMonth->format('F Y'),
                'awarded_by' => auth()->id() ?? 1,
                'awarded_at' => $currentMonth->copy()->endOfMonth(), // Award at end of month
            ]);

            // Move to next month
            $currentMonth->addMonth();
        }
    }

    /**
     * Calculate GCTA days based on years served
     */
    private function calculateGctaDays($yearsServed)
    {
        if ($yearsServed >= 11) {
            return 30; // 11+ years served
        } elseif ($yearsServed >= 6) {
            return 25; // 6-10 years served
        } elseif ($yearsServed >= 3) {
            return 23; // 3-5 years served
        } else {
            return 20; // 0-2 years served
        }
    }

    /**
     * Add time allowances for a new month (can be called monthly via cron job)
     */
    public function addMonthlyAllowances()
    {
        // Get all active PDLs (those without release date or future release date)
        $activePdls = Pdl::whereHas('courtOrders', function($query) {
            $query->whereNotNull('admission_date')
                  ->where(function($q) {
                      $q->whereNull('release_date')
                        ->orWhere('release_date', '>', now());
                  });
        })->get();

        $currentMonth = now()->startOfMonth();
        $addedCount = 0;

        foreach ($activePdls as $pdl) {
            $courtOrder = $pdl->courtOrders()
                ->whereNotNull('admission_date')
                ->orderBy('admission_date', 'asc')
                ->first();

            if (!$courtOrder) continue;

            $admissionDate = Carbon::parse($courtOrder->admission_date);

            // Skip if admission is in the future
            if ($admissionDate->greaterThan($currentMonth)) continue;

            // Check if allowances already exist for current month
            $existingAllowances = TimeAllowance::where('pdl_id', $pdl->id)
                ->whereMonth('awarded_at', $currentMonth->month)
                ->whereYear('awarded_at', $currentMonth->year)
                ->exists();

            if ($existingAllowances) continue;

            // Calculate months served
            $monthsServed = $admissionDate->diffInMonths($currentMonth) + 1;
            $yearsServed = floor($monthsServed / 12);

            $gctaDays = $this->calculateGctaDays($yearsServed);
            $tastmDays = 15;

            // Create GCTA record
            TimeAllowance::create([
                'pdl_id' => $pdl->id,
                'type' => 'GCTA',
                'days' => $gctaDays,
                'reason' => "GCTA for " . $currentMonth->format('F Y') . " ({$yearsServed} years served)",
                'awarded_by' => auth()->id() ?? 1,
                'awarded_at' => $currentMonth->copy()->endOfMonth(),
            ]);

            // Create TASTM record
            TimeAllowance::create([
                'pdl_id' => $pdl->id,
                'type' => 'TASTM',
                'days' => $tastmDays,
                'reason' => "TASTM for " . $currentMonth->format('F Y'),
                'awarded_by' => auth()->id() ?? 1,
                'awarded_at' => $currentMonth->copy()->endOfMonth(),
            ]);

            $addedCount++;
        }

        return response()->json([
            'success' => true,
            'message' => "Monthly allowances added for {$addedCount} active PDLs."
        ]);
    }

    /**
     * Recalculate all time allowances for a specific PDL
     */
    public function recalculateTimeAllowances($pdlId)
    {
        $pdl = Pdl::findOrFail($pdlId);

        $courtOrder = $pdl->courtOrders()
            ->whereNotNull('admission_date')
            ->orderBy('admission_date', 'asc')
            ->first();

        if ($courtOrder && $courtOrder->admission_date) {
            $this->recordMonthlyTimeAllowances($pdl, $courtOrder->admission_date, $courtOrder->release_date);

            return redirect()->back()->with('success', 'Time allowances recalculated successfully.');
        }

        return redirect()->back()->with('error', 'No admission date found for this PDL.');
    }

    /**
     * Get time allowance summary for a PDL
     */
    public function getTimeAllowanceSummary($pdlId)
    {
        $pdl = Pdl::findOrFail($pdlId);

        $summary = [
            'total_gcta_days' => TimeAllowance::where('pdl_id', $pdlId)->where('type', 'GCTA')->sum('days'),
            'total_tastm_days' => TimeAllowance::where('pdl_id', $pdlId)->where('type', 'TASTM')->sum('days'),
            'total_months_served' => TimeAllowance::where('pdl_id', $pdlId)->where('type', 'GCTA')->count(),
            'allowances_by_month' => TimeAllowance::where('pdl_id', $pdlId)
                ->selectRaw('YEAR(awarded_at) as year, MONTH(awarded_at) as month, type, SUM(days) as total_days')
                ->groupBy('year', 'month', 'type')
                ->orderBy('year', 'desc')
                ->orderBy('month', 'desc')
                ->get()
        ];

        return response()->json($summary);
    }
}
