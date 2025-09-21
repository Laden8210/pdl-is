import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import type { PageProps } from '@/types';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';


export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
    const { props } = usePage<PageProps>();
    const user = props.auth.user;

    const toggleDropdown = (title: string) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu className="mt-2">
                {items
                    .filter((item) => !item.userType || item.userType === user?.position)
                    .map((item) => {
                        const hasChildren = item.children && item.children.length > 0;
                        const isChildActive = hasChildren && item.children?.some((child) => page.url.startsWith(`/${child.href ?? ''}`));
                        const isDropdownOpen = openDropdowns[item.title] || isChildActive;

                        return (
                            <div key={item.title}>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild={!hasChildren}
                                        isActive={item.href ? page.url.startsWith(item.href) : false}
                                        tooltip={{ children: item.title }}
                                        onClick={() => hasChildren && toggleDropdown(item.title)}
                                    >
                                        {hasChildren ? (
                                            <div className="flex w-full cursor-pointer items-center gap-2 text-left">
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                                {isDropdownOpen ? <ChevronDown className="ml-auto" /> : <ChevronRight className="ml-auto" />}
                                            </div>
                                        ) : (
                                            <Link href={item.href ?? '#'} prefetch className="flex items-center gap-2">
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                            </Link>
                                        )}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                                {hasChildren && isDropdownOpen && item.children && (
                                    <div className="mt-1 ml-6 space-y-1">
                                        {item.children.map((child) => (
                                            <SidebarMenuItem key={child.title}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={child.href ? page.url.startsWith(`/${child.href}`) : false}
                                                    tooltip={{ children: child.title }}
                                                >
                                                    <Link
                                                        href={`/${(child.href ?? '').replace(/^\/+/, '')}`}
                                                        prefetch
                                                        className="flex items-center gap-2 text-left"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {child.icon && <child.icon />}
                                                        <span>{child.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
