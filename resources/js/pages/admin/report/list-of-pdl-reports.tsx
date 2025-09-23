import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { PageProps, type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: '/reports',
    },
    {
        title: 'List of PDL',
        href: '/reports/pdl-list',
    },
];

export default function ListOfPdlReports() {
    const { props } = usePage<PageProps>();
    const { pdls, filters } = props;

    const { data, setData, get } = useForm({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
    });

    const handleFilter = () => {
        get(
            route('reports.pdl-list', {
                start_date: data.start_date,
                end_date: data.end_date,
            }),
        );
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        if (data.start_date) params.append('start_date', data.start_date);
        if (data.end_date) params.append('end_date', data.end_date);

        window.location.href = route('reports.pdl-list.export') + '?' + params.toString();
    };
    const handleGenerateReport = (pdlId: number, reportType: string) => {
        window.open(route('reports.pdl.report', { pdl: pdlId, type: reportType }), '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List of PDL Reports" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">List of PDL Reports</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input id="start_date" type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="end_date">End Date</Label>
                                <Input id="end_date" type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} />
                            </div>
                            <div className="flex items-end gap-2">
                                <Button onClick={handleFilter} variant="default">
                                    Apply Filter
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setData({ start_date: '', end_date: '' });
                                        get(route('reports.pdl-list'));
                                    }}
                                >
                                    Clear
                                </Button>
                                <Button onClick={handleExport} variant="secondary" >
                                    Export to List of PDL Report
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Showing {pdls.length} records
                                {data.start_date &&
                                    data.end_date &&
                                    ` from ${format(new Date(data.start_date), 'MMM dd, yyyy')} to ${format(new Date(data.end_date), 'MMM dd, yyyy')}`}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">
                            <div className="flex items-center justify-center gap-4 mb-4">

                                <div>
                                    <div className="text-xl font-bold">List of PDL Reports</div>
                                    <div className="text-sm text-gray-600">South Cotabato Rehabilitation and Detention Center</div>
                                </div>

                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Case No</TableHead>
                                    <TableHead>Crime Committed</TableHead>
                                    <TableHead>Date of Birth</TableHead>
                                    <TableHead>Date Committed</TableHead>
                                    <TableHead>Age</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Tribe</TableHead>
                                    <TableHead>Years</TableHead>
                                    <TableHead>Case Status</TableHead>
                                    <TableHead>RTC</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pdls.length > 0 ? (
                                    pdls.map((pdl) => (
                                        <TableRow key={pdl.id}>
                                            <TableCell className="font-medium">{pdl.name}</TableCell>
                                            <TableCell>{pdl.case_no}</TableCell>
                                            <TableCell>{pdl.crime_committed}</TableCell>
                                            <TableCell>{pdl.date_of_birth ? format(new Date(pdl.date_of_birth), 'MMM dd, yyyy') : 'N/A'}</TableCell>
                                            <TableCell>{pdl.date_committed ? format(new Date(pdl.date_committed), 'MMM dd, yyyy') : 'N/A'}</TableCell>
                                            <TableCell>{pdl.age ? Math.floor(pdl.age) : 'N/A'}</TableCell>
                                            <TableCell>{pdl.address || 'N/A'}</TableCell>
                                            <TableCell>{pdl.tribe}</TableCell>
                                            <TableCell>{pdl.years ? Math.floor(pdl.years) : 'N/A'}</TableCell>
                                            <TableCell>{pdl.case_status}</TableCell>
                                            <TableCell>{pdl.rtc}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={11} className="py-4 text-center">
                                            No records found for the selected date range.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
