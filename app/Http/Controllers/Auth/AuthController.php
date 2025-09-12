<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Faker\Provider\ar_EG\Person;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Personnel;
use App\Models\PasswordReset;
use App\Models\SystemNotification;

class AuthController extends Controller
{

    public function index()
    {
        return Inertia::render('welcome');
    }

    public function dashboard()
    {
        return Inertia::render('dashboard');
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = Auth::user();

        if ($user->position === 'admin') {
            return redirect()->route('dashboard');
        } elseif ($user->position === 'record-officer') {
            return redirect()->route('dashboard.record-officer');
        } else if ($user->position === 'law-enforcement') {
            return redirect()->route('dashboard.record-officer');
        } else {
            return redirect()->route('home');
        }
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    public function forgot_password()
    {
        return Inertia::render('forgot-password');
    }

    public function handle_forgot_password(Request $request)
    {

        $username_or_phone = $request->input('usernameOrPhone');

        $personnel = Personnel::where('username', $username_or_phone)
            ->orWhere('contactnum', $username_or_phone)
            ->first();
        if (!$personnel) {
            return Redirect::back()->withErrors(['error' => 'No account found with that username or phone number.'])->withInput();
        }



        PasswordReset::create([
            'personnel_id' => $personnel->id,
            'is_used' => false,
            'created_at' => now(),
        ]);


        return Redirect::back()->with('status', 'If an account with that username or phone number exists, a password reset request has been sent to the admin.');
    }
}
