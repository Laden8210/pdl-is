<?php

namespace App\Http\Requests\PDL;

use Illuminate\Foundation\Http\FormRequest;

class CreatePdlRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fname' => 'required|string|max:255',
            'lname' => 'required|string|max:255',
            'alias' => 'nullable|string|max:255',
            'birthdate' => 'nullable|date',
            'age' => 'nullable|integer|min:0',
            'gender' => 'nullable|in:Male,Female',
            'ethnic_group' => 'nullable|string|max:255',
            'civil_status' => 'nullable|in:Single,Married,Widowed,Divorced',
            'brgy' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'fname.required' => 'The first name is required.',
            'fname.string' => 'The first name must be a valid string.',
            'fname.max' => 'The first name may not be greater than 255 characters.',

            'lname.required' => 'The last name is required.',
            'lname.string' => 'The last name must be a valid string.',
            'lname.max' => 'The last name may not be greater than 255 characters.',

            'alias.string' => 'The alias must be a valid string.',
            'alias.max' => 'The alias may not be greater than 255 characters.',

            'birthdate.date' => 'The birthdate must be a valid date.',

            'age.integer' => 'The age must be a valid number.',
            'age.min' => 'The age must be at least 0.',

            'gender.in' => 'The gender must be either Male or Female.',

            'ethnic_group.string' => 'The ethnic group must be a valid string.',
            'ethnic_group.max' => 'The ethnic group may not be greater than 255 characters.',

            'civil_status.in' => 'The civil status must be Single, Married, Widowed, or Divorced.',

            'brgy.string' => 'The barangay must be a valid string.',
            'brgy.max' => 'The barangay may not be greater than 255 characters.',

            'city.string' => 'The city must be a valid string.',
            'city.max' => 'The city may not be greater than 255 characters.',

            'province.string' => 'The province must be a valid string.',
            'province.max' => 'The province may not be greater than 255 characters.',
        ];
    }
}
