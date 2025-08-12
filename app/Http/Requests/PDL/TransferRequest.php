<?php

namespace App\Http\Requests\PDL;

use Illuminate\Foundation\Http\FormRequest;

class TransferRequest extends FormRequest
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
            'reason' => 'required|string|max:255',
            'pdl_id' => 'required|exists:pdl,id',
        ];
    }

    public function messages(): array
    {
        return [
            'reason.required' => 'The reason for transfer is required.',
            'reason.string' => 'The reason must be a valid string.',
            'reason.max' => 'The reason may not be greater than 255 characters.',
            'pdl_id.required' => 'The PDL ID is required.',
            'pdl_id.exists' => 'The selected PDL does not exist.',
        ];
    }
}
