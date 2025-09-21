import { DataTable } from '@/components/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { CreateMedicalRecord } from '@/features/pdl-management/create-medical-record';
import { medical_record_columns } from '@/features/pdl-management/medical-record-columns';
import { type BreadcrumbItem } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Medical Records',
        href: '/medical-records',
    },
];

interface MedicalRecord {
    medical_record_id: number;
    pdl_id: number;
    complaint: string;
    date: string;
    prognosis: string;
    laboratory: string;
    prescription: string;
    findings: string;
    pdl?: {
        fname: string;
        lname: string;
    };
}

interface PageProps {
    records: MedicalRecord[];
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

export default function MedicalRecords() {
    const { props } = usePage<PageProps>();
    const { records, pdls, filters, auth, searchPerformed, totalResults } = props;

    const [searchInput, setSearchInput] = useState(filters?.search || '');

    const getUserRoute = () => {
        const userPosition = auth?.user?.position;
        switch (userPosition) {
            case 'admin':
                return '/admin/pdl-management/medical-records';
            case 'law-enforcement':
                return '/law-enforcement/pdl-management/medical-records';
            case 'record-officer':
            default:
                return '/record-officer/pdl-management/medical-records';
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
    const { props: pageProps } = usePage();
    const successMessage = (pageProps as any).success;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Medical Records Management" />

            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-2xl font-bold">Medical Records</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>
                        {successMessage && (
                                <Alert variant="default">
                                    <AlertTitle>Success</AlertTitle>
                                    <AlertDescription>{successMessage}</AlertDescription>
                                </Alert>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center space-x-4">
                            <Label htmlFor="search" className="text-sm font-medium">
                                Search Records
                            </Label>
                            <Input
                                id="search"
                                placeholder="Search by complaint, PDL name, findings, etc."
                                className="w-64 md:w-96"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <Button variant="outline" onClick={handleSearch}>
                                Search
                            </Button>
                        </div>

                        <DataTable data={records ?? []} columns={medical_record_columns} />

                        {/* Search Results Message */}
                        {searchPerformed && (
                            <div className="mt-4 text-center">
                                {totalResults === 0 ? (
                                    <div className="text-muted-foreground">
                                        <p className="text-lg font-medium">No medical records found</p>
                                        <p className="mt-2">No medical records match your search criteria: "{filters?.search}"</p>
                                        <p className="mt-1 text-sm">Try searching with different keywords or check your spelling.</p>
                                    </div>
                                ) : (
                                    <div className="text-muted-foreground">
                                        <p className="text-sm">Found {totalResults} medical record{totalResults !== 1 ? 's' : ''} matching "{filters?.search}"</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* No Records Message (when no search performed) */}
                        {!searchPerformed && records.length === 0 && (
                            <div className="mt-4 text-center text-muted-foreground">
                                <p className="text-lg font-medium">No medical records found</p>
                                <p className="mt-2">Medical records will appear here once they are created.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
