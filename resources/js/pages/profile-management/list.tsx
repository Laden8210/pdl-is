import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// <Dialog>
//     <DialogTrigger asChild>
//         <Button variant="outline" className="mt-4 w-full">
//             Show Message
//         </Button>
//     </DialogTrigger>
//     <DialogContent>
//         <DialogHeader>
//             <DialogTitle>Welcome!</DialogTitle>
//             <DialogDescription>
//                 This is a placeholder for the login functionality.
//             </DialogDescription>
//         </DialogHeader>
//         <DialogFooter>
//             <DialogClose asChild>
//                 <Button>Close</Button>
//             </DialogClose>
//         </DialogFooter>
//     </DialogContent>
// </Dialog>
export default function List() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header section with Add button */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Item List</h2>

               
                </div>

                {/* Full-width table */}
                <div className="w-full">
                    <Table className="w-full">
                        <TableCaption>A list of items.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Item 1</TableCell>
                                <TableCell>Sample description for item 1.</TableCell>
                                <TableCell>$10.00</TableCell>
                                <TableCell>100</TableCell>
                                <TableCell>Available</TableCell>
                                <TableCell className="flex items-center gap-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">View</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Item Details</DialogTitle>
                                                <DialogDescription>Sample description for item 1.</DialogDescription>
                                            </DialogHeader>
                                            <div className="py-2 text-sm space-y-1">
                                                <p><strong>Price:</strong> $10.00</p>
                                                <p><strong>Quantity:</strong> 100</p>
                                                <p><strong>Status:</strong> Available</p>
                                            </div>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant="ghost">Close</Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
