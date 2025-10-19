import { Button } from "@/components/ui/button";
import { Court } from "@/types";
import { useForm } from "@inertiajs/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";

export function EditCourt({ court }: { court: Court }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        court_id: court.court_id, // Make sure this is included
        branch_code: court.branch_code,
        branch: court.branch,
        station: court.station,
        court_type: court.court_type,
        location: court.location,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting data:', data);
        put(route('court-list.update', court.court_id), {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Update successful');
                reset();
            },
            onError: (errors) => {
                console.log('Update errors:', errors);
            }
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof typeof data;
        setData(name, e.target.value);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Court</DialogTitle>
                    <DialogDescription>Update court information</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    {/* Add hidden input for court_id */}
                    <input type="hidden" name="court_id" value={data.court_id} />

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
                            {processing ? 'Updating...' : 'Update Court'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
