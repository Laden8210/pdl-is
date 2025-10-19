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
            'alias' => 'required|string|max:255|regex:/^[A-Za-z\s\-]+$/',
            'mname' => 'nullable|string|max:255|regex:/^[A-Za-z\s\-]+$/',
            'birthdate' => 'required|date',
            'age' => 'required|integer|min:18',
            'gender' => 'required|string|in:Male,Female',
            'ethnic_group' => 'required|string|max:255|regex:/^[A-Za-z\s\-]+$/',
            'civil_status' => 'required|string|in:Single,Married,Widowed,Annulment',
            'brgy' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'mugshot' => 'nullable|file|mimes:jpg,jpeg,png|max:5120', // 5MB max for mugshots


            // Court Order

            'court_orders' => 'required|array',
            'court_orders.*.order_type' => 'required|string|max:255',
            'court_orders.*.order_date' => 'required|date',
            'court_orders.*.received_date' => 'required|date',
            'court_orders.*.document_type' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png,txt|max:10240',
            'court_orders.*.court_id' => 'required|exists:courts,court_id',
            'court_orders.*.cod_remarks' => 'nullable|string',



            // Medical Record
            'medical_records' => 'required|array',
            'medical_records.*.complaint' => 'required|string',
            'medical_records.*.date' => 'required|date',
            'medical_records.*.prognosis' => 'required|string',
            'medical_records.*.prescription' => 'required|string',
            'medical_records.*.findings' => 'required|string',
            'medical_records.*.medical_file' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png,txt|max:10240',



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
            'cases.*.case_status' => 'required|string|in:on_trial,bonded,transferred_to_another_jail,served_sentence,convicted,dismissed,arraignment',

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
            'ethnic_group.required' => 'Ethnic group is required',
            'ethnic_group.max' => 'Ethnic group must not exceed 255 characters',

            'ethnic_group.regex' => 'Ethnic group must be a valid string',
            'brgy.required' => 'Barangay is required',
            'brgy.max' => 'Barangay must not exceed 255 characters',
            'city.required' => 'City is required',
            'city.max' => 'City must not exceed 255 characters',
            'province.required' => 'Province is required',
            'province.max' => 'Province must not exceed 255 characters',
            'mugshot.file' => 'Mugshot must be a valid image file',
            'mugshot.mimes' => 'Mugshot must be a JPG, JPEG, or PNG image',
            'mugshot.max' => 'Mugshot file size must not exceed 5MB',

            // Court Order Information
            'court_orders.required' => 'At least one court order is required',
            'court_orders.array' => 'Court orders must be provided as an array',
            'court_orders.*.order_type.required' => 'Order type is required for all court orders',
            'court_orders.*.order_type.max' => 'Order type must not exceed 255 characters for all court orders',
            'court_orders.*.order_date.required' => 'Order date is required for all court orders',
            'court_orders.*.order_date.date' => 'Order date must be a valid date for all court orders',
            'court_orders.*.received_date.required' => 'Received date is required for all court orders',
            'court_orders.*.received_date.date' => 'Received date must be a valid date for all court orders',

            // Medical Record
            'medical_records.required' => 'At least one medical record is required',
            'medical_records.array' => 'Medical records must be provided as an array',
            'medical_records.*.complaint.required' => 'Medical complaint is required for all medical records',
            'medical_records.*.date.required' => 'Medical record date is required for all medical records',
            'medical_records.*.date.date' => 'Medical record date must be a valid date for all medical records',
            'medical_records.*.prognosis.required' => 'Prognosis is required for all medical records',
            'medical_records.*.prescription.required' => 'Prescription is required for all medical records',
            'medical_records.*.findings.required' => 'Medical findings are required for all medical records',
            'medical_records.*.medical_file.required' => 'Medical file is required for all medical records',
            'medical_records.*.medical_file.file' => 'Medical file must be a valid file',
            'medical_records.*.medical_file.mimes' => 'Medical file must be a PDF, DOC, DOCX, JPG, JPEG, PNG, or TXT file',
            'medical_records.*.medical_file.max' => 'Medical file size must not exceed 10MB',

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
            'cases.*.case_status.in' => 'Case status must be open, pending, convicted, deceased, dismissed, or on trial',
            'cases.*.security_classification.required' => 'Security classification is required for all cases',
            'cases.*.security_classification.in' => 'Security classification must be low, medium, high, or maximum',
        ];
    }
}
