import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

interface PdlReportRecord {
    id: string;
    pdl_id: number;
    name: string;
    case_no: string;
    crime_committed: string;
    date_of_birth: string | null;
    date_committed: string;
    age: number | string;
    address: string;
    tribe: string;
    years: number;
    case_status: string;
    rtc: string;
}

interface FilterProps {
    start_date?: string;
    end_date?: string;
    crime_committed?: string;
    age?: string;
    address?: string;
    rtc?: string;
}

export default function ListOfPdlReports() {
    const { props } = usePage<PageProps>();
    const pdls = (props.pdls || []) as unknown as PdlReportRecord[];
    const filters = (props.filters || {}) as FilterProps;
    const courts = (props.courts || []) as Array<{ court_id: number; branch_code: string; court_type: string }>;
    const crimes = (props.crimes || []) as string[];
    const addresses = (props.addresses || []) as string[];

    const { data, setData, get } = useForm({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        crime_committed: filters.crime_committed || 'all',
        age: filters.age || '',
        address: filters.address || 'all',
        rtc: filters.rtc || 'all',
    });

    const handleFilter = () => {
        const params: Record<string, string> = {};
        if (data.start_date) params.start_date = data.start_date;
        if (data.end_date) params.end_date = data.end_date;
        if (data.crime_committed && data.crime_committed !== 'all') params.crime_committed = data.crime_committed;
        if (data.age && data.age !== 'all') params.age = data.age;
        if (data.address && data.address !== 'all') params.address = data.address;
        if (data.rtc && data.rtc !== 'all') params.rtc = data.rtc;

        get(route('reports.pdl-list', params));
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        if (data.start_date) params.append('start_date', data.start_date);
        if (data.end_date) params.append('end_date', data.end_date);
        if (data.crime_committed && data.crime_committed !== 'all') params.append('crime_committed', data.crime_committed);
        if (data.age && data.age !== 'all') params.append('age', data.age);
        if (data.address && data.address !== 'all') params.append('address', data.address);
        if (data.rtc && data.rtc !== 'all') params.append('rtc', data.rtc);

        window.location.href = route('reports.pdl-list.export') + '?' + params.toString();
    };

    // Group PDls by their ID to show cases together
    const groupedPdls = pdls.reduce((acc: Record<number, {
        pdl_id: number;
        name: string;
        date_of_birth: string | null;
        age: number | string;
        address: string;
        tribe: string;
        years: number;
        cases: Array<{
            id: string;
            case_no: string;
            crime_committed: string;
            date_committed: string;
            case_status: string;
            rtc: string;
        }>;
    }>, pdl) => {
        if (!acc[pdl.pdl_id]) {
            acc[pdl.pdl_id] = {
                pdl_id: pdl.pdl_id,
                name: pdl.name,
                date_of_birth: pdl.date_of_birth,
                age: pdl.age,
                address: pdl.address,
                tribe: pdl.tribe,
                years: pdl.years,
                cases: []
            };
        }
        acc[pdl.pdl_id].cases.push({
            id: pdl.id,
            case_no: pdl.case_no,
            crime_committed: pdl.crime_committed,
            date_committed: pdl.date_committed,
            case_status: pdl.case_status,
            rtc: pdl.rtc
        });
        return acc;
    }, {});

    const groupedPdlsArray = Object.values(groupedPdls);

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
                        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                            <div>
                                <Label htmlFor="start_date">Start Date</Label>
                                <Input id="start_date" type="date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="end_date">End Date</Label>
                                <Input id="end_date" type="date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="crime_committed">Crime Committed</Label>
                                <Select value={data.crime_committed || 'all'} onValueChange={(value) => setData('crime_committed', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select crime" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Crimes</SelectItem>
                                        {crimes.map((crime: string, index: number) => (
                                            <SelectItem key={index} value={crime}>
                                                {crime}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="age">Age</Label>
                                <Input id="age" type="number" value={data.age} onChange={(e) => setData('age', e.target.value)} placeholder="Enter age" min="0" />
                            </div>
                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Select value={data.address || 'all'} onValueChange={(value) => setData('address', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select address" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Addresses</SelectItem>
                                        {addresses.map((address: string, index: number) => (
                                            <SelectItem key={index} value={address}>
                                                {address}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="rtc">Court Branch (RTC)</Label>
                                <Select value={data.rtc || 'all'} onValueChange={(value) => setData('rtc', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select court branch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Courts</SelectItem>
                                        {courts.map((court) => (
                                            <SelectItem key={court.court_id} value={court.branch_code}>
                                                {court.branch_code} - {court.court_type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex items-end gap-2 mb-4">
                            <Button onClick={handleFilter} variant="default">
                                Apply Filter
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setData({
                                        start_date: '',
                                        end_date: '',
                                        crime_committed: 'all',
                                        age: '',
                                        address: 'all',
                                        rtc: 'all'
                                    });
                                    get(route('reports.pdl-list'));
                                }}
                            >
                                Clear
                            </Button>
                            <Button onClick={handleExport} variant="secondary" >
                                Export to List of PDL Report
                            </Button>
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
                                {groupedPdlsArray.length > 0 ? (
                                    groupedPdlsArray.map((pdl) => (
                                        <>
                                            {pdl.cases.map((caseItem, index) => (
                                                <TableRow key={caseItem.id}>
                                                    {index === 0 ? (
                                                        <>
                                                            <TableCell rowSpan={pdl.cases.length} className="font-medium">
                                                                {pdl.name}
                                                            </TableCell>
                                                            <TableCell>{caseItem.case_no}</TableCell>
                                                            <TableCell>{caseItem.crime_committed}</TableCell>
                                                            <TableCell rowSpan={pdl.cases.length}>
                                                                {pdl.date_of_birth ? format(new Date(pdl.date_of_birth), 'MMM dd, yyyy') : 'N/A'}
                                                            </TableCell>
                                                            <TableCell>{caseItem.date_committed ? format(new Date(caseItem.date_committed), 'MMM dd, yyyy') : 'N/A'}</TableCell>
                                                            <TableCell rowSpan={pdl.cases.length}>
                                                                {pdl.age
                                                                    ? (typeof pdl.age === 'number'
                                                                        ? Math.floor(pdl.age)
                                                                        : (isNaN(Number(pdl.age)) ? pdl.age : Math.floor(Number(pdl.age))))
                                                                    : 'N/A'}
                                                            </TableCell>
                                                            <TableCell rowSpan={pdl.cases.length}>{pdl.address || 'N/A'}</TableCell>
                                                            <TableCell rowSpan={pdl.cases.length}>{pdl.tribe}</TableCell>
                                                            <TableCell rowSpan={pdl.cases.length}>{pdl.years ? Math.floor(pdl.years) : 'N/A'}</TableCell>
                                                            <TableCell>{caseItem.case_status}</TableCell>
                                                            <TableCell>{caseItem.rtc}</TableCell>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <TableCell>{caseItem.case_no}</TableCell>
                                                            <TableCell>{caseItem.crime_committed}</TableCell>
                                                            <TableCell>{caseItem.date_committed ? format(new Date(caseItem.date_committed), 'MMM dd, yyyy') : 'N/A'}</TableCell>
                                                            <TableCell>{caseItem.case_status}</TableCell>
                                                            <TableCell>{caseItem.rtc}</TableCell>
                                                        </>
                                                    )}
                                                </TableRow>
                                            ))}
                                        </>
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
