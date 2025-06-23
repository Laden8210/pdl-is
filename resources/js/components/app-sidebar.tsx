import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BarChart3, Calculator, Calendar, FileSearch, LayoutGrid, Share2, User, UserCheck, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },

    {
        title: 'Verification',
        href: '/verification',
        icon: User,
    },
    {
        title: 'Profile Management',
        href: '/profile-management',
        icon: UserCheck,
    },

    {
        title: 'User Management',
        href: '/user-management',
        icon: Users,
    },

    {
        title: 'Jail Activity & Court Hearing',
        href: '/court-hearing-calendar',
        icon: Calendar,
    },
    {
        title: 'Record Search & Retrieval',
        href: '/record-management',
        icon: FileSearch,
    },
    {
        title: 'PDL Management',
        href: '/pdl-management',
        icon: UserCheck,
    },
    {
        title: 'GCTA Calculator',
        href: '/gcta-calculator',
        icon: Calculator,
    },
    {
        title: 'Reports Management',
        href: '/reports-management',
        icon: BarChart3,
    },
    // Records Officer Interfaces
    {
        title: 'Record Search Display',
        href: '/record-display',
        icon: FileSearch,
    },

    {
        title: 'PDL Transfer',
        href: '/pdl-transfer',
        icon: Share2,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo imageUrl="/images/user.jpg" name="John Doe" role="Administrator" />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>
        </Sidebar>
    );
}
