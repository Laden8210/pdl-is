import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, FileText, User, Calendar, Building, Shield } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Pdl {
    id: number;
    first_name: string;
    last_name: string;
    middle_name?: string;
    created_at: string;
    cases?: Array<{
        id: number;
        case_number?: string;
        crime_committed?: string;
        drug_related: boolean;
    }>;
}

interface CertificateData {
    pdl_id: number;
    title: string;
    facility_name: string;
    office: string;
    unit: string;
    location: string;
    contact: {
        tel: string;
        email: string;
    };
    pdl: {
        name: string;
        middle_name?: string;
        full_name: string;
        commitment_date: string;
        detention_period: {
            years: number;
            months: number;
            days: number;
        };
    };
    court_info: {
        court: string;
        location: string;
        case_number: string;
        charge: string;
    };
    issue_date: string;
    issue_location: string;
    signed_by: {
        name: string;
        position: string;
    };
}

interface PageProps {
    certificates?: CertificateData[];
    filters?: {
        pdl_ids?: number[];
    };
    pdls?: Pdl[];
}

export default function DrugClearingCertificate({ certificates, filters, pdls = [] }: PageProps) {
    const { data, setData, post, processing } = useForm<{
        pdl_id: number | null;
        export_pdf: boolean;
    }>({
        pdl_id: filters?.pdl_ids?.[0] || null,
        export_pdf: false,
    });

    const [selectedPdl, setSelectedPdl] = useState<number | null>(null);

    const handlePdlSelection = (pdlId: number) => {
        setSelectedPdl(pdlId);
        setData('pdl_id', pdlId);
    };

    const handleGenerate = (exportPdf: boolean = false) => {
        setData('export_pdf', exportPdf);
        post(route('reports.drug-clearing-certificate.generate'));
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        if (selectedPdl) {
            params.append('pdl_id', selectedPdl.toString());
        }

        window.location.href = route('reports.drug-clearing-certificate.export') + '?' + params.toString();
    };

    // Filter PDLs with drug-related cases
    const drugRelatedPdls = pdls.filter(pdl =>
        pdl.cases && pdl.cases.some(case_ => case_.drug_related)
    );

    return (
        <AppLayout>
            <Head title="Drug-Clearing Status Certificate - South Cotabato Rehabilitation and Detention Center" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Drug-Clearing Status Certificate</h1>
                        <p className="text-muted-foreground">
                            Generate official certificate for drug-clearing status
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            Official Certificate
                        </span>
                    </div>
                </div>

                {/* PDL Selection Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Select PDL for Drug-Clearing Certificate</CardTitle>
                        <CardDescription>
                            Choose one PDL with drug-related cases to generate certificate
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {drugRelatedPdls.length > 0 ? (
                            <>
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium">
                                            Select PDL for Certificate Generation
                                        </span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            onClick={() => handleGenerate(false)}
                                            disabled={processing || !selectedPdl}
                                            size="sm"
                                        >
                                            <FileText className="h-4 w-4 mr-2" />
                                            {processing ? 'Generating...' : 'Generate Certificate'}
                                        </Button>
                                        <Button
                                            onClick={() => handleExport()}
                                            disabled={processing || !selectedPdl}
                                            variant="outline"
                                            size="sm"
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Export PDF
                                        </Button>
                                    </div>
                                </div>

                                <div className="border rounded-lg">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-12">Select</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Commitment Date</TableHead>
                                                <TableHead>Drug Cases</TableHead>
                                                <TableHead>Detention Period</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {drugRelatedPdls.map((pdl) => {
                                                const commitmentDate = new Date(pdl.created_at);
                                                const currentDate = new Date();
                                                const detentionPeriod = Math.floor((currentDate.getTime() - commitmentDate.getTime()) / (1000 * 60 * 60 * 24));
                                                const years = Math.floor(detentionPeriod / 365);
                                                const months = Math.floor((detentionPeriod % 365) / 30);
                                                const days = detentionPeriod % 30;
                                                const drugCases = pdl.cases?.filter(c => c.drug_related).length || 0;

                                                return (
                                                    <TableRow key={pdl.id}>
                                                        <TableCell>
                                                            <RadioGroup value={selectedPdl?.toString() || ''} onValueChange={(value) => handlePdlSelection(parseInt(value))}>
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value={pdl.id.toString()} id={`pdl-${pdl.id}`} />
                                                                    <Label htmlFor={`pdl-${pdl.id}`} className="sr-only">
                                                                        Select {pdl.first_name} {pdl.last_name}
                                                                    </Label>
                                                                </div>
                                                            </RadioGroup>
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            {pdl.first_name} {pdl.last_name}
                                                            {pdl.middle_name && ` ${pdl.middle_name}`}
                                                        </TableCell>
                                                        <TableCell>
                                                            {commitmentDate.toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                {drugCases} case{drugCases !== 1 ? 's' : ''}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            {years > 0 && `${years}y `}
                                                            {months > 0 && `${months}m `}
                                                            {days}d
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                Active
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>

                                {selectedPdl && (
                                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                        <h4 className="font-semibold text-blue-900 mb-2">
                                            Selected PDL:
                                        </h4>
                                        <div className="text-sm text-blue-800">
                                            {(() => {
                                                const pdl = drugRelatedPdls.find(p => p.id === selectedPdl);
                                                return pdl ? (
                                                    <div className="flex items-center space-x-2">
                                                        <User className="h-3 w-3" />
                                                        <span>{pdl.first_name} {pdl.last_name}</span>
                                                    </div>
                                                ) : null;
                                            })()}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <Alert>
                                <AlertDescription>
                                    No PDLs with drug-related cases found. Please ensure there are PDLs with drug-related cases in the system.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                {/* Certificate Results */}
                {certificates && certificates.length > 0 && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Generated Certificates ({certificates.length})</CardTitle>
                                <CardDescription>
                                    Drug-clearing status certificates for selected PDLs
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {certificates.map((certificate, index) => (
                                        <div key={certificate.pdl_id} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-semibold text-lg">{certificate.title}</h4>
                                                <span className="text-sm text-muted-foreground">Certificate #{index + 1}</span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div className="space-y-2">
                                                    <div className="flex items-center space-x-2">
                                                        <User className="h-4 w-4 text-blue-600" />
                                                        <span className="font-medium">PDL Name:</span>
                                                        <span>{certificate.pdl.full_name}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="h-4 w-4 text-green-600" />
                                                        <span className="font-medium">Commitment Date:</span>
                                                        <span>{certificate.pdl.commitment_date}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Building className="h-4 w-4 text-purple-600" />
                                                        <span className="font-medium">Court:</span>
                                                        <span>{certificate.court_info.court}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center space-x-2">
                                                        <Shield className="h-4 w-4 text-red-600" />
                                                        <span className="font-medium">Charge:</span>
                                                        <span>{certificate.court_info.charge}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="h-4 w-4 text-orange-600" />
                                                        <span className="font-medium">Case Number:</span>
                                                        <span>{certificate.court_info.case_number}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="h-4 w-4 text-indigo-600" />
                                                        <span className="font-medium">Issue Date:</span>
                                                        <span>{certificate.issue_date}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-3 p-3 bg-gray-50 rounded text-xs">
                                                <div className="font-medium mb-1">Certificate Content:</div>
                                                <div className="text-gray-700">
                                                    <strong>THIS IS TO CERTIFY</strong> that <strong>{certificate.pdl.full_name}</strong>,
                                                    was committed in this institution on <strong>{certificate.pdl.commitment_date}</strong>,
                                                    per Commitment Order issued by the {certificate.court_info.court},
                                                    {certificate.court_info.location} for the charge of
                                                    <strong> {certificate.court_info.charge}</strong> docketed as
                                                    Criminal Case No. {certificate.court_info.case_number}.
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Instructions */}
                {!certificates && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Instructions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p>• Select one PDL who has drug-related cases</p>
                                <p>• Use radio buttons to select a single PDL</p>
                                <p>• The certificate will show the PDL's detention period and drug-clearing status</p>
                                <p>• Certificate includes court information and case details</p>
                                <p>• Export the certificate as PDF for official documentation</p>
                                <p>• Certificate is signed by the Provincial Warden</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* No Drug-Related PDLs Alert */}
                {drugRelatedPdls.length === 0 && (
                    <Alert>
                        <AlertDescription>
                            No PDLS with drug-related cases found. Please ensure there are PDLS with drug-related cases in the system.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </AppLayout>
    );
}
