<div class="cert-title text-center">INMATE STATUS REPORT</div>
<div class="subtitle text-center">Individual Detainee Record</div>

<div class="to-whom">Inmate Information:</div>
<table width="100%" style="font-size: 10px; margin-bottom: 15px;">
    <tr>
        <td width="25%"><strong>Name:</strong></td>
        <td width="25%">{{ $pdl->fname }} {{ $pdl->mname }} {{ $pdl->lname }}</td>
        <td width="25%"><strong>PDL ID:</strong></td>
        <td width="25%">{{ $pdl->id }}</td>
    </tr>
    <tr>
        <td><strong>Date of Birth:</strong></td>
        <td>{{ $pdl->dob ? \Carbon\Carbon::parse($pdl->dob)->format('m/d/Y') : 'N/A' }}</td>
        <td><strong>Age:</strong></td>
        <td>{{ $pdl->dob ? \Carbon\Carbon::parse($pdl->dob)->age : 'N/A' }}</td>
    </tr>
    <tr>
        <td><strong>Gender:</strong></td>
        <td>{{ $pdl->gender }}</td>
        <td><strong>Nationality:</strong></td>
        <td>{{ $pdl->nationality ?? 'Filipino' }}</td>
    </tr>
    <tr>
        <td><strong>Date Admitted:</strong></td>
        <td>{{ $pdl->date_admitted ? \Carbon\Carbon::parse($pdl->date_admitted)->format('m/d/Y') : 'N/A' }}</td>
        <td><strong>Detention Status:</strong></td>
        <td>{{ $pdl->detention_status ?? 'N/A' }}</td>
    </tr>
    <tr>
        <td><strong>Cell Block:</strong></td>
        <td>{{ $pdl->cell_block ?? 'N/A' }}</td>
        <td><strong>Cell Number:</strong></td>
        <td>{{ $pdl->cell_number ?? 'N/A' }}</td>
    </tr>
</table>

@if($pdl->cases && count($pdl->cases) > 0)
<div class="to-whom">Case Information:</div>
<table width="100%" style="font-size: 9px; border-collapse: collapse; margin-bottom: 15px;">
    <thead>
        <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ccc; padding: 5px;">Case Number</th>
            <th style="border: 1px solid #ccc; padding: 5px;">Charges</th>
            <th style="border: 1px solid #ccc; padding: 5px;">Court</th>
            <th style="border: 1px solid #ccc; padding: 5px;">Status</th>
        </tr>
    </thead>
    <tbody>
        @foreach($pdl->cases as $case)
        <tr>
            <td style="border: 1px solid #ccc; padding: 5px;">{{ $case->case_number ?? 'N/A' }}</td>
            <td style="border: 1px solid #ccc; padding: 5px;">{{ $case->charges ?? 'N/A' }}</td>
            <td style="border: 1px solid #ccc; padding: 5px;">{{ $case->court ?? 'N/A' }}</td>
            <td style="border: 1px solid #ccc; padding: 5px;">{{ $case->status ?? 'N/A' }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
@endif

@if($pdl->medicalRecords && count($pdl->medicalRecords) > 0)
<div class="to-whom">Medical Information:</div>
<table width="100%" style="font-size: 9px; border-collapse: collapse; margin-bottom: 15px;">
    <thead>
        <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ccc; padding: 5px;">Date</th>
            <th style="border: 1px solid #ccc; padding: 5px;">Diagnosis</th>
            <th style="border: 1px solid #ccc; padding: 5px;">Treatment</th>
            <th style="border: 1px solid #ccc; padding: 5px;">Physician</th>
        </tr>
    </thead>
    <tbody>
        @foreach($pdl->medicalRecords as $record)
        <tr>
            <td style="border: 1px solid #ccc; padding: 5px;">{{ $record->date ? \Carbon\Carbon::parse($record->date)->format('m/d/Y') : 'N/A' }}</td>
            <td style="border: 1px solid #ccc; padding: 5px;">{{ $record->diagnosis ?? 'N/A' }}</td>
            <td style="border: 1px solid #ccc; padding: 5px;">{{ $record->treatment ?? 'N/A' }}</td>
            <td style="border: 1px solid #ccc; padding: 5px;">{{ $record->physician ?? 'N/A' }}</td>
        </tr>
        @endforeach
    </tbody>
</table>
@endif

<div class="footer-text">
    This report was generated on {{ \Carbon\Carbon::now()->format('F j, Y') }} and reflects the current status of the inmate in our facility.
</div>

<div class="signature-section">
    <div class="issue-date">Issued on: {{ \Carbon\Carbon::now()->format('F j, Y') }}</div>
    <div class="underline" style="width: 250px; margin-bottom: 5px;"></div>
    <div class="warden-name">{{ $pdl->personnel->name ?? 'FACILITY ADMINISTRATOR' }}</div>
    <div class="warden-title">Officer-in-Charge</div>
    <div class="warden-title">South Cotabato Rehabilitation and Detention Center</div>
</div>  
