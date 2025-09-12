<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserRequest extends FormRequest
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
            'firstName'      => 'required|string|max:255',
            'middleName'     => 'nullable|string|max:255',
            'lastName'       => 'required|string|max:255',
            'contactNumber'  => ['required', 'regex:/^09\d{9}$/', 'unique:personnel,contactnum'],
            'avatar'         => 'nullable|image|max:25600',
            'username'       => 'required|string|max:255|unique:personnel,username',
            'password'       => 'required|string|min:8',
            'position'       => 'required|string|max:255',
            'agency'         => 'required|string|max:255',
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'firstName.required'     => 'First name is required.',
            'lastName.required'      => 'Last name is required.',
            'contactNumber.required' => 'Contact number is required.',
            'contactNumber.regex'    => 'Contact number must be a valid Philippine mobile number.',
            'username.required'      => 'Username is required.',
            'username.unique'        => 'Username has already been taken.',
            'password.required'      => 'Password is required.',
            'password.min'           => 'Password must be at least 8 characters.',
            'position.required'      => 'Position is required.',
            'agency.required'        => 'Agency is required.',
            'avatar.image'           => 'Profile image must be an image file.',
            'avatar.max'             => 'Profile image must not be larger than 2MB.',
        ];
    }

    /**
     * Attribute name customization.
     */
    public function attributes(): array
    {
        return [
            'firstName'     => 'First Name',
            'middleName'    => 'Middle Name',
            'lastName'      => 'Last Name',
            'contactNumber' => 'Contact Number',
            'avatar'        => 'Avatar',
            'username'      => 'Username',
            'password'      => 'Password',
            'position'      => 'Position',
            'agency'        => 'Agency',
        ];
    }
}
