<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $data['title'] }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            margin: 0;
            padding: 20px;
            line-height: 1.4;
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
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .facility-name {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .location {
            font-size: 12px;
            margin-bottom: 10px;
        }

        .contact {
            font-size: 10px;
            margin-bottom: 15px;
        }

        .title {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .date {
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        th, td {
            border: 1px solid #000;
            padding: 4px;
            text-align: center;
            font-size: 9px;
            vertical-align: middle;
        }

        th {
            background-color: #f0f0f0;
            font-weight: bold;
            font-size: 9px;
        }

        .court-column {
            text-align: left;
            font-weight: bold;
        }

        .subtotal-row {
            background-color: #e0e0e0;
            font-weight: bold;
        }

        .total-row {
            background-color: #ffffcc;
            font-weight: bold;
        }

        .signature-section {
            margin-top: 40px;
            display: table;
            width: 100%;
        }

        .signature-left, .signature-right {
            display: table-cell;
            width: 50%;
            text-align: center;
            vertical-align: bottom;
        }

        .signature-line {
            border-bottom: 1px solid #000;
            width: 200px;
            margin: 0 auto 5px auto;
            height: 20px;
        }

        .signature-label {
            font-size: 10px;
            font-weight: bold;
            text-align: center;
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
                <div class="location">{{ $data['location'] }}</div>
                <div class="contact">
                    Tel #: {{ $data['contact']['tel'] }}; Email Address: {{ $data['contact']['email'] }}
                </div>
                <div class="title">{{ $data['title'] }}</div>
                <div class="date">As of {{ $data['as_of_date'] }}</div>
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

    <table>
        <thead>
            <tr>
                <th rowspan="2">COURT</th>
                <th rowspan="2">STATION</th>
                <th rowspan="2">BRANCH</th>
                <th colspan="4">TOTAL NO. OF DETAINEES</th>
            </tr>
            <tr>
                <th>MALE</th>
                <th>FEMALE</th>
                <th>CICL</th>
                <th>TOTAL</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data['court_data'] as $courtType => $courtInfo)
                @foreach($courtInfo['stations'] as $index => $station)
                <tr>
                    <td class="court-column">
                        @if($index === 0)
                            {{ $courtType }}
                        @endif
                    </td>
                    <td>{{ $station['station'] }}</td>
                    <td>{{ $station['branch'] }}</td>
                    <td>{{ $station['male'] }}</td>
                    <td>{{ $station['female'] }}</td>
                    <td>{{ $station['cicl'] }}</td>
                    <td><strong>{{ $station['total'] }}</strong></td>
                </tr>
                @endforeach
            @endforeach

            <!-- Sub Total Row -->
            <tr class="subtotal-row">
                <td colspan="3" style="text-align: right; font-weight: bold;">SUB TOTAL:</td>
                <td>{{ $data['totals']['male'] }}</td>
                <td>{{ $data['totals']['female'] }}</td>
                <td>{{ $data['totals']['cicl'] }}</td>
                <td><strong>{{ $data['totals']['total'] }}</strong></td>
            </tr>

            <!-- Total Row -->
            <tr class="total-row">
                <td colspan="3" style="text-align: right; font-weight: bold;">TOTAL:</td>
                <td>{{ $data['totals']['male'] }}</td>
                <td>{{ $data['totals']['female'] }}</td>
                <td>{{ $data['totals']['cicl'] }}</td>
                <td><strong>{{ $data['totals']['total'] }}</strong></td>
            </tr>
        </tbody>
    </table>

    <div class="signature-section">
        <div class="signature-left">
            <div class="signature-line"></div>
            <div class="signature-label">Prepared by:</div>
        </div>
        <div class="signature-right">
            <div class="signature-line"></div>
            <div class="signature-label">Noted by:</div>
        </div>
    </div>

    <div style="margin-top: 20px; font-size: 8px; text-align: right;">
        Generated on: {{ date('F d, Y \a\t g:i A') }}
    </div>
</body>
</html>
