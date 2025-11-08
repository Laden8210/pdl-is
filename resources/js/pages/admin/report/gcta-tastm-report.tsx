import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
    const [fullName, setFullName] = useState('');
    const [position, setPosition] = useState('');

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

    const handleExport = () => {
        const params = new URLSearchParams();

        params.append('verification_id', verificationId?.toString() ?? '');
        params.append('full_name', fullName);
        params.append('position', position);

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
    const [verificationId, setVerificationId] = useState<number | null>(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);

    const handleViewDialog = (verification_id: number) => {
        setVerificationId(verification_id);
        setViewDialogOpen(true);
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
                        <CardTitle className="text-center">
                            <div className="mb-4 flex items-center justify-center gap-4">
                                <div>
                                    <div className="text-xl font-bold">GCTA & TASTM Reports</div>
                                    <div className="text-sm text-gray-600">South Cotabato Rehabilitation and Detention Center</div>
                                </div>
                            </div>
                        </CardTitle>
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
                                                    <TableCell>{`${verification.pdl.fname} ${verification.pdl.mname || ''} ${verification.pdl.lname} ${verification.pdl.suffix ?? ''}`}</TableCell>
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
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleViewDialog(verification.verification_id)}
                                                        >
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

                <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>GCTA & TASTM Report</DialogTitle>
                        </DialogHeader>

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="full-name">Full Name</Label>
                                <Input id="full-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="alias">Position</Label>
                                <Input id="position" type="text" value={position} onChange={(e) => setPosition(e.target.value)} />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button onClick={() => handleExport()}>Export</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
