import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { ViewPdlInformation } from '@/features/pdl-management/view-pdl-information';
import AppLayout from '@/layouts/app-layout';
import { getAge } from '@/lib/dateUtils';
import { PageProps, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Archive, Edit } from 'lucide-react';
import { useState } from 'react';
import { Court } from '@/types';
import { CreateCourt } from '@/features/create-court';
import { EditCourt } from '@/features/edit-court';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'PDL Management',
        href: '/pdl-management',
    },
];

export default function CourtList() {
    const { props } = usePage<any>();
    const { courts } = props;


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Personal Information" />

            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-2xl font-bold">Court List</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <div className="flex items-center justify-between">
                                <span>Court List</span>

                                <div className="flex gap-2">

                                    <CreateCourt />

                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Branch Code</TableHead>
                                    <TableHead>Branch</TableHead>
                                    <TableHead>Station</TableHead>
                                    <TableHead>Court Type</TableHead>
                                    <TableHead>Location</TableHead>

                                    <TableHead>Added At</TableHead>
                                    <TableHead>Actions</TableHead>

                                </TableRow>
                            </TableHeader>
                            <TableBody>
                              {courts.map((court: Court) => (
                                    <TableRow key={court.court_id}>
                                        <TableCell>{court.court_id}</TableCell>
                                        <TableCell>{court.branch_code}</TableCell>
                                        <TableCell>{court.branch}</TableCell>
                                        <TableCell>{court.station}</TableCell>
                                        <TableCell>{court.court_type}</TableCell>
                                        <TableCell>{court.location}</TableCell>

                                        <TableCell>{format(new Date(court.created_at), 'MMMM dd, yyyy')}</TableCell>
                                        <TableCell>
                                           <EditCourt court={court} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {courts.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">
                                            No courts found
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
