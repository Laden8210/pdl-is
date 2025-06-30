import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href?: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    userType?: string;
    children?: NavItem[];

}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface CurrentUser {
    fname: string;
    lname: string;
    position: string;
    avatar: string | null;
}
export interface PageProps {
    auth: {
        user: {
            id: number;
            fname: string;
            lname: string;
            username: string;
            position: string;
            avatar: string | null;
        } | null;
    };
    errors: Record<string, string>;
}
