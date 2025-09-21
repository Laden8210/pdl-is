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
            text-align: center;
            margin-bottom: 30px;
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

        .logo-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            margin-top: 10px;
        }

        .logo {
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .logo img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }

        .logo-placeholder {
            width: 80px;
            height: 80px;
            border: 2px solid #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
            text-align: center;
            background-color: #f9f9f9;
            color: #666;
        }

        .header-content {
            flex: 1;
            text-align: center;
        }

        .recipient-info {
            margin-bottom: 20px;
        }

        .recipient-info div {
            margin-bottom: 5px;
        }

        .label {
            font-weight: bold;
            display: inline-block;
            width: 80px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
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

        .section-title {
            font-weight: bold;
            margin-bottom: 10px;
            margin-top: 20px;
        }

        .two-column {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
        }

        .column {
            flex: 1;
        }

        .remarks {
            background-color: #f9f9f9;
            padding: 10px;
            border: 1px solid #ccc;
            margin: 20px 0;
        }

        .submitted-by {
            margin-top: 30px;
        }

        .submitted-by div {
            margin-bottom: 5px;
        }

        .total-row {
            background-color: #e0e0e0;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="logo-section">
        <div class="logo">
            {{-- @if(file_exists(public_path('images/pgo.jpg')))
                <img src="{{ public_path('images/pgo.jpg') }}" alt="Provincial Government Office Logo">
            @else
                <div class="logo-placeholder">
                    <div>
                        <div style="font-weight: bold;">PGO</div>
                        <div style="margin: 2px 0;">LOGO</div>
                        <div style="font-size: 6px;">Provincial</div>
                        <div style="font-size: 6px;">Government</div>
                    </div>
                </div>
            @endif --}}
        </div>
        <div class="header-content">
            <div class="republic">Republic of the Philippines</div>
            <div class="facility-name">{{ $data['facility_name'] }}</div>
            <div class="location">{{ $data['location'] }}</div>
        </div>
        <div class="logo">
            {{-- @if(file_exists(public_path('images/scrdc.jpg')))
                <img src="{{ public_path('images/scrdc.jpg') }}" alt="South Cotabato Rehabilitation and Detention Center Logo">
            @else
                <div class="logo-placeholder">
                    <div>
                        <div style="font-weight: bold;">SCRDC</div>
                        <div style="margin: 2px 0;">LOGO</div>
                        <div style="font-size: 6px;">Rehabilitation</div>
                        <div style="font-size: 6px;">Center</div>
                    </div>
                </div>
            @endif --}}
        </div>
    </div>

    <div class="recipient-info">
        <div><span class="label" style="font-weight: bold;">To:</span> {{ $data['recipient']['name'] }}</div>
        <div><span class="label"></span> {{ $data['recipient']['position'] }}</div>
        <div><span class="label">Subject:</span> {{ $data['title'] }}</div>
        <div><span class="label">Date:</span> {{ $data['report_date'] }}</div>
        <div><span class="label">Sir:</span></div>
    </div>

    <div style="margin-bottom: 20px;">
        This is to inform you of the jail status within 24 hours.
    </div>

    <!-- Escorted PDLs -->
    <div class="section-title">Escorted PDL for court hearing at any different court cases:</div>
    <table>
        <thead>
            <tr>
                <th>RTC</th>
                <th>NO. OF PDL</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>NONE</td>
                <td>{{ $data['escorted_pdls']['rtc_count'] }}</td>
            </tr>
            <tr class="total-row">
                <td>TOTAL:</td>
                <td>{{ $data['escorted_pdls']['total'] }}</td>
            </tr>
        </tbody>
    </table>

    <!-- Released and Committed PDLs -->
    <div class="two-column">
        <div class="column">
            <div class="section-title">Released PDL from any different courts:</div>
            <table>
                <thead>
                    <tr>
                        <th>RTC</th>
                        <th>NO. OF PDL</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>NONE</td>
                        <td>{{ $data['released_pdls']['rtc_count'] }}</td>
                    </tr>
                    <tr class="total-row">
                        <td>TOTAL:</td>
                        <td>{{ $data['released_pdls']['total'] }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="column">
            <div class="section-title">Committed of PDL from any courts:</div>
            <table>
                <thead>
                    <tr>
                        <th>RTC/POLICE STATION</th>
                        <th>NO. OF PDL</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>NONE</td>
                        <td>{{ $data['committed_pdls']['rtc_count'] }}</td>
                    </tr>
                    <tr class="total-row">
                        <td>TOTAL:</td>
                        <td>{{ $data['committed_pdls']['total'] }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Visitors -->
    <div class="section-title">Number of visitors entered in Jail premises:</div>
    <table>
        <thead>
            <tr>
                <th>NO. OF VISITORS (PADALA)</th>
                <th>NO. OF VISITORS W/ TRANSACTION</th>
                <th>TOTAL</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ $data['visitors']['padala'] }}</td>
                <td>{{ $data['visitors']['transaction'] }}</td>
                <td class="total-row">{{ $data['visitors']['total'] }}</td>
            </tr>
        </tbody>
    </table>

    <!-- Greyhound Operation -->
    <div class="section-title">Greyhound operation conducted:</div>
    <table>
        <thead>
            <tr>
                <th>CELL OPERATED</th>
                <th>NUMBER OF TIMES</th>
                <th>CONDUCTED BY</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ $data['greyhound_operation']['cell_operated'] }}</td>
                <td>{{ $data['greyhound_operation']['number_of_times'] }}</td>
                <td>{{ $data['greyhound_operation']['conducted_by'] }}</td>
            </tr>
        </tbody>
    </table>

    <!-- Confined PDLs -->
    <div class="two-column">
        <div class="column">
            <div class="section-title">Total PDL confined at SCRDC:</div>
            <table>
                <thead>
                    <tr>
                        <th>CATEGORY</th>
                        <th>NO. OF PDL</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>FEMALE</td>
                        <td>{{ $data['confined_pdls']['female'] }}</td>
                    </tr>
                    <tr>
                        <td>MALE</td>
                        <td>{{ $data['confined_pdls']['male'] }}</td>
                    </tr>
                    <tr class="total-row">
                        <td>TOTAL:</td>
                        <td>{{ $data['confined_pdls']['total'] }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="column">
            <div class="section-title">No. of PDL confined at SCPH & any private hospital:</div>
            <table>
                <thead>
                    <tr>
                        <th>CATEGORY</th>
                        <th>NO. OF PDL</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>FEMALE</td>
                        <td>{{ $data['hospital_pdls']['female'] }}</td>
                    </tr>
                    <tr>
                        <td>MALE</td>
                        <td>{{ $data['hospital_pdls']['male'] }}</td>
                    </tr>
                    <tr>
                        <td>HOUSE ARREST</td>
                        <td>{{ $data['hospital_pdls']['house_arrest'] }}</td>
                    </tr>
                    <tr class="total-row">
                        <td>TOTAL:</td>
                        <td>{{ $data['hospital_pdls']['total'] }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Remarks -->
    <div class="section-title">Remarks:</div>
    <div class="remarks">
        {{ $data['remarks'] }}
    </div>

    <!-- Submitted By -->
    <div class="submitted-by">
        <div class="section-title">Submitted by:</div>
        <div>{{ $data['submitted_by']['name'] }}</div>
        <div>{{ $data['submitted_by']['position'] }}</div>
    </div>

    <div style="margin-top: 20px; font-size: 8px; text-align: right;">
        Generated on: {{ date('F d, Y \a\t g:i A') }}
    </div>
</body>
</html>
