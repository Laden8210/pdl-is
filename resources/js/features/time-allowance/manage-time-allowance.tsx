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

interface ManageTimeAllowanceProps {
    pdl: any;
    gctaDays: number;
    tastmDays: number;
}

export function ManageTimeAllowance({ pdl, gctaDays, tastmDays }: ManageTimeAllowanceProps) {
    const { props } = usePage<any>();
    const successMessage = props.success;

    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'gcta',
        days: 0,
        reason: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('time-allowance.update', pdl.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
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
                        <DialogTitle>Manage Time Allowance for {pdl.fname} {pdl.lname}</DialogTitle>
                        <DialogDescription>
                            Add time allowance days for Good Conduct Time Allowance (GCTA) or Time Allowance for Study, Teaching and Mentoring (TASTM).
                        </DialogDescription>
                    </DialogHeader>

                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-4 mt-4">
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

                    <div className="grid grid-cols-2 gap-4 mb-4 py-2">
                        <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                            <h3 className="text-sm font-medium text-blue-800">Current GCTA Days</h3>
                            <p className="text-2xl font-bold text-blue-900">{gctaDays}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-md border border-green-200">
                            <h3 className="text-sm font-medium text-green-800">Current TASTM Days</h3>
                            <p className="text-2xl font-bold text-green-900">{tastmDays}</p>
                        </div>
                    </div>

                    <div className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Allowance Type</Label>
                            <Select
                                value={data.type}
                                onValueChange={(value: 'gcta' | 'tastm') => setData('type', value)}
                                required
                            >
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
                            <Input
                                id="days"
                                name="days"
                                type="number"
                                min="0"
                                value={data.days}
                                onChange={(e) => setData('days', parseInt(e.target.value) || 0)}
                                required
                            />
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
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            form="time-allowance-form"
                            className="bg-blue-500 hover:bg-blue-600"
                            disabled={processing}
                        >
                            {processing ? 'Adding...' : 'Add Allowance'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
