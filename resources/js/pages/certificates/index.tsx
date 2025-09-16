import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Download, Eye, Edit, AlertTriangle } from 'lucide-react';
import  AppLayout  from '@/layouts/app-layout';

interface Certificate {
    id: number;
    certificate_number: string;
    certificate_type: string;
    title: string;
    issue_date: string;
    valid_until?: string;
    status: string;
    purpose?: string;
    file_path?: string;
    pdl: {
        id: number;
        fname: string;
        lname: string;
    };
    issuer: {
        id: number;
        fname: string;
        lname: string;
        position: string;
    };
    requester?: {
        id: number;
        fname: string;
        lname: string;
    };
}

interface CertificateTypes {
    [key: string]: string;
}

interface Statuses {
    [key: string]: string;
}

interface PageProps {
    certificates: {
        data: Certificate[];
        links: any[];
        meta: any;
    };
    filters: {
        type?: string;
        status?: string;
        pdl_id?: string;
        search?: string;
    };
    certificateTypes: CertificateTypes;
    statuses: Statuses;
}

export default function CertificateIndex({ certificates, filters, certificateTypes, statuses }: PageProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [typeFilter, setTypeFilter] = useState(filters.type || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const handleSearch = () => {
        router.get(route('certificates.index'), {
            search: searchTerm,
            type: typeFilter,
            status: statusFilter,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'active':
                return 'default';
            case 'expired':
                return 'destructive';
            case 'revoked':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    const getTypeBadgeVariant = (type: string) => {
        switch (type) {
            case 'drug_clearing_status':
                return 'default';
            case 'no_records':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    return (
        <AppLayout>
            <Head title="Certificates" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Certificates</h1>
                        <p className="text-muted-foreground">
                            Manage and generate certificates for PDLs
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link href={route('certificates.expiring')}>
                            <Button variant="outline" size="sm">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Expiring Soon
                            </Button>
                        </Link>
                        <Link href={route('certificates.create')}>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Generate Certificate
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                        <CardDescription>Search and filter certificates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="search">Search</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        placeholder="Search certificates..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Certificate Type</Label>
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All types</SelectItem>
                                        {Object.entries(certificateTypes).map(([key, value]) => (
                                            <SelectItem key={key} value={key}>
                                                {value}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All statuses</SelectItem>
                                        {Object.entries(statuses).map(([key, value]) => (
                                            <SelectItem key={key} value={key}>
                                                {value}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>&nbsp;</Label>
                                <Button onClick={handleSearch} className="w-full">
                                    <Search className="h-4 w-4 mr-2" />
                                    Search
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Certificates Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Certificates ({certificates.data.length})</CardTitle>
                        <CardDescription>
                            List of all generated certificates
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {certificates.data.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No certificates found.</p>
                                <Link href={route('certificates.create')}>
                                    <Button className="mt-4">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Generate First Certificate
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Certificate #</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>PDL</TableHead>
                                        <TableHead>Issuer</TableHead>
                                        <TableHead>Issue Date</TableHead>
                                        <TableHead>Valid Until</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {certificates.data.map((certificate) => (
                                        <TableRow key={certificate.id}>
                                            <TableCell className="font-medium">
                                                {certificate.certificate_number}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getTypeBadgeVariant(certificate.certificate_type)}>
                                                    {certificateTypes[certificate.certificate_type]}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {certificate.pdl.fname} {certificate.pdl.lname}
                                            </TableCell>
                                            <TableCell>
                                                {certificate.issuer.fname} {certificate.issuer.lname}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(certificate.issue_date).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                {certificate.valid_until
                                                    ? new Date(certificate.valid_until).toLocaleDateString()
                                                    : 'N/A'
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusBadgeVariant(certificate.status)}>
                                                    {statuses[certificate.status]}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Link href={route('certificates.show', certificate.id)}>
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('certificates.edit', certificate.id)}>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    {certificate.file_path && (
                                                        <Link href={route('certificates.download', certificate.id)}>
                                                            <Button variant="outline" size="sm">
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
