<?php

namespace App\Http\Controllers;

use App\Models\Sms;
use Illuminate\Http\Request;

class SMSController extends Controller
{
    public function getPending()
    {
        $pendingSms = Sms::where('is_sent', false)
            ->where('is_used', false)
            ->orderBy('created_at', 'asc')
            ->limit(10)
            ->get(['id', 'recipient_number', 'message']); 

        return response()->json([
            'success' => true,
            'data' => $pendingSms,
            'count' => $pendingSms->count()
        ]);
    }

    public function markAsUsed($id)
    {
        $sms = Sms::findOrFail($id);
        $sms->is_used = true;
        $sms->save();

        return response()->json(['message' => 'SMS marked as used.']);
    }
}
