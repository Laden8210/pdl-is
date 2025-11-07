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
use App\Models\Sms;
use App\Models\SystemNotification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{

    public function index()
    {
        return Inertia::render('welcome');
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

        if ($personnel->position === 'admin') {

            $otpCode = rand(100000, 999999);
            $otpExpiresAt = now()->addMinutes(10);


            $sms = Sms::create([
                'recipient_number' => $personnel->contactnum,
                'message' => "Your OTP code for password reset is: {$otpCode}. This code will expire in 10 minutes.",
                'otp_code' => $otpCode,
                'otp_expires_at' => $otpExpiresAt,
                'personnel_id' => $personnel->id,
                'is_used' => false,
            ]);

            // create session for the otp
            $request->session()->put('otp_personnel_id', $personnel->id);
            $request->session()->put('is_request_otp', true);


            return Inertia::render('otp', [
                'personnel_id' => $personnel->id,
                'phone_number' => substr($personnel->contactnum, -4),
                'message' => 'OTP has been sent to your registered phone number.',
            ]);
        } else {

            $adminPersonnel = Personnel::where('position', 'admin')->first();

            if ($adminPersonnel) {
                Sms::create([
                    'recipient_number' => $adminPersonnel->contactnum,
                    'message' => "Password reset requested for personnel: {$personnel->username} ({$personnel->name}). Please contact them to proceed.",
                    'personnel_id' => $adminPersonnel->id,
                ]);
            }

            PasswordReset::create([
                'personnel_id' => $personnel->id,
                'is_used' => false,
                'created_at' => now(),
            ]);

            return Redirect::back()->with('status', 'Password reset request has been sent to administrator.');
        }
    }

    /**
     * Verify OTP code
     */
    public function verify_otp(Request $request)
    {
        $request->validate([
            'otp_code' => 'required|string|size:6',
            'personnel_id' => 'required|exists:personnel,id',
        ]);

        // Find valid OTP record
        $sms = Sms::where('personnel_id', $request->personnel_id)
            ->where('otp_code', $request->otp_code)
            ->where('is_used', false)
            ->where('otp_expires_at', '>', now())
            ->first();

        if (!$sms) {
            // Instead of Redirect::back(), render the OTP page again with errors
            return Inertia::render('otp', [
                'personnel_id' => $request->personnel_id,
                'phone_number' => substr($sms->personnel->contactnum ?? '', -4),
                'message' => '',
                'errors' => ['otp_code' => 'Invalid or expired OTP code.']
            ]);
        }

        // Mark OTP as used
        $sms->update(['is_used' => true]);

        // Generate reset token and store in cache
        $resetToken = Str::random(60);

        // Store token in cache for 30 minutes
        cache()->put('password_reset_' . $resetToken, [
            'personnel_id' => $request->personnel_id,
            'email' => $sms->personnel->email,
            'created_at' => now(),
        ], now()->addMinutes(30));

        // Clear the session variables
        $request->session()->forget(['otp_personnel_id', 'is_request_otp']);

        // Redirect to password reset page
        return Inertia::render('reset-password', [
            'personnel_id' => $request->personnel_id,
            'token' => $resetToken,
            'email' => $sms->personnel->email,
        ]);
    }

    /**
     * Resend OTP code
     */
    public function resend_otp(Request $request)
    {
        $request->validate([
            'personnel_id' => 'required|exists:personnel,id',
        ]);

        $personnel = Personnel::find($request->personnel_id);

        if (!$personnel || $personnel->position !== 'admin') {
            return Inertia::render('otp', [
                'personnel_id' => $request->personnel_id,
                'phone_number' => substr($personnel->contactnum ?? '', -4),
                'message' => '',
                'errors' => ['error' => 'Unable to resend OTP. Admin privileges required.']
            ]);
        }

        // Invalidate any existing unused OTPs for this personnel
        Sms::where('personnel_id', $personnel->id)
            ->where('is_used', false)
            ->where('otp_expires_at', '>', now())
            ->update(['is_used' => true]);

        // Generate new OTP
        $otpCode = rand(100000, 999999);
        $otpExpiresAt = now()->addMinutes(10);

        // Create new SMS record with OTP
        Sms::create([
            'recipient_number' => $personnel->contactnum,
            'message' => "Your new OTP code for password reset is: {$otpCode}. This code will expire in 10 minutes.",
            'otp_code' => $otpCode,
            'otp_expires_at' => $otpExpiresAt,
            'personnel_id' => $personnel->id,
            'is_used' => false,
        ]);

        return Inertia::render('otp', [
            'personnel_id' => $request->personnel_id,
            'phone_number' => substr($personnel->contactnum, -4),
            'message' => 'New OTP has been sent to your phone number.',
        ]);
    }

    /**
     * Handle password reset after OTP verification
     */
    public function reset_password(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'personnel_id' => 'required|exists:personnel,id',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Verify reset token
        $resetData = cache()->get('password_reset_' . $request->token);

        if (!$resetData) {
            return Redirect::back()->withErrors(['error' => 'Invalid or expired reset token.'])->withInput();
        }

        if ($resetData['personnel_id'] != $request->personnel_id) {
            return Redirect::back()->withErrors(['error' => 'Invalid reset request.'])->withInput();
        }

        // Update personnel password
        $personnel = Personnel::find($request->personnel_id);
        $personnel->update([
            'password' => Hash::make($request->password),
        ]);

        // Invalidate the reset token
        cache()->forget('password_reset_' . $request->token);

        // Create a log entry for the password reset
        Sms::create([
            'recipient_number' => $personnel->contactnum,
            'message' => "Your password has been successfully reset. If you didn't perform this action, please contact administrator immediately.",
            'personnel_id' => $personnel->id,
        ]);

        return Redirect::route('login')->with('status', 'Password has been reset successfully. Please login with your new password.');
    }

    /**
     * Show reset password form (after OTP verification)
     */
    public function show_reset_password(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'personnel_id' => 'required|exists:personnel,id',
        ]);

        $resetData = cache()->get('password_reset_' . $request->token);

        if (!$resetData || $resetData['personnel_id'] != $request->personnel_id) {
            return Redirect::route('login')->withErrors(['error' => 'Invalid or expired reset link.']);
        }

        return Inertia::render('reset-password', [
            'personnel_id' => $request->personnel_id,
            'token' => $request->token,
            'email' => $resetData['email'],
        ]);
    }
}
