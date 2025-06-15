import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

// TODO: Refactor this to use a configuration file or context for dynamic navigation items.


const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'PDL Transfer',
        href: '/pdl-transfer',
        icon: Folder,
    },
    {
        title: 'PDL Information',
        href: '/pdl-information',
        icon: Folder,
    },
    {
        title: 'PDL Cell Assignment',
        href: '/pdl-cell-assignment',
        icon: Folder,
    },
    {
        title: 'Court Order',
        href: '/court-order',
        icon: Folder,
    },
    {
        title: 'Case Information',
        href: '/case-information',
        icon: Folder,
    },
    {
        title: 'Medical Record',
        href: '/medical-record',
        icon: BookOpen,
    },
    {
        title: 'Health Assessment',
        href: '/health-assessment',
        icon: BookOpen,
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
