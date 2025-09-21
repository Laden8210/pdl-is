<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pdl;
use App\Models\CourtOrder;

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
                'order_date' => now(),
                'received_date' => now(),
                'remarks' => 'Custody management entry',
                'admission_date' => $request->admission_date,
                'release_date' => $request->release_date,
            ]);
        }

        return redirect()->back()->with('success', 'Custody dates updated successfully.');
    }
}
