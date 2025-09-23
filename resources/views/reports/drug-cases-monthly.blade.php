<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $data['title'] }} - {{ $data['subtitle'] }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            margin: 0;
            padding: 20px;
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
        }

        .title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .subtitle {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .year {
            font-size: 11px;
            font-weight: bold;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th, td {
            border: 1px solid #000;
            padding: 3px;
            text-align: center;
            font-size: 8px;
        }

        th {
            background-color: #f0f0f0;
            font-weight: bold;
        }

        .month-column {
            text-align: left;
            font-weight: bold;
        }

        .total-row {
            background-color: #e0e0e0;
            font-weight: bold;
        }

        .facilities {
            margin-top: 30px;
            font-size: 9px;
        }

        .facilities h3 {
            font-size: 10px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .facility-item {
            margin-bottom: 5px;
        }

        .facility-acronym {
            font-weight: bold;
        }

        .generated-info {
            margin-top: 20px;
            font-size: 8px;
            text-align: right;
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
                <div class="title">{{ $data['title'] }}</div>
                <div class="subtitle">{{ $data['subtitle'] }}</div>
                <div class="year">Year: {{ $data['year'] }}</div>
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
                <th rowspan="2">MONTH</th>
                <th colspan="2">NO. OF DETAINEES</th>
                <th rowspan="2">TOTAL NO. OF DETAINEES</th>
                <th rowspan="2">TOTAL NO. OF COMMITTED</th>
                <th rowspan="2">TOTAL NO. OF DISCHARGED</th>
                <th colspan="9">CAUSED OF DISCHARGE WITH DRUG CASE</th>
                <th rowspan="2">% OF DRUG OFFENDERS FROM TOTAL POPULATION</th>
                <th rowspan="2">TOTAL NO. OF POPULATION WITH DRUG CASES</th>
            </tr>
            <tr>
                <th>MALE</th>
                <th>FEMALE</th>
                <th>BONDED</th>
                <th>SERVED SENTENCE</th>
                <th>PROV. DISMISSED/DISMISSED</th>
                <th>TRANSFER TO OTHER FACILITY</th>
                <th>DAPECOL</th>
                <th>PROBATION</th>
                <th>DECEASED</th>
                <th>ACQUITTED</th>
                <th>TOTAL</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data['monthly_data'] as $row)
            <tr class="{{ $row['month'] === 'TOTAL' ? 'total-row' : '' }}">
                <td class="month-column">{{ $row['month'] }}</td>
                <td>{{ $row['male_detainees'] }}</td>
                <td>{{ $row['female_detainees'] }}</td>
                <td><strong>{{ $row['total_detainees'] }}</strong></td>
                <td>{{ $row['total_committed'] }}</td>
                <td>{{ $row['total_discharged'] }}</td>
                <td>{{ $row['bonded'] }}</td>
                <td>{{ $row['served_sentence'] }}</td>
                <td>{{ $row['dismissed'] }}</td>
                <td>{{ $row['transferred'] }}</td>
                <td>{{ $row['dapecol'] }}</td>
                <td>{{ $row['probation'] }}</td>
                <td>{{ $row['deceased'] }}</td>
                <td>{{ $row['acquitted'] }}</td>
                <td><strong>{{ $row['total_discharged_drug'] }}</strong></td>
                <td>{{ $row['drug_offenders_percentage'] }}%</td>
                <td><strong>{{ $row['total_drug_cases'] }}</strong></td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="facilities">
        <h3>REHABILITATION FACILITY</h3>
        @foreach($data['facilities'] as $acronym => $fullName)
        <div class="facility-item">
            <span class="facility-acronym">{{ $acronym }}</span> - {{ $fullName }}
        </div>
        @endforeach
    </div>

    <div class="generated-info">
        Generated on: {{ date('F d, Y \a\t g:i A') }}
    </div>
</body>
</html>
