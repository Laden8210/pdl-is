import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EditMedicalRecord } from '@/features/pdl-management/edit-medical-record';
import { router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';

export type MedicalRecord = {
    medical_record_id: number;
    pdl_id: number;
    complaint: string;
    date: string;
    progonosis: string;
    prognosis: string;
    prescription: string;
    findings: string;
    pdl?: {
        fname: string;
        lname: string;
    };
};

export const medical_record_columns: ColumnDef<MedicalRecord>[] = [
    {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => format(new Date(row.original.date), 'MMM dd, yyyy'),
    },
    {
        id: 'pdl',
        header: 'PDL',
        cell: ({ row }) => {
            const pdl = row.original.pdl;
            return pdl ? `${pdl.fname} ${pdl.lname}` : `ID: ${row.original.pdl_id}`;
        },
    },
    {
        accessorKey: 'complaint',
        header: 'Complaint',
        cell: ({ row }) => <div className="max-w-[200px] truncate">{row.original.complaint}</div>,
    },
    {
        accessorKey: 'findings',
        header: 'Findings',
        cell: ({ row }) => <div className="max-w-[200px] truncate">{row.original.findings}</div>,
    },
    {
        accessorKey: 'prognosis',
        header: 'Prognosis',
        cell: ({ row }) => <div className="max-w-[200px] truncate">{row.original.prognosis}</div>,
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const record = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <EditMedicalRecord record={record} pdls={[]} />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => router.delete(route('medical-records.destroy', record.medical_record_id))}
                            className="text-red-500"
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
