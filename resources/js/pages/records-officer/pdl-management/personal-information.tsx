import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'PDL Management',
        href: '/pdl-management',
    },
];

import { PageProps } from '@/types';
import { format } from 'date-fns';


import { TransferPDL } from '@/features/pdl-management/transfer-pdl';
import { ViewPdlInformation } from '@/features/pdl-management/view-pdl-information';
import { Button } from '@/components/ui/button';
import { usePage } from '@inertiajs/react';
import { Archive, Calendar } from 'lucide-react';

export default function PersonalInformation() {
    const { props } = usePage<PageProps>();
    const { pdls } = props;

    console.log('PDLs:', pdls);
    console.log(
        'PDLs:',
        pdls.map((pdl) => ({
            id: pdl.id,
            status: pdl.verifications.length > 0 ? pdl.verifications[0].status : 'No Verification',
            reviewed_at: pdl.verifications.length > 0 ? pdl.verifications[0].reviewed_at : null,
            reviewed_by: pdl.verifications.length > 0 ? pdl.verifications[0].reviewed_by : null,
        })),
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Personal Information" />

            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-2xl font-bold">Personal Information</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <div className="flex items-center justify-between">
                                <span>Personal Information List</span>

                                <div className="flex gap-2">

                                    <Link
                                        href="/law-enforcement/pdl-management/personal-information/create"
                                        className="flex items-center gap-2 rounded-sm bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
                                    >
                                        Add PDL Information
                                    </Link>
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
                                    <TableHead>Ethnic Group</TableHead>
                                    <TableHead>Civil Status</TableHead>
                                    <TableHead>Date of Birth</TableHead>
                                    <TableHead>Age</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Added By</TableHead>
                                    <TableHead>Transfer Request</TableHead>
                                    <TableHead>Archive Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pdls.map((pdl) => (
                                    <TableRow key={pdl.id}>
                                        <TableCell>{pdl.id}</TableCell>
                                        <TableCell>{`${pdl.fname} ${pdl.lname}`}</TableCell>
                                        <TableCell>{pdl.alias ?? '-'}</TableCell>
                                        <TableCell>{pdl.gender ?? '-'}</TableCell>
                                        <TableCell>{pdl.ethnic_group ?? '-'}</TableCell>
                                        <TableCell>{pdl.civil_status ?? '-'}</TableCell>
                                        <TableCell>{format(new Date(pdl.birthdate), 'MMMM dd, yyyy')}</TableCell>
                                        <TableCell>{pdl.age}</TableCell>
                                        <TableCell>{`${pdl.brgy ?? ''}, ${pdl.city ?? ''}, ${pdl.province ?? ''}`}</TableCell>
                                        <TableCell>{pdl.personnel ? `${pdl.personnel.fname} ${pdl.personnel.lname}` : '—'}</TableCell>
                                        <TableCell>
                                            {pdl.verifications.length > 0
                                                ? pdl.verifications[0].status.charAt(0).toUpperCase() + pdl.verifications[0].status.slice(1)
                                                : 'No Verification'}
                                        </TableCell>
                                        <TableCell>
                                            {pdl.archived_at ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Archived
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Active
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {/* Dropdown menu using shadcn and horizontal ellipse icon */}
                                            <div className="flex gap-2">
                                                <ViewPdlInformation pdl={pdl} />

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        window.location.href = `/law-enforcement/pdl-management/personal-information/${pdl.id}`;
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <TransferPDL pdl={pdl} />


                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
