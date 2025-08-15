import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Personnel } from './user-columns';
import { Archive } from 'lucide-react';

interface DeleteUserProps {
    user: Personnel;
}

export function DeleteUser({ user }: DeleteUserProps) {
    const { props } = usePage<PageProps>();
    const successMessage = props.success;

    const { delete: destroy, processing, errors } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('user-management.destroy', user.id), {
            preserveScroll: true,
            onSuccess: () => {},
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button onSelect={(e) => e.preventDefault()} className=" hover:bg-red-400" variant="outline">
                    <Archive />
                    Archive
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form id="delete-user-form" onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to archive {user.fname} {user.lname}?
                        </DialogDescription>
                    </DialogHeader>

                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mt-4 mb-4">
                            <AlertTitle>Unable to process request</AlertTitle>
                            <AlertDescription>
                                {Object.values(errors).map((error, index) => (
                                    <ul className="list-inside list-disc text-sm" key={index}>
                                        <li>{error}</li>
                                    </ul>
                                ))}
                            </AlertDescription>
                        </Alert>
                    )}

                    {successMessage && (
                        <Alert variant="default" className="mb-4">
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{successMessage}</AlertDescription>
                        </Alert>
                    )}

                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">This action cannot be undone. This will permanently delete the user account.</p>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" form="delete-user-form" variant="destructive" disabled={processing}>
                            {processing ? 'Deleting...' : 'Delete User'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
