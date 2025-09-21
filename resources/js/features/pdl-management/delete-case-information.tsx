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

interface DeleteCaseInformationProps {
    caseInfo: {
        case_id: number;
        case_number?: string;
        crime_committed?: string;
        pdl?: {
            fname: string;
            lname: string;
        };
    };
}

export function DeleteCaseInformation({ caseInfo }: DeleteCaseInformationProps) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        router.delete(route('case-information.destroy', caseInfo.case_id), {
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
                    <DialogTitle>Delete Case Information</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this case information record?
                        {caseInfo.pdl && (
                            <span className="block mt-2 font-medium">
                                PDL: {caseInfo.pdl.fname} {caseInfo.pdl.lname}
                            </span>
                        )}
                        {caseInfo.case_number && (
                            <span className="block mt-1 text-sm text-gray-600">
                                Case Number: {caseInfo.case_number}
                            </span>
                        )}
                        {caseInfo.crime_committed && (
                            <span className="block mt-1 text-sm text-gray-600">
                                Crime: {caseInfo.crime_committed}
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
