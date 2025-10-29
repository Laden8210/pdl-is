<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>GCTA & TASTM Certification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            margin: 0;
            padding: 20px;
            line-height: 1.4;
            max-width: 800px;
            margin: 0 auto;
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

        .logo-left,
        .logo-right {
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
            margin-bottom: 10px;
        }

        .certification-text {
            text-align: justify;
            margin-bottom: 20px;
            line-height: 1.6;
        }

        .computation-title {
            font-weight: bold;
            margin-bottom: 10px;
        }

        .computation-section {
            margin-bottom: 20px;
            width: 100%;

        }

        .computation-line {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
            font-family: monospace;
            text-align: right;
            width: 100%;

            padding: 2px 0;
        }

  

        .computation-label {
            text-align: right;
        }

        .computation-value {
            text-align: right;
        }

        .computation-date {
            display: flex;
            gap: 20px;
        }

        .computation-date span {
            width: 40px;
            text-align: center;
        }


        .computation-section {
            margin-bottom: 20px;
            width: 100%;
        }

        .computation-line {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
            font-family: monospace;
            width: 100%;
            clear: both;
        }


        .gcta-table {
            margin: 20px 0;
            width: 100%;
            font-family: monospace;
            border-collapse: collapse;
            table-layout: fixed;
        }

        .gcta-table th,
        .gcta-table td {
            border: 1px solid #ddd;
            padding: 3px 6px;
            text-align: center;
            font-size: 9px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .col-year {
            width: 12%;
        }

        .col-month {
            width: 8%;
        }

        .col-day {
            width: 8%;
        }

        .col-earned-gcta {
            width: 20%;
        }

        .col-earned-tastm {
            width: 20%;
        }

        .total-line {
            border-top: 1px solid #000;
            margin: 5px 0;
            width: 100px;
        }

        .summary-calculations {
            margin: 20px 0;
            font-family: monospace;
        }

        .summary-calc {
            margin-bottom: 5px;
        }

        .concluding-text {
            text-align: justify;
            margin: 20px 0;
        }

        .issued-text {
            text-align: left;
            margin: 20px 0;
        }

        .totals-row {
            display: flex;
            justify-content: flex-start;
            margin-top: 5px;
        }

        .total-box {
            border-top: 1px solid #000;
            width: 15%;
            margin-right: 5%;
            text-align: center;
            padding-top: 2px;
        }

        /* Print-specific styles */
        @media print {
            body {
                padding: 0;
                font-size: 10px;
            }

            .header {
                page-break-after: avoid;
            }

            .gcta-table {
                page-break-inside: avoid;
            }
        }

          .signature-section {
            margin-top: 40px;
            text-align: right;
        }


        .signature-name {
            font-weight: bold;
            margin-bottom: 5px;
        }

        .signature-title {
            font-size: 10px;
        }
    </style>
</head>

<body>
    <div class="header">
        <div class="logo-section">
            <div class="logo-left">
                @if (file_exists(public_path('rdh.jpg')))
                    <img src="data:image/jpeg;base64,{{ base64_encode(file_get_contents(public_path('rdh.jpg'))) }}"
                        alt="Regional Director of Health" style="width: 80px; height: 80px; object-fit: contain;">
                @else
                    <div class="logo-placeholder">
                        <div style="font-weight: bold;">RDH</div>
                        <div style="margin: 2px 0;">LOGO</div>
                    </div>
                @endif
            </div>
            <div class="header-text">
                <div class="republic">Republic of the Philippines</div>
                <div class="facility-name">South Cotabato Rehabilitation and Detention Center</div>
                <div class="contact-info">Tel #: (083) 228-2445; Email Address: <span
                        style="color: blue;">socotrehab@gmail.com</span></div>
                <div class="city">City of Koronadal</div>
            </div>
            <div class="logo-right">
                @if (file_exists(public_path('scof.jpg')))
                    <img src="data:image/jpeg;base64,{{ base64_encode(file_get_contents(public_path('scof.jpg'))) }}"
                        alt="South Cotabato Office" style="width: 80px; height: 80px; object-fit: contain;">
                @else
                    <div class="logo-placeholder">
                        <div style="font-weight: bold;">SCOF</div>
                        <div style="margin: 2px 0;">LOGO</div>
                    </div>
                @endif
            </div>
        </div>
    </div>

    <div class="cert-title">CERTIFICATION</div>
    <div class="subtitle">Good Conduct Time Allowance (GCTA) and Time Allowance for Study Teaching and Mentoring (TASTM)
    </div>

    <div class="to-whom">TO WHOM IT MAY CONCERN:</div>

    <div class="certification-text">
        THIS IS TO CERTIFY that convicted prisoner
        <strong>{{ strtoupper($pdl->fname . ' ' . $pdl->lname) }}</strong>, was detained in this facility since
        <strong>{{ $commitment_date }}</strong> to date. {{ $pdl->gender == 'Male' ? 'He' : 'She' }} is generally of
        good behaviour. {{ $pdl->gender == 'Male' ? 'He' : 'She' }} is granted of Good Conduct Time Allowance (GCTA)
        less <strong>0 year/s to deduct</strong> for {{ $pdl->gender == 'Male' ? 'his' : 'her' }} violation of
        <strong>none</strong>. {{ $pdl->gender == 'Male' ? 'His' : 'Her' }} net GCTA then is
        <strong>{{ $total_gcta }} days</strong> or
        <strong>{{ call_user_func($convertDaysToYMD, $total_gcta) }}</strong> covering said period.
        {{ $pdl->gender == 'Male' ? 'He' : 'She' }} is also granted of net TASTM of <strong>{{ $total_tastm }}
            days</strong> or <strong>{{ call_user_func($convertDaysToYMD, $total_tastm) }}</strong> for said
        period. {{ $pdl->gender == 'Male' ? 'His' : 'Her' }} total detention with GCTA and TASTM then summed to
        <strong>{{ call_user_func($convertDaysToYMD, $total_allowances) }}</strong>.
    </div>

    <div class="computation-section">
        <div class="computation-title">Computation of Preventive Imprisonment:</div>

        <div style="width: 100%;">
            <div class="computation-line">
                <div class="computation-label">Present Date:</div>
                <div class="computation-date">
                    <span>{{ $currentDate->format('Y') }}</span>
                    <span>{{ $currentDate->format('n') }}</span>
                    <span>{{ $currentDate->format('j') }}</span>
                </div>
                <span class="computation-date-separator">-------------------</span>
            </div>

            <div class="computation-line">
                <div class="computation-label">Commitment Date:</div>
                <div class="computation-date">
                    <span>{{ $commitmentDate->format('Y') }}</span>
                    <span>{{ $commitmentDate->format('n') }}</span>
                    <span>{{ $commitmentDate->format('j') }}</span>

                </div>
                <span class="computation-date-separator">-------------------</span>
            </div>



            <div class="computation-line">
                <div class="computation-label">Total Detention</div>
                <div class="computation-value">{{ $time_served['years'] }} Y {{ $time_served['months'] }} M
                    {{ $time_served['days'] }} D</div>
                      <span class="computation-date-separator">-------------------</span>
            </div>

            <div class="computation-line">
                <div class="computation-label">Add GCTA</div>
                <div class="computation-value">({{ $net_gcta_ymd }})</div>
            </div>

            <div class="separator-line" style="margin-left: 0;"></div>

            <div class="computation-line">
                <div class="computation-label">Total Detention w/ GCTA</div>
                <div class="computation-value">({{ $total_detention_gcta_ymd }})</div>
                <span class="computation-date-separator">-------------------</span>
            </div>

            <div class="computation-line">
                <div class="computation-label">Add TASTM</div>
                <div class="computation-value">({{ $net_tastm_ymd }})</div>
                <span class="computation-date-separator">-------------------</span>
            </div>

            <div class="separator-line" style="margin-left: 0;"></div>

            <div class="computation-line">
                <div class="computation-label">Total Detention w/ GCTA & TASTM</div>
                <div class="computation-value">({{ $total_detention_gcta_tastm_ymd }})</div>
                <span class="computation-date-separator">-------------------</span>
            </div>
        </div>
    </div>

    <table class="gcta-table">
        <thead>
            <tr>
                <th colspan="3">From</th>
                <th colspan="3">To</th>
                <th class="col-earned-gcta">EARNED GCTA</th>
                <th class="col-earned-tastm">EARNED TASTM</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($computation_data as $row)
                <tr>
                    <td colspan="3">{{ explode(' ', $row['first_column_date'])[0] }}</td>
                    <td colspan="3">{{ explode(' ', $row['second_column_date'])[0] }}</td>
                    <td class="col-earned-gcta">{{ $row['gcta_calculation'] }} {{ $row['gcta_total'] }}</td>
                    <td class="col-earned-tastm">{{ $row['tastm_calculation'] }} {{ $row['tastm_total'] }}</td>
                </tr>
            @endforeach
            <!-- Totals row -->
            <tr>
                <td colspan="6"
                    style="text-align: left; border: none; border-top: 1px solid #000; padding-left: 10px;">
                    <strong>TOTAL</strong>
                </td>
                <td class="col-earned-gcta" style="border-top: 1px solid #000;">
                    <strong>{{ number_format($total_gcta) }}</strong>
                </td>
                <td class="col-earned-tastm" style="border-top: 1px solid #000;">
                    <strong>{{ number_format($total_tastm) }}</strong>
                </td>
            </tr>
        </tbody>
    </table>

    <div class="concluding-text">
        This certification is issued upon the request of the accused for whatever legal purpose it may serve
        {{ $pdl->gender == 'Male' ? 'him' : 'her' }} best.
    </div>

    <div class="issued-text">
        Issued this {{ now()->format('jS') }} day of {{ now()->format('F Y') }}. Koronadal City, South Cotabato.
    </div>

    
    <div class="signature-section">

        <div class="signature-name">{{$full_name ?? 'Provincial Warden'}}</div>
        <div class="signature-title">{{$position ?? 'Provincial Warden'}}</div>
    </div>
</body>

</html>
