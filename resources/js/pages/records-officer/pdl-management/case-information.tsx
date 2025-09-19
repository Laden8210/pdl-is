import { DataTable } from '@/components/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { case_information_columns } from '@/features/pdl-management/case-information-columns';
import { CreateCaseInformation } from '@/features/pdl-management/create-case-information';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Case Information Management',
        href: '/case-information',
    },
];

interface CaseInformation {
    case_id: number;
    case_number: string;
    crime_committed: string;
    date_committed: string;
    time_committed: string;
    case_status: string;
    case_remarks: string;
    security_classification: string;
    pdl_id: number;
    pdl?: {
        fname: string;
        lname: string;
    };
}

interface PageProps {
    cases: CaseInformation[];
    pdls: any[]; // Adjust this type based on your Pdl model
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

export default function CaseInformation() {
    const { props } = usePage<PageProps>();
    const { cases, pdls, filters, auth, searchPerformed, totalResults } = props;

    // Safely handle undefined filters
    const [searchInput, setSearchInput] = useState(filters?.search || '');

    const getUserRoute = () => {
        const userPosition = auth?.user?.position;
        switch (userPosition) {
            case 'admin':
                return '/admin/pdl-management/case-information';
            case 'law-enforcement':
                return '/law-enforcement/pdl-management/case-information';
            case 'record-officer':
            default:
                return '/record-officer/pdl-management/case-information';
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
            <Head title="Case Information Management" />

            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-2xl font-bold">Case Information Management</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <div className="flex items-center justify-between">
                                <span>Case Information List</span>
                                <CreateCaseInformation pdls={pdls} />
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center space-x-4">
                            <Label htmlFor="search" className="text-sm font-medium">
                                Search Cases
                            </Label>
                            <Input
                                id="search"
                                placeholder="Search by case number, crime, PDL name, etc."
                                className="w-64 md:w-96"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <Button variant="outline" onClick={handleSearch}>
                                Search
                            </Button>
                        </div>

                        <DataTable data={cases} columns={case_information_columns} />

                        {/* Search Results Message */}
                        {searchPerformed && (
                            <div className="mt-4 text-center">
                                {totalResults === 0 ? (
                                    <div className="text-muted-foreground">
                                        <p className="text-lg font-medium">No cases found</p>
                                        <p className="mt-2">No case records match your search criteria: "{filters?.search}"</p>
                                        <p className="mt-1 text-sm">Try searching with different keywords or check your spelling.</p>
                                    </div>
                                ) : (
                                    <div className="text-muted-foreground">
                                        <p className="text-sm">Found {totalResults} case{totalResults !== 1 ? 's' : ''} matching "{filters?.search}"</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* No Cases Message (when no search performed) */}
                        {!searchPerformed && cases.length === 0 && (
                            <div className="mt-4 text-center text-muted-foreground">
                                <p className="text-lg font-medium">No case records found</p>
                                <p className="mt-2">Case information records will appear here once they are created.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
