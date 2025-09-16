import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, FileText, Calendar, Users, AlertCircle, Building } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface ReportData {
    title: string;
    facility_name: string;
    location: string;
    recipient: {
        name: string;
        position: string;
    };
    report_date: string;
    escorted_pdls: {
        rtc_count: number;
        total: number;
    };
    released_pdls: {
        rtc_count: number;
        total: number;
    };
    committed_pdls: {
        rtc_count: number;
        total: number;
    };
    visitors: {
        padala: number;
        transaction: number;
        total: number;
    };
    greyhound_operation: {
        cell_operated: string;
        number_of_times: number;
        conducted_by: string;
    };
    confined_pdls: {
        female: number;
        male: number;
        total: number;
    };
    hospital_pdls: {
        female: number;
        male: number;
        house_arrest: number;
        total: number;
    };
    remarks: string;
    submitted_by: {
        name: string;
        position: string;
    };
}

interface PageProps {
    reportData?: ReportData;
    filters?: {
        report_date?: string;
    };
}

export default function InmatesStatusDailyReport({ reportData, filters }: PageProps) {
    const { data, setData, post, processing } = useForm({
        report_date: filters?.report_date || new Date().toISOString().split('T')[0],
        export_pdf: false,
    });

    const handleGenerate = (exportPdf: boolean = false) => {
        setData('export_pdf', exportPdf);
        post(route('reports.inmates-status-daily.generate'));
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        params.append('report_date', data.report_date);

        console.log(params.toString());
        console.log(route('reports.inmates-status-daily.export') + '?' + params.toString());
        window.location.href = route('reports.inmates-status-daily.export') + '?' + params.toString();
    };

    return (
        <AppLayout>
            <Head title="Inmates Status Daily Report - South Cotabato Rehabilitation and Detention Center" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Inmates Status Daily Report</h1>
                        <p className="text-muted-foreground">
                            Daily operational status report for jail operations
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            {reportData ? `Report Date: ${reportData.report_date}` : 'Select Date'}
                        </span>
                    </div>
                </div>

                {/* Report Generation Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Generate Daily Report</CardTitle>
                        <CardDescription>
                            Select the date for the daily status report
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="report_date">Report Date</Label>
                                <Input
                                    id="report_date"
                                    type="date"
                                    value={data.report_date}
                                    onChange={(e) => setData('report_date', e.target.value)}
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
                                                Escorted PDLs
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {reportData.escorted_pdls.total}
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
                                                Released PDLs
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {reportData.released_pdls.total}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center">
                                        <Users className="h-8 w-8 text-red-600" />
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Committed PDLs
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {reportData.committed_pdls.total}
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
                                                Total Visitors
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {reportData.visitors.total}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Report Content */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-center">{reportData.title}</CardTitle>
                                <CardDescription className="text-center">
                                    {reportData.facility_name} - {reportData.location}
                                </CardDescription>
                                <div className="text-center text-sm text-muted-foreground">
                                    Report Date: {reportData.report_date}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Recipient Information */}
                                <div className="space-y-2">
                                    <div className="flex">
                                        <span className="font-semibold w-20">To:</span>
                                        <span>{reportData.recipient.name}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="font-semibold w-20"></span>
                                        <span>{reportData.recipient.position}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="font-semibold w-20">Subject:</span>
                                        <span>{reportData.title}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="font-semibold w-20">Date:</span>
                                        <span>{reportData.report_date}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="font-semibold w-20">Sir:</span>
                                    </div>
                                </div>

                                <div className="text-sm">
                                    This is to inform you of the jail status within 24 hours.
                                </div>

                                {/* Escorted PDLs */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold">Escorted PDL for court hearing at any different court cases:</h4>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>RTC</TableHead>
                                                <TableHead>NO. OF PDL</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>NONE</TableCell>
                                                <TableCell>{reportData.escorted_pdls.rtc_count}</TableCell>
                                            </TableRow>
                                            <TableRow className="bg-gray-50 font-semibold">
                                                <TableCell>TOTAL:</TableCell>
                                                <TableCell>{reportData.escorted_pdls.total}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Released and Committed PDLs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <h4 className="font-semibold">Released PDL from any different courts:</h4>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>RTC</TableHead>
                                                    <TableHead>NO. OF PDL</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>NONE</TableCell>
                                                    <TableCell>{reportData.released_pdls.rtc_count}</TableCell>
                                                </TableRow>
                                                <TableRow className="bg-gray-50 font-semibold">
                                                    <TableCell>TOTAL:</TableCell>
                                                    <TableCell>{reportData.released_pdls.total}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-semibold">Committed of PDL from any courts:</h4>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>RTC/POLICE STATION</TableHead>
                                                    <TableHead>NO. OF PDL</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>NONE</TableCell>
                                                    <TableCell>{reportData.committed_pdls.rtc_count}</TableCell>
                                                </TableRow>
                                                <TableRow className="bg-gray-50 font-semibold">
                                                    <TableCell>TOTAL:</TableCell>
                                                    <TableCell>{reportData.committed_pdls.total}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>

                                {/* Visitors */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold">Number of visitors entered in Jail premises:</h4>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>NO. OF VISITORS (PADALA)</TableHead>
                                                <TableHead>NO. OF VISITORS W/ TRANSACTION</TableHead>
                                                <TableHead>TOTAL</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>{reportData.visitors.padala}</TableCell>
                                                <TableCell>{reportData.visitors.transaction}</TableCell>
                                                <TableCell className="font-semibold">{reportData.visitors.total}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Greyhound Operation */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold">Greyhound operation conducted:</h4>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>CELL OPERATED</TableHead>
                                                <TableHead>NUMBER OF TIMES</TableHead>
                                                <TableHead>CONDUCTED BY</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>{reportData.greyhound_operation.cell_operated}</TableCell>
                                                <TableCell>{reportData.greyhound_operation.number_of_times}</TableCell>
                                                <TableCell>{reportData.greyhound_operation.conducted_by}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Confined PDLs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <h4 className="font-semibold">Total PDL confined at SCRDC:</h4>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>CATEGORY</TableHead>
                                                    <TableHead>NO. OF PDL</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>FEMALE</TableCell>
                                                    <TableCell>{reportData.confined_pdls.female}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>MALE</TableCell>
                                                    <TableCell>{reportData.confined_pdls.male}</TableCell>
                                                </TableRow>
                                                <TableRow className="bg-gray-50 font-semibold">
                                                    <TableCell>TOTAL:</TableCell>
                                                    <TableCell>{reportData.confined_pdls.total}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-semibold">No. of PDL confined at SCPH & any private hospital:</h4>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>CATEGORY</TableHead>
                                                    <TableHead>NO. OF PDL</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>FEMALE</TableCell>
                                                    <TableCell>{reportData.hospital_pdls.female}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>MALE</TableCell>
                                                    <TableCell>{reportData.hospital_pdls.male}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>HOUSE ARREST</TableCell>
                                                    <TableCell>{reportData.hospital_pdls.house_arrest}</TableCell>
                                                </TableRow>
                                                <TableRow className="bg-gray-50 font-semibold">
                                                    <TableCell>TOTAL:</TableCell>
                                                    <TableCell>{reportData.hospital_pdls.total}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>

                                {/* Remarks */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold">Remarks:</h4>
                                    <div className="text-sm bg-gray-50 p-3 rounded">
                                        {reportData.remarks}
                                    </div>
                                </div>

                                {/* Submitted By */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold">Submitted by:</h4>
                                    <div className="text-sm">
                                        <div>{reportData.submitted_by.name}</div>
                                        <div>{reportData.submitted_by.position}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* No Data Alert */}
                        {reportData.confined_pdls.total === 0 && (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    No PDLs found for {reportData.report_date}. 
                                    This could mean there were no PDLs on this date.
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
                                <p>• Select the date for which you want to generate the daily status report</p>
                                <p>• The report will show operational statistics for the selected 24-hour period</p>
                                <p>• Data includes escorted PDLs, releases, commitments, visitors, and operations</p>
                                <p>• Greyhound operations and hospital confinements are also tracked</p>
                                <p>• Export the report as PDF for official documentation</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
