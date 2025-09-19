import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, FileText, Calendar, Users, AlertCircle, Building } from 'lucide-react';
import  AppLayout  from '@/layouts/app-layout';

interface CourtStation {
    station: string;
    branch: string;
    male: number;
    female: number;
    cicl: number;
    total: number;
}

interface CourtData {
    [courtType: string]: {
        stations: CourtStation[];
    };
}

interface ReportData {
    title: string;
    facility_name: string;
    location: string;
    contact: {
        tel: string;
        email: string;
    };
    as_of_date: string;
    court_data: CourtData;
    totals: {
        male: number;
        female: number;
        cicl: number;
        total: number;
    };
}

interface PageProps {
    reportData?: ReportData;
    filters?: {
        as_of_date?: string;
    };
}

export default function InmatesStatusReport({ reportData, filters }: PageProps) {
    const { data, setData, post, processing } = useForm({
        as_of_date: filters?.as_of_date || new Date().toISOString().split('T')[0],
        export_pdf: false,
    });

    const handleGenerate = (exportPdf: boolean = false) => {
        setData('export_pdf', exportPdf);
        post(route('reports.inmates-status.generate'));
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        params.append('as_of_date', data.as_of_date);

        console.log(params.toString());
        console.log(route('reports.inmates-status.export') + '?' + params.toString());
        window.location.href = route('reports.inmates-status.export') + '?' + params.toString();
    };

    return (
        <AppLayout>
            <Head title="Inmates Status Report - South Cotabato Rehabilitation and Detention Center" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Inmates Status Report</h1>
                        <p className="text-muted-foreground">
                            Status Report as to the Total Number of Detainees
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            {reportData ? `As of ${reportData.as_of_date}` : 'Select Date'}
                        </span>
                    </div>
                </div>

                {/* Report Generation Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Generate Status Report</CardTitle>
                        <CardDescription>
                            Select the date for the inmates status report
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="as_of_date">As of Date</Label>
                                <Input
                                    id="as_of_date"
                                    type="date"
                                    value={data.as_of_date}
                                    onChange={(e) => setData('as_of_date', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>&nbsp;</Label>
                                <div className="flex space-x-2">
                                    <Button
                                        onClick={() => handleGenerate(false)}
                                        disabled={processing}
                                        className="flex-1"
                                    >
                                        <FileText className="h-4 w-4 mr-2" />
                                        {processing ? 'Generating...' : 'Generate Report'}
                                    </Button>
                                    <Button
                                        onClick={() => handleExport()}
                                        disabled={processing}
                                        variant="outline"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Export PDF
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Report Results */}
                {reportData && (
                    <div className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center">
                                        <Users className="h-8 w-8 text-blue-600" />
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Total Male
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {reportData.totals.male}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center">
                                        <Users className="h-8 w-8 text-pink-600" />
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Total Female
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {reportData.totals.female}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center">
                                        <Users className="h-8 w-8 text-green-600" />
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Total CICL
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {reportData.totals.cicl}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center">
                                        <Calendar className="h-8 w-8 text-purple-600" />
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Grand Total
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {reportData.totals.total}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Report Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-center">{reportData.title}</CardTitle>
                                <CardDescription className="text-center">
                                    {reportData.facility_name} - {reportData.location}
                                </CardDescription>
                                <div className="text-center text-sm text-muted-foreground">
                                    Tel: {reportData.contact.tel} | Email: {reportData.contact.email}
                                </div>
                                <div className="text-center text-sm font-medium">
                                    As of {reportData.as_of_date}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-center">COURT</TableHead>
                                                <TableHead className="text-center">STATION</TableHead>
                                                <TableHead className="text-center">BRANCH</TableHead>
                                                <TableHead className="text-center">MALE</TableHead>
                                                <TableHead className="text-center">FEMALE</TableHead>
                                                <TableHead className="text-center">CICL</TableHead>
                                                <TableHead className="text-center">TOTAL</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {Object.entries(reportData.court_data).map(([courtType, courtInfo]) => (
                                                <React.Fragment key={courtType}>
                                                    {courtInfo.stations.map((station, index) => (
                                                        <TableRow key={`${courtType}-${index}`}>
                                                            <TableCell className="font-medium">
                                                                {index === 0 ? courtType : ''}
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                {station.station}
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                {station.branch}
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                {station.male}
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                {station.female}
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                {station.cicl}
                                                            </TableCell>
                                                            <TableCell className="text-center font-semibold">
                                                                {station.total}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </React.Fragment>
                                            ))}

                                            {/* Sub Total Row */}
                                            <TableRow className="bg-gray-50 font-semibold">
                                                <TableCell colSpan={3} className="text-right">
                                                    SUB TOTAL:
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {reportData.totals.male}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {reportData.totals.female}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {reportData.totals.cicl}
                                                </TableCell>
                                                <TableCell className="text-center font-bold">
                                                    {reportData.totals.total}
                                                </TableCell>
                                            </TableRow>

                                            {/* Total Row */}
                                            <TableRow className="bg-yellow-50 font-bold">
                                                <TableCell colSpan={3} className="text-right">
                                                    TOTAL:
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {reportData.totals.male}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {reportData.totals.female}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {reportData.totals.cicl}
                                                </TableCell>
                                                <TableCell className="text-center font-bold text-lg">
                                                    {reportData.totals.total}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Signature Section */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex justify-between">
                                    <div className="text-center">
                                        <div className="border-b border-gray-300 w-48 mb-2"></div>
                                        <p className="text-sm font-medium">Prepared by:</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="border-b border-gray-300 w-48 mb-2"></div>
                                        <p className="text-sm font-medium">Noted by:</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* No Data Alert */}
                        {reportData.totals.total === 0 && (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    No detainees found as of {reportData.as_of_date}.
                                    This could mean there were no detainees on this date.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                )}

                {/* Instructions */}
                {!reportData && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Instructions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p>• Select the date for which you want to generate the inmates status report</p>
                                <p>• The report will show detainee counts by court jurisdiction</p>
                                <p>• Data includes male, female, and CICL (Children in Conflict with the Law) counts</p>
                                <p>• Court categories include Regional Trial Court, Municipal Trial Court, and Family Court</p>
                                <p>• Export the report as PDF for official documentation</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
