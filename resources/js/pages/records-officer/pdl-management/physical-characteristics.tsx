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
    searchPerformed?: boolean;
    totalResults?: number;
    auth?: {
        user?: {
            position?: string;
        };
    };
}

export default function PhysicalCharacteristics() {
    const { props } = usePage<PageProps>();
    const { characteristics, pdls, filters, auth, searchPerformed, totalResults } = props;

    const [searchInput, setSearchInput] = useState(filters?.search || '');

    const getUserRoute = () => {
        const userPosition = auth?.user?.position;
        switch (userPosition) {
            case 'admin':
                return '/admin/pdl-management/physical-characteristics';
            case 'law-enforcement':
                return '/law-enforcement/pdl-management/physical-characteristics';
            case 'record-officer':
            default:
                return '/record-officer/pdl-management/physical-characteristics';
        }
    };

    const handleSearch = () => {
        router.get(getUserRoute(), {
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

                        {/* Search Results Message */}
                        {searchPerformed && (
                            <div className="mt-4 text-center">
                                {totalResults === 0 ? (
                                    <div className="text-muted-foreground">
                                        <p className="text-lg font-medium">No physical characteristics found</p>
                                        <p className="mt-2">No physical characteristics match your search criteria: "{filters?.search}"</p>
                                        <p className="mt-1 text-sm">Try searching with different keywords or check your spelling.</p>
                                    </div>
                                ) : (
                                    <div className="text-muted-foreground">
                                        <p className="text-sm">Found {totalResults} physical characteristic{totalResults !== 1 ? 's' : ''} matching "{filters?.search}"</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* No Characteristics Message (when no search performed) */}
                        {!searchPerformed && characteristics.length === 0 && (
                            <div className="mt-4 text-center text-muted-foreground">
                                <p className="text-lg font-medium">No physical characteristics found</p>
                                <p className="mt-2">Physical characteristics will appear here once they are created.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
