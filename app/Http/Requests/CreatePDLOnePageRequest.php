<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreatePDLOnePageRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'fname' => 'required|string|max:255|regex:/^[A-Za-z\s\-]+$/',
            'lname' => 'required|string|max:255|regex:/^[A-Za-z\s\-]+$/',
            'alias' => 'nullable|string|max:255|regex:/^[A-Za-z\s\-]+$/',
            'birthdate' => 'required|date',
            'age' => 'required|integer|min:18',
            'gender' => 'required|string|in:Male,Female',
            'ethnic_group' => 'nullable|string|max:255|regex:/^[A-Za-z\s\-]+$/',
            'civil_status' => 'required|string|in:Single,Married,Widowed,Divorced',
            'brgy' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',


            // Court Order
            'court_order_number' => 'required|string|max:255',
            'order_type' => 'required|string|max:255',
            'order_date' => 'required|date',
            'received_date' => 'required|date',
            'document_type' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png,txt|max:10240',
            'court_branch' => 'required|string|max:255',
            'cod_remarks' => 'nullable|string',

            // Medical Record
            'complaint' => 'required|string',
            'date' => 'required|date',
            'prognosis' => 'required|string',
            'laboratory' => 'required|string',
            'prescription' => 'required|string',
            'findings' => 'required|string',

            // Physical Characteristics
            'height' => 'required|numeric',
            'weight' => 'required|numeric',
            'build' => 'required|string|max:255',
            'complexion' => 'required|string|max:255',
            'hair_color' => 'required|string|max:255',
            'eye_color' => 'required|string|max:255',
            'identification_marks' => 'required|string',
            'mark_location' => 'required|string',
            'pc_remark' => 'nullable|string',

            // Cases
            'cases' => 'required|array',
            'cases.*.case_number' => 'required|string|max:255',
            'cases.*.crime_committed' => 'required|string',
            'cases.*.date_committed' => 'required|date',
            'cases.*.time_committed' => 'required|date_format:H:i',
            'cases.*.case_status' => 'required|string|in:open,closed,pending',
            'cases.*.case_remarks' => 'nullable|string',
            'cases.*.security_classification' => 'required|string|in:low,medium,high,maximum',
        ];
    }

    public function messages()
    {
        return [
            // Personal Information
            'fname.required' => 'First name is required',
            'fname.max' => 'First name must not exceed 255 characters',
            'fname.regex' => 'First name must be a valid string',
            'lname.required' => 'Last name is required',
            'lname.max' => 'Last name must not exceed 255 characters',
            'lname.regex' => 'Last name must be a valid string',
            'alias.max' => 'Alias must not exceed 255 characters',
            'alias.regex' => 'Alias must be a valid string',

            'birthdate.required' => 'Birthdate is required',
            'birthdate.date' => 'Birthdate must be a valid date',
                'age.required' => 'Age is required',
            'age.min' => 'Age must be at least 18',
            'age.integer' => 'Age must be a number',
            'gender.required' => 'Gender is required',
            'gender.in' => 'Gender must be either Male or Female',
            'civil_status.required' => 'Civil status is required',
            'civil_status.in' => 'Civil status must be Single, Married, Widowed, or Divorced',
            'ethnic_group.regex' => 'Ethnic group must be a valid string',
            'brgy.regex' => 'Barangay must be a valid string',
            'city.regex' => 'City must be a valid string',
            'province.regex' => 'Province must be a valid string',


            // Address Information
            'brgy.max' => 'Barangay must not exceed 255 characters',
            'city.max' => 'City must not exceed 255 characters',
            'province.max' => 'Province must not exceed 255 characters',

            // Court Order Information
            'court_order_number.required' => 'Court order number is required',
            'court_order_number.max' => 'Court order number must not exceed 255 characters',
            'order_type.required' => 'Order type is required',
            'order_type.max' => 'Order type must not exceed 255 characters',
            'order_date.required' => 'Order date is required',
            'order_date.date' => 'Order date must be a valid date',
            'received_date.required' => 'Received date is required',
            'received_date.date' => 'Received date must be a valid date',
            'document_type.required' => 'Document file is required',
            'document_type.file' => 'Document must be a valid file',
            'document_type.mimes' => 'Document must be a PDF, DOC, DOCX, JPG, JPEG, PNG, or TXT file',
            'document_type.max' => 'Document file size must not exceed 10MB',
            'court_branch.required' => 'Court branch is required',
            'court_branch.max' => 'Court branch must not exceed 255 characters',

            // Medical Record
            'complaint.required' => 'Medical complaint is required',
            'date.required' => 'Medical record date is required',
            'date.date' => 'Medical record date must be valid',
            'prognosis.required' => 'Prognosis is required',
            'laboratory.required' => 'Laboratory results are required',
            'prescription.required' => 'Prescription is required',
            'findings.required' => 'Medical findings are required',

            // Physical Characteristics
            'height.required' => 'Height is required',
            'height.numeric' => 'Height must be a number',
            'weight.required' => 'Weight is required',
            'weight.numeric' => 'Weight must be a number',
            'build.required' => 'Build description is required',
            'build.max' => 'Build description must not exceed 255 characters',
            'complexion.required' => 'Complexion is required',
            'complexion.max' => 'Complexion must not exceed 255 characters',
            'hair_color.required' => 'Hair color is required',
            'hair_color.max' => 'Hair color must not exceed 255 characters',
            'eye_color.required' => 'Eye color is required',
            'eye_color.max' => 'Eye color must not exceed 255 characters',
            'identification_marks.required' => 'Identification marks are required',
            'mark_location.required' => 'Mark location is required',

            // Cases
            'cases.required' => 'At least one case is required',
            'cases.array' => 'Cases must be provided as an array',
            'cases.*.case_number.required' => 'Case number is required for all cases',
            'cases.*.case_number.max' => 'Case number must not exceed 255 characters',
            'cases.*.crime_committed.required' => 'Crime committed is required for all cases',
            'cases.*.date_committed.required' => 'Date committed is required for all cases',
            'cases.*.date_committed.date' => 'Date committed must be a valid date',
            'cases.*.time_committed.required' => 'Time committed is required for all cases',
            'cases.*.time_committed.date_format' => 'Time committed must be in HH:MM format',
            'cases.*.case_status.required' => 'Case status is required for all cases',
            'cases.*.case_status.in' => 'Case status must be open, closed, or pending',
            'cases.*.security_classification.required' => 'Security classification is required for all cases',
            'cases.*.security_classification.in' => 'Security classification must be low, medium, high, or maximum',
        ];
    }
}
