<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Personnel;
use App\Http\Requests\Profile\CreateUserRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\UpdateUserRequest;
use App\Models\PasswordReset;
use Illuminate\Support\Facades\Validator;
use Mockery\Generator\StringManipulation\Pass\Pass;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search', '');

        $users = Personnel::with(['passwordResets' => function ($query) {
            $query->where('is_used', false)
                ->where('created_at', '>', now()->subHours(24));
        }])
            ->when($search, function ($query, $search) {
                $query->where('fname', 'like', "%$search%")
                    ->orWhere('lname', 'like', "%$search%")
                    ->orWhere('username', 'like', "%$search%");
            })
            ->paginate(10)
            ->appends(['search' => $search]);

        return Inertia::render('admin/user-management/list', [
            'users' => $users,
            'filters' => [
                'search' => $search
            ],
        ]);
    }

    public function resetPassword(Request $request, $id)
    {

        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ], [
            'password.required' => 'Password is required',
            'password.min' => 'Password must be at least 8 characters',
            'password.confirmed' => 'Passwords do not match',
        ]);

        try {

            $user = Personnel::findOrFail($id);

            $user->password = Hash::make($request->password);
            $user->save();

            PasswordReset::where('personnel_id', $user->id)
                ->where('is_used', false)

                ->update(['is_used' => true]);

            return redirect()->back()->with('success', 'Password has been reset successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to reset password: ' . $e->getMessage());
        }
    }

    public function store(CreateUserRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $user = new Personnel();
        $user->fname = $data['firstName'];
        $user->lname = $data['lastName'];
        $user->mname = $data['middleName'] ?? null;
        $user->position = $data['position'];
        $user->contactnum = $data['contactNumber'];
        $user->agency = $data['agency'];
        $user->status = 1;
        $user->username = $data['username'];
        $user->password = Hash::make($data['password']);

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('profile_images', 'public');
            $user->avatar = $path;
        }

        $user->save();

        return redirect()->route('user-management.index')->with('success', 'User created successfully.');
    }

    public function destroy($id)
    {
        $personnel = Personnel::find($id);

        if (!$personnel) {
            return back()->withErrors(['user' => 'User not found.']);
        }


        $personnel->delete();

        return back()->with('success', 'User archived successfully.');
    }

    public function update(UpdateUserRequest $request, $id)
    {
        $personnel = Personnel::findOrFail($id);

        $validated = $request->validated();

        $updateData = [
            'fname' => $validated['firstName'],
            'mname' => $validated['middleName'],
            'lname' => $validated['lastName'],
            'contactnum' => $validated['contactNumber'],
            'username' => $validated['username'],
            'position' => $validated['position'],
            'agency' => $validated['agency'],
        ];

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('profile_images', 'public');
            $updateData['avatar'] = $path;
        } else {
            $updateData['avatar'] = $personnel->avatar;
        }

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $personnel->update($updateData);

        return back()->with('success', 'User updated successfully.');
    }
}
