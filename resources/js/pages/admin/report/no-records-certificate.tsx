import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, FileText, User, Plus, X, Building } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Person {
    fname: string;
    mname: string;
    lname: string;
    [key: string]: any;
}

interface CertificateData {
    title: string;
    facility_name: string;
    office: string;
    unit: string;
    location: string;
    contact: {
        tel: string;
        email: string;
    };
    persons: Person[];
    requested_by: string;
    requesting_agency: string;
    issue_date: string;
    issue_location: string;
    signed_by: {
        name: string;
        position: string;
    };
}

interface PageProps {
    certificateData?: CertificateData;
    filters?: {
        persons?: Person[];
        requested_by?: string;
        requesting_agency?: string;
    };
}

export default function NoRecordsCertificate({ certificateData, filters }: PageProps) {
    const { data, setData, post, processing } = useForm<{
        persons: Person[];
        requested_by: string;
        requesting_agency: string;
        export_pdf: boolean;
    }>({
        persons: filters?.persons || [{ fname: '', mname: '', lname: '' }],
        requested_by: filters?.requested_by || '',
        requesting_agency: filters?.requesting_agency || '',
        export_pdf: false,
    });

    const handleAddPerson = () => {
        setData('persons', [...data.persons, { fname: '', mname: '', lname: '' }]);
    };

    const handleRemovePerson = (index: number) => {
        if (data.persons.length > 1) {
            const newPersons = data.persons.filter((_, i) => i !== index);
            setData('persons', newPersons);
        }
    };

    const handlePersonFieldChange = (index: number, field: keyof Person, value: string) => {
        const newPersons = [...data.persons];
        newPersons[index] = { ...newPersons[index], [field]: value };
        setData('persons', newPersons);
    };

    const handleGenerate = (exportPdf: boolean = false) => {
        setData('export_pdf', exportPdf);
        post(route('reports.no-records-certificate.generate'));
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        data.persons.forEach((person, index) => {
            params.append(`persons[${index}][fname]`, person.fname || '');
            params.append(`persons[${index}][mname]`, person.mname || '');
            params.append(`persons[${index}][lname]`, person.lname || '');
        });

        params.append('requested_by', data.requested_by);
        params.append('requesting_agency', data.requesting_agency);

        console.log(params.toString());
        console.log(route('reports.no-records-certificate.export') + '?' + params.toString());

        // open in new tab
        window.open(route('reports.no-records-certificate.export') + '?' + params.toString(), '_blank');

        //window.location.href = route('reports.no-records-certificate.export') + '?' + params.toString();
    };



    return (
        <AppLayout>
            <Head title="Certificate of No Records - South Cotabato Rehabilitation and Detention Center" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Certificate of No Records</h1>
                        <p className="text-muted-foreground">
                            Generate official certificate stating no records exist for specified persons
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            Official Certificate
                        </span>
                    </div>
                </div>

                {/* Certificate Generation Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Generate Certificate of No Records</CardTitle>
                        <CardDescription>
                            Enter the names of persons and requesting information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Person Names */}
                            <div className="space-y-4">
                                <Label className="text-base font-semibold">Person Names</Label>
                                {data.persons.map((person, index) => (
                                    <div key={index} className="space-y-3 p-4 border rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm font-medium">Person {index + 1}</Label>
                                            {data.persons.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleRemovePerson(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div className="space-y-1">
                                                <Label htmlFor={`fname-${index}`} className="text-xs">First Name</Label>
                                                <Input
                                                    id={`fname-${index}`}
                                                    placeholder="First Name"
                                                    value={person.fname}
                                                    onChange={(e) => handlePersonFieldChange(index, 'fname', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor={`mname-${index}`} className="text-xs">Middle Name</Label>
                                                <Input
                                                    id={`mname-${index}`}
                                                    placeholder="Middle Name"
                                                    value={person.mname}
                                                    onChange={(e) => handlePersonFieldChange(index, 'mname', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor={`lname-${index}`} className="text-xs">Last Name</Label>
                                                <Input
                                                    id={`lname-${index}`}
                                                    placeholder="Last Name"
                                                    value={person.lname}
                                                    onChange={(e) => handlePersonFieldChange(index, 'lname', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAddPerson}
                                    className="w-full"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Another Person
                                </Button>
                            </div>

                            {/* Requesting Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="requested_by">Requested By</Label>
                                    <Input
                                        id="requested_by"
                                        placeholder="e.g., PEMS Edwin P. Arroyo"
                                        value={data.requested_by}
                                        onChange={(e) => setData('requested_by', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="requesting_agency">Requesting Agency</Label>
                                    <Input
                                        id="requesting_agency"
                                        placeholder="e.g., Philippine National Police ACG-RACV12"
                                        value={data.requesting_agency}
                                        onChange={(e) => setData('requesting_agency', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-2">
                                <Button
                                    onClick={() => handleGenerate(false)}
                                    disabled={processing || !data.persons.some(person => person.fname.trim() || person.lname.trim()) || !data.requested_by || !data.requesting_agency}
                                    className="flex-1"
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    {processing ? 'Generating...' : 'Generate Certificate'}
                                </Button>
                                <Button
                                    onClick={() => handleExport()}
                                    disabled={processing || !data.persons.some(person => person.fname.trim() || person.lname.trim()) || !data.requested_by || !data.requesting_agency}
                                    variant="outline"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Export PDF
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Certificate Results */}
                {certificateData && (
                    <div className="space-y-6">
                        {/* Certificate Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-center">{certificateData.title}</CardTitle>
                                <CardDescription className="text-center">
                                    {certificateData.facility_name} - {certificateData.location}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Header Information */}
                                <div className="text-center space-y-2">
                                    <div className="font-bold text-lg">{certificateData.facility_name}</div>
                                    <div className="font-semibold">{certificateData.office}</div>
                                    <div className="font-semibold">{certificateData.unit}</div>
                                    <div>{certificateData.location}</div>
                                    <div className="text-sm">
                                        Tel #: {certificateData.contact.tel}; Email Address: {certificateData.contact.email}
                                    </div>
                                </div>

                                <hr className="border-gray-300" />

                                {/* Certificate Content */}
                                <div className="space-y-4">
                                    <div className="font-bold text-lg text-center underline">
                                        {certificateData.title}
                                    </div>

                                    <div className="space-y-3">
                                        <div className="font-bold underline">TO WHOM IT MAY CONCERN:</div>

                                        <div className="text-sm leading-relaxed">
                                            <p>
                                                <strong>THIS IS TO CERTIFY</strong> that this office has no records,
                                                whatsoever affecting the following persons:
                                            </p>
                                        </div>

                                        <div className="text-sm ml-4">
                                            {certificateData.persons.map((person, index) => (
                                                <div key={index} className="mb-1">
                                                    {index + 1}. {person.fname} {person.mname} {person.lname}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="text-sm leading-relaxed">
                                            <p>
                                                This certification is issued upon the request of {certificateData.requested_by},
                                                {certificateData.requesting_agency} for whatever legal purpose it may serve him best.
                                            </p>
                                        </div>

                                        <div className="text-sm">
                                            <p>
                                                Issued this {certificateData.issue_date}, {certificateData.issue_location}.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Signature Section */}
                                <div className="text-right mt-8">
                                    <div className="font-bold">{certificateData.signed_by.name}</div>
                                    <div>{certificateData.signed_by.position}</div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Certificate Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Certificate Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <User className="h-4 w-4 text-blue-600" />
                                            <span className="font-medium">Persons Listed:</span>
                                            <span>{certificateData.persons.length}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Building className="h-4 w-4 text-green-600" />
                                            <span className="font-medium">Requested By:</span>
                                            <span>{certificateData.requested_by}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Building className="h-4 w-4 text-purple-600" />
                                            <span className="font-medium">Agency:</span>
                                            <span>{certificateData.requesting_agency}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <FileText className="h-4 w-4 text-orange-600" />
                                            <span className="font-medium">Issue Date:</span>
                                            <span>{certificateData.issue_date}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Instructions */}
                {!certificateData && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Instructions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p>• Enter the full names of persons for whom no records exist</p>
                                <p>• Add multiple persons using the "Add Another Person" button</p>
                                <p>• Provide the name of the person requesting the certificate</p>
                                <p>• Specify the requesting agency or organization</p>
                                <p>• Export the certificate as PDF for official documentation</p>
                                <p>• Certificate is signed by the Provincial Warden</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
