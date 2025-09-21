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
            'fname'      => 'required|string|max:255',
            'mname'     => 'nullable|string|max:255',
            'lname'       => 'required|string|max:255',
            'contactnum'  => ['required', 'regex:/^09\d{9}$/', 'unique:personnel,contactnum'],
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
            'fname.required'     => 'First name is required.',
            'lname.required'      => 'Last name is required.',
            'contactnum.required' => 'Contact number is required.',
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
            'fname'     => 'First Name',
            'mname'    => 'Middle Name',
            'lname'      => 'Last Name',
            'contactnum' => 'Contact Number',
            'avatar'        => 'Avatar',
            'username'      => 'Username',
            'password'      => 'Password',
            'position'      => 'Position',
            'agency'        => 'Agency',
        ];
    }
}
