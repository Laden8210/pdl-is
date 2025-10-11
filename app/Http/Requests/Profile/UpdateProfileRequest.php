<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;

class UpdateProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'middleName' => 'nullable|string|max:255',
            'position' => 'required|string|max:255',
            'password' => 'nullable|string|min:8',
            'oldpassword' => 'nullable|required_with:password|string|min:8',
            'profileImage' => 'nullable|image|max:25600', // max 25MB
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $user = $this->user();

            if ($this->filled('password')) {
                // Check if the old password is correct
                if (!Hash::check($this->input('oldpassword'), $user->password)) {
                    $validator->errors()->add('oldpassword', 'The old password is incorrect.');
                }

                // Check if new password is the same as old
                if (Hash::check($this->input('password'), $user->password)) {
                    $validator->errors()->add('password', 'New password cannot be the same as the old password.');
                }
            }
        });
    }

    public function messages(): array
    {
        return [
            'firstName.required' => 'First name is required.',
            'lastName.required' => 'Last name is required.',
            'position.required' => 'Position is required.',
            'password.min' => 'Password must be at least 8 characters.',
            'oldpassword.required_with' => 'Old password is required when changing your password.',
            'profileImage.image' => 'Profile image must be an image file.',
        ];
    }

    public function attributes(): array
    {
        return [
            'firstName' => 'First Name',
            'lastName' => 'Last Name',
            'middleName' => 'Middle Name',
            'position' => 'Position',
            'status' => 'Status',
            'password' => 'Password',
            'oldpassword' => 'Old Password',
            'profileImage' => 'Profile Image',
        ];
    }
}
