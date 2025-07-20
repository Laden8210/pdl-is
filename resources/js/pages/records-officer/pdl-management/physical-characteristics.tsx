import { DataTable } from '@/components/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { CreatePhysicalCharacteristic } from '@/features/pdl-management/create-physical-characteristic';
import { physical_characteristic_columns } from '@/features/pdl-management/physical-characteristic-columns';
import { type BreadcrumbItem } from '@/types';
import { PhysicalCharacteristic } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Physical Characteristics',
        href: '/physical-characteristics',
    },
];


interface PageProps {
    characteristics: PhysicalCharacteristic[];
    pdls: any[];
    filters?: {
        search: string;
    };
}

export default function PhysicalCharacteristics() {
    const { props } = usePage<PageProps>();
    const { characteristics, pdls, filters } = props;

    const [searchInput, setSearchInput] = useState(filters?.search || '');

    const handleSearch = () => {
        router.get('/physical-characteristics', {
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
            <Head title="Physical Characteristics Management" />

            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-2xl font-bold">Physical Characteristics</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <div className="flex items-center justify-between">
                                <span>Physical Characteristics</span>
                                <CreatePhysicalCharacteristic pdls={pdls} />
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center space-x-4">
                            <Label htmlFor="search" className="text-sm font-medium">
                                Search Characteristics
                            </Label>
                            <Input
                                id="search"
                                placeholder="Search by build, complexion, PDL name, etc."
                                className="w-64 md:w-96"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <Button variant="outline" onClick={handleSearch}>
                                Search
                            </Button>
                        </div>

                        <DataTable data={characteristics} columns={physical_characteristic_columns} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
