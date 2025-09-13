import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ViewPdlInformation } from '@/features/pdl-management/view-pdl-information';
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

    const { auth } = props;
    const isAdmin = auth?.user?.position === 'admin';

    console.log('Is Admin:', isAdmin);
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
                                {verifications.map(
                                    (verification) =>
                                        verification.pdl && (
                                            <TableRow key={verification.pdl.id}>
                                                <TableCell>{verification.pdl.id}</TableCell>
                                                <TableCell>{`${verification.pdl.fname} ${verification.pdl.lname}`}</TableCell>
                                                <TableCell>{verification.pdl.alias ?? '-'}</TableCell>
                                                <TableCell>{verification.pdl.gender ?? '-'}</TableCell>
                                                <TableCell>{verification.pdl.ethnic_group ?? '-'}</TableCell>
                                                <TableCell>{verification.pdl.civil_status ?? '-'}</TableCell>
                                                <TableCell>{format(new Date(verification.pdl.birthdate), 'MMMM dd, yyyy')}</TableCell>
                                                <TableCell>{getAge(verification.pdl.birthdate)}</TableCell>
                                                <TableCell>{`${verification.pdl.brgy ?? ''}, ${verification.pdl.city ?? ''}, ${verification.pdl.province ?? ''}`}</TableCell>
                                                <TableCell>
                                                    {verification.pdl.personnel
                                                        ? `${verification.pdl.personnel.fname} ${verification.pdl.personnel.lname}`
                                                        : '—'}
                                                </TableCell>
                                                <TableCell className="space-x-1">
                                                    <ViewPdlInformation pdl={verification.pdl} />



                                                    {!isAdmin && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                window.location.href = `/record-officer/pdl-management/personal-information/${verification.pdl.id}`;
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                    )}
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
