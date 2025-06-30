import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Health Assessment',
        href: '/health-assessment',
    },
];

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

export default function HealthAssessment() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Health Assessment" />

            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-2xl font-bold">Health Assessment</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Health Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>

                                    <TableHead>Name</TableHead>
                                    <TableHead>Scheduled Date</TableHead>
                                    <TableHead>Date</TableHead>
                                     <TableHead>Status</TableHead>
                                    <TableHead>Result</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>John Doe</TableCell>
                                    <TableCell>01/01/2023</TableCell>
                                    <TableCell>01/02/2023</TableCell>
                                    <TableCell>Completed</TableCell>
                                    <TableCell>Normal</TableCell>
                                    <TableCell>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline">Edit</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Health Assessment Details</DialogTitle>
                                                    <DialogDescription>
                                                        Here you can view the details of the health assessment.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                {/* Additional content can be added here */}
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>

                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
