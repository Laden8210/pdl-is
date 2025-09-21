'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { router } from '@inertiajs/react';

interface DeleteCourtOrderProps {
    order: {
        court_order_id: number;
        court_order_number?: string;
        order_type?: string;
        pdl?: {
            fname: string;
            lname: string;
        };
    };
}

export function DeleteCourtOrder({ order }: DeleteCourtOrderProps) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        router.delete(route('court-orders.destroy', order.court_order_id), {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-700">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete Court Order</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this court order?
                        {order.pdl && (
                            <span className="block mt-2 font-medium">
                                PDL: {order.pdl.fname} {order.pdl.lname}
                            </span>
                        )}
                        {order.court_order_number && (
                            <span className="block mt-1 text-sm text-gray-600">
                                Order Number: {order.court_order_number}
                            </span>
                        )}
                        {order.order_type && (
                            <span className="block mt-1 text-sm text-gray-600">
                                Order Type: {order.order_type}
                            </span>
                        )}
                        <span className="block mt-2 text-red-600">
                            This action cannot be undone.
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
