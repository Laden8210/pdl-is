<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EditCellRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Adjust this if you want to use authorization logic
    }

    public function rules(): array
    {
        return [
            'cell_id' => 'required|exists:cells,cell_id',
            'cell_name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'gender' => 'required|in:male,female',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ];
    }

    public function messages(): array
    {
        return [
            'cell_name.required' => 'Cell name is required.',
            'capacity.required' => 'Capacity is required.',
            'gender.required' => 'Gender is required.',
            'gender.in' => 'Gender must be either male or female.',
            'status.required' => 'Status is required.',
            'status.in' => 'Status must be either active or inactive.',
        ];
    }
}
