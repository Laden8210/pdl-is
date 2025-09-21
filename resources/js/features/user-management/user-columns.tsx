'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { DeleteUser } from './delete-user';
import { EditUser } from './edit-user';
import { ResetPasswordDialog } from './reset-password-dialog';
export type PasswordReset = {
    id: number;
    personnel_id: number;
    is_used: boolean;
    created_at: string;
};

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
    password_resets?: PasswordReset[];
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
        accessorKey: 'password',
        header: 'Request Password Reset',
        cell: ({ row }) => {
            const user = row.original;
            const hasActiveRequest = user.password_resets && user.password_resets.length > 0;

            return hasActiveRequest ? <ResetPasswordDialog user={user} /> : <span className="text-muted-foreground">No active request</span>;
        },
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
