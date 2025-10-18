<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Certificate of Detention</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12px;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
            background-color: white;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            position: relative;
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

        .republic {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .province {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .office {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
            text-transform: uppercase;
        }

        .unit {
            font-size: 14px;
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

        .separator {
            border-top: 1px solid #000;
            margin: 10px 0;
        }

        .title {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            margin: 30px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .salutation {
            font-weight: bold;
            text-transform: uppercase;
            text-decoration: underline;
            margin-bottom: 20px;
        }

        .content {
            text-align: justify;
            margin-bottom: 20px;
            line-height: 1.8;
        }

        .content p {
            margin-bottom: 15px;
            text-indent: 30px;
        }

        .signature-section {
            margin-top: 50px;
            text-align: right;
        }

        .signature-name {
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 5px;
        }

        .signature-title {
            font-size: 11px;
        }

        .highlight {
            font-weight: bold;
        }

        .uppercase {
            text-transform: uppercase;
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
                <div class="province">Province of South Cotabato</div>
                <div class="office">Office of the Provincial Governor</div>
                <div class="unit">Provincial Jail Management Unit</div>
                <div class="location">Koronadal City</div>
                <div class="separator"></div>
                <div class="contact">
                    Tel #: (083) 228-2445; Email Address: socot.scrdcjail@gmail.com
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

    <div class="title">Certificate of Detention</div>

    <div class="salutation">To Whom It May Concern:</div>

    <div class="content">
        <p>
            THIS IS TO CERTIFY that <span class="highlight uppercase">{{ $pdl_name }}</span>, was committed in this institution on <span class="highlight">{{ $date_committed }}</span>, per Commitment Order issued by the <span class="highlight">{{ $court_branch }}</span> for the charge of <span class="highlight uppercase">{{ $crime_committed }}</span> docketed as <span class="highlight">{{ $case_number }}</span>.
        </p>

        <p>
            It is further certified that said accused was detained for <span class="highlight">{{ $detention_period }}</span> as to date.
        </p>

        <p>
            This certification is issued upon the request of the above-named person for whatever legal purpose it may serve him best.
        </p>

        <p>
            Issued this <span class="highlight">{{ $issue_date }}</span>, <span class="highlight">{{ $issue_city }}</span>.
        </p>
    </div>

    <div class="signature-section">
        <div class="signature-name">{{ $officer_name }}</div>
        <div class="signature-title">{{ $officer_position }}</div>
    </div>
</body>
</html>
