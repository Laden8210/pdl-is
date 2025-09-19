<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\PdlAlert;
use App\Models\Pdl;
use App\Models\Personnel;
use App\Services\NotificationService;
use Illuminate\Support\Facades\Auth;

class PdlAlertController extends Controller
{
    /**
     * Display a listing of PDL alerts
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $alertType = $request->input('alert_type');
        $status = $request->input('status');
        $perPage = $request->input('perPage', 10);

        $alerts = PdlAlert::with(['pdl', 'createdBy', 'assignedTo'])
            ->when($search, function ($query, $search) {
                $query->whereHas('pdl', function ($q) use ($search) {
                    $q->where('fname', 'like', "%{$search}%")
                      ->orWhere('lname', 'like', "%{$search}%");
                })
                ->orWhere('title', 'like', "%{$search}%");
            })
            ->when($alertType, function ($query, $alertType) {
                $query->where('alert_type', $alertType);
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest('scheduled_date')
            ->paginate($perPage);

        return Inertia::render('admin/pdl-management/alerts', [
            'alerts' => $alerts->items(),
            'alertTypes' => PdlAlert::ALERT_TYPES,
            'statuses' => PdlAlert::STATUSES,
            'filters' => [
                'search' => $search,
                'alert_type' => $alertType,
                'status' => $status,
            ],
            'pagination' => [
                'current_page' => $alerts->currentPage(),
                'last_page' => $alerts->lastPage(),
                'total' => $alerts->total(),
            ]
        ]);
    }

    /**
     * Show the form for creating a new PDL alert
     */
    public function create()
    {
        $pdls = Pdl::select('id', 'fname', 'lname')->get();
        $personnel = Personnel::select('id', 'fname', 'lname', 'position')->get();

        return Inertia::render('admin/pdl-management/create-alert', [
            'pdls' => $pdls,
            'personnel' => $personnel,
            'alertTypes' => PdlAlert::ALERT_TYPES,
        ]);
    }

    /**
     * Store a newly created PDL alert
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'pdl_id' => 'required|exists:pdl,id',
            'alert_type' => 'required|string',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'scheduled_date' => 'required|date|after:now',
            'reminder_date' => 'nullable|date|before:scheduled_date',
            'location' => 'nullable|string|max:255',
            'assigned_to' => 'nullable|exists:personnel,id',
        ]);

        $validated['created_by'] = Auth::id();

        // Set default reminder date if not provided
        if (!$validated['reminder_date']) {
            $scheduledDate = \Carbon\Carbon::parse($validated['scheduled_date']);
            $validated['reminder_date'] = $scheduledDate->subHours(2); // Default 2 hours before
        }

        $alert = PdlAlert::create($validated);

        // Create notification
        NotificationService::pdlAlertCreated($alert);

        return redirect()->route('pdl-alerts.index')
            ->with('success', 'PDL alert created successfully.');
    }

    /**
     * Display the specified PDL alert
     */
    public function show(PdlAlert $alert)
    {
        $alert->load(['pdl', 'createdBy', 'assignedTo']);

        return Inertia::render('admin/pdl-management/show-alert', [
            'alert' => $alert,
        ]);
    }

    /**
     * Show the form for editing the specified PDL alert
     */
    public function edit(PdlAlert $alert)
    {
        $pdls = Pdl::select('id', 'fname', 'lname')->get();
        $personnel = Personnel::select('id', 'fname', 'lname', 'position')->get();

        return Inertia::render('admin/pdl-management/edit-alert', [
            'alert' => $alert,
            'pdls' => $pdls,
            'personnel' => $personnel,
            'alertTypes' => PdlAlert::ALERT_TYPES,
        ]);
    }

    /**
     * Update the specified PDL alert
     */
    public function update(Request $request, PdlAlert $alert)
    {
        $validated = $request->validate([
            'pdl_id' => 'required|exists:pdl,id',
            'alert_type' => 'required|string',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'scheduled_date' => 'required|date',
            'reminder_date' => 'nullable|date|before:scheduled_date',
            'location' => 'nullable|string|max:255',
            'assigned_to' => 'nullable|exists:personnel,id',
            'status' => 'required|string|in:pending,completed,cancelled,rescheduled',
        ]);

        $oldStatus = $alert->status;
        $alert->update($validated);

        // Create notification for status change if status changed
        if ($oldStatus !== $validated['status']) {
            NotificationService::pdlAlertStatusChanged($alert, $oldStatus, $validated['status']);
        }

        return redirect()->route('pdl-alerts.index')
            ->with('success', 'PDL alert updated successfully.');
    }

    /**
     * Remove the specified PDL alert
     */
    public function destroy(PdlAlert $alert)
    {
        $alert->delete();

        return redirect()->route('pdl-alerts.index')
            ->with('success', 'PDL alert deleted successfully.');
    }

    /**
     * Get upcoming alerts for dashboard
     */
    public function upcoming(Request $request)
    {
        $days = $request->input('days', 7);

        $alerts = PdlAlert::upcoming($days)
            ->with(['pdl', 'assignedTo'])
            ->orderBy('scheduled_date')
            ->get();

        return response()->json($alerts);
    }

    /**
     * Mark alert as completed
     */
    public function markCompleted(PdlAlert $alert)
    {
        $oldStatus = $alert->status;
        $alert->update(['status' => 'completed']);

        NotificationService::pdlAlertStatusChanged($alert, $oldStatus, 'completed');

        return redirect()->back()
            ->with('success', 'Alert marked as completed.');
    }
}
