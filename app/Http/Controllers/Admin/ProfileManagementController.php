<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdateProfileRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/profile-management/profie');
    }



    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        $user = Auth::user();

        $user->fname = $request->input('firstName');
        $user->lname = $request->input('lastName');
        $user->mname = $request->input('middleName');
        $user->position = $request->input('position');
        $user->status = $request->input('status');

        if ($request->filled('password')) {
            $user->password = Hash::make($request->input('password'));
        }

        if ($request->hasFile('profileImage')) {

            if ($user->profile_image) {
                Storage::delete($user->profile_image);
            }

            $path = $request->file('profileImage')->store('profile_images', 'public');
            
            $user->avatar = $path;
        }

        $user->save();

        return redirect()->back()->with('success', 'Profile updated successfully.');
    }
}
