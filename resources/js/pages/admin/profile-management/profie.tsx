import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { PageProps, type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function ProfileManagement() {
    const { props } = usePage<PageProps>();
    const user = props.auth.user;
    const successMessage = props.success;

    const { data, setData, post, processing, errors, reset } = useForm({
        firstName: user?.fname || '',
        lastName: user?.lname || '',
        middleName: (user as any)?.mname || '',
        position: user?.position || '',
        status: (user as any)?.status || 'active',
        password: '',
        profileImage: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('admin.profile.update'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                reset('password', 'profileImage');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile Management" />

            <div className="p-4">
                <h1 className="mb-4 text-2xl font-bold">Profile Management</h1>

                {Object.keys(errors).length > 0 && (
                    <Alert variant="destructive" className="mb-4">
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

                <form onSubmit={submit}>
                    <div className="grid grid-cols-3 gap-4">
                        {/* Profile Photo */}
                        <div className="col-span-1">
                            <Label>Profile</Label>
                            <div className="mt-2">
                                <img
                                    src={
                                        user?.avatar
                                            ? `/storage/${user.avatar}`
                                            : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLMI5YxZE03Vnj-s-sth2_JxlPd30Zy7yEGg&s'
                                    }
                                    alt="Profile"
                                    className="m-auto h-32 w-32 rounded-full object-cover"
                                />
                            </div>
                            <div className="mt-2">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="w-full"
                                    onChange={(e) => setData('profileImage', e.target.files?.[0] || null)}
                                />
                            </div>
                        </div>

                        {/* Left Column */}
                        <div className="col-span-1">
                            <Label htmlFor="first-name">First Name</Label>
                            <Input
                                id="first-name"
                                type="text"
                                placeholder="Enter your first name"
                                className="mb-4"
                                value={data.firstName}
                                onChange={(e) => setData('firstName', e.target.value)}
                            />

                            <Label htmlFor="last-name">Last Name</Label>
                            <Input
                                id="last-name"
                                type="text"
                                placeholder="Enter your last name"
                                className="mb-4"
                                value={data.lastName}
                                onChange={(e) => setData('lastName', e.target.value)}
                            />

                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                className="mb-4"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                        </div>

                        {/* Right Column */}
                        <div className="col-span-1">
                            <Label htmlFor="middle-name">Middle Name</Label>
                            <Input
                                id="middle-name"
                                type="text"
                                placeholder="Enter your middle name"
                                className="mb-4"
                                value={data.middleName}
                                onChange={(e) => setData('middleName', e.target.value)}
                            />

                            <Label htmlFor="role">Position</Label>
                            <Input
                                id="role"
                                type="text"
                                placeholder="Enter your position"
                                className="mb-4"
                                value={data.position}
                                onChange={(e) => setData('position', e.target.value)}
                                readOnly
                            />

                            <Label htmlFor="status">Status</Label>
                            <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex gap-2">
                                <Button type="button" className="mt-4 w-full" variant="destructive" onClick={() => reset()}>
                                    Cancel
                                </Button>

                                <Button type="submit" className="mt-4 w-full" variant="default" disabled={processing}>
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
