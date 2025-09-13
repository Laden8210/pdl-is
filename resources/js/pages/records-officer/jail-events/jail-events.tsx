import AppLayout from '@/layouts/app-layout';
import { PageProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Search } from 'lucide-react';

import CreateEvent from '@/features/court-hearing/create-event';
import { usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { useState } from 'react';

export default function Calendar() {
    const { props } = usePage<PageProps>();
    const { pdls = [], activities = [] } = props;

    const events = activities.map((activity) => ({
        id: activity.activity_id,
        title: activity.activity_name,
        start: `${activity.activity_date}T${activity.activity_time}`,
        extendedProps: {
            description: activity.description || 'No description provided',
            pdl: activity.pdl,
            category: activity.category,
            location: activity.location || 'Not specified',
        },
        backgroundColor: getEventColor(activity.category),
        borderColor: getEventColor(activity.category),
        textColor: '#ffffff',
        className: 'hover:shadow-md transition-shadow duration-200',
    }));

    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [showCreateEvent, setShowCreateEvent] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');

    // Category-based color coding
    function getEventColor(category: string) {
        switch (category.toLowerCase()) {
            case 'court_hearing':
            case 'court hearing':
                return '#3b82f6'; // blue
            case 'medical':
                return '#ef4444'; // red
            case 'visitation':
                return '#10b981'; // green
            case 'rehabilitation':
                return '#f59e0b'; // amber
            case 'transfer':
                return '#8b5cf6'; // violet
            case 'jail_activity':
            case 'jail activity':
                return '#8b5cf6'; // violet for jail activities
            default:
                return '#6b7280'; // gray
        }
    }

    // Handle double click on date to open create event dialog
    const handleDateDoubleClick = (arg: any) => {
        const clickedDate = arg.dateStr;
        setSelectedDate(clickedDate);
        setShowCreateEvent(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Calendar" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Court Hearings & Jail Activities</h1>
                        <p className="text-muted-foreground">Manage and view all scheduled activities. Double-click on a date to add a new event.</p>
                    </div>
                    <CreateEvent pdls={pdls} />
                </div>

                {/* Calendar Legend */}
                <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-[#3b82f6]"></div>
                        <span className="text-xs">Court Hearing</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-[#ef4444]"></div>
                        <span className="text-xs">Medical</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-[#10b981]"></div>
                        <span className="text-xs">Visitation</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-[#f59e0b]"></div>
                        <span className="text-xs">Rehabilitation</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-[#8b5cf6]"></div>
                        <span className="text-xs">Jail Activity/Transfer</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-3 w-3 rounded-full bg-[#6b7280]"></div>
                        <span className="text-xs">Other</span>
                    </div>
                </div>

                {/* Calendar Container */}
                <div className="h-[75vh] w-full rounded-lg border bg-card p-4 shadow-sm">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay listWeek',
                        }}
                        height="100%"
                        selectable={true}
                        editable={true}
                        events={events}
                        eventDisplay="block"
                        eventTimeFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            meridiem: 'short',
                            hour12: true,
                        }}
                        eventClick={(info) => {
                            setSelectedEvent({
                                title: info.event.title,
                                start: info.event.start,
                                description: info.event.extendedProps.description,
                                pdl: info.event.extendedProps.pdl,
                                category: info.event.extendedProps.category,
                                location: info.event.extendedProps.location,
                            });
                        }}
                        dateClick={handleDateDoubleClick} // Handle single click if needed
                        dayHeaderClassNames="font-medium"
                        dayCellClassNames="hover:bg-muted/50 cursor-pointer"
                        nowIndicator
                        slotMinTime="06:00:00"
                        slotMaxTime="20:00:00"
                    />
                </div>
            </div>

            {/* Event Details Dialog */}
            <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">{selectedEvent?.title}</DialogTitle>
                        <div className="flex gap-2">
                            <Badge
                                variant="outline"
                                className="border-0 text-white"
                                style={{
                                    backgroundColor: getEventColor(selectedEvent?.category || ''),
                                }}
                            >
                                {selectedEvent?.category}
                            </Badge>
                        </div>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                                <p>{selectedEvent?.start && format(selectedEvent.start, 'MMMM d, yyyy')}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Time</h3>
                                <p>{selectedEvent?.start && format(selectedEvent.start, 'h:mm a')}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                            <p>{selectedEvent?.location || 'Not specified'}</p>
                        </div>

                        {selectedEvent?.pdl && (
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Person Deprived of Liberty</h3>
                                <p>
                                    {selectedEvent.pdl.fname} {selectedEvent.pdl.lname}
                                </p>
                            </div>
                        )}

                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                            <p
                                className="rounded-md p-2 whitespace-pre-line"
                                style={{
                                    backgroundColor: `${getEventColor(selectedEvent?.category || '')}20`,
                                    borderLeft: `4px solid ${getEventColor(selectedEvent?.category || '')}`,
                                }}
                            >
                                {selectedEvent?.description || 'No description provided'}
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Create Event Dialog (triggered by double-click) */}
            <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add New Event for {selectedDate && format(new Date(selectedDate), 'MMMM d, yyyy')}</DialogTitle>
                        <DialogDescription>Fill in the details of the event you want to add.</DialogDescription>
                    </DialogHeader>

                    {/* We'll create a simplified version of the CreateEvent form for this modal */}
                    <SimpleEventForm pdls={pdls} preselectedDate={selectedDate} onSuccess={() => setShowCreateEvent(false)} />
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

// Simple Event Form Component for the double-click functionality
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

function SimpleEventForm({ pdls, preselectedDate, onSuccess }: { pdls: any[]; preselectedDate: string; onSuccess: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        activity_name: '',
        activity_date: preselectedDate,
        activity_time: '09:00',
        category: '',
        pdl_ids: [] as number[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('jail-events.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onSuccess();
            },
        });
    };
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPdls, setFilteredPdls] = useState<Pdl[]>(pdls || []);
    const [selectedCount, setSelectedCount] = useState(0);
    const selectAllFiltered = () => {
        const filteredIds = filteredPdls.map((pdl) => pdl.id);
        setData('pdl_ids', (prev) => {
            // If all filtered are already selected, deselect all
            if (filteredIds.every((id) => prev.includes(id))) {
                return prev.filter((id) => !filteredIds.includes(id));
            }
            // Otherwise, add all filtered that aren't already selected
            return [...new Set([...prev, ...filteredIds])];
        });
    };

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
        setSelectedCount(data.pdl_ids.length);
    }, [data.pdl_ids]);
    const togglePdlSelection = (pdlId: number) => {
        setData('pdl_ids', data.pdl_ids.includes(pdlId) ? data.pdl_ids.filter((id) => id !== pdlId) : [...data.pdl_ids, pdlId]);
    };

    return (
        <form onSubmit={handleSubmit}>
            {Object.keys(errors).length > 0 && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        <ul className="list-inside list-disc">
                            {Object.entries(errors).map(([key, value]) => (
                                <li key={key}>{value}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <label htmlFor="activity_name" className="text-sm font-medium">
                        Activity Name
                    </label>
                    <input
                        id="activity_name"
                        placeholder="Enter activity name"
                        value={data.activity_name}
                        onChange={(e) => setData('activity_name', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="activity_date" className="text-sm font-medium">
                            Event Date
                        </label>
                        <input
                            type="date"
                            id="activity_date"
                            value={data.activity_date}
                            onChange={(e) => setData('activity_date', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="activity_time" className="text-sm font-medium">
                            Event Time
                        </label>
                        <input
                            type="time"
                            id="activity_time"
                            value={data.activity_time}
                            onChange={(e) => setData('activity_time', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                        Event Category
                    </label>
                    <select
                        id="category"
                        value={data.category}
                        onChange={(e) => setData('category', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        required
                    >
                        <option value="">Select a category</option>
                        <option value="court_hearing">Court Hearing</option>
                        <option value="jail_activity">Jail Activity</option>
                        <option value="medical">Medical</option>
                        <option value="visitation">Visitation</option>
                        <option value="rehabilitation">Rehabilitation</option>
                        <option value="transfer">Transfer</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Persons Involved (PDLs)</Label>
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
                                    <Checkbox checked={data.pdl_ids.includes(pdl.id)} onCheckedChange={() => togglePdlSelection(pdl.id)} />
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

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={() => onSuccess()}
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                    {processing ? 'Creating...' : 'Create Event'}
                </button>
            </div>
        </form>
    );
}
