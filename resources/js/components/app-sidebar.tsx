import { NavMain } from '@/components/nav-main';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

import { type NavItem } from '@/types';
import { Link, usePage, router } from '@inertiajs/react';
import { Calendar, FileSearch, FileText, LayoutGrid, Shield, User, UserCheck, Users, Archive } from 'lucide-react';
import AppLogo from './app-logo';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import type { PageProps } from '@/types';

interface AppSidebarProps extends PageProps {
    [key: string]: unknown;
}

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/record-officer/dashboard',
        icon: LayoutGrid,
        userType: 'record-officer',
    },
    {
        title: 'Profile Management',
        href: '/record-officer/profile-management',
        icon: UserCheck,
        userType: 'record-officer',
    },

    {
        title: 'Verification',
        href: '/record-officer/verification',
        icon: User,
        userType: 'record-officer',
    },

    {
        title: 'Jail Events',
        href: '/record-officer/jail-events',
        icon: Calendar,
        userType: 'record-officer',
    },

    {
        title: 'PDL Management',
        icon: Calendar,
        userType: 'record-officer',
        children: [
            {
                title: 'List of PDLs',
                href: 'record-officer/pdl-management/personal-information',
                icon: UserCheck,
            },
            {
                title: 'Cell Assignment',
                href: 'record-officer/pdl-management/cell-assignment',
                icon: UserCheck,
            },
            {
                title: 'Time Allowance',
                href: 'record-officer/pdl-management/time-allowance',
                icon: UserCheck,
            },

        ],
    },
    {
        title: 'PDL Archive',
        href: '/record-officer/pdl-archives',
        icon: Calendar,
        userType: 'record-officer',
    },

    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
        userType: 'admin',
    },

    {
        title: 'Profile Management',
        href: '/admin/profile-management',
        icon: UserCheck,
        userType: 'admin',
    },

    {
        title: 'User Management',
        href: '/admin/user-management',
        icon: Users,
        userType: 'admin',
    },

    {
        title: 'Verification',
        href: '/admin/verification',
        icon: User,
        userType: 'admin',
    },

    {
        title: 'Jail Activity & Court Hearing',
        href: '/admin/court-hearing-calendar',
        icon: Calendar,
        userType: 'admin',
    },

    {
        title: 'Cell Management',
        href: '/admin/cell-management',
        icon: Calendar,
        userType: 'admin',
    },

    {
        title: 'PDL Management',
        icon: Calendar,
        userType: 'admin',
        children: [
            {
                title: 'List of PDLs',
                href: 'admin/pdl-management/personal-information',
                icon: UserCheck,
            },
            {
                title: 'Cell Assignment',
                href: 'admin/pdl-management/cell-assignment',
                icon: UserCheck,
            },
            {
                title: 'Time Allowance',
                href: 'admin/pdl-management/time-allowance',
                icon: UserCheck,
            },
        ],
    },

    {
        title: 'Report Management',
        icon: Calendar,
        userType: 'admin',
        children: [

            {
                title: 'GCTA & TASTM Reports',
                href: 'admin/report/gcta-and-tastm',
                icon: UserCheck,
            },
            {
                title: 'Inmates Population Report',
                href: 'admin/report/inmate-population',
                icon: UserCheck,
            },


            {
                title: 'Certificate of No Records',
                href: 'admin/report/no-records-certificate',
                icon: FileText,
            },
            {
                title: 'Certificate of Detention',
                href: 'admin/report/certificate-of-detention',
                icon: FileText,
            },
            {
                title: 'Inmates Status Report',
                href: 'admin/report/inmates-status',
                icon: UserCheck,
            },
            {
                title: 'List of PDL Report',
                href: 'admin/report/list-of-pdl-reports',
                icon: UserCheck,
            },
            {
                title: 'Population of Drug-Related Cases',
                href: 'admin/report/drug-related-cases-monthly',
                icon: UserCheck,
            },
        ],
    },

    {
        title: 'User and PDL Archive',
        icon: Calendar,
        href: '/admin/user-pdl-archive',
        userType: 'admin',
    },

    {
        title: 'Law Enforcement Dashboard',
        href: '/law-enforcement/dashboard',
        icon: LayoutGrid,
        userType: 'law-enforcement',
    },

    {
        title: 'Profile Management',
        href: '/law-enforcement/profile-management',
        icon: UserCheck,
        userType: 'law-enforcement',
    },

    {
        title: 'PDL Management',
        icon: Calendar,
        userType: 'law-enforcement',
        children: [
            {
                title: 'PDL Personal Information',
                href: 'law-enforcement/pdl-management/personal-information',
                icon: UserCheck,
            },

            {
                title: 'Court Order',
                href: 'law-enforcement/pdl-management/court-order',
                icon: UserCheck,
            },

            {
                title: 'Case Information',
                href: 'law-enforcement/pdl-management/case-information',
                icon: UserCheck,
            },
            {
                title: 'Medical Records',
                href: 'law-enforcement/pdl-management/medical-records',
                icon: FileSearch,
            },
            {
                title: 'Physical Characteristics',
                href: 'law-enforcement/pdl-management/physical-characteristics',
                icon: UserCheck,
            },
        ],
    },
];

export function AppSidebar() {
    const { props } = usePage<AppSidebarProps>();
    const user = props.auth.user;
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const fullName = user ? `${user.fname} ${user.lname}` : 'Guest';
    const position = user?.position ? user.position.charAt(0).toUpperCase() + user.position.slice(1) : '';
    const avatar = user?.avatar ? `/storage/${user.avatar}` : '/images/default-avatar.jpg';
    const url = user?.position ? `/${user.position}/profile-management` : '/';

    const handleLogoutClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setLogoutDialogOpen(true);
    };

    const confirmLogout = () => {
        setLogoutDialogOpen(false);
        router.post(route('logout'));
    };

    return (
        <>
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={url} prefetch>
                                <AppLogo imageUrl={avatar} name={fullName} role={position} />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <Button variant="outline" className="w-full" onClick={handleLogoutClick}>
                    Logout
                </Button>
            </SidebarFooter>
        </Sidebar>

        {/* Logout Confirmation Dialog */}
        <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Confirm Logout</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to log out of your account?
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">
                                    Warning
                                </h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                    <p>You will be logged out of the system and will need to log in again to access your account.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setLogoutDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmLogout}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Yes, Log Out
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
        </>
    );
}
