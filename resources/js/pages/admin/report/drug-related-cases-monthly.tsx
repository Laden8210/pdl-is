import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, FileText, Calendar, Users, AlertCircle, Building } from 'lucide-react';
import  AppLayout  from '@/layouts/app-layout';

interface MonthlyData {
    month: string;
    male_detainees: number;
    female_detainees: number;
    total_detainees: number;
    total_committed: number;
    total_discharged: number;
    bonded: number;
    served_sentence: number;
    dismissed: number;
    transferred: number;
    dapecol: number;
    probation: number;
    deceased: number;
    acquitted: number;
    total_discharged_drug: number;
    drug_offenders_percentage: number;
    total_drug_cases: number;
}

interface ReportData {
    title: string;
    subtitle: string;
    year: number;
    monthly_data: MonthlyData[];
    yearly_totals: any;
    facilities: {
        [key: string]: string;
    };
}

interface PageProps {
    reportData?: ReportData;
    filters?: {
        year?: number;
    };
}

export default function DrugRelatedCasesMonthlyReport({ reportData, filters }: PageProps) {
    const { data, setData, post, processing } = useForm({
        year: filters?.year || new Date().getFullYear(),
        export_pdf: false,
    });

    const handleGenerate = (exportPdf: boolean = false) => {
        setData('export_pdf', exportPdf);
        post(route('reports.drug-cases-monthly.generate'));
    };


    const handleExport = () => {
        const params = new URLSearchParams();
        params.append('year', data.year.toString());
        params.append('export_pdf', 'true');
        window.location.href = route('reports.drug-cases-monthly.export') + '?' + params.toString();
    };


    return (
        <AppLayout>
            <Head title="South Cotabato Rehabilitation and Detention Center - Drug-Related Cases Monthly Report" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                    <h1 className="text-2xl font-bold">Population of Drug-Related Cases Monthly Report</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            {reportData ? `Year ${reportData.year}` : 'Select Year'}
                        </span>
                    </div>
                </div>

                {/* Report Generation Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Generate Annual Report</CardTitle>
                        <CardDescription>
                            Select the year for the comprehensive drug-related cases report
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="year">Year</Label>
                                <Select
                                    value={data.year.toString()}
                                    onValueChange={(value) => setData('year', parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 10 }, (_, i) => {
                                            const year = new Date().getFullYear() - 5 + i;
                                            return (
                                                <SelectItem key={year} value={year.toString()}>
                                                    {year}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
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
                                                Total Detainees
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {reportData.yearly_totals.total_detainees}
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
                                                Total Committed
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {reportData.yearly_totals.total_committed}
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
                                                Total Discharged
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {reportData.yearly_totals.total_discharged}
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
                                                Drug Cases
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {reportData.yearly_totals.total_drug_cases}
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
                                    {reportData.subtitle} - {reportData.year}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead rowSpan={2} className="text-center">MONTH</TableHead>
                                                <TableHead colSpan={2} className="text-center">NO. OF DETAINEES</TableHead>
                                                <TableHead rowSpan={2} className="text-center">TOTAL NO. OF DETAINEES</TableHead>
                                                <TableHead rowSpan={2} className="text-center">TOTAL NO. OF COMMITTED</TableHead>
                                                <TableHead rowSpan={2} className="text-center">TOTAL NO. OF DISCHARGED</TableHead>
                                                <TableHead colSpan={9} className="text-center">CAUSED OF DISCHARGE WITH DRUG CASE</TableHead>
                                                <TableHead rowSpan={2} className="text-center">% OF DRUG OFFENDERS FROM TOTAL POPULATION</TableHead>
                                                <TableHead rowSpan={2} className="text-center">TOTAL NO. OF POPULATION WITH DRUG CASES</TableHead>
                                            </TableRow>
                                            <TableRow>
                                                <TableHead className="text-center">MALE</TableHead>
                                                <TableHead className="text-center">FEMALE</TableHead>
                                                <TableHead className="text-center">BONDED</TableHead>
                                                <TableHead className="text-center">SERVED SENTENCE</TableHead>
                                                <TableHead className="text-center">PROV. DISMISSED/DISMISSED</TableHead>
                                                <TableHead className="text-center">TRANSFER TO OTHER FACILITY</TableHead>
                                                <TableHead className="text-center">DAPECOL</TableHead>
                                                <TableHead className="text-center">PROBATION</TableHead>
                                                <TableHead className="text-center">DECEASED</TableHead>
                                                <TableHead className="text-center">ACQUITTED</TableHead>
                                                <TableHead className="text-center">TOTAL</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {reportData.monthly_data.map((row, index) => (
                                                <TableRow
                                                    key={index}
                                                    className={row.month === 'TOTAL' ? 'font-bold bg-gray-50' : ''}
                                                >
                                                    <TableCell className="font-medium text-center">
                                                        {row.month}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {row.male_detainees}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {row.female_detainees}
                                                    </TableCell>
                                                    <TableCell className="text-center font-semibold">
                                                        {row.total_detainees}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {row.total_committed}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {row.total_discharged}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {row.bonded}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {row.served_sentence}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {row.dismissed}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {row.transferred}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {row.dapecol}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {row.probation}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {row.deceased}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {row.acquitted}
                                                    </TableCell>
                                                    <TableCell className="text-center font-semibold">
                                                        {row.total_discharged_drug}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {row.drug_offenders_percentage}%
                                                    </TableCell>
                                                    <TableCell className="text-center font-semibold">
                                                        {row.total_drug_cases}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rehabilitation Facilities */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Building className="h-5 w-5 mr-2" />
                                    Rehabilitation Facilities
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {Object.entries(reportData.facilities).map(([acronym, fullName]) => (
                                        <div key={acronym} className="p-4 border rounded-lg">
                                            <h4 className="font-semibold text-blue-600">{acronym}</h4>
                                            <p className="text-sm text-muted-foreground">{fullName}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* No Data Alert */}
                        {reportData.yearly_totals.total_drug_cases === 0 && (
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    No drug-related cases found for {reportData.year}.
                                    This could mean there were no drug-related cases during this year.
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
                                <p>• Select the year for which you want to generate the comprehensive drug-related cases report</p>
                                <p>• The report will show monthly statistics for all 12 months of the selected year</p>
                                <p>• Data includes detainee counts, commitments, discharges, and drug case breakdowns</p>
                                <p>• Discharge causes are tracked for drug-related cases specifically</p>
                                <p>• Percentage calculations show drug offenders as a proportion of total population</p>
                                <p>• Export the report as PDF for official documentation</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
