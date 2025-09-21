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

interface DeletePhysicalCharacteristicProps {
    characteristic: {
        characteristic_id: number;
        pdl?: {
            fname: string;
            lname: string;
        };
    };
}

export function DeletePhysicalCharacteristic({ characteristic }: DeletePhysicalCharacteristicProps) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        router.delete(route('physical-characteristics.destroy', characteristic.characteristic_id), {
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
                    <DialogTitle>Delete Physical Characteristic</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this physical characteristic record?
                        {characteristic.pdl && (
                            <span className="block mt-2 font-medium">
                                PDL: {characteristic.pdl.fname} {characteristic.pdl.lname}
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
