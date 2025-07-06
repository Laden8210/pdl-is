import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

import { DataTable } from '@/components/data-table';
import { PaginationControls } from '@/components/pagination-controls';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Personnel } from '@/types';
import { useState } from 'react';
import { user_columns } from '@/features/user-management/user-columns';

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
import { CreateUser } from '@/features/user-management/create-user';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function List() {
    const { users, filters } = usePage().props as unknown as {
        users: {
            data: Personnel[];
            current_page: number;
            last_page: number;
        };
        filters: {
            search: string;
        };
    };

    const [searchInput, setSearchInput] = useState(filters.search || '');

    const handleSearch = () => {
        router.get('/admin/user-management', { search: searchInput }, { preserveState: true });
    };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="User Management" />

      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage your users and their permissions.
            </p>
          </div>

          <CreateUser />
        </div>

        <div className="flex items-center space-x-4">
          <Label htmlFor="search" className="text-sm font-medium">
            Search Users
          </Label>
          <Input
            id="search"
            placeholder="Search by name or username"
            className="w-64"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button variant="outline" onClick={handleSearch}>Search</Button>
        </div>

        <div className="w-full">
          <DataTable columns={user_columns} data={users.data} />
          <PaginationControls
            page={users.current_page}
            totalPages={users.last_page}
            onPageChange={(newPage) =>
              router.get('/admin/user-management', {
                search: filters.search,
                page: newPage,
              }, { preserveState: true })
            }
          />
        </div>
      </div>
    </AppLayout>
  );

}
