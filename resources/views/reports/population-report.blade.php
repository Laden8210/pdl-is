<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Population Report</title>
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
            font-size: 16px;
            font-weight: bold;
        }
        .header h2 {
            margin: 5px 0;
            font-size: 14px;
            font-weight: normal;
        }
        .header h3 {
            margin: 5px 0;
            font-size: 12px;
            font-weight: normal;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid #000;
            padding: 6px;
            text-align: center;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        th:first-child, td:first-child {
            text-align: left;
        }
        .total-row {
            background-color: #e6e6e6;
            font-weight: bold;
        }
        .footer {
            margin-top: 20px;
            text-align: right;
            font-size: 10px;
            color: #666;
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
                <h1>JAIL SERVICES</h1>
                <h2>as of {{ $data['report_date'] }}</h2>
                <h3>{{ $data['title'] }}</h3>
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

    <table>
        <thead>
            <tr>
                @foreach($data['headers'] as $header)
                <th>{{ $header }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach($data['data'] as $row)
            <tr class="{{ $row[strtolower($data['headers'][0])] === 'TOTAL' ? 'total-row' : '' }}">
                @foreach($data['headers'] as $header)
                @php
                    $key = strtolower($header);
                    $value = $row[$key] ?? $row[array_keys($row)[array_search($header, $data['headers'])]];
                @endphp
                <td>{{ $value }}</td>
                @endforeach
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Generated on: {{ now()->format('Y-m-d H:i:s') }}</p>
    </div>
</body>
</html>
