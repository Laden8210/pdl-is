<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class AuthController extends Controller
{

    public function index(){
        return Inertia::render('welcome');
    }

    public function dashboard(){
        return Inertia::render('dashboard');
    }

    public function store(LoginRequest $request): RedirectResponse{
        $request->authenticate();
        $request->session()->regenerate();

        $user = Auth::user();

        if ($user->position === 'admin') {
            return redirect()->route('dashboard');
        } elseif ($user->position === 'record-officer') {
            return redirect()->route('dashboard.record-officer');
        }else if ($user->position === 'law-enforcement') {
            return redirect()->route('dashboard.record-officer');
        }
        else {
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
}
