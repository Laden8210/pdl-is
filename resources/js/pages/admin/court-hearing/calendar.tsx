import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

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
import {Textarea} from '@/components/ui/textarea';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Calendar() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Calendar" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-semibold">Court Hearings & Jail Activities Calendar</div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="mt-4">
                                Add Event
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Event</DialogTitle>
                                <DialogDescription>Fill in the details of the event you want to add.</DialogDescription>
                            </DialogHeader>

                            <form>
                                <div className="grid gap-4">
                                    <div>
                                        <Label htmlFor="event-title">Activity Name</Label>
                                        <Input id="event-title" placeholder="Enter event title" />
                                    </div>

                                    <div>
                                        <Label htmlFor="event-description">Description</Label>
                                        <Textarea id="event-description" placeholder="Enter event description" rows={3} />
                                    </div>


                                    <div>
                                        <Label htmlFor="event-date">Event Date</Label>
                                        <Input type="date" id="event-date" />
                                    </div>
                                    <div>
                                        <Label htmlFor="event-time">Event Time</Label>
                                        <Input type="time" id="event-time" />
                                    </div>
                                </div>
                            </form>


                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button>Close</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
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
                        events={[
                            {
                                title: 'Court Hearing - Juan Dela Cruz',
                                date: '2025-06-25',
                            },
                            {
                                title: 'Jail Activity - Medical Checkup',
                                start: '2025-06-27T09:00:00',
                                end: '2025-06-27T11:00:00',
                            },
                        ]}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
