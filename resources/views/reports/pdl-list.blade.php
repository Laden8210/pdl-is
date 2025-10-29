<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>PDL List Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            margin: 0;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
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
            width: 60px;
            height: 60px;
            object-fit: contain;
        }

        .logo-placeholder {
            width: 60px;
            height: 60px;
            border: 1px solid #ccc;
            display: inline-block;
            vertical-align: middle;
            text-align: center;
            font-size: 6px;
            line-height: 1.2;
            padding: 15px 0;
            box-sizing: border-box;
        }

        .header h1 {
            margin: 0;
            font-size: 18px;
        }

        .header p {
            margin: 5px 0;
            font-size: 12px;
        }

        .filters {
            margin-bottom: 15px;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 5px;
        }

        .filters p {
            margin: 3px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th, td {
            border: 1px solid #ddd;
            padding: 6px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }

        tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .footer {
            margin-top: 20px;
            text-align: right;
            font-size: 10px;
            color: #666;
        }

        .page-break {
            page-break-after: always;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .pdl-name {
            font-weight: bold;
            background-color: #e8f4fd;
        }

        .case-row {
            background-color: #ffffff;
        }

        .no-border-top {
            border-top: none;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-section">
            <div class="logo-left">
                @if(file_exists(public_path('rdh.jpg')))
                    <img src="data:image/jpeg;base64,{{ base64_encode(file_get_contents(public_path('rdh.jpg'))) }}" alt="Regional Director of Health" style="width: 60px; height: 60px; object-fit: contain;">
                @else
                    <div class="logo-placeholder">
                        <div style="font-weight: bold;">RDH</div>
                        <div style="margin: 1px 0;">LOGO</div>
                    </div>
                @endif
            </div>
            <div class="header-text">
                <h1>LIST OF PERSONS DEPRIVED OF LIBERTY (PDL)</h1>
                <p>South Cotabato Rehabilitation and Detention Center</p>
                <p>PDL List Report</p>
            </div>
            <div class="logo-right">
                @if(file_exists(public_path('scof.jpg')))
                    <img src="data:image/jpeg;base64,{{ base64_encode(file_get_contents(public_path('scof.jpg'))) }}" alt="South Cotabato Office" style="width: 60px; height: 60px; object-fit: contain;">
                @else
                    <div class="logo-placeholder">
                        <div style="font-weight: bold;">SCOF</div>
                        <div style="margin: 1px 0;">LOGO</div>
                    </div>
                @endif
            </div>
        </div>
    </div>

    <div class="filters">
        <p><strong>Date Range:</strong>
            {{ $startDate ? \Carbon\Carbon::parse($startDate)->format('F d, Y') : 'All Dates' }}
            to
            {{ $endDate ? \Carbon\Carbon::parse($endDate)->format('F d, Y') : 'All Dates' }}
        </p>
        <p><strong>Total Records:</strong> {{ count($pdls) }}</p>
        <p><strong>Generated On:</strong> {{ $generatedAt }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Case No</th>
                <th>Crime Committed</th>
                <th>Date of Birth</th>
                <th>Date Committed</th>
                <th>Age</th>
                <th>Address</th>
                <th>Tribe</th>
                <th>Years</th>
                <th>Case Status</th>
                <th>RTC</th>
            </tr>
        </thead>
        <tbody>
            @php
                $currentPdlId = null;
                $pdlCaseCount = 0;
                $pdlCases = [];
                
                // Group cases by PDL
                foreach($pdls as $pdl) {
                    if (!isset($pdlCases[$pdl['pdl_id']])) {
                        $pdlCases[$pdl['pdl_id']] = [];
                    }
                    $pdlCases[$pdl['pdl_id']][] = $pdl;
                }
            @endphp

            @foreach($pdlCases as $pdlId => $cases)
                @foreach($cases as $index => $pdl)
                    <tr class="{{ $index === 0 ? 'pdl-name' : 'case-row no-border-top' }}">
                        @if($index === 0)
                            <td rowspan="{{ count($cases) }}" class="pdl-name">{{ $pdl['name'] }}</td>
                            <td>{{ $pdl['case_no'] }}</td>
                            <td>{{ $pdl['crime_committed'] }}</td>
                            <td rowspan="{{ count($cases) }}">{{ $pdl['date_of_birth'] }}</td>
                            <td>{{ $pdl['date_committed'] }}</td>
                            <td rowspan="{{ count($cases) }}" class="text-center">{{ is_numeric($pdl['age']) ? floor($pdl['age']) : 'N/A' }}</td>
                            <td rowspan="{{ count($cases) }}">{{ $pdl['address'] }}</td>
                            <td rowspan="{{ count($cases) }}">{{ $pdl['tribe'] }}</td>
                            <td rowspan="{{ count($cases) }}" class="text-center">{{ is_numeric($pdl['years']) ? floor($pdl['years']) : 'N/A' }}</td>
                            <td>{{ $pdl['case_status'] }}</td>
                            <td>{{ $pdl['rtc'] }}</td>
                        @else
                            <td>{{ $pdl['case_no'] }}</td>
                            <td>{{ $pdl['crime_committed'] }}</td>
                            <td>{{ $pdl['date_committed'] }}</td>
                            <td>{{ $pdl['case_status'] }}</td>
                            <td>{{ $pdl['rtc'] }}</td>
                        @endif
                    </tr>
                @endforeach
            @endforeach

            @if(count($pdls) === 0)
            <tr>
                <td colspan="11" class="text-center">No records found for the selected date range.</td>
            </tr>
            @endif
        </tbody>
    </table>

    <div class="footer">
        <p>Generated on: {{ $generatedAt }}</p>
    </div>
</body>
</html>