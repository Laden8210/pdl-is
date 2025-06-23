import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const documents = [
    {
        id: 1,
        name: 'John Doe',
        description: 'Document Verification',
        status: 'Pending',
        submittedOn: '2023-10-01',
    },
    {
        id: 2,
        name: 'Jane Smith',
        description: 'Employment Certification',
        status: 'Approved',
        submittedOn: '2023-09-20',
    },
    {
        id: 3,
        name: 'Mario Santos',
        description: 'Police Clearance',
        status: 'Rejected',
        submittedOn: '2023-08-15',
    },
];

export default function List() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Verification" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Document List</h2>
                    <Button>Add Document</Button>
                </div>

                {/* Document cards */}
                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {documents.map((doc) => (
                        <li key={doc.id}>
                            <Card className="p-4">
                                <h3 className="text-lg font-medium">{doc.name}</h3>
                                <p className="text-sm text-muted-foreground">{doc.description}</p>
                                <div className="mt-3 space-y-1 text-sm">
                                    <p>
                                        Status: <Badge>{doc.status}</Badge>
                                    </p>
                                    <p>Submitted on: {doc.submittedOn}</p>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">View Details</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Document Details</DialogTitle>
                                                <DialogDescription>
                                                    Detailed view for <strong>{doc.name}</strong>
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="grid gap-4 py-2">
                                                {/* Placeholder for image preview or document content */}
                                                <Label className="text-sm font-medium">Document Image</Label>
                                                <div className="h-40 w-full rounded bg-muted flex items-center justify-center text-muted-foreground">
                                                    [ Image preview here ]
                                                </div>

                                                <Label htmlFor="doc-description" className="text-sm font-medium">
                                                    Feedback / Comment
                                                </Label>
                                                <Textarea
                                                    id="doc-description"
                                                    placeholder="Enter any feedback or comments here"
                                                    rows={3}
                                                />
                                            </div>

                                            <DialogFooter className="flex gap-2">
                                                <DialogClose asChild>
                                                    <Button variant="secondary">Cancel</Button>
                                                </DialogClose>
                                                <Button type="submit">Send Feedback</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </Card>
                        </li>
                    ))}
                </ul>
            </div>
        </AppLayout>
    );
}
