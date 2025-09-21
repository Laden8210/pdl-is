import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft } from 'lucide-react';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Medical Records',
        href: '/pdl-management/medical-records',
    },
    {
        title: 'Edit Medical Record',
        href: '#',
    },
];

interface PageProps {
    record: any;
    [key: string]: any;
}

export default function EditMedicalRecord() {
    const { props } = usePage<PageProps>();
    const { record } = props;

    const { data, setData, put, processing, errors } = useForm({
        pdl_id: record.pdl_id.toString(),
        complaint: record.complaint || '',
        date: record.date ? format(new Date(record.date), 'yyyy-MM-dd') : '',
        prognosis: record.prognosis || '',
        prescription: record.prescription || '',
        findings: record.findings || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('medical-records.update', record.medical_record_id), {
            preserveScroll: true,
            onSuccess: () => {
                router.visit(route('medical-records.index'));
            },
        });
    };

    const { props: pageProps } = usePage();
    const successMessage = (pageProps as any).success;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Medical Record" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.visit(route('medical-records.index'))}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Medical Records
                    </Button>
                    <h1 className="text-2xl font-bold">Edit Medical Record</h1>
                </div>

                {Object.keys(errors).length > 0 && (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            <ul className="list-inside list-disc">
                                {Object.values(errors).map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                {successMessage && (
                    <Alert variant="default">
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Medical Record Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Date */}
                                <div className="space-y-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input
                                        type="date"
                                        id="date"
                                        value={data.date}
                                        onChange={(e) => setData('date', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Complaint */}
                            <div className="space-y-2">
                                <Label htmlFor="complaint">Complaint</Label>
                                <Textarea
                                    id="complaint"
                                    value={data.complaint}
                                    onChange={(e) => setData('complaint', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            {/* Findings */}
                            <div className="space-y-2">
                                <Label htmlFor="findings">Findings</Label>
                                <Textarea
                                    id="findings"
                                    value={data.findings}
                                    onChange={(e) => setData('findings', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            {/* Prognosis */}
                            <div className="space-y-2">
                                <Label htmlFor="prognosis">Prognosis</Label>
                                <Textarea
                                    id="prognosis"
                                    value={data.prognosis}
                                    onChange={(e) => setData('prognosis', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            {/* Prescription */}
                            <div className="space-y-2">
                                <Label htmlFor="prescription">Prescription</Label>
                                <Textarea
                                    id="prescription"
                                    value={data.prescription}
                                    onChange={(e) => setData('prescription', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit(route('medical-records.index'))}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Record'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
