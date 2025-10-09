import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { cell_transfer_log_columns } from '@/features/pdl-management/cell-transfer-log-columns';

interface TransferLog {
  id: number;
  assignment_id: number;
  pdl_id: number;
  from_cell_id: number;
  to_cell_id: number;

  reason: string | null;
  transferred_at: string;
  created_at: string;
  updated_at: string;
  pdl: {
    id: number;
    fname: string;
    lname: string;
    gender: string;
  };
  from_cell: {
    cell_id: number;
    cell_name: string;
    gender: string;
  };
  to_cell: {
    cell_id: number;
    cell_name: string;
    gender: string;
  };
  transferred_by?: { // Made optional with ?
    id: number;
    fname: string;
    lname: string;
  };
}

interface PageProps {
  transferLogs: TransferLog[];
  cell?: {
    cell_id: number;
    cell_name: string;
    gender: string;
    capacity: number;
  };
  filters: {
    search: string;
    cell_id?: number;
  };
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
  };
  [key: string]: any;
}

export default function CellActivityLog() {
  const { props } = usePage<PageProps>();
  const { transferLogs, cell, filters, pagination } = props;
  const [searchInput, setSearchInput] = useState(filters.search || '');
  console.log(transferLogs);

  const transferLogData = transferLogs.map(log => ({
    id: log.id,
    assignment_id: log.assignment_id,
    pdl_name: `${log.pdl.fname} ${log.pdl.lname}`,
    pdl_gender: log.pdl.gender,
    from_cell: log.from_cell.cell_name,
    to_cell: log.to_cell.cell_name,
    transferred_by: log.transferred_by
      ? `${log.transferred_by.fname} ${log.transferred_by.lname}`
      : 'Unknown User', // Fallback for missing user
    reason: log.reason || 'No reason provided',
    transferred_at: log.transferred_at,
  }));

  const handleSearch = () => {
    const url = cell
      ? `/admin/pdl-management/cell-activity-log?cell_id=${cell.cell_id}`
      : '/admin/pdl-management/cell-activity-log';

    router.get(url, {
      search: searchInput,
    });
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Cell Management',
      href: '/admin/cell-management',
    },
    {
      title: cell ? `Activity Log - ${cell.cell_name}` : 'Activity Log',
      href: cell ? `/admin/pdl-management/cell-activity-log?cell_id=${cell.cell_id}` : '/admin/pdl-management/cell-activity-log',
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Cell Transfer Activity Log" />

      <div className="flex flex-col gap-6 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {cell ? `Cell Transfer Activity Log - ${cell.cell_name}` : 'Cell Transfer Activity Log'}
          </h1>
          <div className="flex items-center space-x-2">
            {cell && (
              <Button
                variant="outline"
                onClick={() => router.get('/admin/cell-management')}
              >
                Back to Cell Management
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => router.get('/admin/pdl-management/cell-assignment')}
            >
              Back to Assignments
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transfer History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center space-x-4">
              <Label htmlFor="search" className="text-sm font-medium">
                Search Activity Log
              </Label>
              <Input
                id="search"
                placeholder="Search by PDL name, cell names, or personnel..."
                className="w-64"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button variant="outline" onClick={handleSearch}>
                Search
              </Button>
            </div>

            <div className="mb-4 text-sm text-gray-600">
              Showing {transferLogData.length} of {pagination.total} transfer records
              {cell && ` for ${cell.cell_name}`}
            </div>

            <DataTable columns={cell_transfer_log_columns} data={transferLogData} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
