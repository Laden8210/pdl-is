import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogHeader,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@inertiajs/react";
import { Clock, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

export function RescheduleEvent({ event }: { event: any }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        activity_id: event?.activity_id || '',
        date: event?.start ? format(new Date(event.start), 'yyyy-MM-dd') : '',
        time: event?.start ? format(new Date(event.start), 'HH:mm') : '',
        reason: '',
        status: 'rescheduled'
    });

    const handleReschedule = () => {
        post(route('admin.jail-events.reschedule'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
            onError: (errors) => {
                console.error('Error rescheduling event:', errors);
            }
        });
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            reset();
        }
    };

    return (
        <Dialog onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" >
                    <Clock className="h-4 w-4 mr-1" />
                    Reschedule
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Reschedule Event
                    </DialogTitle>
                    <DialogDescription>
                        Update the date, time, and location for:
                        <span className="font-semibold text-foreground block mt-1">"{event?.title || ''}"</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date" className="text-sm font-medium">
                                Date *
                            </Label>
                            <Input
                                id="date"
                                type="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                className={errors.date ? 'border-red-500' : ''}
                            />
                            {errors.date && (
                                <p className="text-xs text-red-600">{errors.date}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="time" className="text-sm font-medium">
                                Time *
                            </Label>
                            <Input
                                id="time"
                                type="time"
                                value={data.time}
                                onChange={(e) => setData('time', e.target.value)}
                                className={errors.time ? 'border-red-500' : ''}
                            />
                            {errors.time && (
                                <p className="text-xs text-red-600">{errors.time}</p>
                            )}
                        </div>
                    </div>

                    {/* Reason for Reschedule */}
                    <div className="space-y-2">
                        <Label htmlFor="reason" className="text-sm font-medium">
                            Reason for Rescheduling *
                        </Label>
                        <Textarea
                            id="reason"
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            placeholder="Explain why this event needs to be rescheduled..."
                            rows={3}
                            className={errors.reason ? 'border-red-500' : ''}
                        />
                        {errors.reason && (
                            <p className="text-xs text-red-600">{errors.reason}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            This reason will be recorded with the event update.
                        </p>
                    </div>

                    {/* Current Event Details */}
                    <div className="p-3 bg-muted/50 rounded-md text-sm">
                        <h4 className="font-medium mb-2">Current Event Details:</h4>
                        <div className="space-y-1 text-muted-foreground">
                            <div>Date: {event?.start ? format(new Date(event.start), 'MMMM d, yyyy') : 'Not set'}</div>
                            <div>Time: {event?.start ? format(new Date(event.start), 'h:mm a') : 'Not set'}</div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-1">
                    <DialogClose asChild>
                        <Button variant="outline" disabled={processing}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={handleReschedule}
                        disabled={processing || !data.date || !data.time || !data.reason.trim()}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {processing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Updating...
                            </>
                        ) : (
                            'Reschedule Event'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
