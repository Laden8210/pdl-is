// CellAssignment.tsx
import { DataTable } from '@/components/data-table';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { cell_assignment_columns } from '@/features/pdl-management/cell-assignment-columns';
import { CreateCellAssignment } from '@/features/pdl-management/create-cell-assignment';
import { Cells, Pdl } from '@/types';

interface PageProps {
  assignments: {
    assignment_id: number;
    cell: {
      cell_id: number;
      cell_name: string;
    };
    pdl: {
      id: number;
      fname: string;
      lname: string;
    };
    created_at: string;
  }[];
  cells: Cells[];
  pdls: Pdl[];
  filters: {
    search: string;
  };
}

export default function CellAssignment() {
  const { props } = usePage<PageProps>();
  const { assignments, cells, pdls, filters } = props;
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const assignmentData = assignments.map(assignment => ({
    assignment_id: assignment.assignment_id,
    cell_number: assignment.cell.cell_name,
    cell_id: assignment.cell.cell_id,
    pdl_id: assignment.pdl.id,
    pdl_name: `${assignment.pdl.fname} ${assignment.pdl.lname}`,
    assigned_date: assignment.created_at
  }));

  const handleSearch = () => {
    router.get('/admin/pdl-management/cell-assignment', {
      search: searchInput,
    });
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Cell Management',
      href: '/cell-management',
    },
    {
      title: 'Assignments',
      href: '/admin/pdl-management/cell-assignment',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Cell Assignment Management" />

      <div className="flex flex-col gap-6 p-4">
        <h1 className="text-2xl font-bold">Cell Assignments</h1>
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between">
                <span>Cell Assignment List</span>
                <CreateCellAssignment cells={cells} pdls={pdls} />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center space-x-4">
              <Label htmlFor="search" className="text-sm font-medium">
                Search Assignments
              </Label>
              <Input
                id="search"
                placeholder="Search by cell number or PDL name"
                className="w-64"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button variant="outline" onClick={handleSearch}>
                Search
              </Button>
            </div>

            <DataTable columns={cell_assignment_columns} data={assignmentData} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
