'use client';

import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

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
import { usePage } from '@inertiajs/react';

interface Pdl {
    id: number;
    fname: string;
    lname: string;
    alias: string;
    birthdate: string;
    age: number;
    gender: string;
    ethnic_group: string;
    civil_status: string;
    brgy: string;
    city: string;
    province: string;
}

export function EditPersonalInformation({ pdl }: { pdl: Pdl }) {
    const [date, setDate] = useState<Date | undefined>(pdl.birthdate ? new Date(pdl.birthdate) : undefined);

    const { data, setData, put, processing, errors, reset } = useForm({
        fname: pdl.fname,
        lname: pdl.lname,
        alias: pdl.alias ?? '',
        birthdate: pdl.birthdate,
        age: (pdl.age ?? '').toString(),
        gender: pdl.gender ?? '',
        ethnic_group: pdl.ethnic_group ?? '',
        civil_status: pdl.civil_status ?? '',
        brgy: pdl.brgy ?? '',
        city: pdl.city ?? '',
        province: pdl.province ?? '',
    });

    const { props } = usePage();
    const successMessage = (props as any).success;

    useEffect(() => {
        if (date) {
            const formatted = format(date, 'yyyy-MM-dd');
            const age = new Date().getFullYear() - date.getFullYear();
            setData('birthdate', formatted);
            setData('age', age.toString());
        }
    }, [date]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof typeof data;
        setData(name, e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('pdl-management.update', pdl.id), {
            preserveScroll: true,
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Personal Information</DialogTitle>
                    <DialogDescription>Update the details for this personal information record.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mx-auto w-full space-y-4">
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mt-4 mb-4">
                            <AlertTitle>Unable to update record</AlertTitle>
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

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="fname">First Name</Label>
                            <Input id="fname" name="fname" value={data.fname} onChange={handleChange} />
                        </div>
                        <div>
                            <Label htmlFor="lname">Last Name</Label>
                            <Input id="lname" name="lname" value={data.lname} onChange={handleChange} />
                        </div>
                        <div>
                            <Label htmlFor="alias">Alias</Label>
                            <Input id="alias" name="alias" value={data.alias} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Date of Birth</Label>
                            <Input
                                type="date"
                                value={date ? format(date, 'yyyy-MM-dd') : ''}
                                onChange={(e) => setDate(e.target.value ? new Date(e.target.value) : undefined)}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <Label>Gender</Label>
                            <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="ethnic_group">Ethnic Group</Label>
                            <Input id="ethnic_group" name="ethnic_group" value={data.ethnic_group} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Civil Status</Label>
                            <Select value={data.civil_status} onValueChange={(value) => setData('civil_status', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Single">Single</SelectItem>
                                    <SelectItem value="Married">Married</SelectItem>
                                    <SelectItem value="Widowed">Widowed</SelectItem>
                                    <SelectItem value="Divorced">Divorced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="brgy">Barangay</Label>
                            <Input id="brgy" name="brgy" value={data.brgy} onChange={handleChange} />
                        </div>
                        <div>
                            <Label htmlFor="city">City</Label>
                            <Input id="city" name="city" value={data.city} onChange={handleChange} />
                        </div>
                        <div>
                            <Label htmlFor="province">Province</Label>
                            <Input id="province" name="province" value={data.province} onChange={handleChange} />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            Update
                        </Button>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
