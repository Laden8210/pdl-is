'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { useForm } from '@inertiajs/react';
import { Pdl, MedicalRecord } from '@/types';

export function EditMedicalRecord({ record, pdls }: { record: MedicalRecord; pdls: Pdl[] }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        pdl_id: record.pdl_id.toString(),
        complaint: record.complaint,
        date: record.date.split('T')[0],
        progonosis: record.progonosis,
        laboratory: record.laboratory,
        prescription: record.prescription,
        findings: record.findings,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('medical-records.update', record.medical_record_id), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

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

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* PDL */}
                        <div className="space-y-2">
                            <Label>PDL (Person Deprived of Liberty)</Label>
                            <Select
                                value={data.pdl_id}
                                onValueChange={(value) => setData('pdl_id', value)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a PDL" />
                                </SelectTrigger>
                                <SelectContent>
                                    {pdls.map((pdl) => (
                                        <SelectItem key={pdl.id} value={pdl.id.toString()}>
                                            {pdl.fname} {pdl.lname} (ID: {pdl.id})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

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
                            required
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
                            required
                            rows={3}
                        />
                    </div>

                    {/* Progonosis */}
                    <div className="space-y-2">
                        <Label htmlFor="progonosis">Progonosis</Label>
                        <Textarea
                            id="progonosis"
                            value={data.progonosis}
                            onChange={(e) => setData('progonosis', e.target.value)}
                            required
                            rows={3}
                        />
                    </div>

                    {/* Laboratory */}
                    <div className="space-y-2">
                        <Label htmlFor="laboratory">Laboratory Results</Label>
                        <Textarea
                            id="laboratory"
                            value={data.laboratory}
                            onChange={(e) => setData('laboratory', e.target.value)}
                            required
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
                            required
                            rows={3}
                        />
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
