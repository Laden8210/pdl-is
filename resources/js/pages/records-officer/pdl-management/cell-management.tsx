import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { CreateCellInformation } from '@/features/pdl-management/create-cell-information';
import { DataTable } from '@/components/data-table';
import { cell_management_columns } from '@/features/pdl-management/cell-management-columns';
import { Cells } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cell Management',
        href: '/cell-management',
    },
];

interface PageProps {
    cells: Cells[];
    filters: {
        search: string;
    };
}
export default function CellManagement() {
    const { props } = usePage<PageProps>();
    const { cells } = props;
    const [searchInput, setSearchInput] = useState('');

    const filteredCells = useMemo(() => {
        if (!searchInput) return cells;
        return cells.filter(cell =>
            cell.cell_name.toLowerCase().includes(searchInput.toLowerCase())
        );
    }, [cells, searchInput]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cell Management" />

            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-2xl font-bold">Cell Management</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <div className="flex items-center justify-between">
                                <span>Cell List</span>
                                <CreateCellInformation />
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center space-x-4">
                            <Label htmlFor="search" className="text-sm font-medium">
                                Search Cells
                            </Label>
                            <Input
                                id="search"
                                placeholder="Search by cell name"
                                className="w-64"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </div>

                        <DataTable
                            data={filteredCells}
                            columns={cell_management_columns}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
