import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Archive, User, Calendar, Eye, RotateCcw } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Pdl {
    id: number;
    fname: string;
    lname: string;
    alias?: string;
    age?: number;
    gender?: string;
    archive_status?: string;
    archive_reason?: string;
    archived_at?: string;
    admission_date?: string;
    release_date?: string;
    personnel?: {
        id: number;
        name: string;
    };
    cases?: Array<{
        id: number;
        case_number?: string;
        crime_committed?: string;
    }>;
}

interface PageProps {
    archivedPdls: {
        data: Pdl[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

const archiveStatusColors = {
    'BONDED': 'bg-green-100 text-green-800',
    'SERVED_SENTENCE': 'bg-blue-100 text-blue-800',
    'PROV_DISMISSED': 'bg-yellow-100 text-yellow-800',
    'DISMISSED': 'bg-gray-100 text-gray-800',
    'TRANSFER_TO_OTHER_FACILITY': 'bg-purple-100 text-purple-800',
    'DAPECOL': 'bg-red-100 text-red-800',
    'PROBATION': 'bg-indigo-100 text-indigo-800',
    'DECEASED': 'bg-black text-white',
    'ACQUITTED': 'bg-emerald-100 text-emerald-800',
};

const archiveStatusLabels = {
    'BONDED': 'BONDED',
    'SERVED_SENTENCE': 'SERVED SENTENCE',
    'PROV_DISMISSED': 'PROV. DISMISSED',
    'DISMISSED': 'DISMISSED',
    'TRANSFER_TO_OTHER_FACILITY': 'TRANSFER TO OTHER FACILITY',
    'DAPECOL': 'DAPECOL',
    'PROBATION': 'PROBATION',
    'DECEASED': 'DECEASED',
    'ACQUITTED': 'ACQUITTED',
};

export default function ArchivedPdls({ archivedPdls }: PageProps) {
    return (
        <AppLayout>
            <Head title="Archived PDLs - South Cotabato Rehabilitation and Detention Center" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Archived PDLs</h1>
                        <p className="text-muted-foreground">
                            View and manage archived PDL records
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Archive className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            {archivedPdls.total} archived records
                        </span>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Archived</CardTitle>
                            <Archive className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{archivedPdls.total}</div>
                            <p className="text-xs text-muted-foreground">
                                PDL records archived
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">This Page</CardTitle>
                            <User className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{archivedPdls.data.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Records on this page
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Page {archivedPdls.current_page}</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{archivedPdls.last_page}</div>
                            <p className="text-xs text-muted-foreground">
                                Total pages
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Archived PDLs Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Archived PDL Records</CardTitle>
                        <CardDescription>
                            All archived PDL records with their archive status and details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Age/Gender</TableHead>
                                    <TableHead>Archive Status</TableHead>
                                    <TableHead>Archive Date</TableHead>
                                    <TableHead>Admission Date</TableHead>
                                    <TableHead>Release Date</TableHead>
                                    <TableHead>Cases</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {archivedPdls.data.map((pdl) => (
                                    <TableRow key={pdl.id}>
                                        <TableCell className="font-medium">
                                            <div>
                                                <div>{pdl.fname} {pdl.lname}</div>
                                                {pdl.alias && (
                                                    <div className="text-sm text-muted-foreground">
                                                        Alias: {pdl.alias}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div>{pdl.age || 'N/A'} years old</div>
                                                <div className="text-muted-foreground">{pdl.gender || 'N/A'}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge 
                                                className={archiveStatusColors[pdl.archive_status as keyof typeof archiveStatusColors] || 'bg-gray-100 text-gray-800'}
                                            >
                                                {archiveStatusLabels[pdl.archive_status as keyof typeof archiveStatusLabels] || pdl.archive_status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {pdl.archived_at ? new Date(pdl.archived_at).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {pdl.admission_date ? new Date(pdl.admission_date).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {pdl.release_date ? new Date(pdl.release_date).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {pdl.cases?.length || 0} case{(pdl.cases?.length || 0) !== 1 ? 's' : ''}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button asChild size="sm" variant="outline">
                                                    <Link href={route('pdl.archive.show', pdl.id)}>
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View
                                                    </Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {archivedPdls.data.length === 0 && (
                            <div className="text-center py-8">
                                <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No Archived Records</h3>
                                <p className="text-muted-foreground">
                                    There are no archived PDL records to display.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Archive Status Legend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Archive Status Legend</CardTitle>
                        <CardDescription>
                            Understanding the different archive statuses
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(archiveStatusLabels).map(([key, label]) => (
                                <div key={key} className="flex items-center space-x-2">
                                    <Badge className={archiveStatusColors[key as keyof typeof archiveStatusColors]}>
                                        {label}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                        {key.replace(/_/g, ' ').toLowerCase()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
