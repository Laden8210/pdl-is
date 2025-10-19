import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "@inertiajs/react";

export function CreateCourt() {
    const { data, setData, post, processing, errors, reset } = useForm({
        branch_code: '',
        branch: '',
        station: '',
        court_type: '',
        location: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('court-list.create'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof typeof data;
        setData(name, e.target.value);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Create Court</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Court</DialogTitle>
                    <DialogDescription>Create a new court</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="branch_code">Branch Code</Label>
                            <Input
                                id="branch_code"
                                name="branch_code"
                                value={data.branch_code}
                                onChange={handleChange}
                                required
                            />
                            {errors.branch_code && (
                                <p className="text-sm text-red-600 mt-1">{errors.branch_code}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="branch">Branch</Label>
                            <Input
                                id="branch"
                                name="branch"
                                value={data.branch}
                                onChange={handleChange}
                                required
                            />
                            {errors.branch && (
                                <p className="text-sm text-red-600 mt-1">{errors.branch}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="station">Station</Label>
                            <Input
                                id="station"
                                name="station"
                                value={data.station}
                                onChange={handleChange}
                                required
                            />
                            {errors.station && (
                                <p className="text-sm text-red-600 mt-1">{errors.station}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="court_type">Court Type</Label>
                            <Input
                                id="court_type"
                                name="court_type"
                                value={data.court_type}
                                onChange={handleChange}
                                required
                            />
                            {errors.court_type && (
                                <p className="text-sm text-red-600 mt-1">{errors.court_type}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                name="location"
                                value={data.location}
                                onChange={handleChange}
                                required
                            />
                            {errors.location && (
                                <p className="text-sm text-red-600 mt-1">{errors.location}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button type="button" variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
