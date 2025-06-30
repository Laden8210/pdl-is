import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];



export default function PDLArchives() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header section with Add button */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Item List</h2>

                    <div className='flex items-center gap-2'>
                        <Input
                            type="text"
                            placeholder="Search items..."
                            className="w-64"
                        />
                        <Button className="ml-2" >
                            Search
                        </Button>
                    </div>
                </div>

                <div className='grid col-span-1 md:grid-cols-2 lg:grid-cols-2 gap-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground">Total Inmate Population</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between gap-4">
                                {/* Left: Total number */}
                                <div>
                                    <p className="text-3xl font-bold">487</p>
                                    <p className="mt-1 text-sm text-muted-foreground">Total Inmates</p>
                                </div>

                                {/* Right: Placeholder for chart or other content */}
                                <div className="h-[80px] w-[80px] bg-gray-200 rounded-lg flex items-center justify-center">
                                    {/* Placeholder content */}
                                    <span className="text-xs text-gray-500">Chart Placeholder</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground">Total Cases</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between gap-4">
                                {/* Left: Total number */}
                                <div>
                                    <p className="text-3xl font-bold">1200</p>
                                    <p className="mt-1 text-sm text-muted-foreground">Total Cases</p>
                                </div>

                                {/* Right: Placeholder for chart or other content */}
                                <div className="h-[80px] w-[80px] bg-gray-200 rounded-lg flex items-center justify-center">
                                    {/* Placeholder content */}
                                    <span className="text-xs text-gray-500">Chart Placeholder</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Full-width table */}
                <div className="w-full">
                    <Table className="w-full">
                        <TableCaption>A list of items.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Case Number</TableHead>
                                <TableHead>Crime Category</TableHead>
                                <TableHead>Released Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>

                            <TableRow>
                                <TableCell>John Doe</TableCell>
                                <TableCell>123456</TableCell>
                                <TableCell>Theft</TableCell>
                                <TableCell>2023-10-01</TableCell>
                                <TableCell>Released</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Jane Smith</TableCell>
                                <TableCell>654321</TableCell>
                                <TableCell>Fraud</TableCell>
                                <TableCell>2023-09-15</TableCell>
                                <TableCell>Released</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Michael Johnson</TableCell>
                                <TableCell>789012</TableCell>
                                <TableCell>Assault</TableCell>
                                <TableCell>2023-08-20</TableCell>
                                <TableCell>Released</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Emily Davis</TableCell>
                                <TableCell>345678</TableCell>
                                <TableCell>Burglary</TableCell>
                                <TableCell>2023-07-10</TableCell>
                                <TableCell>Released</TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
