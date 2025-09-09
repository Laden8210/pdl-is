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
                <!-- Add your logo here -->
            </div>
            <div class="header-text">
                <div class="republic">Republic of the Philippines</div>
                <div class="facility-name">South Cotabato Rehabilitation and Detention Center</div>
                <div class="contact-info">Tel #: (083) 228-2445; Email Address: <span style="color: blue;">socotrehab@gmail.com</span></div>
                <div class="city">City of Koronadal</div>
            </div>
            <div class="logo-right">
                <!-- Add your logo here -->
            </div>
        </div>

        <div class="cert-title">CERTIFICATION</div>
        <div class="subtitle">Good Conduct Time Allowance (GCTA) and Time Allowance for Study Teaching and Mentoring (TASTM)</div>
    </div>

    <div class="to-whom">TO WHOM IT MAY CONCERN:</div>

    <div class="certify-section">
        <span class="certify-bold">THIS IS TO CERTIFY</span> that convicted prisoner <span class="prisoner-info text-bold">{{ $pdl->fname }} {{ $pdl->lname }}</span>, was detained in this facility since <span class="text-bold">{{ $commitment_date }}</span> to date. He is generally of good behaviour. He is granted of Good Conduct Time Allowance (GCTA) less <span class="text-bold">0</span> for his violation of <span class="text-bold">none</span>. His net GCTA then is <span class="text-bold">{{ $gcta_days }} days</span> or <span class="text-bold">{{ $gcta_ymd['years'] }} years, {{ $gcta_ymd['months'] }} months, and {{ $gcta_ymd['days'] }} days</span> covering said period. He is also granted of net TASTM of <span class="text-bold">{{ $tastm_days }} days</span> or <span class="text-bold">{{ $tastm_ymd['months'] }} months, and {{ $tastm_ymd['days'] }} days</span> for said period. His total detention with GCTA and TASTM then summed to <span class="text-bold">{{ $total_with_allowances['years'] }} years, {{ $total_with_allowances['months'] }} months, and {{ $total_with_allowances['days'] }} days</span>.
    </div>

    <div class="computation-section">
        <div class="computation-title">Computation of Preventive Imprisonment:</div>

        <div class="computation-table">
            <div class="comp-row">Present Date: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{ date('Y', strtotime($current_date)) }} &nbsp;&nbsp; {{ date('m', strtotime($current_date)) }} &nbsp;&nbsp; {{ date('d', strtotime($current_date)) }}</div>
            <div class="comp-row">Commitment Date: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{ date('Y', strtotime($commitment_date)) }} &nbsp;&nbsp; {{ date('m', strtotime($commitment_date)) }} &nbsp;&nbsp; {{ date('d', strtotime($commitment_date)) }}</div>
            <div class="comp-row">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;____________</div>
            <div class="comp-row">Total Detention &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{ $time_served['years'] }} &nbsp;&nbsp; {{ $time_served['months'] }} &nbsp;&nbsp; {{ $time_served['days'] }}</div>
            <div class="comp-row">Add GCTA &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (net GCTA mentioned above)</div>
            <div class="comp-row">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;____________</div>
            <div class="comp-row">Total Detention w/ GCTA &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (Total Detention + GCTA)</div>
            <div class="comp-row">Add TASTM &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (net TASTM)</div>
            <div class="comp-row">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;____________</div>
            <div class="comp-row">Total Detention w/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (Total)</div>
            <div class="comp-row">GCTA & TASTM</div>
        </div>
    </div>

    <div class="mb-20 text-center">
        <div class="text-bold mb-10">GCTA Earned: {{ $gcta_days }} days</div>
        <div class="text-bold">TASTM Earned: {{ $tastm_days }} days</div>
    </div>

    <div class="footer-text">
        This certification is issued upon the request of the accused for whatever legal purpose it may serve him best.
    </div>

    <div class="signature-section">
        <div class="issue-date">
            Issued this {{ date('jS', strtotime($current_date)) }} day of {{ date('F', strtotime($current_date)) }} {{ date('Y', strtotime($current_date)) }}. Koronadal City, South Cotabato.
        </div>

        <div class="warden-name">JUAN R. LANZADERAS, JR. MPA.</div>
        <div class="warden-title">Provincial Warden</div>
    </div>
</body>
</html>
