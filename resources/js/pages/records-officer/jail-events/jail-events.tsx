import AppLayout from '@/layouts/app-layout';
import { PageProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

import CreateEvent from '@/features/court-hearing/create-event';
import { usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { format } from 'date-fns';

export default function Calendar() {
    const { props } = usePage<PageProps>();
    const { pdls = [], activities = [] } = props;

    // Transform activities to FullCalendar events with category-based styling
    const events = activities.map(activity => ({
        id: activity.activity_id,
        title: activity.activity_name,
        start: `${activity.activity_date}T${activity.activity_time}`,
        extendedProps: {
            description: activity.description || 'No description provided',
            pdl: activity.pdl,
            category: activity.category,
            location: activity.location || 'Not specified'
        },
        backgroundColor: getEventColor(activity.category),
        borderColor: getEventColor(activity.category),
        textColor: '#ffffff',
        className: 'hover:shadow-md transition-shadow duration-200'
    }));

    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    // Category-based color coding
    function getEventColor(category: string) {
        switch (category.toLowerCase()) {
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
            default:
                return '#6b7280'; // gray
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Calendar" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Court Hearings & Jail Activities</h1>
                        <p className="text-muted-foreground">
                            Manage and view all scheduled activities
                        </p>
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
                        <span className="text-xs">Transfer</span>
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
                            hour12: true
                        }}
                        eventClick={(info) => {
                            setSelectedEvent({
                                title: info.event.title,
                                start: info.event.start,
                                description: info.event.extendedProps.description,
                                pdl: info.event.extendedProps.pdl,
                                category: info.event.extendedProps.category,
                                location: info.event.extendedProps.location
                            });
                        }}
                        dayHeaderClassNames="font-medium"
                        dayCellClassNames="hover:bg-muted/50"
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
                            <Badge variant="outline" className="border-blue-500 text-blue-500">
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
                                <p>{selectedEvent.pdl.fname} {selectedEvent.pdl.lname}</p>
                            </div>
                        )}

                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                            <p className="whitespace-pre-line">
                                {selectedEvent?.description || 'No description provided'}
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
