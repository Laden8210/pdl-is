'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { DeleteUser } from './delete-user';
import { EditUser } from './edit-user';

export type Personnel = {
    id: number;
    fname: string;
    mname: string | null;
    lname: string;
    contactnum: string;
    avatar: string | null;
    username: string;
    password: string;
    position: string;
    agency: string;
};

export const user_columns: ColumnDef<Personnel>[] = [
    {
        accessorKey: 'fname',
        header: 'First Name',
    },
    {
        accessorKey: 'mname',
        header: 'Middle Name',
        cell: ({ row }) => row.getValue('mname') || <span className="text-muted-foreground">N/A</span>,
    },
    {
        accessorKey: 'lname',
        header: 'Last Name',
    },
    {
        accessorKey: 'contactnum',
        header: 'Contact No.',
    },
    {
        accessorKey: 'avatar',
        header: 'Avatar',
        cell: ({ row }) => {
            const avatar = row.getValue('avatar') as string | null;
            return avatar ? (
                <img src={`/storage/${avatar}`} alt="Avatar" className="h-8 w-8 rounded-full object-cover" />
            ) : (
                <span className="text-muted-foreground">N/A</span>
            );
        },
    },
    {
        accessorKey: 'username',
        header: 'Username',
    },
    {
        accessorKey: 'position',
        header: 'Position',
    },
    {
        accessorKey: 'agency',
        header: 'Agency',
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const user = row.original;

            return (
                <div className="flex items-center space-x-2">
                    <EditUser user={user} />
                    <DeleteUser user={user} />
                </div>
            );
        },
    },
];
