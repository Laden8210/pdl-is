import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import  AppLayout  from '@/layouts/app-layout';

interface Pdl {
    id: number;
    fname: string;
    lname: string;
}

interface Personnel {
    id: number;
    fname: string;
    lname: string;
    position: string;
}

interface CertificateTypes {
    [key: string]: string;
}

interface PageProps {
    pdls: Pdl[];
    personnel: Personnel[];
    certificateTypes: CertificateTypes;
    selectedPdlId?: number;
    selectedType?: string;
}

export default function CreateCertificate({ pdls, personnel, certificateTypes, selectedPdlId, selectedType }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        certificate_type: selectedType || 'drug_clearing_status',
        pdl_id: selectedPdlId || '',
        issued_by: '',
        issue_date: new Date().toISOString().split('T')[0],
        valid_until: '',
        purpose: 'For legal and official purposes',
        remarks: '',
        requested_by_name: '',
        location: 'City of Koronadal',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('certificates.store'));
    };

    const getCertificateTypeDescription = (type: string) => {
        switch (type) {
            case 'drug_clearing_status':
                return 'Certifies that the PDL has been cleared of drug-related charges and maintained clean record during detention.';
            case 'no_records':
                return 'Certifies that this office has no records affecting the specified person.';
            case 'good_standing':
                return 'Certifies that the PDL has maintained good conduct and discipline.';
            case 'release_clearance':
                return 'Certifies that the PDL is cleared for release with no pending issues.';
            case 'medical_clearance':
                return 'Certifies that the PDL has passed medical examinations and is medically cleared.';
            case 'disciplinary_clearance':
                return 'Certifies that the PDL has no pending disciplinary actions.';
            default:
                return 'Official certificate for legal and administrative purposes.';
        }
    };

    return (
        <AppLayout>
            <Head title="Generate Certificate" />

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
                            <h1 className="text-3xl font-bold tracking-tight">Generate Certificate</h1>
                            <p className="text-muted-foreground">
                                Create a new certificate for a PDL
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Certificate Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Certificate Details</CardTitle>
                                <CardDescription>
                                    Basic information about the certificate
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="certificate_type">Certificate Type</Label>
                                    <Select
                                        value={data.certificate_type}
                                        onValueChange={(value) => setData('certificate_type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select certificate type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(certificateTypes).map(([key, value]) => (
                                                <SelectItem key={key} value={key}>
                                                    {value}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.certificate_type && (
                                        <p className="text-sm text-red-600">{errors.certificate_type}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground">
                                        {getCertificateTypeDescription(data.certificate_type)}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="pdl_id">PDL</Label>
                                    <Select
                                        value={data.pdl_id.toString()}
                                        onValueChange={(value) => setData('pdl_id', parseInt(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select PDL" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {pdls.map((pdl) => (
                                                <SelectItem key={pdl.id} value={pdl.id.toString()}>
                                                    {pdl.fname} {pdl.lname} (ID: {pdl.id})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.pdl_id && (
                                        <p className="text-sm text-red-600">{errors.pdl_id}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="issued_by">Issued By</Label>
                                    <Select
                                        value={data.issued_by.toString()}
                                        onValueChange={(value) => setData('issued_by', parseInt(value))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select issuer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {personnel.map((person) => (
                                                <SelectItem key={person.id} value={person.id.toString()}>
                                                    {person.fname} {person.lname} ({person.position})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.issued_by && (
                                        <p className="text-sm text-red-600">{errors.issued_by}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Dates and Validity */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Dates and Validity</CardTitle>
                                <CardDescription>
                                    Issue date and validity period
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="issue_date">Issue Date</Label>
                                    <Input
                                        id="issue_date"
                                        type="date"
                                        value={data.issue_date}
                                        onChange={(e) => setData('issue_date', e.target.value)}
                                    />
                                    {errors.issue_date && (
                                        <p className="text-sm text-red-600">{errors.issue_date}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="valid_until">Valid Until (Optional)</Label>
                                    <Input
                                        id="valid_until"
                                        type="date"
                                        value={data.valid_until}
                                        onChange={(e) => setData('valid_until', e.target.value)}
                                    />
                                    {errors.valid_until && (
                                        <p className="text-sm text-red-600">{errors.valid_until}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground">
                                        Leave empty for certificates that don't expire
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="City of Koronadal"
                                    />
                                    {errors.location && (
                                        <p className="text-sm text-red-600">{errors.location}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Additional Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Information</CardTitle>
                            <CardDescription>
                                Purpose, remarks, and requester details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="purpose">Purpose</Label>
                                <Textarea
                                    id="purpose"
                                    value={data.purpose}
                                    onChange={(e) => setData('purpose', e.target.value)}
                                    placeholder="For legal and official purposes"
                                    rows={3}
                                />
                                {errors.purpose && (
                                    <p className="text-sm text-red-600">{errors.purpose}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="requested_by_name">Requested By</Label>
                                <Input
                                    id="requested_by_name"
                                    value={data.requested_by_name}
                                    onChange={(e) => setData('requested_by_name', e.target.value)}
                                    placeholder="Name of person requesting the certificate"
                                />
                                {errors.requested_by_name && (
                                    <p className="text-sm text-red-600">{errors.requested_by_name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="remarks">Remarks (Optional)</Label>
                                <Textarea
                                    id="remarks"
                                    value={data.remarks}
                                    onChange={(e) => setData('remarks', e.target.value)}
                                    placeholder="Additional notes or remarks"
                                    rows={3}
                                />
                                {errors.remarks && (
                                    <p className="text-sm text-red-600">{errors.remarks}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end space-x-4">
                        <Link href={route('certificates.index')}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            <Save className="h-4 w-4 mr-2" />
                            {processing ? 'Generating...' : 'Generate Certificate'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
