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
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* Profile Photo */}
                        <div className="flex flex-col items-center space-y-4">
                            <Label>Profile</Label>
                            <img
                                src={
                                    user?.avatar
                                        ? `/storage/${user.avatar}`
                                        : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLMI5YxZE03Vnj-s-sth2_JxlPd30Zy7yEGg&s'
                                }
                                alt="Profile"
                                className="h-32 w-32 rounded-full object-cover"
                            />
                            <Input
                                type="file"
                                accept="image/*"
                                className="w-full"
                                onChange={(e) => setData('profileImage', e.target.files?.[0] || null)}
                            />
                        </div>

                        {/* Left Column */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="first-name">First Name</Label>
                                <Input
                                    readOnly
                                    id="first-name"
                                    type="text"
                                    placeholder="Enter your first name"
                                    value={data.firstName}
                                    onChange={(e) => setData('firstName', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="last-name">Last Name</Label>
                                <Input
                                    readOnly
                                    id="last-name"
                                    type="text"
                                    placeholder="Enter your last name"
                                    value={data.lastName}
                                    onChange={(e) => setData('lastName', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="middle-name">Middle Name</Label>
                                <Input
                                    readOnly
                                    id="middle-name"
                                    type="text"
                                    placeholder="Enter your middle name"
                                    value={data.middleName}
                                    onChange={(e) => setData('middleName', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="role">Position</Label>
                                <Input

                                    id="role"
                                    type="text"
                                    placeholder="Enter your position"
                                    value={data.position}
                                    onChange={(e) => setData('position', e.target.value)}
                                    readOnly
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="destructive" onClick={() => reset()}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="default" disabled={processing}>
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
