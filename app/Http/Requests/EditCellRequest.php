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
            'cell_type' => 'required|in:isolation,female,male,trustee,kitchen boys',
            'status' => 'required|in:active,inactive',
            'classification' => 'required|in:maximum,high,medium,low',
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
            'cell_type.required' => 'Cell type is required.',
            'cell_type.in' => 'Cell type must be either isolation, female, male, trustee, or kitchen boys.',
            'classification.required' => 'Classification is required.',
            'classification.in' => 'Classification must be either maximum, high, medium, or low.',
        ];
    }
}
