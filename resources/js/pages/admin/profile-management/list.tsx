import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function ProfileManagement() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile Management" />

            <div className="p-4">
                <h1 className="mb-4 text-2xl font-bold">Profile Management</h1>

                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                        <Label>Profile</Label>
                        <div className="placeholder placeholder-lg col-3 bg-primary"></div>
                        <div className="mt-2">
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLMI5YxZE03Vnj-s-sth2_JxlPd30Zy7yEGg&s"
                                alt="Profile"
                                className="h-32 w-32 rounded-full object-cover m-auto"
                            />
                        </div>
                        <div className="mt-2">
                            <Input type="file" accept="image/*" className="w-full" />
                            <Button variant="outline" className="mt-2 w-full">
                                Upload
                            </Button>
                        </div>
                    </div>

                    <div className="col-span-1">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" type="text" placeholder="Enter your first name" className="mb-4" />

                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" type="text" placeholder="Enter your last name" className="mb-4" />

                        <Label htmlFor="email">Password</Label>
                        <Input id="email" type="password" placeholder="Enter your password" className="mb-4" />
                    </div>

                    <div className="col-span-1">
                        <Label htmlFor="middle-name">Middle Name</Label>
                        <Input id="middle-name" type="text" placeholder="Enter your middle name" className="mb-4" />
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" type="text" placeholder="Enter your role" className="mb-4" />
                        <Label htmlFor="status">Status</Label>
                        <Select>
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
                            <Button className="mt-4 w-full" variant="destructive" onClick={() => alert('Delete Profile')}>
                                Cancel
                            </Button>

                            <Button className="mt-4 w-full" variant="default" type="submit">
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
