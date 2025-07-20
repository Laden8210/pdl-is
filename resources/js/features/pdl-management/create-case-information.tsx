// create-case-information.tsx
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Pdl } from '@/types';
import { useForm } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

export function CreateCaseInformation({ pdls }: { pdls: Pdl[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        case_number: '',
        crime_committed: '',
        date_committed: '',
        time_committed: '',
        case_status: 'open',
        case_remarks: '',
        security_classification: 'medium',
        pdl_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('case-information.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };


        const { props } = usePage();
        const successMessage = (props as any).success;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Create Case</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Create Case Information</DialogTitle>
                    <DialogDescription>Fill in the details for the new case.</DialogDescription>
                </DialogHeader>

                {Object.keys(errors).length > 0 && (
                    <Alert variant="destructive" className="mt-4 mb-4">
                        <AlertTitle>Unable to process request</AlertTitle>
                        <AlertDescription>
                            <ul className="list-inside list-disc text-sm">
                                {Object.values(errors).map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                {successMessage && (
                    <Alert variant="default" className="mb-4">
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                )}

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
                        {/* Case Number */}
                        <div className="space-y-2">
                            <Label htmlFor="case_number">Case Number</Label>
                            <Input id="case_number" value={data.case_number} onChange={(e) => setData('case_number', e.target.value)} required />
                        </div>

                        {/* Crime Committed */}
                        <div className="space-y-2">
                            <Label htmlFor="crime_committed">Crime Committed</Label>
                            <Input
                                id="crime_committed"
                                value={data.crime_committed}
                                onChange={(e) => setData('crime_committed', e.target.value)}
                                required
                            />
                        </div>

                        {/* Date Committed */}
                        <div className="space-y-2">
                            <Label htmlFor="date_committed">Date Committed</Label>
                            <Input type="date" value={data.date_committed} onChange={(e) => setData('date_committed', e.target.value)} required />
                        </div>

                        {/* Time Committed */}
                        <div className="space-y-2">
                            <Label htmlFor="time_committed">Time Committed</Label>
                            <Input type="time" value={data.time_committed} onChange={(e) => setData('time_committed', e.target.value)} required />
                        </div>

                        {/* Case Status */}
                        <div className="space-y-2">
                            <Label htmlFor="case_status">Case Status</Label>
                            <Select value={data.case_status} onValueChange={(value) => setData('case_status', value)} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Security Classification */}
                        <div className="space-y-2">
                            <Label htmlFor="security_classification">Security Classification</Label>
                            <Select
                                value={data.security_classification}
                                onValueChange={(value) => setData('security_classification', value)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select classification" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="maximum">Maximum</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* PDL */}
                        <div className="space-y-2">
                            <Label>PDL (Person Deprived of Liberty)</Label>
                            <Select value={data.pdl_id} onValueChange={(value) => setData('pdl_id', value)} required>
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
                    </div>

                    {/* Remarks */}
                    <div className="space-y-2">
                        <Label htmlFor="case_remarks">Remarks</Label>
                        <Textarea id="case_remarks" value={data.case_remarks} onChange={(e) => setData('case_remarks', e.target.value)} rows={3} />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Case'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
