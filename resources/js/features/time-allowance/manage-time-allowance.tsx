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
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { TimeAllowanceRecords } from './time-allowance-records';

interface ManageTimeAllowanceProps {
    pdl: any;
    gctaDays: number;
    tastmDays: number;
    records: any[];
}

export function ManageTimeAllowance({ pdl, gctaDays, tastmDays, records }: ManageTimeAllowanceProps) {
    const { props } = usePage<any>();
    const successMessage = props.success;

    // Get GCTA days based on years served
    const getGctaDays = () => {
        const yearsServed = typeof pdl?.years_served === 'object' ? pdl.years_served.years : pdl?.years_served || 0;

        if (yearsServed >= 0 && yearsServed <= 2) return 20;
        if (yearsServed >= 3 && yearsServed <= 5) return 23;
        if (yearsServed >= 6 && yearsServed <= 10) return 25;
        if (yearsServed >= 11) return 30;
        return 20; // Default for 0 years
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'gcta',
        days: getGctaDays(),
        reason: '',
        supporting_document: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.time-allowance.update', pdl.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    const handleTypeChange = (value: 'gcta' | 'tastm') => {
        setData('type', value);
        if (value === 'gcta') {
            setData('days', getGctaDays());
        } else {
            setData('days', 15); // Fixed TASTM days
        }
    };

    return (
        <Dialog>
            <Head title="Manage Time Allowance" />

            <DialogTrigger asChild>
                <Button variant="outline">Manage Allowance</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form id="time-allowance-form" onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>
                            Manage Time Allowance for {pdl.fname} {pdl.lname}
                        </DialogTitle>
                        <DialogDescription>
                            Add time allowance days for Good Conduct Time Allowance (GCTA) or Time Allowance for Study, Teaching and Mentoring
                            (TASTM).
                        </DialogDescription>
                    </DialogHeader>

                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mt-4 mb-4">
                            <AlertTitle>Unable to process request</AlertTitle>
                            <AlertDescription>
                                {Object.values(errors).map((error, index) => (
                                    <ul className="list-inside list-disc text-sm" key={index}>
                                        <li>{error}</li>
                                    </ul>
                                ))}
                            </AlertDescription>
                        </Alert>
                    )}

                    {successMessage && (
                        <Alert variant="default" className="mb-4 border-green-200 bg-green-50 text-green-800">
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{successMessage}</AlertDescription>
                        </Alert>
                    )}

                    <div className="mb-4 grid grid-cols-2 gap-4 py-2">
                        <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
                            <h3 className="text-sm font-medium text-blue-800">Current GCTA Days</h3>
                            <p className="text-2xl font-bold text-blue-900">{gctaDays}</p>
                        </div>
                        <div className="rounded-md border border-green-200 bg-green-50 p-3">
                            <h3 className="text-sm font-medium text-green-800">Current TASTM Days</h3>
                            <p className="text-2xl font-bold text-green-900">{tastmDays}</p>
                        </div>
                    </div>

                    {/* Years Served Information */}
                    <div className="mb-4 rounded-md border border-gray-200 bg-gray-50 p-3">
                        <h3 className="text-sm font-medium text-gray-800">Years Served</h3>
                        <p className="text-lg font-semibold text-gray-900">
                            {typeof pdl?.years_served === 'object' ? pdl.years_served.formatted : `${pdl?.years_served || 0} years`}
                        </p>
                        <div className="mt-2 text-xs text-gray-600">
                            <p>
                                <strong>GCTA Default:</strong> {getGctaDays()} days per month (based on{' '}
                                {typeof pdl?.years_served === 'object' ? pdl.years_served.years : pdl?.years_served || 0} years served)
                            </p>
                            <p>
                                <strong>TASTM Default:</strong> 15 days per month (fixed)
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Allowance Type</Label>
                            <Select value={data.type} onValueChange={handleTypeChange} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select allowance type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gcta">Good Conduct Time Allowance (GCTA)</SelectItem>
                                    <SelectItem value="tastm">Time Allowance for Study, Teaching & Mentoring (TASTM)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="days">Days to Add</Label>
                            <Select value={data.days.toString()} onValueChange={(value) => setData('days', parseInt(value))} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select days to add" />
                                </SelectTrigger>
                                <SelectContent>
                                    {data.type === 'gcta' ? (
                                        <>
                                            <SelectItem value="20">20 days (0-2 years served)</SelectItem>
                                            <SelectItem value="23">23 days (3-5 years served)</SelectItem>
                                            <SelectItem value="25">25 days (6-10 years served)</SelectItem>
                                            <SelectItem value="30">30 days (11+ years served)</SelectItem>
                                        </>
                                    ) : (
                                        <SelectItem value="15">15 days (TASTM fixed)</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="reason">Reason</Label>
                            <Textarea
                                id="reason"
                                name="reason"
                                value={data.reason}
                                onChange={(e) => setData('reason', e.target.value)}
                                placeholder="Enter the reason for adding time allowance"
                                required
                            />
                        </div>

                        <div className="grid gap-2 mb-2">
                            <Label htmlFor="supporting_document">Supporting Document (optional)</Label>
                            <div>
                                <div className="mb-1 text-xs text-gray-600">
                                    Upload a supporting document (e.g., approval letter, memorandum) if applicable.
                                </div>
                            </div>
                            <div>

                                <Input
                                    type="file"
                                    id="supporting_document"
                                    name="supporting_document"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={(e) => setData('supporting_document', e.target.files?.[0] || null)}
                                />

                                {data.supporting_document && (
                                    <a
                                        href={URL.createObjectURL(data.supporting_document)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                                    >
                                        Review Uploaded Document
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <div className="flex w-full items-center justify-between">
                            <div className="flex gap-2">
                                <DialogClose asChild>
                                    <Button variant="secondary">Cancel</Button>
                                </DialogClose>
                                <TimeAllowanceRecords pdl={pdl} records={records} />
                                <Button type="submit" form="time-allowance-form" className="bg-blue-500 hover:bg-blue-600" disabled={processing}>
                                    {processing ? 'Adding...' : 'Add Allowance'}
                                </Button>
                            </div>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
