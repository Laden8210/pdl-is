import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { PageProps, type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: '/reports',
    },
    {
        title: 'Population Report',
        href: '/reports/population',
    },
];

interface ReportData {
    title: string;
    headers: string[];
    data: any[];
    report_date: string;
}

export default function PopulationReport() {
    const { props } = usePage<PageProps>();
    const { reportData, filters } = props as { reportData: ReportData; filters: any };

    const { data, setData, post, processing } = useForm({
        report_date: filters?.report_date || new Date().toISOString().split('T')[0],
        report_type: filters?.report_type || 'age_sex',
        export_pdf: false,
    });

    const handleGenerateReport = (exportPdf = false) => {
        post(route('reports.population.generate'), {
            ...data,
            export_pdf: exportPdf,
        });
    };



    const handleExport = () => {
        const params = new URLSearchParams();
        params.append('report_date', data.report_date);
        params.append('report_type', data.report_type);
        params.append('export_pdf', 'true');

        window.location.href = route('reports.population.generate') + '?' + params.toString();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Population Report" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Population Report</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Report Parameters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <Label htmlFor="report_date">Report Date</Label>
                                <Input
                                    id="report_date"
                                    type="date"
                                    value={data.report_date}
                                    onChange={(e) => setData('report_date', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="report_type">Report Type</Label>
                                <Select value={data.report_type} onValueChange={(value) => setData('report_type', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select report type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="age_sex">Age and Sex</SelectItem>
                                        <SelectItem value="case_status">Case Status</SelectItem>
                                        <SelectItem value="case_load">Case Load</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end gap-2">
                                <Button onClick={() => handleGenerateReport(false)} disabled={processing} className="bg-blue-500 hover:bg-blue-600">
                                    {processing ? 'Generating...' : 'Generate Report'}
                                </Button>
                                <Button
                                    onClick={handleExport}
                                    disabled={processing}
                                    variant="outline"
                                    className="bg-green-500 text-white hover:bg-green-600"
                                >
                                    Export PDF
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {reportData && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">
                                <div>JAIL SERVICES</div>
                                <div className="text-lg font-normal">as of {reportData.report_date}</div>
                                <div className="text-lg font-normal">{reportData.title}</div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {reportData.headers.map((header, index) => (
                                            <TableHead key={index} className={index === 0 ? 'text-left' : 'text-center'}>
                                                {header}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportData.data.map((row, rowIndex) => (
                                        <TableRow
                                            key={rowIndex}
                                            className={row[reportData.headers[0].toLowerCase()] === 'TOTAL' ? 'bg-gray-100 font-bold' : ''}
                                        >
                                            {reportData.headers.map((header, colIndex) => {
                                                const key = header.toLowerCase();
                                                const value = row[key] ?? row[Object.keys(row)[colIndex]];

                                                return (
                                                    <TableCell key={colIndex} className={colIndex === 0 ? 'text-left' : 'text-center'}>
                                                        {value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
