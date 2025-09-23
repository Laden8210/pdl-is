<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GCTA & TASTM Certification - {{ $pdl->fname }} {{ $pdl->lname }}</title>
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
        }

        .header-text {
            display: table-cell;
            width: 70%;
            text-align: center;
            vertical-align: middle;
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

        .to-whom {
            font-weight: bold;
            margin: 25px 0 5px 0;
            text-align: left;
        }

        .certify-section {
            text-align: justify;
            margin: 15px 0;
            line-height: 1.4;
        }

        .certify-bold {
            font-weight: bold;
            display: inline;
        }

        .prisoner-info {
            font-style: italic;
        }

        .computation-section {
            margin: 25px 0;
        }

        .computation-title {
            font-weight: bold;
            margin-bottom: 15px;
            text-decoration: underline;
        }

        .computation-table {
            font-family: 'Courier New', monospace;
            font-size: 10px;
            line-height: 1.3;
            margin-left: 20px;
        }

        .comp-row {
            margin: 8px 0;
        }

        .earned-section {
            margin: 25px 0;
        }

        .earned-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 9px;
        }

        .earned-table th {
            font-weight: bold;
            padding: 4px 2px;
            text-align: center;
            border: none;
        }

        .earned-table td {
            padding: 2px 4px;
            text-align: center;
            border: none;
        }

        .period-col {
            width: 12%;
        }

        .earned-col {
            width: 8%;
        }

        .gcta-col {
            width: 8%;
        }

        .tastm-col {
            width: 8%;
        }

        .totals-section {
            margin: 20px 0;
            text-align: center;
        }

        .total-line {
            display: inline-block;
            margin: 0 80px;
            text-align: center;
        }

        .underline {
            border-bottom: 1px solid #000;
            width: 60px;
            margin: 0 auto 5px auto;
        }

        .calculation {
            margin: 15px 0;
            text-align: left;
        }

        .calc-line {
            margin: 3px 0;
        }

        .result {
            font-weight: bold;
            margin: 3px 0 15px 0;
        }

        .footer-text {
            margin: 30px 0;
            text-align: justify;
            line-height: 1.4;
        }

        .signature-section {
            margin-top: 40px;
            text-align: center;
        }

        .issue-date {
            margin-bottom: 40px;
        }

        .warden-name {
            font-weight: bold;
            margin-top: 20px;
        }

        .warden-title {
            margin-top: 2px;
        }

        .text-center {
            text-align: center;
        }

        .text-bold {
            font-weight: bold;
        }

        .mb-10 {
            margin-bottom: 10px;
        }

        .mb-20 {
            margin-bottom: 20px;
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
                    <div style="width: 80px; height: 80px; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 8px; text-align: center;">
                        <div>
                            <div style="font-weight: bold;">RDH</div>
                            <div style="margin: 2px 0;">LOGO</div>
                        </div>
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
                    <div style="width: 80px; height: 80px; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 8px; text-align: center;">
                        <div>
                            <div style="font-weight: bold;">SCOF</div>
                            <div style="margin: 2px 0;">LOGO</div>
                        </div>
                    </div>
                @endif
            </div>
        </div>


        @switch($data['report_type'])
            @case('inmate-status')
                @include('reports.pdl.inmate-status-report', ['pdl' => $pdl, 'reportDate' => $reportDate])
                @break

            @case('inmate-daily-status')
                @include('reports.pdl.inmate-daily-status-report', ['pdl' => $pdl, 'reportDate' => $reportDate])
                @break

            @default

        @endswitch

    </div>

</body>
</html>
