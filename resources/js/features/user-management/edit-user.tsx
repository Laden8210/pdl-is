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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { FormEventHandler, useEffect, useRef } from 'react';
import { Personnel } from './user-columns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
interface EditUserProps {
    user: Personnel;
}

export function EditUser({ user }: EditUserProps) {
    const avatarRef = useRef<HTMLInputElement>(null);
    const { props } = usePage<PageProps>();
    const successMessage = props.success;

    const { data, setData, put, processing, errors } = useForm({
        firstName: user.fname,
        middleName: user.mname || '',
        lastName: user.lname,
        contactNumber: user.contactnum,
        avatar: null as File | null,
        username: user.username,
        password: '',
        position: user.position,
        agency: user.agency,
    });

    useEffect(() => {
        setData({
            firstName: user.fname,
            middleName: user.mname || '',
            lastName: user.lname,
            contactNumber: user.contactnum,
            avatar: null,
            username: user.username,
            password: '',
            position: user.position,
            agency: user.agency,
        });
    }, [user]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('user-management.update', user.id), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                // Clear password field after successful update
                setData('password', '');
            },
        });
    };

    return (
        <Dialog>
            <Head title="Edit User" />

            <DialogTrigger asChild>
                <Button variant="outline" className="text-start">
                    <Pencil />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <form id="edit-user-form" onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>Update the user details below.</DialogDescription>
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

                    <div className="grid grid-cols-3 gap-4 py-2">
                        <div className="col-span-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={data.firstName}
                                onChange={(e) => setData('firstName', e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="middleName">Middle Name</Label>
                            <Input
                                id="middleName"
                                name="middleName"
                                value={data.middleName}
                                onChange={(e) => setData('middleName', e.target.value)}
                            />
                        </div>

                        <div className="col-span-3">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={data.lastName}
                                onChange={(e) => setData('lastName', e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-span-3">
                            <Label htmlFor="contactNumber">Contact Number</Label>
                            <Input
                                id="contactNumber"
                                name="contactNumber"
                                value={data.contactNumber}
                                onChange={(e) => setData('contactNumber', e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-span-3">
                            <Label htmlFor="avatar">Avatar</Label>
                            <div className="flex items-center gap-4">
                                {user.avatar && (
                                    <img src={`/storage/${user.avatar}`} alt="Current avatar" className="h-12 w-12 rounded-full object-cover" />
                                )}
                                <Input
                                    id="avatar"
                                    name="avatar"
                                    type="file"
                                    ref={avatarRef}
                                    onChange={(e) => setData('avatar', e.target.files?.[0] ?? null)}
                                    accept="image/*"
                                />
                            </div>
                        </div>

                        <div className="col-span-3">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-span-3">
                            <Label htmlFor="password">Password (leave blank to keep current)</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Leave blank to keep current password"
                            />
                        </div>

                        <div className="col-span-3">
                            <Label htmlFor="userType">User Type</Label>
                            <Select value={data.position} onValueChange={(value) => setData('position', value)} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select user type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="law-enforcement">Law Enforcement</SelectItem>
                                    <SelectItem value="admin">Administrator</SelectItem>
                                    <SelectItem value="record-officer">Records Officer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="col-span-3">
                            <Label htmlFor="agency">Agency</Label>
                            <Input id="agency" name="agency" value={data.agency} onChange={(e) => setData('agency', e.target.value)} required />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" form="edit-user-form" className="bg-blue-500 hover:bg-blue-600" disabled={processing}>
                            {processing ? 'Updating...' : 'Update User'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
