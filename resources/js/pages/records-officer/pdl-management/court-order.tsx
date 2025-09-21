import { DataTable } from '@/components/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { court_order_columns } from '@/features/pdl-management/court_order_columns';
import { CreateCourtOrder } from '@/features/pdl-management/create-court-order';
import AppLayout from '@/layouts/app-layout';
import { CourtOrder, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Court Order Management',
        href: '/court-order',
    },
];

interface PageProps {
    courtOrders: CourtOrder[];
    pdls: any[];
    filters?: {
        search: string;
    };
    auth?: {
        user?: {
            position?: string;
        };
    };
    [key: string]: any;
}



export default function CourtOrderManagement() {
    const { props } = usePage<PageProps>();
    const { courtOrders, pdls, filters, auth } = props;
    const [searchInput, setSearchInput] = useState(filters?.search || '');

    const handleSearch = () => {
        router.get(route('pdl-management.court-order'), {
            search: searchInput,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Court Order Management" />

            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-2xl font-bold">Court Order Management</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <div className="flex items-center justify-between">
                                <span>Court Order List</span>
                                {/* {auth?.user?.position !== 'law-enforcement' && (
                                    <CreateCourtOrder pdls={pdls} />
                                )} */}
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center space-x-4">
                            <Label htmlFor="search" className="text-sm font-medium">
                                Search Orders
                            </Label>
                            <Input
                                id="search"
                                placeholder="Search by order number, type, PDL name, etc."
                                className="w-64 md:w-96"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <Button variant="outline" onClick={handleSearch}>
                                Search
                            </Button>
                        </div>

                        <DataTable data={courtOrders} columns={court_order_columns} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
