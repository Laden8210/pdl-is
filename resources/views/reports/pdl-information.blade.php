<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Certificate of Detention</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Times New Roman', serif;
            font-size: 12px;
            padding: 20px;
            line-height: 1.4;
            background-color: white;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
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
            width: 12%;
            text-align: center;
            vertical-align: top;
        }

        .header-text {
            display: table-cell;
            width: 76%;
            text-align: center;
            vertical-align: middle;
            padding: 0 15px;
        }

        .logo-container img {
            width: 70px;
            height: 70px;
            object-fit: contain;
        }

        .republic {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 3px;
        }

        .office-name {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 3px;
        }

        .city {
            font-size: 11px;
            margin-bottom: 5px;
        }

        .contact {
            font-size: 10px;
            margin-bottom: 0;
        }

        .inmate-section {
            display: table;
            width: 100%;
            margin-bottom: 20px;
        }

        .photo-section {
            display: table-cell;
            width: 25%;
            vertical-align: top;
            text-align: center;
            padding-right: 15px;
        }

        .photo-container img {
            width: 150px;
            height: 150px;
            border: 2px solid #000;
            object-fit: cover;
        }

        .inmate-id {
            text-align: center;
            font-weight: bold;
            margin-top: 5px;
            font-size: 14px;
        }

        .details-section {
            display: table-cell;
            width: 75%;
            vertical-align: top;
        }

        .details-row {
            display: table;
            width: 100%;
            margin-bottom: 8px;
        }

        .detail-label {
            display: table-cell;
            width: 35%;
            font-weight: bold;
            vertical-align: top;
        }

        .detail-value {
            display: table-cell;
            width: 30%;
            border-bottom: 1px solid #000;
            padding-bottom: 2px;
        }

        .detail-label-right {
            display: table-cell;
            width: 20%;
            font-weight: bold;
            vertical-align: top;
            text-align: right;
            padding-right: 10px;
        }

        .detail-value-right {
            display: table-cell;
            width: 15%;
            border-bottom: 1px solid #000;
            padding-bottom: 2px;
        }

        .case-section {
            display: table;
            width: 100%;
            margin-top: 20px;
            border-top: 1px solid #000;
            padding-top: 15px;
        }

        .case-item {
            display: table-cell;
            width: 33%;
            padding: 0 10px;
        }

        .case-label {
            font-weight: bold;
            font-size: 11px;
            margin-bottom: 5px;
        }

        .case-value {
            font-size: 11px;
            border-bottom: 1px solid #000;
            padding-bottom: 3px;
            min-height: 25px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <div class="logo-section">
                <div class="logo-left">
                    <div class="logo-container">
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
                </div>
                <div class="header-text">
                    <div class="republic">Republic of the Philippines</div>
                    <div class="office-name">South Cotabato Rehabilitation and Detention Center</div>
                    <div class="city">City of Koronadal</div>
                    <div class="contact">Tel #: (083) 228-2445; Email Address: socot.scrdcjail@gmail.com</div>
                </div>
                <div class="logo-right">
                    <div class="logo-container">
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
        </div>

        <div class="inmate-section">
            <div class="photo-section">
                <div class="photo-container">

                    <img src="data:image/jpeg;base64,{{ $image }}" alt="PDL Image"
                        style="width: 150px; height: 150px; object-fit: cover;">
                </div>
                <div class="inmate-id">{{ $pdl->lname }}, {{ $pdl->mname }}.<br>ID No: {{ $pdl->id }}</div>
            </div>

            <div class="details-section">
                <div class="details-row">
                    <div class="detail-label">Last Name:</div>
                    <div class="detail-value">{{ $pdl->lname }}</div>
                    <div class="detail-label-right">Birth Date:</div>
                    <div class="detail-value-right">{{ $pdl->birthdate->format('F d, Y') }}</div>
                </div>

                <div class="details-row">
                    <div class="detail-label">First Name:</div>
                    <div class="detail-value">{{ $pdl->fname }}</div>
                    <div class="detail-label-right">Gender:</div>
                    <div class="detail-value-right">{{ $pdl->gender }}</div>
                </div>

                <div class="details-row">
                    <div class="detail-label">Middle Name:</div>
                    <div class="detail-value">{{ $pdl->mname }}</div>
                    <div class="detail-label-right">Age:</div>
                    <div class="detail-value-right">{{ $pdl->age }}</div>
                </div>

                <div class="details-row">
                    <div class="detail-label">Suffix:</div>
                    <div class="detail-value">{{ $pdl->suffix }}</div>
                    <div class="detail-label-right">Alias:</div>
                    <div class="detail-value-right">{{ $pdl->alias }}</div>
                </div>

                <div class="details-row">

                    <div class="detail-label">Date Committed:</div>
                    <div class="detail-value">
                        @if ($pdl->cases->isNotEmpty() && $pdl->cases->first()->date_committed)
                            {{ $pdl->cases->first()->date_committed->format('F d, Y') }}
                        @else
                            N/A
                        @endif
                    </div>
                    <div class="detail-label-right">Time Committed:</div>
                    <div class="detail-value-right">
                        @if ($pdl->cases->isNotEmpty() && $pdl->cases->first()->time_committed)
                            {{ $pdl->cases->first()->time_committed }}
                        @else
                            N/A
                        @endif
                    </div>
                </div>

                <div class="details-row">
                    <div class="detail-label">Barangay:</div>
                    <div class="detail-value">{{ $pdl->brgy }}</div>
                    <div class="detail-label-right">Municipality:</div>
                    <div class="detail-value-right">{{ $pdl->city }}</div>

                </div>

                <div class="details-row">
                    <div class="detail-label">Province:</div>
                    <div class="detail-value">{{ $pdl->province }}</div>
                    <div class="detail-label-right">Tribe:</div>
                    <div class="detail-value-right">{{ $pdl->ethnic_group }}</div>
                </div>

                <div class="details-row">

                    <div class="detail-label">Status:</div>
                    <div class="detail-value">{{ $pdl->civil_status }}</div>
                    <div class="detail-label-right"> </div>

                </div>
            </div>
        </div>

        <div class="case-section" style="margin-top: 20px; border-top: 1px solid #000; padding-top: 15px;">
            @if ($pdl->cases->count() > 0)


                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                    <thead>
                        <tr style="background-color: #f5f5f5;">
                            <th style="border: 1px solid #000; padding: 8px; text-align: left; width: 10%;">Case #</th>
                            <th style="border: 1px solid #000; padding: 8px; text-align: left; width: 20%;">Case No</th>
                            <th style="border: 1px solid #000; padding: 8px; text-align: left; width: 30%;">Crime
                                Committed</th>
                            <th style="border: 1px solid #000; padding: 8px; text-align: left; width: 15%;">Case Status
                            </th>
                            <th style="border: 1px solid #000; padding: 8px; text-align: left; width: 15%;">RTC Branch
                            </th>
                            <th style="border: 1px solid #000; padding: 8px; text-align: left; width: 10%;">Date Filed
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($pdl->cases as $index => $case)
                            <tr
                                style="{{ $index % 2 == 0 ? 'background-color: #f9f9f9;' : 'background-color: #fff;' }}">
                                <td style="border: 1px solid #000; padding: 8px; font-weight: bold;">
                                    {{ $index + 1 }}</td>
                                <td style="border: 1px solid #000; padding: 8px;">{{ $case->case_number ?? 'N/A' }}
                                </td>
                                <td style="border: 1px solid #000; padding: 8px;">{{ $case->crime_committed ?? 'N/A' }}
                                </td>
                                <td style="border: 1px solid #000; padding: 8px;">{{ $case->case_status ?? 'N/A' }}
                                </td>
                                <td style="border: 1px solid #000; padding: 8px;">
                                    {{ $courtOrder->court->branch_code }}
                                </td>
                                <td style="border: 1px solid #000; padding: 8px;">
                                    {{ $courtOrder->order_date->format('F d, Y') }}

                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @else
                <div
                    style="text-align: center; color: #666; font-style: italic; padding: 20px; border: 1px solid #ddd;">
                    <p>No case information available.</p>
                </div>
            @endif
        </div>
    </div>
</body>

</html>
