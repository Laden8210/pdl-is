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
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Calendar, Clock, User, CalendarDays } from 'lucide-react';
import { format, differenceInDays, differenceInYears } from 'date-fns';

interface CustodyManagementProps {
    pdl: any;
}

export function CustodyManagement({ pdl }: CustodyManagementProps) {
    const { props } = usePage<any>();
    const successMessage = props.success;

    console.log('PDL Data in CustodyManagement:', pdl.court_orders[0].admission_date);

    const { data, setData, post, processing, errors, reset } = useForm({
        admission_date: pdl?.court_orders[0]?.admission_date ? format(new Date(pdl.court_orders[0].admission_date), 'yyyy-MM-dd') : '',
        release_date: pdl?.release_date ? format(new Date(pdl.release_date), 'yyyy-MM-dd') : '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.custody.update', pdl.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    const calculateCustodyPeriod = () => {
        if (!data.admission_date) return null;

        const admissionDate = new Date(data.admission_date);
        const releaseDate = data.release_date ? new Date(data.release_date) : new Date();

        const totalDays = differenceInDays(releaseDate, admissionDate);

        // Calculate years as whole number
        const years = Math.floor(totalDays / 365);

        // Calculate remaining days after years
        const remainingDays = totalDays % 365;

        // Calculate months from remaining days
        const months = Math.floor(remainingDays / 30);

        // Calculate remaining days after months
        const days = remainingDays % 30;

        return {
            totalDays,
            years,
            months,
            days,
            formatted: `${years} years ${months} months ${days} days`,
            isReleased: !!data.release_date
        };
    };

    const custodyPeriod = calculateCustodyPeriod();

    const getGctaDefault = (years: number) => {
        if (years >= 1 && years <= 2) return 20;
        if (years >= 3 && years <= 5) return 23;
        if (years >= 6 && years <= 10) return 25;
        if (years >= 11) return 30;
        return 0;
    };

    return (
        <Dialog>
            <Head title="Custody Management" />
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Manage Custody
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <form id="custody-form" onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Custody Management for {pdl.fname} {pdl.lname}
                        </DialogTitle>
                        <DialogDescription>
                            Set admission and release dates to track custody period and calculate time allowances.
                        </DialogDescription>
                    </DialogHeader>

                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-4 mt-4">
                            <AlertTitle>Unable to process request</AlertTitle>
                            <AlertDescription>
                                {Object.values(errors).map((error, index) => (
                                    <ul className="list-inside list-disc text-sm" key={index}>
                                        <li>{String(error)}</li>
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

                    {/* Current Custody Information */}
                    {custodyPeriod && (
                        <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
                            <h3 className="text-sm font-medium text-blue-800 mb-2">Custody Period</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-blue-700">
                                        <strong>Total Days:</strong> {custodyPeriod.totalDays} days
                                    </p>
                                    <p className="text-blue-700">
                                        <strong>Period:</strong> {custodyPeriod.formatted}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-blue-700">
                                        <strong>Status:</strong> {custodyPeriod.isReleased ? 'Released' : 'Currently in custody'}
                                    </p>
                                    <p className="text-blue-700">
                                        <strong>GCTA Default:</strong> {getGctaDefault(custodyPeriod.years)} days/month
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="admission_date">Admission Date</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="admission_date"
                                    name="admission_date"
                                    type="date"
                                    value={data.admission_date}
                                    onChange={(e) => setData('admission_date', e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="release_date">Release Date (Optional)</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="release_date"
                                    name="release_date"
                                    type="date"
                                    value={data.release_date}
                                    onChange={(e) => setData('release_date', e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <p className="text-xs text-gray-500">
                                Leave empty if PDL is still in custody
                            </p>
                        </div>
                    </div>

                    {/* Time Allowance Information */}
                    {custodyPeriod && custodyPeriod.years > 0 && (
                        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                            <h3 className="text-sm font-medium text-gray-800 mb-2">Time Allowance Information</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-700">
                                        <strong>GCTA Eligibility:</strong> {custodyPeriod.years >= 1 ? 'Yes' : 'No'}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Default GCTA:</strong> {getGctaDefault(custodyPeriod.years)} days/month
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-700">
                                        <strong>TASTM Eligibility:</strong> Yes
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Default TASTM:</strong> 15 days/year
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            form="custody-form"
                            className="bg-blue-500 hover:bg-blue-600"
                            disabled={processing}
                        >
                            {processing ? 'Updating...' : 'Update Custody Dates'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
