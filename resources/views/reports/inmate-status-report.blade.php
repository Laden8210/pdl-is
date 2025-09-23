<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Inmate Status Report</title>
    <style>
        @page {
            margin: 0.8in;
            size: A4;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            line-height: 1.2;
            color: #000;
            margin: 0;
            padding: 0;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 15px;
        }

        .logo-section {
            display: table;
            width: 100%;
            margin-bottom: 10px;
        }

        .logo-left, .logo-right {
            display: table-cell;
            width: 15%;
            vertical-align: middle;
            text-align: center;
        }

        .header-text {
            display: table-cell;
            width: 70%;
            text-align: center;
            vertical-align: middle;
        }

        .logo-container img {
            width: 80px;
            height: 80px;
            object-fit: contain;
        }

        .logo-placeholder {
            width: 80px;
            height: 80px;
            border: 1px solid #ccc;
            display: inline-block;
            vertical-align: middle;
            text-align: center;
            font-size: 8px;
            line-height: 1.2;
            padding: 20px 0;
            box-sizing: border-box;
        }

        .republic {
            font-size: 12px;
            font-weight: normal;
            margin-bottom: 2px;
        }

        .facility-name {
            font-size: 12px;
            font-weight: normal;
            margin-bottom: 2px;
        }

        .contact-info {
            font-size: 9px;
            margin-bottom: 2px;
        }

        .city {
            font-size: 10px;
            margin-bottom: 10px;
        }

        .cert-title {
            font-size: 14px;
            font-weight: bold;
            text-decoration: underline;
            margin: 15px 0 5px 0;
        }

        .subtitle {
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .text-center {
            text-align: center;
        }

        .to-whom {
            font-weight: bold;
            margin: 25px 0 5px 0;
            text-align: left;
        }

        .footer-text {
            margin: 30px 0;
            text-align: justify;
            line-height: 1.4;
            font-size: 10px;
        }

        .signature-section {
            margin-top: 40px;
            text-align: center;
        }

        .issue-date {
            margin-bottom: 20px;
            font-size: 10px;
        }

        .underline {
            border-bottom: 1px solid #000;
            margin: 0 auto 5px auto;
        }

        .warden-name {
            font-weight: bold;
            margin-top: 5px;
            font-size: 11px;
        }

        .warden-title {
            margin-top: 2px;
            font-size: 10px;
        }

        table {
            border-collapse: collapse;
        }

        th, td {
            padding: 5px;
            vertical-align: top;
        }

        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-section">
            <div class="logo-left">
                @if(file_exists(public_path('rdh.jpg')))
                    <img src="data:image/jpeg;base64,{{ base64_encode(file_get_contents(public_path('rdh.jpg'))) }}" alt="Regional Director of Health" style="width: 80px; height: 80px; object-fit: contain;">
                @else
                    <div class="logo-placeholder">
                        <div style="font-weight: bold;">RDH</div>
                        <div style="margin: 2px 0;">LOGO</div>
                    </div>
                @endif
            </div>
            <div class="header-text">
                <div class="republic">Republic of the Philippines</div>
                <div class="facility-name">South Cotabato Rehabilitation and Detention Center</div>
                <div class="contact-info">Tel #: (083) 228-2445; Email Address: <span style="color: blue;">socotrehab@gmail.com</span></div>
                <div class="city">City of Koronadal</div>
            </div>
            <div class="logo-right">
                @if(file_exists(public_path('scof.jpg')))
                    <img src="data:image/jpeg;base64,{{ base64_encode(file_get_contents(public_path('scof.jpg'))) }}" alt="South Cotabato Office" style="width: 80px; height: 80px; object-fit: contain;">
                @else
                    <div class="logo-placeholder">
                        <div style="font-weight: bold;">SCOF</div>
                        <div style="margin: 2px 0;">LOGO</div>
                    </div>
                @endif
            </div>
        </div>

        <div class="cert-title text-center">INMATE STATUS REPORT</div>
        <div class="subtitle text-center">Individual Detainee Record</div>
    </div>

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
</body>
</html>
