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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

export function CreateUser() {
    const avatarRef = useRef<HTMLInputElement>(null);
    const { props } = usePage<any>();
    const successMessage = props.success;

    const { data, setData, post, processing, errors } = useForm({
        firstName: '',
        middleName: '',
        lastName: '',
        contactNumber: '',
        avatar: null as File | null,
        username: '',
        password: '',
        position: '',
        agency: '',

    });


    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('user-management.store'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {},
        });
    };

    return (
        <Dialog>
            <Head title="Create User" />

            <DialogTrigger asChild>
                <Button variant="outline">Add User</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <form id="create-user-form" onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Create User</DialogTitle>
                        <DialogDescription>Fill in the details to create a new user.</DialogDescription>
                    </DialogHeader>

                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-4 mt-4">
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
                            <Input
                                id="avatar"
                                name="avatar"
                                type="file"
                                ref={avatarRef}
                                onChange={(e) => setData('avatar', e.target.files?.[0] ?? null)}
                                accept="image/*"
                            />
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
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-span-3">
                            <Label htmlFor="userType">User Type</Label>
                            <Select
                                value={data.position}
                                onValueChange={(value) => setData('position', value)}
                                required
                            >
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
                            <Input
                                id="agency"
                                name="agency"
                                value={data.agency}
                                onChange={(e) => setData('agency', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            form="create-user-form"
                            className="bg-blue-500 hover:bg-blue-600"
                            disabled={processing}
                        >
                            {processing ? 'Creating...' : 'Create User'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
