import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { useForm, usePage } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

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
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedCount, setSelectedCount] = useState(0);
    const [showActivitySuggestions, setShowActivitySuggestions] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const activitySuggestions = [
        'Court Hearing',
        'Medical',
        'Rehabilitation',
        'Jail Activity/Transfer',
        'Other'
    ];

    const getFilteredActivitySuggestions = () => {
        if (!data.activity_name || data.activity_name.trim() === '') return [];
        return activitySuggestions.filter(suggestion =>
            suggestion.toLowerCase().includes(data.activity_name.toLowerCase())
        );
    };

    const { data, setData, post, processing } = useForm({
        activity_name: '',
        activity_date: '',
        activity_time: '',
        category: '',
        pdl_ids: [] as number[],
    });

    useEffect(() => {
        setFilteredPdls(
            pdls.filter(
                (pdl) =>
                    `${pdl.fname} ${pdl.lname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    pdl.alias?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    pdl.id.toString().includes(searchTerm),
            ),
        );
    }, [searchTerm, pdls]);

    useEffect(() => {
        setSelectedCount(Array.isArray(data.pdl_ids) ? data.pdl_ids.length : 0);
    }, [data.pdl_ids]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Debug: Log the form data being submitted
        console.log('Form data being submitted:', {
            activity_name: data.activity_name,
            activity_date: data.activity_date,
            activity_time: data.activity_time,
            category: data.category,
            pdl_ids: data.pdl_ids,
        });

        post(route('record-officer.jail-events.store'), {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Form submitted successfully');
                setShowSuccess(true);
                setIsDialogOpen(false);
                // Reset form fields
                setData({
                    activity_name: '',
                    activity_date: '',
                    activity_time: '',
                    category: '',
                    pdl_ids: [],
                });
                setSearchTerm('');
                setShowActivitySuggestions(false);
                toast.success('Event created successfully');
            },
            onError: (errors) => {
                console.error('Form submission errors:', errors);
                toast.error('Unable to process request');
            },
        });
    };

    const togglePdlSelection = (pdlId: number) => {
        const currentIds = Array.isArray(data.pdl_ids) ? data.pdl_ids : [];
        setData('pdl_ids', currentIds.includes(pdlId) ? currentIds.filter((id) => id !== pdlId) : [...currentIds, pdlId]);
    };

    const selectAllFiltered = () => {
        const filteredIds = filteredPdls.map((pdl) => pdl.id);
        const currentIds = Array.isArray(data.pdl_ids) ? data.pdl_ids : [];

        // If all filtered are already selected, deselect all
        if (filteredIds.every((id) => currentIds.includes(id))) {
            setData('pdl_ids', currentIds.filter((id) => !filteredIds.includes(id)));
        } else {
            // Otherwise, add all filtered that aren't already selected
            setData('pdl_ids', [...new Set([...currentIds, ...filteredIds])]);
        }
    };

    const { props } = usePage<any>();
    const successMessage = props.success;
    const errors = props.errors || {};

    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    // Reset form when dialog opens
    useEffect(() => {
        if (isDialogOpen) {
            setData({
                activity_name: '',
                activity_date: '',
                activity_time: '',
                category: '',
                pdl_ids: [],
            });
            setSearchTerm('');
            setShowActivitySuggestions(false);
        }
    }, [isDialogOpen]);

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="mt-4">
                    Add Event
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Event</DialogTitle>
                        <DialogDescription>Fill in the details of the event you want to add.</DialogDescription>
                    </DialogHeader>

                    {Object.keys(errors).length > 0 && (
                        <div data-alert-container className="relative">
                            <Alert variant="destructive">
                                <button
                                    type="button"
                                    aria-label="Close"
                                    onClick={(e) => {
                                        const container = (e.currentTarget.closest('[data-alert-container]') as HTMLElement) || undefined;
                                        if (container) container.style.display = 'none';
                                    }}
                                    className="absolute top-2 right-2 rounded p-1 text-lg leading-none hover:bg-muted"
                                >
                                    ×
                                </button>
                                <AlertTitle>Unable to process request</AlertTitle>
                                <AlertDescription>
                                    <ul className="list-inside list-disc space-y-1">
                                        {Object.entries(errors).map(([key, value]) => (
                                            // use toast.error to show the error
                                            toast.error(value as string)
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}

                    {showSuccess && successMessage && (
                        <Alert variant="default" className="relative mb-4">
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{successMessage}</AlertDescription>
                            <button onClick={() => setShowSuccess(false)} className="absolute top-3 right-3">
                                <X className="h-4 w-4" />
                            </button>
                        </Alert>
                    )}

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="activity_name">Activity Name</Label>
                            <div className="relative">
                                <Input
                                    id="activity_name"
                                    placeholder="Type to search activities..."
                                    value={data.activity_name}
                                    onChange={(e) => {
                                        setData('activity_name', e.target.value);
                                        setShowActivitySuggestions(e.target.value.trim() !== '');
                                    }}
                                    onFocus={() => setShowActivitySuggestions(data.activity_name.trim() !== '')}
                                    onBlur={() => {
                                        // Delay hiding suggestions to allow clicking on them
                                        setTimeout(() => setShowActivitySuggestions(false), 200);
                                    }}
                                    required
                                />
                                {showActivitySuggestions && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                        {getFilteredActivitySuggestions().map((suggestion, index) => (
                                            <div
                                                key={index}
                                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                onClick={() => {
                                                    setData('activity_name', suggestion);
                                                    setShowActivitySuggestions(false);
                                                }}
                                            >
                                                {suggestion}
                                            </div>
                                        ))}
                                        {getFilteredActivitySuggestions().length === 0 && data.activity_name && (
                                            <div className="px-3 py-2 text-sm text-gray-500">
                                                No suggestions found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="activity_date">Event Date</Label>
                                <Input
                                    type="date"
                                    id="activity_date"
                                    value={data.activity_date}
                                    onChange={(e) => setData('activity_date', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="activity_time">Event Time</Label>
                                <Input
                                    type="time"
                                    id="activity_time"
                                    value={data.activity_time}
                                    onChange={(e) => setData('activity_time', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Event Category</Label>
                            <select
                                id="category"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                required
                            >
                                <option value="">Select a category</option>

                                <option value="court_hearing">Court Hearing</option>
                                <option value="jail_activity">Jail Activity</option>
                                <option value="medical">Medical</option>

                                <option value="rehabilitation">Rehabilitation</option>
                                <option value="transfer">Transfer</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Persons Involved (PDLs)</Label>
                                <button
                                    type="button"
                                    onClick={selectAllFiltered}
                                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                                >
                                    {filteredPdls.every((pdl) => Array.isArray(data.pdl_ids) && data.pdl_ids.includes(pdl.id)) ? 'Deselect All' : 'Select All'}
                                </button>
                            </div>

                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search PDLs by name, alias or ID..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="mt-2 max-h-60 overflow-y-auto rounded-md border">
                                {filteredPdls.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-muted-foreground">No PDLs found matching your search</div>
                                ) : (
                                    <div className="divide-y">
                                        {filteredPdls.map((pdl) => (
                                            <label key={pdl.id} className="flex cursor-pointer items-center gap-3 p-3 hover:bg-muted/50">
                                                <Checkbox
                                                    checked={Array.isArray(data.pdl_ids) && data.pdl_ids.includes(pdl.id)}
                                                    onCheckedChange={() => togglePdlSelection(pdl.id)}
                                                />
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
                            </div>

                            {selectedCount > 0 && <div className="text-sm text-muted-foreground">Selected: {selectedCount} PDL(s)</div>}
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
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
