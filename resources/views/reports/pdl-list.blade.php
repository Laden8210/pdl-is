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
    </style>
</head>
<body>
    <div class="header">
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
            @if(file_exists(public_path('rdh.jpg')))
                <img src="data:image/jpeg;base64,{{ base64_encode(file_get_contents(public_path('rdh.jpg'))) }}" alt="Regional Director of Health" style="width: 60px; height: 60px; object-fit: contain; margin-right: 20px;">
            @else
                <div style="width: 60px; height: 60px; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 6px; text-align: center; margin-right: 20px;">
                    <div>
                        <div style="font-weight: bold;">RDH</div>
                        <div style="margin: 1px 0;">LOGO</div>
                    </div>
                </div>
            @endif
            <div style="text-align: center;">
                <h1>LIST OF PERSONS DEPRIVED OF LIBERTY (PDL)</h1>
                <p>South Cotabato Rehabilitation and Detention Center</p>
                <p>PDL List Report</p>
            </div>
            @if(file_exists(public_path('scof.jpg')))
                <img src="data:image/jpeg;base64,{{ base64_encode(file_get_contents(public_path('scof.jpg'))) }}" alt="South Cotabato Office" style="width: 60px; height: 60px; object-fit: contain; margin-left: 20px;">
            @else
                <div style="width: 60px; height: 60px; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 6px; text-align: center; margin-left: 20px;">
                    <div>
                        <div style="font-weight: bold;">SCOF</div>
                        <div style="margin: 1px 0;">LOGO</div>
                    </div>
                </div>
            @endif
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
                <th>No. of Cases</th>
                <th>Tribe</th>
                <th>Years</th>
                <th>Case Status</th>
                <th>RTC</th>
            </tr>
        </thead>
        <tbody>
            @foreach($pdls as $pdl)
            <tr>
                <td>{{ $pdl['Name'] }}</td>
                <td>{{ $pdl['CaseNo'] }}</td>
                <td>{{ $pdl['CrimeCommitted'] }}</td>
                <td>{{ $pdl['Date of Birth'] }}</td>
                <td>{{ $pdl['Date Committed'] }}</td>
                <td class="text-center">{{ $pdl['NoOfCases'] }}</td>
                <td>{{ $pdl['Tribe'] }}</td>
                <td class="text-center">{{ $pdl['Years'] }}</td>
                <td>{{ $pdl['CaseStatus'] }}</td>
                <td>{{ $pdl['RTC'] }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Generated on: {{ $generatedAt }}</p>

    </div>
</body>
</html>
