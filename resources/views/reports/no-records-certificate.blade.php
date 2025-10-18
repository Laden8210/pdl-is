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
            line-height: 1.6;
        }

        .header {
            margin-bottom: 20px;
        }

        .logo-section {
            display: table;
            width: 100%;
            margin-bottom: 15px;
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
            background-color: #f9f9f9;
            color: #666;
        }

        .republic {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .facility-name {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .office {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .unit {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .location {
            font-size: 12px;
            margin-bottom: 10px;
        }

        .contact {
            font-size: 11px;
            margin-bottom: 15px;
        }

        .title {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            text-decoration: underline;
            margin: 30px 0;
        }

        .salutation {
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 20px;
        }

        .content {
            margin-bottom: 20px;
            text-align: justify;
        }

        .content p {
            margin-bottom: 15px;
            line-height: 1.8;
        }

        .person-list {
            margin: 20px 0;
            padding-left: 20px;
        }

        .person-list div {
            margin-bottom: 8px;
        }

        .signature-section {
            text-align: right;
            margin-top: 50px;
        }

        .signature-name {
            font-weight: bold;
            margin-bottom: 5px;
        }

        .signature-position {
            font-size: 11px;
        }

        .issue-info {
            margin-top: 20px;
            font-size: 11px;
        }

        hr {
            border: none;
            border-top: 1px solid #000;
            margin: 20px 0;
        }

        strong {
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
                <div class="facility-name">{{ $data['facility_name'] }}</div>
                <div class="office">{{ $data['office'] }}</div>
                <div class="unit">{{ $data['unit'] }}</div>
                <div class="location">{{ $data['location'] }}</div>
                <div class="contact">
                    Tel #: {{ $data['contact']['tel'] }};<br>
                    Email Address: {{ $data['contact']['email'] }}
                </div>
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
    </div>

    <hr>

    <div class="title">{{ $data['title'] }}</div>

    <div class="content">
        <div class="salutation">TO WHOM IT MAY CONCERN:</div>

        <p>
            <strong>THIS IS TO CERTIFY</strong> that this office has no records,
            whatsoever affecting the following persons:
        </p>

        <div class="person-list">
            @foreach($data['persons'] as $index => $person)
                <div>{{ $index + 1 }}. {{ $person['fname'] }} {{ $person['mname'] }} {{ $person['lname'] }}</div>
            @endforeach
        </div>

        <p>
            This certification is issued upon the request of {{ $data['requested_by'] }},
            {{ $data['requesting_agency'] }} for whatever legal purpose it may serve him best.
        </p>

        <div class="issue-info">
            Issued this {{ $data['issue_date'] }}, {{ $data['issue_location'] }}.
        </div>
    </div>

    <div class="signature-section">
        <div class="signature-name">{{ $data['officer_name']  }}</div>
        <div class="signature-position">{{ $data['officer_position'] }}</div>
    </div>

    <div style="margin-top: 20px; font-size: 8px; text-align: right;">
        Generated on: {{ date('F d, Y \a\t g:i A') }}
    </div>
</body>
</html>
