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

import { useForm, usePage } from '@inertiajs/react';

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

export default function CreateEvent({ pdls }: { pdls: Pdl[] }) {
    console.log(pdls);
    const { data, setData, post, processing, errors, reset } = useForm({
        activity_name: '',
        activity_date: '',
        activity_time: '',
        category: '',
        pdl_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('jail-events.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    const { props } = usePage<{ success?: string }>();

    const successMessage = props.success;

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="mt-4">
                        Add Event
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Add New Event</DialogTitle>
                            <DialogDescription>Fill in the details of the event you want to add.</DialogDescription>
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

                        <div className="grid gap-4">
                            <div>
                                <Label htmlFor="event-title">Activity Name</Label>
                                <Input
                                    id="event-title"
                                    placeholder="Enter event title"
                                    value={data.activity_name}
                                    onChange={(e) => setData('activity_name', e.target.value)}
                                />
                            </div>


                            <div>
                                <Label htmlFor="event-date">Event Date</Label>
                                <Input type="date" id="event-date" value={data.activity_date} onChange={(e) => setData('activity_date', e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="event-time">Event Time</Label>
                                <Input type="time" id="event-time" value={data.activity_time} onChange={(e) => setData('activity_time', e.target.value)} />
                            </div>

                            <div>
                                <Label htmlFor="event-category">Event Category</Label>
                                <Select value={data.category} onValueChange={(value) => setData('category', value)} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="court_hearing">Court Hearing</SelectItem>
                                        <SelectItem value="jail_activity">Jail Activity</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="event-pdl">Person Involved</Label>
                                <Label>PDL (Person Deprived of Liberty)</Label>
                                <Select value={data.pdl_id} onValueChange={(value) => setData('pdl_id', value)} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a PDL" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        { pdls === null || pdls.length === 0 ? (
                                            <SelectItem value="" disabled>
                                                No PDLs available
                                            </SelectItem>
                                        ) : (
                                            pdls.map((pdl) => (
                                                <SelectItem key={pdl.id} value={pdl.id.toString()}>
                                                    {pdl.fname} {pdl.lname} (ID: {pdl.id})
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <DialogFooter className="py-2">
                            <DialogClose asChild>
                                <Button variant="destructive">Close</Button>
                            </DialogClose>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Event'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
