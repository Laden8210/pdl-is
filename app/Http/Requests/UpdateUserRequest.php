<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $userId = $this->route('user') ?? $this->route('id');

        return [
            'firstName' => 'required|string|max:255',
            'middleName' => 'nullable|string|max:255',
            'lastName' => 'required|string|max:255',
            'contactNumber' => 'required|string|max:20',
            'avatar' => 'nullable|image|max:2048',
            'username' => [
                'required',
                'string',
                'max:255',
                Rule::unique('personnel', 'username')->ignore($userId),
            ],
            'password' => 'nullable|string|min:6',
            'position' => 'required|string|max:255',
            'agency' => 'required|string|max:255',
        ];
    }

    public function messages()
    {
        return [
            'firstName.required' => 'First name is required.',
            'lastName.required' => 'Last name is required.',
            'position.required' => 'Position is required.',
            'agency.required' => 'Agency is required.',
            'password.min' => 'Password must be at least 6 characters.',
            'avatar.image' => 'Avatar must be an image file.',

        ];
    }
}
