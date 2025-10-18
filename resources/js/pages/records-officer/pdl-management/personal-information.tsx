import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageProps } from '@/types';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { TransferPDL } from '@/features/pdl-management/transfer-pdl';
import { ViewPdlInformation } from '@/features/pdl-management/view-pdl-information';
import { usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'PDL Management',
        href: '/pdl-management',
    },
];

export default function PersonalInformation() {
    const { props } = usePage<PageProps>();
    const { pdls } = props;

    // State for search, sorting, and pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filter and sort PDLs
    const filteredAndSortedPdls = useMemo(() => {
        let filtered = pdls.filter(pdl => {
            const fullName = `${pdl?.fname || ''} ${pdl?.mname || ''} ${pdl?.lname || ''}`.toLowerCase();
            const searchLower = searchTerm.toLowerCase();

            return (
                fullName.includes(searchLower) ||
                pdl.alias?.toLowerCase().includes(searchLower) ||
                pdl.gender?.toLowerCase().includes(searchLower) ||
                pdl.ethnic_group?.toLowerCase().includes(searchLower) ||
                pdl.civil_status?.toLowerCase().includes(searchLower) ||
                pdl.brgy?.toLowerCase().includes(searchLower) ||
                pdl.city?.toLowerCase().includes(searchLower) ||
                pdl.province?.toLowerCase().includes(searchLower) ||
                pdl.id.toString().includes(searchLower)
            );
        });

        // Sort PDLs
        filtered.sort((a, b) => {
            let aValue: any;
            let bValue: any;

            switch (sortField) {
                case 'name':
                    aValue = `${a.fname} ${a.mname} ${a.lname}`.toLowerCase();
                    bValue = `${b.fname} ${b.mname} ${b.lname}`.toLowerCase();
                    break;
                case 'id':
                    aValue = a.id;
                    bValue = b.id;
                    break;
                case 'gender':
                    aValue = a.gender?.toLowerCase() || '';
                    bValue = b.gender?.toLowerCase() || '';
                    break;
                case 'ethnic_group':
                    aValue = a.ethnic_group?.toLowerCase() || '';
                    bValue = b.ethnic_group?.toLowerCase() || '';
                    break;
                case 'civil_status':
                    aValue = a.civil_status?.toLowerCase() || '';
                    bValue = b.civil_status?.toLowerCase() || '';
                    break;
                case 'age':
                    aValue = a.age;
                    bValue = b.age;
                    break;
                case 'agency':
                    aValue = a.personnel?.agency?.toLowerCase() || '';
                    bValue = b.personnel?.agency?.toLowerCase() || '';
                    break;
                default:
                    aValue = a[sortField as keyof typeof a];
                    bValue = b[sortField as keyof typeof b];
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [pdls, searchTerm, sortField, sortDirection]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedPdls.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPdls = filteredAndSortedPdls.slice(startIndex, startIndex + itemsPerPage);

    // Handle sort
    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
        setCurrentPage(1);
    };

    // Sort indicator component
    const SortIndicator = ({ field }: { field: string }) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Personal Information" />

            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-2xl font-bold">Personal Information</h1>

                {/* Search and Controls */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search PDLs..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="pl-8"
                        />
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Show:</span>
                            <Select
                                value={itemsPerPage.toString()}
                                onValueChange={(value) => {
                                    setItemsPerPage(Number(value));
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger className="w-20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Link
                            href="/pdl-management/personal-information/create"
                            className="flex items-center gap-2 rounded-sm bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
                        >
                            Add PDL Information
                        </Link>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Personal Information List
                            <span className="text-sm font-normal text-muted-foreground ml-2">
                                ({filteredAndSortedPdls.length} PDL{filteredAndSortedPdls.length !== 1 ? 's' : ''})
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => handleSort('id')}
                                    >
                                        <div className="flex items-center gap-1">
                                            ID
                                            <SortIndicator field="id" />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => handleSort('name')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Full Name
                                            <SortIndicator field="name" />
                                        </div>
                                    </TableHead>
                                    <TableHead>Alias</TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => handleSort('gender')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Gender
                                            <SortIndicator field="gender" />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => handleSort('ethnic_group')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Ethnic Group
                                            <SortIndicator field="ethnic_group" />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => handleSort('civil_status')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Civil Status
                                            <SortIndicator field="civil_status" />
                                        </div>
                                    </TableHead>
                                    <TableHead>Date of Birth</TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => handleSort('age')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Age
                                            <SortIndicator field="age" />
                                        </div>
                                    </TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Encoded By</TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => handleSort('agency')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Agency
                                            <SortIndicator field="agency" />
                                        </div>
                                    </TableHead>
                                    <TableHead>Transfer Request</TableHead>
                                    <TableHead>Archive Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedPdls.map((pdl) => (
                                    <TableRow key={pdl.id}>
                                        <TableCell>{pdl.id}</TableCell>
                                        <TableCell>
                                            {`${pdl?.fname || ''}  ${pdl?.mname} ${pdl?.lname || ''}`
                                                .trim()
                                                .split(' ')
                                                .filter(Boolean)
                                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                                .join(' ')}
                                        </TableCell>
                                        <TableCell>{pdl.alias ?? '-'}</TableCell>
                                        <TableCell>{pdl.gender ?? '-'}</TableCell>
                                        <TableCell>{pdl.ethnic_group ?? '-'}</TableCell>
                                        <TableCell>{pdl.civil_status ?? '-'}</TableCell>
                                        <TableCell>{format(new Date(pdl.birthdate), 'MMMM dd, yyyy')}</TableCell>
                                        <TableCell>{pdl.age}</TableCell>
                                        <TableCell>{`${pdl.brgy ?? ''}, ${pdl.city ?? ''}, ${pdl.province ?? ''}`}</TableCell>
                                        <TableCell>{pdl.personnel ? `${pdl.personnel.fname} ${pdl.personnel.lname}` : '—'}</TableCell>
                                        <TableCell>{pdl.personnel ? `${pdl.personnel.agency}` : '—'}</TableCell>
                                        <TableCell>
                                            {pdl.verifications.length > 0
                                                ? pdl.verifications[0].status.charAt(0).toUpperCase() + pdl.verifications[0].status.slice(1)
                                                : 'No Verification'}
                                        </TableCell>
                                        <TableCell>
                                            {pdl.archived_at ? (
                                                <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                                                    Archived
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                                                    Active
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <ViewPdlInformation pdl={pdl} />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        window.location.href = `/law-enforcement/pdl-management/personal-information/${pdl.id}`;
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <TransferPDL pdl={pdl} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAndSortedPdls.length)} of {filteredAndSortedPdls.length} entries
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }

                                            return (
                                                <Button
                                                    key={pageNum}
                                                    variant={currentPage === pageNum ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setCurrentPage(pageNum)}
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
