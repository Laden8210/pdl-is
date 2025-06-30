import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'PDL Management',
        href: '/pdl-management',
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

export default function MedicalRecord() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Medical Records" />

            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-2xl font-bold">Medical Records</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Medical Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>

                                    <TableHead>Name</TableHead>
                                    <TableHead>Date of Birth</TableHead>
                                    <TableHead>Age</TableHead>
                                    <TableHead>Condition</TableHead>
                                     <TableHead>Notes</TableHead>

                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>1</TableCell>
                                    <TableCell>John Doe</TableCell>
                                    <TableCell>01/01/1990</TableCell>
                                    <TableCell>33</TableCell>
                                    <TableCell>Healthy</TableCell>
                                    <TableCell>Healthy</TableCell>
                                    <TableCell>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline">Edit</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Medical Record Details</DialogTitle>
                                                    <DialogDescription>
                                                        Here you can view the details of the medical record.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                {/* Additional content can be added here */}
                                            </DialogContent>
                                        </Dialog>

                                        <Button variant="outline" className="ml-2">
                                            Download Record
                                        </Button>

                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>2</TableCell>
                                    <TableCell>Jane Smith</TableCell>
                                    <TableCell>02/02/1985</TableCell>
                                    <TableCell>38</TableCell>
                                    <TableCell>Diabetic</TableCell>
                                    <TableCell>Requires regular check-ups</TableCell>
                                    <TableCell>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline">Edit</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Medical Record Details</DialogTitle>
                                                    <DialogDescription>
                                                        Here you can view the details of the medical record.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                {/* Additional content can be added here */}
                                            </DialogContent>
                                        </Dialog>

                                        <Button variant="outline" className="ml-2">
                                            Download Record
                                        </Button>

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
