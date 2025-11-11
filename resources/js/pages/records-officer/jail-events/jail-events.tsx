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
import { Calendar as CalendarIcon, Search, Tag, User, X } from 'lucide-react';

import { CancelEvent } from '@/features/cancel-event';
import CreateEvent from '@/features/court-hearing/create-event';
import { RescheduleEvent } from '@/features/reschedule-event';
import { usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function Calendar() {
    const { props } = usePage<PageProps>();
    const { pdls = [], activities = [] } = props;
    const calendarRef = useRef<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [highlightedEvents, setHighlightedEvents] = useState<Set<string>>(new Set());
    const [highlightedDates, setHighlightedDates] = useState<Set<string>>(new Set());
    const searchInputRef = useRef<HTMLInputElement>(null);

    const searchSuggestions = useMemo(() => {
        const suggestions: { type: 'pdl' | 'event' | 'category'; value: string; label: string }[] = [];


        const pdlNames = new Set<string>();
        activities.forEach((activity) => {
            if (activity.pdls) {
                activity.pdls.forEach((pdl: any) => {
                    const fullName = `${pdl.fname} ${pdl.lname}`;
                    pdlNames.add(fullName);
                });
            }
        });
        pdlNames.forEach((name) => {
            suggestions.push({
                type: 'pdl',
                value: name,
                label: name,
            });
        });

        const eventNames = new Set<string>();
        activities.forEach((activity) => {
            eventNames.add(activity.activity_name);
        });
        eventNames.forEach((eventName) => {
            suggestions.push({
                type: 'event',
                value: eventName,
                label: eventName,
            });
        });


        const categories = new Set<string>();
        activities.forEach((activity) => {
            categories.add(activity.category);
        });
        categories.forEach((category) => {
            suggestions.push({
                type: 'category',
                value: category,
                label: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '),
            });
        });

        return suggestions;
    }, [activities]);


    const filteredSuggestions = useMemo(() => {
        if (!searchTerm.trim()) {
            return searchSuggestions.slice(0, 10);
        }

        const searchLower = searchTerm.toLowerCase();
        return searchSuggestions
            .filter((suggestion) => suggestion.value.toLowerCase().includes(searchLower) || suggestion.label.toLowerCase().includes(searchLower))
            .slice(0, 10); // Limit to 10 results
    }, [searchTerm, searchSuggestions]);


    const events = useMemo(() => {
        return activities.map((activity) => {

            const pdlNames = activity.pdls
                ? activity.pdls.map((pdl: any) => `${pdl.fname} ${pdl.lname}`).join(', ')
                : activity.pdl
                  ? `${activity.pdl.fname} ${activity.pdl.lname}`
                  : 'Unknown PDL';


            const searchableText = [activity.activity_name, pdlNames, activity.category, activity.description || '', activity.reason || '']
                .join(' ')
                .toLowerCase();

            return {
                id: activity.activity_id,
                title: `${activity.activity_name} (${activity.pdls?.length || 1} PDL${(activity.pdls?.length || 1) > 1 ? 's' : ''})`,
                start: `${activity.activity_date}T${activity.activity_time}`,
                extendedProps: {
                    description: activity.description || 'No description provided',
                    pdl: activity.pdl,
                    pdls: activity.pdls || [],
                    pdlNames: pdlNames,
                    category: activity.category,
                    reason: activity.reason || 'No reason provided',
                    searchableText: searchableText,
                },
                backgroundColor: getEventColor(activity.category),
                borderColor: getEventColor(activity.category),
                status: activity.status,
                textColor: '#ffffff',
                className: 'hover:shadow-md transition-shadow duration-200',
            };
        });
    }, [activities]);


    const filteredEvents = useMemo(() => {
        if (!searchTerm.trim()) {
            return events;
        }

        const searchLower = searchTerm.toLowerCase();
        return events.filter((event) => event.extendedProps.searchableText.includes(searchLower));
    }, [events, searchTerm]);


    useEffect(() => {
        if (!searchTerm.trim()) {
            setHighlightedEvents(new Set());
            setHighlightedDates(new Set());
            return;
        }

        const searchLower = searchTerm.toLowerCase();
        const newHighlightedEvents = new Set<string>();
        const newHighlightedDates = new Set<string>();

        events.forEach((event) => {
            if (event.extendedProps.searchableText.includes(searchLower)) {
                newHighlightedEvents.add(event.id);

                const dateStr = event.start.toString().split('T')[0];
                newHighlightedDates.add(dateStr);
            }
        });

        setHighlightedEvents(newHighlightedEvents);
        setHighlightedDates(newHighlightedDates);


        if (calendarRef.current) {
            calendarRef.current.getApi().refetchEvents();
        }
    }, [searchTerm, events]);


    const eventContent = (arg: any) => {
        const isHighlighted = highlightedEvents.has(arg.event.id);

        return {
            html: `
                <div class="fc-event-main-frame ${isHighlighted ? 'highlighted-event' : ''}">
                    <div class="fc-event-title-container">
                        <div class="fc-event-title fc-sticky">
                            ${arg.event.title}
                        </div>
                    </div>
                </div>
            `,
        };
    };


    const dayCellContent = (arg: any) => {

        return {
            html: `<div class="fc-daygrid-day-number">${arg.dayNumberText}</div>`,
        };
    };

    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [showCreateEvent, setShowCreateEvent] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');


    function getEventColor(category: string) {
        switch (category.toLowerCase()) {
            case 'court_hearing':
            case 'court hearing':
                return '#3b82f6';
            case 'medical':
                return '#ef4444';
            case 'rehabilitation':
                return '#f59e0b';
            case 'transfer':
                return '#8b5cf6';
            case 'jail_activity':
            case 'jail activity':
                return '#8b5cf6';
            default:
                return '#6b7280';
        }
    }

    function getStatusColor(status: string) {
        switch (status.toLowerCase()) {
            case 'pending':
                return '#f59e0b';
            case 'completed':
                return '#3b82f6';
            case 'cancelled':
                return '#ef4444';
            case 'rescheduled':
                return '#f59e0b';
            default:
                return '#6b7280';
        }
    }


    const handleDateDoubleClick = (arg: any) => {
        const clickedDate = arg.dateStr;
        setSelectedDate(clickedDate);
        setShowCreateEvent(true);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setShowSuggestions(false);
    };

    const handleSuggestionClick = (suggestion: { type: string; value: string }) => {
        setSearchTerm(suggestion.value);
        setShowSuggestions(false);
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setShowSuggestions(true);
    };


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getSuggestionIcon = (type: string) => {
        switch (type) {
            case 'pdl':
                return <User className="h-4 w-4 text-blue-500" />;
            case 'event':
                return <CalendarIcon className="h-4 w-4 text-green-500" />;
            case 'category':
                return <Tag className="h-4 w-4 text-purple-500" />;
            default:
                return <Search className="h-4 w-4 text-gray-500" />;
        }
    };

    const getSuggestionTypeLabel = (type: string) => {
        switch (type) {
            case 'pdl':
                return 'PDL';
            case 'event':
                return 'Event';
            case 'category':
                return 'Category';
            default:
                return type;
        }
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

                {/* Search Bar with Suggestions */}
                <div className="flex items-center gap-4">
                    <div className="relative max-w-md flex-1" ref={searchInputRef}>
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            ref={searchInputRef}
                            placeholder="Search by PDL name, event, or category..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            onFocus={() => setShowSuggestions(true)}
                            className="pr-9 pl-9"
                        />
                        {searchTerm && (
                            <button
                                onClick={clearSearch}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}

                        {/* Search Suggestions Dropdown */}
                        {showSuggestions && filteredSuggestions.length > 0 && (
                            <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
                                <div className="p-2">
                                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                                        Suggestions ({filteredSuggestions.length})
                                    </div>
                                    {filteredSuggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            className="flex w-full items-center gap-3 rounded-sm px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                        >
                                            {getSuggestionIcon(suggestion.type)}
                                            <div className="flex flex-1 flex-col items-start">
                                                <span className="font-medium">{suggestion.label}</span>
                                                <span className="text-xs text-muted-foreground capitalize">
                                                    {getSuggestionTypeLabel(suggestion.type)}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* No results message */}
                        {showSuggestions && searchTerm && filteredSuggestions.length === 0 && (
                            <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-4 text-sm text-muted-foreground shadow-md">
                                No results found for "{searchTerm}"
                            </div>
                        )}
                    </div>

                    {/* Search Results Counter */}
                    {searchTerm && (
                        <div className="text-sm text-muted-foreground">
                            {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
                        </div>
                    )}
                </div>

                {/* Quick Search Chips */}
                {!searchTerm && (
                    <div className="flex flex-wrap gap-2">
                        <div className="text-sm text-muted-foreground">Quick search:</div>
                        {searchSuggestions.slice(0, 8).map((suggestion, index) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="cursor-pointer hover:bg-accent"
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                {getSuggestionIcon(suggestion.type)}
                                <span className="ml-1">{suggestion.label}</span>
                            </Badge>
                        ))}
                    </div>
                )}

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
                    {searchTerm && (
                        <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full border-2 border-yellow-600 bg-yellow-400"></div>
                            <span className="text-xs">Search Match</span>
                        </div>
                    )}
                </div>

                {/* Calendar Container */}
                <div className="h-[75vh] w-full rounded-lg border bg-card p-4 shadow-sm">
                    <FullCalendar
                        ref={calendarRef}
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
                        events={filteredEvents}
                        eventDisplay="block"
                        eventContent={eventContent}
                        dayCellContent={dayCellContent}
                        eventTimeFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            meridiem: 'short',
                            hour12: true,
                        }}
                        eventClick={(info) => {
                            setSelectedEvent({
                                activity_id: info.event.id,
                                title: info.event.title,
                                start: info.event.start,
                                description: info.event.extendedProps.description,
                                pdl: info.event.extendedProps.pdl,
                                pdls: info.event.extendedProps.pdls,
                                pdlNames: info.event.extendedProps.pdlNames,
                                category: info.event.extendedProps.category,
                                status: info.event.extendedProps.status,
                                reason: info.event.extendedProps.reason,
                            });
                        }}
                        dateClick={handleDateDoubleClick}
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
                            <Badge
                                variant="outline"
                                className="border-0 text-white"
                                style={{
                                    backgroundColor: getStatusColor(selectedEvent?.status || ''),
                                }}
                            >
                                {selectedEvent?.status}
                            </Badge>
                        </div>
                        <div className="grid gap-4 py-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Reason</h3>
                            <p>{selectedEvent?.reason || 'No reason provided'}</p>
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

                        {selectedEvent?.pdls && selectedEvent.pdls.length > 0 && (
                            <div>
                                <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                                    Person{selectedEvent.pdls.length > 1 ? 's' : ''} Deprived of Liberty
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {selectedEvent.pdls.map((pdl: any, index: number) => (
                                        <div key={index} className="flex items-center space-x-2 text-sm">
                                            <span className="text-muted-foreground">•</span>
                                            <span>
                                                {pdl.fname} {pdl.lname}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <CancelEvent event={selectedEvent} />
                        <RescheduleEvent event={selectedEvent} />
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Event Dialog */}
            <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add New Event for {selectedDate && format(new Date(selectedDate), 'MMMM d, yyyy')}</DialogTitle>
                        <DialogDescription>Fill in the details of the event you want to add.</DialogDescription>
                    </DialogHeader>
                    <SimpleEventForm pdls={pdls} preselectedDate={selectedDate} onSuccess={() => setShowCreateEvent(false)} />
                </DialogContent>
            </Dialog>

            {/* Custom CSS for highlighting */}
            <style>{`
                .highlighted-event {
                    border: 3px solid #f59e0b !important;
                    box-shadow: 0 0 0 2px #f59e0b, 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
                    transform: scale(1.02);
                    z-index: 1000;
                }

                .highlighted-date {
                    background: linear-gradient(45deg, #fef3c7, #f59e0b) !important;
                    border-radius: 4px;
                    margin: -2px;
                    padding: 2px;
                }

                .highlighted-date .fc-daygrid-day-number {
                    font-weight: bold;
                    color: #92400e;
                }

                .fc-daygrid-day.highlighted-date-cell {
                    background-color: #fef3c7 !important;
                }
            `}</style>
        </AppLayout>
    );
}
// Simple Event Form Component for the double-click functionality
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useForm } from '@inertiajs/react';

function SimpleEventForm({ pdls, preselectedDate, onSuccess }: { pdls: any[]; preselectedDate: string; onSuccess: () => void }) {
    const [showSuggestions, setShowSuggestions] = useState(false);

    const activitySuggestions = ['Court Hearing', 'Medical', 'Visitation', 'Rehabilitation', 'Jail Activity/Transfer', 'Other'];

    const getFilteredSuggestions = () => {
        if (!data.activity_name || data.activity_name.trim() === '') return [];
        return activitySuggestions.filter((suggestion) => suggestion.toLowerCase().includes(data.activity_name.toLowerCase()));
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        activity_name: '',
        activity_date: preselectedDate,
        activity_time: '09:00',
        category: '',
        pdl_ids: [] as number[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('record-officer.jail-events.store'), {
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
        const currentIds = Array.isArray(data.pdl_ids) ? data.pdl_ids : [];

        // If all filtered are already selected, deselect all
        if (filteredIds.every((id) => currentIds.includes(id))) {
            setData(
                'pdl_ids',
                currentIds.filter((id) => !filteredIds.includes(id)),
            );
        } else {
            // Otherwise, add all filtered that aren't already selected
            setData('pdl_ids', [...new Set([...currentIds, ...filteredIds])]);
        }
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
        setSelectedCount(Array.isArray(data.pdl_ids) ? data.pdl_ids.length : 0);
    }, [data.pdl_ids]);

    const togglePdlSelection = (pdlId: number) => {
        const currentIds = Array.isArray(data.pdl_ids) ? data.pdl_ids : [];
        setData('pdl_ids', currentIds.includes(pdlId) ? currentIds.filter((id) => id !== pdlId) : [...currentIds, pdlId]);
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
                    <div className="relative">
                        <input
                            id="activity_name"
                            placeholder="Type to search activities..."
                            value={data.activity_name}
                            onChange={(e) => {
                                setData('activity_name', e.target.value);
                                setShowSuggestions(e.target.value.trim() !== '');
                            }}
                            onFocus={() => setShowSuggestions(data.activity_name.trim() !== '')}
                            onBlur={() => {
                                // Delay hiding suggestions to allow clicking on them
                                setTimeout(() => setShowSuggestions(false), 200);
                            }}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        />
                        {showSuggestions && (
                            <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                                {getFilteredSuggestions().map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
                                        onClick={() => {
                                            setData('activity_name', suggestion);
                                            setShowSuggestions(false);
                                        }}
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                                {getFilteredSuggestions().length === 0 && data.activity_name && (
                                    <div className="px-3 py-2 text-sm text-gray-500">No suggestions found</div>
                                )}
                            </div>
                        )}
                    </div>
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
                    <button type="button" onClick={selectAllFiltered} className="text-sm text-blue-600 underline hover:text-blue-800">
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
