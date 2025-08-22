import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

import { ViewPdlInformation } from '@/features/pdl-management/view-pdl-information';
import { ManageTimeAllowance } from '@/features/time-allowance/manage-time-allowance';
import AppLayout from '@/layouts/app-layout';
import { getAge } from '@/lib/dateUtils';
import { PageProps, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { format } from 'date-fns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'PDL Management',
        href: '/pdl-management',
    },
];

export default function PersonalInformation() {
    const { props } = usePage<PageProps>();
    const { verifications } = props;
    console.log('Verifications:', verifications);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Personal Information" />

            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-2xl font-bold">Time Allowance Management</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <div className="flex items-center justify-between">
                                <span>Time Allowance List</span>
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
                                {verifications.map(
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

                                                    <ManageTimeAllowance
                                                        pdl={verification.pdl}
                                                        gctaDays={verification.gcta_days}
                                                        tastmDays={verification.tastm_days}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ),
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
