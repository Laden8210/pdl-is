import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EditMedicalRecord } from '@/features/pdl-management/edit-medical-record';
import { router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { DeleteMedicalRecord } from '@/features/pdl-management/delete-medical-record';

export type MedicalRecord = {
    medical_record_id: number;
    pdl_id: number;
    complaint: string;
    date: string;
    progonosis: string;
    prognosis: string;
    prescription: string;
    findings: string;
    stored_filename: string;
    file_path: string;
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
        accessorKey: 'prescription',
        header: 'Prescription',
        cell: ({ row }) => <div className="max-w-[200px] truncate">{row.original.prescription}</div>,
    },

    {
        accessorKey: 'stored_filename',
        header: 'Medical Record',
        cell: ({ row }) => <div className="max-w-[200px] truncate">
            <Button variant="outline" onClick={() => window.open(`/storage/${row.original.file_path}`, '_blank')}>
                Preview
            </Button>
        </div>,
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
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => router.visit(route('medical-records.edit', record.medical_record_id))}
                          >
                            Edit
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <DeleteMedicalRecord record={record} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
