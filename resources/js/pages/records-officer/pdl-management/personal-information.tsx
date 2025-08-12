import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'PDL Management',
        href: '/pdl-management',
    },
];

import { format } from 'date-fns';
import { EditPersonalInformation } from '@/features/pdl-management/edit-pdl-personal-information';
import { PageProps } from '@/types';

import { CreatePersonalInformation } from '@/features/pdl-management/create-pdl-personal-information';
import { usePage } from '@inertiajs/react';
import { TransferPDL } from '@/features/pdl-management/transfer-pdl';

export default function PersonalInformation() {
    const { props } = usePage<PageProps>();
    const { pdls } = props;

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

                                <CreatePersonalInformation />
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
                                        <TableCell className='space-x-1'>
                                            <EditPersonalInformation pdl={pdl} />
                                            <TransferPDL pdl={pdl} />
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
