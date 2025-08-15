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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Search } from 'lucide-react';
import { useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPdls, setFilteredPdls] = useState<Pdl[]>(pdls || []);

    const { data, setData, post, processing, errors, reset } = useForm({
        activity_name: '',
        activity_date: '',
        activity_time: '',
        category: '',
        pdl_id: '',
    });

    useEffect(() => {
        setFilteredPdls(
            pdls.filter(pdl =>
                `${pdl.fname} ${pdl.lname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pdl.alias?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pdl.id.toString().includes(searchTerm)
            )
        );
    }, [searchTerm, pdls]);

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
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="mt-4">
                    Add Event
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Event</DialogTitle>
                        <DialogDescription>
                            Fill in the details of the event you want to add.
                        </DialogDescription>
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

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="activity_name">Activity Name</Label>
                            <Input
                                id="activity_name"
                                placeholder="Enter activity name"
                                value={data.activity_name}
                                onChange={(e) => setData('activity_name', e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="activity_date">Event Date</Label>
                                <Input
                                    type="date"
                                    id="activity_date"
                                    value={data.activity_date}
                                    onChange={(e) => setData('activity_date', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="activity_time">Event Time</Label>
                                <Input
                                    type="time"
                                    id="activity_time"
                                    value={data.activity_time}
                                    onChange={(e) => setData('activity_time', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Event Category</Label>
                            <select
                                id="category"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                required
                            >
                                <option value="">Select a category</option>
                                <option value="court_hearing">Court Hearing</option>
                                <option value="jail_activity">Jail Activity</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label>Person Involved (PDL)</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search PDLs by name, alias or ID..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="mt-2 max-h-60 overflow-y-auto rounded-md border">
                                <RadioGroup
                                    value={data.pdl_id}
                                    onValueChange={(value) => setData('pdl_id', value)}
                                    required
                                >
                                    {filteredPdls.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-muted-foreground">
                                            No PDLs found matching your search
                                        </div>
                                    ) : (
                                        <div className="divide-y">
                                            {filteredPdls.map((pdl) => (
                                                <label
                                                    key={pdl.id}
                                                    className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer"
                                                >
                                                    <RadioGroupItem value={pdl.id.toString()} />
                                                    <div>
                                                        <div className="font-medium">
                                                            {pdl.fname} {pdl.lname}
                                                            {pdl.alias && ` (${pdl.alias})`}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            ID: {pdl.id} | {pdl.age} years | {pdl.gender}
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </RadioGroup>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 ">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Event'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
