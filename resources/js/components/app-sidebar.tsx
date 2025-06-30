import { NavMain } from '@/components/nav-main';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import type { CurrentUser } from '@/types';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BarChart3, Calculator, Calendar, FileSearch, LayoutGrid, Share2, User, UserCheck, Users } from 'lucide-react';
import AppLogo from './app-logo';

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
                title: 'Personal Information',
                href: 'record-officer/pdl-management/personal-information',
                icon: UserCheck,
            },
            {
                title: 'Health Assessment',
                href: 'record-officer/pdl-management/health-assessment',
                icon: UserCheck,
            },
            {
                title: 'Medical Records',
                href: 'record-officer/pdl-management/medical-records',
                icon: FileSearch,
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
                title: 'Personal Information',
                href: 'admin/pdl-management/personal-information',
                icon: UserCheck,
            },
            {
                title: 'Health Assessment',
                href: 'admin/pdl-management/health-assessment',
                icon: UserCheck,
            },
            {
                title: 'Medical Records',
                href: 'admin/pdl-management/medical-records',
                icon: FileSearch,
            },
        ],
    },


    {
        title: 'Report Management',
        icon: Calendar,
        userType: 'admin',
        children: [
            {
                title: 'Personal Information',
                href: 'admin/pdl-management/personal-information',
                icon: UserCheck,
            },
        ],
    },

    {
        title: 'User and PDL Archive',
        icon: Calendar,
        userType: 'admin',
    },

];

export function AppSidebar() {
    const { props } = usePage<PageProps>();
    const user = props.auth.user as CurrentUser | null;

    const fullName = user ? `${user.fname} ${user.lname}` : 'Guest';
    const position = user?.position ?? '';
    const avatar = user?.avatar ?? '/images/default-avatar.jpg';
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo imageUrl={avatar} name={fullName} role={position} />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} position={user?.position ?? ''} />
            </SidebarContent>

            <SidebarFooter>
                <Link href="/logout" prefetch>
                    <Button variant="outline" className="w-full">
                        Logout
                    </Button>
                </Link>
            </SidebarFooter>
        </Sidebar>
    );
}
