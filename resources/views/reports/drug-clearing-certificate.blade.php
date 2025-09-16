<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $data['title'] }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 20px;
            line-height: 1.4;
            background: white;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .republic {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 3px;
        }

        .facility-name {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 3px;
        }

        .office {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 3px;
        }

        .unit {
            font-size: 11px;
            margin-bottom: 3px;
        }

        .location {
            font-size: 11px;
            margin-bottom: 8px;
        }

        .contact {
            font-size: 10px;
            margin-bottom: 15px;
        }

        .logo-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
            margin-top: 10px;
        }

        .logo {
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .logo img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }

        .logo-placeholder {
            width: 60px;
            height: 60px;
            border: 2px solid #333;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 7px;
            text-align: center;
            background-color: #f9f9f9;
            color: #333;
            border-radius: 50%;
        }

        .header-content {
            flex: 1;
            text-align: center;
            margin: 0 20px;
        }

        .title {
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            text-decoration: underline;
            margin: 25px 0;
            letter-spacing: 1px;
        }

        .salutation {
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 15px;
            font-size: 12px;
        }

        .content {
            margin-bottom: 20px;
            text-align: justify;
            text-justify: inter-word;
        }

        .content p {
            margin-bottom: 12px;
            line-height: 1.6;
            text-indent: 30px;
        }

        .signature-section {
            text-align: center;
            margin-top: 40px;
            margin-right: 50px;
            float: right;
            clear: both;
        }

        .signature-name {
            font-weight: bold;
            margin-bottom: 3px;
            font-size: 12px;
            text-decoration: underline;
        }

        .signature-position {
            font-size: 11px;
        }

        .issue-info {
            margin-top: 25px;
            margin-bottom: 30px;
            font-size: 12px;
            text-indent: 30px;
        }

        hr {
            border: none;
            border-top: 2px solid #000;
            margin: 15px 0;
        }

        strong {
            font-weight: bold;
        }

        .clearfix::after {
            content: "";
            display: table;
            clear: both;
        }

        .generated-info {
            margin-top: 60px;
            font-size: 8px;
            text-align: right;
            color: #666;
            clear: both;
        }
    </style>
</head>
<body>
    <div class="logo-section">

        <div class="header-content">
            <div class="republic">Republic of the Philippines</div>
            <div class="facility-name">{{ $data['facility_name'] }}</div>
            <div class="office">{{ $data['office'] }}</div>
            <div class="unit">{{ $data['unit'] }}</div>
            <div class="location">{{ $data['location'] }}</div>
            <div class="contact">
                Tel #: {{ $data['contact']['tel'] }};<br>
                Email Address: {{ $data['contact']['email'] }}
            </div>
        </div>

    </div>

    <hr>

    <div class="title">CERTIFICATE OF DETENTION</div>

    <div class="content">
        <div class="salutation">TO WHOM IT MAY CONCERN:</div>

        <p>
            <strong>THIS IS TO CERTIFY</strong> that <strong>{{ $data['pdl']['full_name'] }}</strong>,
            was committed in this institution on <strong>{{ $data['pdl']['commitment_date'] }}</strong>,
            per Commitment Order issued by the {{ $data['court_info']['court'] }},
            {{ $data['court_info']['location'] }} for the charge of
            <strong>{{ $data['court_info']['charge'] }}</strong> docketed as
            Criminal Case No. {{ $data['court_info']['case_number'] }}.
        </p>

        <p>
            It is further certified that said accused was detained for
            @if($data['pdl']['detention_period']['years'] > 0)
                {{ $data['pdl']['detention_period']['years'] }} year{{ $data['pdl']['detention_period']['years'] > 1 ? 's' : '' }}
                @if($data['pdl']['detention_period']['months'] > 0 || $data['pdl']['detention_period']['days'] > 0)
                    ,
                @endif
            @endif
            @if($data['pdl']['detention_period']['months'] > 0)
                {{ $data['pdl']['detention_period']['months'] }} month{{ $data['pdl']['detention_period']['months'] > 1 ? 's' : '' }}
                @if($data['pdl']['detention_period']['days'] > 0)
                    , and
                @endif
            @endif
            @if($data['pdl']['detention_period']['days'] > 0)
                {{ $data['pdl']['detention_period']['days'] }} day{{ $data['pdl']['detention_period']['days'] > 1 ? 's' : '' }}
            @endif
            as to date.
        </p>

        <p>
            This certification is issued upon the request of the above-named person
            for whatever legal purpose it may serve him best.
        </p>

        <div class="issue-info">
            Issued this {{ $data['issue_date'] }}, {{ $data['issue_location'] }}.
        </div>
    </div>

    <div class="clearfix">
        <div class="signature-section">
            <div class="signature-name">{{ $data['signed_by']['name'] }}</div>
            <div class="signature-position">{{ $data['signed_by']['position'] }}</div>
        </div>
    </div>

    <div class="generated-info">
        Generated on: {{ date('F d, Y \a\t g:i A') }}
    </div>
</body>
</html>
