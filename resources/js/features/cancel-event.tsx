import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { X } from "lucide-react";

export function CancelEvent({ event }: { event: any }) {
    console.log(event);
    const { data, setData, patch, processing, reset } = useForm({
        activity_id: event?.activity_id || '',
        reason: '',
        status: 'cancelled'
    });

    const handleCancelEvent = () => {
        patch(route('admin.jail-events.cancel'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
            onError: (errors) => {
                console.error('Error canceling event:', errors);
            }
        });
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            // Reset form when dialog closes
            reset();
        }
    };

    return (
        <Dialog onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-red-600 flex items-center gap-2">
                        <X className="w-5 h-5" />
                        Cancel Event
                    </DialogTitle>
                    <DialogDescription>
                        You are about to cancel the event:
                        <span className="font-semibold text-foreground block mt-1">"{event?.title || ''}"</span>
                        Please provide a reason for cancellation.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="reason" className="text-sm font-medium">
                            Reason for Cancellation *
                        </Label>
                        <Input
                            id="reason"
                            value={data.reason}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('reason', e.target.value)}
                            placeholder="Enter your reason here..."
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            This reason will be recorded with the event cancellation.
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-1">
                    <DialogClose asChild>
                        <Button variant="outline" disabled={processing}>
                            Keep Event
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={handleCancelEvent}
                        disabled={processing || !data.reason.trim()}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        {processing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Canceling...
                            </>
                        ) : (
                            'Confirm Cancellation'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
