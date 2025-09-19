import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, Edit, Printer, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import  AppLayout from '@/layouts/app-layout';

interface Certificate {
    id: number;
    certificate_number: string;
    certificate_type: string;
    title: string;
    content: string;
    issue_date: string;
    valid_until?: string;
    status: string;
    purpose?: string;
    remarks?: string;
    file_path?: string;
    pdl: {
        id: number;
        fname: string;
        lname: string;
        alias?: string;
        birthdate: string;
        age: number;
        gender: string;
        ethnic_group: string;
        civil_status: string;
        address: string;
    };
    issuer: {
        id: number;
        fname: string;
        lname: string;
        position: string;
        title: string;
    };
    requester?: {
        id: number;
        fname: string;
        lname: string;
    };
}

interface TemplateData {
    certificate: Certificate;
    pdl: Certificate['pdl'];
    issuer: Certificate['issuer'];
    requester?: Certificate['requester'];
    issue_date_formatted: string;
    valid_until_formatted: string;
    certificate_type_name: string;
    status_name: string;
}

interface PageProps {
    certificate: Certificate;
    templateData: TemplateData;
}

export default function ShowCertificate({ certificate, templateData }: PageProps) {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'expired':
                return <XCircle className="h-4 w-4 text-red-600" />;
            case 'revoked':
                return <AlertTriangle className="h-4 w-4 text-orange-600" />;
            default:
                return <AlertTriangle className="h-4 w-4 text-gray-600" />;
        }
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

    const isExpired = certificate.valid_until && new Date(certificate.valid_until) < new Date();
    const isExpiringSoon = certificate.valid_until &&
        new Date(certificate.valid_until) > new Date() &&
        new Date(certificate.valid_until) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    return (
        <AppLayout>
            <Head title={`Certificate ${certificate.certificate_number}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href={route('certificates.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Certificates
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Certificate {certificate.certificate_number}
                            </h1>
                            <p className="text-muted-foreground">
                                {templateData.certificate_type_name}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {certificate.file_path && (
                            <Link href={route('certificates.download', certificate.id)}>
                                <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download PDF
                                </Button>
                            </Link>
                        )}
                        <Link href={route('certificates.print', certificate.id)}>
                            <Button variant="outline" size="sm">
                                <Printer className="h-4 w-4 mr-2" />
                                Print
                            </Button>
                        </Link>
                        <Link href={route('certificates.edit', certificate.id)}>
                            <Button size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Status Alerts */}
                {isExpired && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <XCircle className="h-5 w-5 text-red-600 mr-2" />
                            <div>
                                <h3 className="text-sm font-medium text-red-800">Certificate Expired</h3>
                                <p className="text-sm text-red-600">
                                    This certificate expired on {templateData.valid_until_formatted}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {isExpiringSoon && !isExpired && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                            <div>
                                <h3 className="text-sm font-medium text-yellow-800">Certificate Expiring Soon</h3>
                                <p className="text-sm text-yellow-600">
                                    This certificate will expire on {templateData.valid_until_formatted}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Certificate Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Certificate Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Certificate Information</CardTitle>
                                <CardDescription>
                                    Basic details about this certificate
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Certificate Number
                                        </Label>
                                        <p className="text-sm font-mono">{certificate.certificate_number}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Type
                                        </Label>
                                        <p className="text-sm">{templateData.certificate_type_name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Issue Date
                                        </Label>
                                        <p className="text-sm">{templateData.issue_date_formatted}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Valid Until
                                        </Label>
                                        <p className="text-sm">
                                            {templateData.valid_until_formatted}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Status
                                        </Label>
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(certificate.status)}
                                            <Badge variant={getStatusBadgeVariant(certificate.status)}>
                                                {templateData.status_name}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {certificate.purpose && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Purpose
                                        </Label>
                                        <p className="text-sm">{certificate.purpose}</p>
                                    </div>
                                )}

                                {certificate.remarks && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Remarks
                                        </Label>
                                        <p className="text-sm">{certificate.remarks}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Certificate Content */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Certificate Content</CardTitle>
                                <CardDescription>
                                    The official certificate text
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <pre className="whitespace-pre-wrap text-sm font-sans">
                                        {certificate.content}
                                    </pre>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* PDL Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>PDL Information</CardTitle>
                                <CardDescription>
                                    Details about the PDL
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Name
                                    </Label>
                                    <p className="text-sm font-medium">
                                        {certificate.pdl.fname} {certificate.pdl.lname}
                                    </p>
                                    {certificate.pdl.alias && (
                                        <p className="text-xs text-muted-foreground">
                                            Alias: {certificate.pdl.alias}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Age & Gender
                                    </Label>
                                    <p className="text-sm">{certificate.pdl.age} years old, {certificate.pdl.gender}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Address
                                    </Label>
                                    <p className="text-sm">{certificate.pdl.address}</p>
                                </div>
                                <Separator />
                                <Link href={route('pdl-management.personal-information', { pdl_id: certificate.pdl.id })}>
                                    <Button variant="outline" size="sm" className="w-full">
                                        View PDL Details
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Issuer Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Issuer Information</CardTitle>
                                <CardDescription>
                                    Who issued this certificate
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Name
                                    </Label>
                                    <p className="text-sm font-medium">
                                        {certificate.issuer.fname} {certificate.issuer.lname}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Position
                                    </Label>
                                    <p className="text-sm">{certificate.issuer.title}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Requester Information */}
                        {certificate.requester && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Requester Information</CardTitle>
                                    <CardDescription>
                                        Who requested this certificate
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Name
                                        </Label>
                                        <p className="text-sm font-medium">
                                            {certificate.requester.fname} {certificate.requester.lname}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
