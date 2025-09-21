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

interface DeleteMedicalRecordProps {
    record: {
        medical_record_id: number;
        complaint?: string;
        date?: string;
        pdl?: {
            fname: string;
            lname: string;
        };
    };
}

export function DeleteMedicalRecord({ record }: DeleteMedicalRecordProps) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        router.delete(route('medical-records.destroy', record.medical_record_id), {
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
                    <DialogTitle>Delete Medical Record</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this medical record?
                        {record.pdl && (
                            <span className="block mt-2 font-medium">
                                PDL: {record.pdl.fname} {record.pdl.lname}
                            </span>
                        )}
                        {record.complaint && (
                            <span className="block mt-1 text-sm text-gray-600">
                                Complaint: {record.complaint}
                            </span>
                        )}
                        {record.date && (
                            <span className="block mt-1 text-sm text-gray-600">
                                Date: {new Date(record.date).toLocaleDateString()}
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
