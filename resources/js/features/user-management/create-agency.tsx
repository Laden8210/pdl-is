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
import { useForm } from '@inertiajs/react';

export function CreateAgency() {
    const { data, setData, post, processing, errors } = useForm({
        agency_name: '',
    });

    const createAgency = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent event from bubbling up to parent form
        post(route('agency.create'), {
            preserveScroll: true,
            onSuccess: () => {
                setData('agency_name', '');
            },
        });
    };

    const handleTriggerClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering parent form submission
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleTriggerClick}
                    type="button" // Explicitly set type to button
                >
                    Add Agency
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Agency</DialogTitle>
                    <DialogDescription>Fill in the details to add a new agency.</DialogDescription>
                </DialogHeader>

                <form id="add-agency-form" className="space-y-4" onSubmit={createAgency}>
                    <div>
                        <Label htmlFor="agencyName">Agency Name *</Label>
                        <Input
                            id="agency_name"
                            name="agency_name"
                            value={data.agency_name}
                            onChange={(e) => setData('agency_name', e.target.value)}
                            required
                        />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary" type="button">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" form="add-agency-form" disabled={processing}>
                            {processing ? 'Adding...' : 'Add Agency'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
