'use client';

import { useForm } from '@inertiajs/react';

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

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormEventHandler } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
type Props = {
    cell: {
        cell_id: number;
        cell_name: string;
        capacity: number;
        gender: 'male' | 'female';
        description: string;
        status: string;
    };
};

export function UpdateCellInformation({ cell }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        cell_id: cell.cell_id,
        cell_name: cell.cell_name,
        capacity: cell.capacity.toString(),
        gender: cell.gender,
        description: cell.description ?? '',
        status: cell.status,
    });

    const { props } = usePage<PageProps>();

    const successMessage = props.success;


    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('cell.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Update Cell</DialogTitle>
                    <DialogDescription>Modify the cell information and save changes.</DialogDescription>
                </DialogHeader>

                {Object.keys(errors).length > 0 && (
                    <Alert variant="destructive" className="mb-4">
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
                    <Alert variant="default" className="mb-4">
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="mx-auto w-full space-y-4">
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

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="cell_name">Cell Name</Label>
                            <Input id="cell_name" name="cell_name" value={data.cell_name}
                            onChange={(e) => setData('cell_name', e.target.value)} />
                        </div>

                        <div>
                            <Label htmlFor="capacity">Capacity</Label>
                            <Input id="capacity" name="capacity" type="number" value={data.capacity} onChange={(e) => setData('capacity', e.target.value)} />
                        </div>

                        <div>
                            <Label>Gender</Label>
                            <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Status</Label>
                            <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" name="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
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
