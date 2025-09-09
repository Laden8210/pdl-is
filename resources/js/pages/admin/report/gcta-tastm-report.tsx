import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { PageProps, type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { differenceInYears, format } from 'date-fns';
import { useState } from 'react';

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

// Helper function to calculate age
function getAge(birthdate: string): number {
    return differenceInYears(new Date(), new Date(birthdate));
}

export default function GCTATASTMReport() {
    const { props } = usePage<PageProps>();
    const { verifications } = props;
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, get } = useForm({
        start_date: '',
        end_date: '',
    });

    const filteredVerifications = verifications.filter((verification) => {
        if (!searchTerm) return true;

        const pdl = verification.pdl;
        if (!pdl) return false;

        const searchLower = searchTerm.toLowerCase();
        return (
            pdl.fname?.toLowerCase().includes(searchLower) ||
            pdl.lname?.toLowerCase().includes(searchLower) ||
            pdl.alias?.toLowerCase().includes(searchLower) ||
            `${pdl.fname} ${pdl.lname}`.toLowerCase().includes(searchLower) ||
            pdl.id?.toString().includes(searchTerm)
        );
    });

    const handleExport = (verification_id: number) => {
        const params = new URLSearchParams();

        if (verification_id) params.append('verification_id', verification_id.toString());

        window.open(route('reports.gcta-tastm.export') + '?' + params.toString(), '_blank');
    };

    const handleFilter = () => {
        get(
            route('reports.gcta-tastm', {
                start_date: data.start_date,
                end_date: data.end_date,
            }),
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List of PDL Reports" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">List of GCTA and TASTM Reports</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <Label htmlFor="search">Search</Label>
                                <Input
                                    id="search"
                                    type="text"
                                    placeholder="Search by name or ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-end gap-2 md:col-span-2">
                                <Button onClick={handleFilter} className="bg-blue-500 hover:bg-blue-600">
                                    Apply Filter
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>PDL List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Full Name</TableHead>
                                    <TableHead>Alias</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>GCTA Days</TableHead>
                                    <TableHead>TASTM Days</TableHead>
                                    <TableHead>Date of Birth</TableHead>
                                    <TableHead>Age</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Added By</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredVerifications.length > 0 ? (
                                    filteredVerifications.map(
                                        (verification) =>
                                            verification.pdl && (
                                                <TableRow key={verification.pdl.id}>
                                                    <TableCell>{verification.pdl.id}</TableCell>
                                                    <TableCell>{`${verification.pdl.fname} ${verification.pdl.lname}`}</TableCell>
                                                    <TableCell>{verification.pdl.alias ?? '-'}</TableCell>
                                                    <TableCell>{verification.pdl.gender ?? '-'}</TableCell>
                                                    <TableCell className="font-medium">{verification.gcta_days}</TableCell>
                                                    <TableCell className="font-medium">{verification.tastm_days}</TableCell>
                                                    <TableCell>{format(new Date(verification.pdl.birthdate), 'MMMM dd, yyyy')}</TableCell>
                                                    <TableCell>{getAge(verification.pdl.birthdate)}</TableCell>
                                                    <TableCell>{`${verification.pdl.brgy ?? ''}, ${verification.pdl.city ?? ''}, ${verification.pdl.province ?? ''}`}</TableCell>
                                                    <TableCell>
                                                        {verification.pdl.personnel
                                                            ? `${verification.pdl.personnel.fname} ${verification.pdl.personnel.lname}`
                                                            : '—'}
                                                    </TableCell>
                                                    <TableCell className="space-x-1">
                                                        <Button size="sm" variant="outline"
                                                        onClick={() => handleExport(verification.verification_id)}>
                                                            View
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ),
                                    )
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={11} className="py-4 text-center">
                                            No records found
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
