<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

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

            'password' => 'nullable|string|min:8|confirmed',
            'profileImage' => 'nullable|image|max:25600',
        ];
    }

    public function messages(): array
    {
        return [
            'firstName.required' => 'First name is required.',
            'lastName.required' => 'Last name is required.',
            'position.required' => 'Position is required.',

            'password.min' => 'Password must be at least 8 characters.',
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
            'profileImage' => 'Profile Image',
        ];
    }

}
