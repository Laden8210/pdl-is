import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Reports',
        href: '/report',
    },
    {
        title: 'Certificate of Detention',
        href: '/report/certificate-of-detention',
    },
];

interface Pdl {
    id: number;
    name: string;
    case_number: string;
    crime_committed: string;
    date_committed: string | null;
}

interface PageProps {
    pdls: Pdl[];
}

export default function CertificateOfDetention({ pdls }: PageProps) {
    const [selectedPdl, setSelectedPdl] = useState<Pdl | null>(null);
    const [issueDate, setIssueDate] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        pdl_id: '',
        issue_date: '',
        officer_name: '',
        officer_position: '',
    });

    const handlePdlSelect = (pdlId: string) => {
        const pdl = pdls.find(p => p.id.toString() === pdlId);
        setSelectedPdl(pdl || null);
        setData('pdl_id', pdlId);
    };

    const handleDateChange = (date: string) => {
        setIssueDate(date);
        setData('issue_date', date);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('reports.certificate-of-detention.generate'));
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        params.append('pdl_id', data.pdl_id);
        params.append('issue_date', data.issue_date);
        params.append('officer_name', data.officer_name);
        params.append('officer_position', data.officer_position);
        window.location.href = route('reports.certificate-of-detention.generate') + '?' + params.toString();
    };

    const calculateDetentionPeriod = () => {
        if (!selectedPdl?.date_committed || !issueDate) return '';

        const committedDate = new Date(selectedPdl.date_committed);
        const issueDateObj = new Date(issueDate);
        const diffTime = issueDateObj.getTime() - committedDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);
        const days = diffDays % 30;

        let result = '';
        if (years > 0) {
            result += `${years} year${years > 1 ? 's' : ''}`;
        }
        if (months > 0) {
            if (result) result += ', ';
            result += `${months} month${months > 1 ? 's' : ''}`;
        }
        if (days > 0) {
            if (result) result += ', and ';
            result += `${days} day${days > 1 ? 's' : ''}`;
        }

        return result || 'Less than 1 day';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Certificate of Detention" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <h1 className="text-2xl font-bold">Certificate of Detention</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Generate Certificate of Detention
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="officer_name" className="text-sm font-medium">
                                        Officer Name
                                    </Label>
                                    <Input
                                        id="officer_name"
                                        type="text"
                                        value={data.officer_name}
                                        onChange={(e) => setData('officer_name', e.target.value)}
                                    />
                                    {errors.officer_name && (
                                        <p className="text-sm text-red-500">{errors.officer_name}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="officer_position" className="text-sm font-medium">
                                        Officer Position
                                    </Label>
                                    <Input
                                        id="officer_position"
                                        type="text"
                                        value={data.officer_position}
                                        onChange={(e) => setData('officer_position', e.target.value)}
                                    />
                                    {errors.officer_position && (
                                        <p className="text-sm text-red-500">{errors.officer_position}</p>
                                    )}
                                </div>
                                {/* PDL Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="pdl_id" className="text-sm font-medium">
                                        Select PDL <span className="text-red-500">*</span>
                                    </Label>
                                    <Select onValueChange={handlePdlSelect} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a PDL..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {pdls.map((pdl) => (
                                                <SelectItem key={pdl.id} value={pdl.id.toString()}>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{pdl.name}</span>
                                                        <span className="text-xs text-gray-500">
                                                            {pdl.case_number} - {pdl.crime_committed}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.pdl_id && (
                                        <p className="text-sm text-red-500">{errors.pdl_id}</p>
                                    )}
                                </div>

                                {/* Issue Date */}
                                <div className="space-y-2">
                                    <Label htmlFor="issue_date" className="text-sm font-medium">
                                        Issue Date <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="issue_date"
                                            type="date"
                                            value={issueDate}
                                            onChange={(e) => handleDateChange(e.target.value)}
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                    {errors.issue_date && (
                                        <p className="text-sm text-red-500">{errors.issue_date}</p>
                                    )}
                                </div>
                            </div>

                            {/* Selected PDL Information */}
                            {selectedPdl && (
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-blue-900 mb-2">Selected PDL Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium">Name:</span> {selectedPdl.name}
                                        </div>
                                        <div>
                                            <span className="font-medium">Case Number:</span> {selectedPdl.case_number}
                                        </div>
                                        <div>
                                            <span className="font-medium">Crime Committed:</span> {selectedPdl.crime_committed}
                                        </div>
                                        <div>
                                            <span className="font-medium">Date Committed:</span> {
                                                selectedPdl.date_committed
                                                    ? new Date(selectedPdl.date_committed).toLocaleDateString()
                                                    : 'N/A'
                                            }
                                        </div>
                                        {issueDate && (
                                            <div className="md:col-span-2">
                                                <span className="font-medium">Detention Period:</span> {calculateDetentionPeriod()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Error Display */}
                            {errors.error && (
                                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                                    <p className="text-red-700">{errors.error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <Button
                                    onClick={() => handleExport()}
                                    disabled={processing || !selectedPdl || !issueDate}
                                    variant="outline"
                                    size="sm"
                                    type='button'
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Export PDF
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Certificate Preview */}
                {selectedPdl && issueDate && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Certificate Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-white border-2 border-gray-200 p-8 rounded-lg">
                                <div className="text-center mb-6">
                                    <div className="text-sm font-bold mb-1">Republic of the Philippines</div>
                                    <div className="text-sm font-bold mb-1">Province of South Cotabato</div>
                                    <div className="text-base font-bold mb-1">OFFICE OF THE PROVINCIAL GOVERNOR</div>
                                    <div className="text-sm font-bold mb-1">Provincial Jail Management Unit</div>
                                    <div className="text-sm mb-2">Koronadal City</div>
                                    <div className="border-t border-gray-400 mb-2"></div>
                                    <div className="text-xs">Tel #: (083) 228-2445; Email Address: socot.scrdcjail@gmail.com</div>
                                </div>

                                <div className="text-center mb-6">
                                    <div className="text-lg font-bold uppercase">Certificate of Detention</div>
                                </div>

                                <div className="mb-4">
                                    <div className="font-bold underline uppercase mb-4">To Whom It May Concern:</div>

                                    <div className="space-y-3 text-sm leading-relaxed">
                                        <p className="text-justify">
                                            THIS IS TO CERTIFY that <strong className="uppercase">{selectedPdl.name}</strong>, was committed in this institution on <strong>{selectedPdl.date_committed ? new Date(selectedPdl.date_committed).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</strong>, per Commitment Order issued by the Regional Court Branch 26, Surallah, South Cotabato for the charge of <strong className="uppercase">{selectedPdl.crime_committed}</strong> docketed as <strong>{selectedPdl.case_number}</strong>.
                                        </p>

                                        <p className="text-justify">
                                            It is further certified that said accused was detained for <strong>{calculateDetentionPeriod()}</strong> as to date.
                                                                                </p>

                                        <p className="text-justify">
                                            This certification is issued upon the request of the above-named person for whatever legal purpose it may serve him best.
                                                                                </p>

                                        <p className="text-justify">
                                            Issued this <strong>{new Date(issueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>,                                         City of Koronadal.
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right mt-8">
                                    <div className="font-bold uppercase">{data.officer_name ?? 'JUAN R. LANZADERAS, JR., MPA'}</div>
                                    <div className="text-sm">{data.officer_position ?? 'Provincial Warden'}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
