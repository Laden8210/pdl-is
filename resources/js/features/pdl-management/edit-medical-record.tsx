'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { MedicalRecord } from '@/features/pdl-management/medical-record-columns';
import { useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';

export function EditMedicalRecord({ record }: { record: MedicalRecord }) {
    const { data, setData, put, processing, errors, reset } = useForm({
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
                // Don't reset the form on success, just close the dialog
            },
        });
    };

    const { props } = usePage();
    const successMessage = (props as any).success;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Edit Medical Record</DialogTitle>
                    <DialogDescription>Update the medical details</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
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

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Date */}
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input type="date" id="date" value={data.date} onChange={(e) => setData('date', e.target.value)} required />
                        </div>
                        {/* Medical record preview */}
                    </div>

                    {/* Complaint */}
                    <div className="space-y-2">
                        <Label htmlFor="complaint">Complaint</Label>
                        <Textarea id="complaint" value={data.complaint} onChange={(e) => setData('complaint', e.target.value)} rows={3} />
                    </div>

                    {/* Findings */}
                    <div className="space-y-2">
                        <Label htmlFor="findings">Findings</Label>
                        <Textarea id="findings" value={data.findings} onChange={(e) => setData('findings', e.target.value)} rows={3} />
                    </div>

                    {/* Prognosis */}
                    <div className="space-y-2">
                        <Label htmlFor="prognosis">Prognosis</Label>
                        <Textarea id="prognosis" value={data.prognosis} onChange={(e) => setData('prognosis', e.target.value)} rows={3} />
                    </div>

                    {/* Prescription */}
                    <div className="space-y-2">
                        <Label htmlFor="prescription">Prescription</Label>
                        <Textarea id="prescription" value={data.prescription} onChange={(e) => setData('prescription', e.target.value)} rows={3} />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Record'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
