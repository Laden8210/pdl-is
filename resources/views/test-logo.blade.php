<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Logo Test</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .test-section { margin: 20px 0; padding: 10px; border: 1px solid #ccc; }
        img { border: 1px solid #000; }
    </style>
</head>
<body>
    <h1>Logo Test Report</h1>

    <div class="test-section">
        <h2>PGO Logo Test</h2>
        @if(file_exists(public_path('PGO.jpg')))
            <p>File exists: YES</p>
            <p>File size: {{ filesize(public_path('PGO.jpg')) }} bytes</p>
            <img src="data:image/jpeg;base64,{{ base64_encode(file_get_contents(public_path('PGO.jpg'))) }}" alt="PGO Logo" style="width: 100px; height: 100px;">
        @else
            <p>File exists: NO</p>
        @endif
    </div>

    <div class="test-section">
        <h2>SCRDC Logo Test</h2>
        @if(file_exists(public_path('SCRDC.jpg')))
            <p>File exists: YES</p>
            <p>File size: {{ filesize(public_path('SCRDC.jpg')) }} bytes</p>
            <img src="data:image/jpeg;base64,{{ base64_encode(file_get_contents(public_path('SCRDC.jpg'))) }}" alt="SCRDC Logo" style="width: 100px; height: 100px;">
        @else
            <p>File exists: NO</p>
        @endif
    </div>

    <div class="test-section">
        <h2>Simple Image Test</h2>
        <p>If you can see a red square below, DomPDF can render images:</p>
        <div style="width: 50px; height: 50px; background-color: red; border: 1px solid black;"></div>
    </div>
</body>
</html>
