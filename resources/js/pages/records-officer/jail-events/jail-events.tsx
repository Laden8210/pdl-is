import AppLayout from '@/layouts/app-layout';
import { PageProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

import CreateEvent from '@/features/court-hearing/create-event';
import { usePage } from '@inertiajs/react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';

export default function Calendar() {
    const { props } = usePage<PageProps>();
    const { pdls = [], activities = [] } = props;

    // Transform activities to FullCalendar events
    const events = activities.map(activity => ({
        id: activity.activity_id,
        title: activity.activity_name,
        start: `${activity.activity_date}T${activity.activity_time}`,
        extendedProps: {
            description: activity.category,
            pdl: activity.pdl,
        }
    }));

    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Calendar" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-semibold">Court Hearings & Jail Activities Calendar</div>
                    <CreateEvent pdls={pdls} />
                </div>

                <div className="h-[80vh] w-full">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay',
                        }}
                        height="100%"
                        selectable={true}
                        editable={true}
                        events={events}  // Use transformed events
                        eventClick={(info) => {
                            setSelectedEvent({
                                title: info.event.title,
                                start: info.event.start,
                                description: info.event.extendedProps.description,
                                pdl: info.event.extendedProps.pdl,
                            });
                        }}
                    />
                </div>
            </div>

            {/* Event Details Dialog */}
            <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedEvent?.title}</DialogTitle>
                        <DialogDescription>
                            <p>
                                <strong>Date:</strong> {selectedEvent?.start?.toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Time:</strong> {selectedEvent?.start?.toLocaleTimeString()}
                            </p>
                            <p>
                                <strong>Category:</strong> {selectedEvent?.description}
                            </p>
                            <p>
                                <strong>PDL:</strong> {selectedEvent?.pdl?.fname} {selectedEvent?.pdl?.lname}
                            </p>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
