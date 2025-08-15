import AppLayout from '@/layouts/app-layout';
import { PageProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, ArchiveRestore } from 'lucide-react';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Archives',
        href: '/archives',
    },
];

export default function ArchiveIndex({ archivedUsers }: PageProps<{ archivedUsers: { personnel: any[], pdls: any[] } }>) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Archived Users" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Archived Users Management</h1>
                        <p className="text-muted-foreground">
                            View and manage all archived PDLs and Personnel records
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {/* <Button variant="outline" size="sm">
                            <ArchiveRestore className="mr-2 h-4 w-4" />
                            Bulk Restore
                        </Button> */}
                    </div>
                </div>

                <Card>
                    <CardHeader className="border-b p-4">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                            <CardTitle className="text-lg">Archived Records</CardTitle>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search archives..."
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Tabs defaultValue="pdls" className="w-full">
                            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                                <TabsTrigger
                                    value="pdls"
                                    className="relative h-12 rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-background data-[state=active]:shadow-none"
                                >
                                    PDLs
                                    <Badge variant="secondary" className="ml-2">
                                        {archivedUsers.pdls.length}
                                    </Badge>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="personnel"
                                    className="relative h-12 rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-background data-[state=active]:shadow-none"
                                >
                                    Personnel
                                    <Badge variant="secondary" className="ml-2">
                                        {archivedUsers.personnel.length}
                                    </Badge>
                                </TabsTrigger>
                            </TabsList>

                            {/* PDLs Tab Content */}
                            <TabsContent value="pdls" className="m-0">
                                <div className="rounded-b-lg">
                                    <Table>
                                        <TableHeader >
                                            <TableRow>
                                                <TableHead className="w-[100px]">ID</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Alias</TableHead>
                                                <TableHead>Birthdate</TableHead>
                                                <TableHead>Added By</TableHead>
                                                <TableHead>Archived At</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {archivedUsers.pdls.length > 0 ? (
                                                archivedUsers.pdls.map((pdl) => (
                                                    <TableRow key={`pdl-${pdl.id}`} className="hover:bg-muted/50">
                                                        <TableCell className="font-medium">{pdl.id}</TableCell>
                                                        <TableCell>
                                                            <div className="font-medium">{pdl.name}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {pdl.type}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{pdl.alias || '-'}</TableCell>
                                                        <TableCell>
                                                            {pdl.birthdate ? format(new Date(pdl.birthdate), 'MMM dd, yyyy') : '-'}
                                                        </TableCell>
                                                        <TableCell>{pdl.added_by || 'System'}</TableCell>
                                                        <TableCell>
                                                            {format(new Date(pdl.deleted_at), 'MMM dd, yyyy HH:mm')}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="ghost" size="sm" className="h-8">
                                                                <ArchiveRestore className="mr-2 h-4 w-4" />
                                                                Restore
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="h-24 text-center">
                                                        <div className="py-8 text-center">
                                                            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                                                <ArchiveRestore className="h-6 w-6 text-muted-foreground" />
                                                            </div>
                                                            <h3 className="text-lg font-medium">No archived PDLs found</h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                All PDL records are currently active
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>

                            {/* Personnel Tab Content */}
                            <TabsContent value="personnel" className="m-0">
                                <div className="rounded-b-lg">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">ID</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Username</TableHead>
                                                <TableHead>Position</TableHead>
                                                <TableHead>Agency</TableHead>
                                                <TableHead>Archived At</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {archivedUsers.personnel.length > 0 ? (
                                                archivedUsers.personnel.map((personnel) => (
                                                    <TableRow key={`personnel-${personnel.id}`} className="hover:bg-muted/50">
                                                        <TableCell className="font-medium">{personnel.id}</TableCell>
                                                        <TableCell>
                                                            <div className="font-medium">{personnel.name}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {personnel.type}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{personnel.username}</TableCell>
                                                        <TableCell>{personnel.position}</TableCell>
                                                        <TableCell>{personnel.agency}</TableCell>
                                                        <TableCell>
                                                            {format(new Date(personnel.deleted_at), 'MMM dd, yyyy HH:mm')}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="ghost" size="sm" className="h-8">
                                                                <ArchiveRestore className="mr-2 h-4 w-4" />
                                                                Restore
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="h-24 text-center">
                                                        <div className="py-8 text-center">
                                                            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                                                <ArchiveRestore className="h-6 w-6 text-muted-foreground" />
                                                            </div>
                                                            <h3 className="text-lg font-medium">No archived personnel found</h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                All personnel records are currently active
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
