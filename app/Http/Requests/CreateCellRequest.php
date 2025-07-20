<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateCellRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cell_name'   => 'required|string|max:255',
            'capacity'    => 'required|integer|min:1',
            'description' => 'nullable|string|max:500',
            'status'      => 'required|in:active,inactive',
        ];
    }

    public function messages(): array
    {
        return [
            'cell_name.required' => 'The cell name is required.',
            'cell_name.string'   => 'The cell name must be a valid string.',
            'cell_name.max'      => 'The cell name may not be greater than 255 characters.',

            'capacity.required' => 'The capacity is required.',
            'capacity.integer'  => 'The capacity must be a valid number.',
            'capacity.min'      => 'The capacity must be at least 1.',

            'description.string' => 'The description must be a valid string.',
            'description.max'    => 'The description may not be greater than 500 characters.',

            'status.required' => 'The status is required.',
            'status.in'       => 'The status must be either active or inactive.',
        ];
    }
}
