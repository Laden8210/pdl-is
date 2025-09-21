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
import { Pdl } from '@/types';

export function CreateMedicalRecord({ pdls = [] }: { pdls?: Pdl[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        pdl_id: '',
        complaint: '',
        date: new Date().toISOString().split('T')[0],
        prognosis: '',
        prescription: '',
        findings: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('medical-records.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Create Record</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Create Medical Record</DialogTitle>
                    <DialogDescription>Fill in the medical details</DialogDescription>
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

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Record'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
