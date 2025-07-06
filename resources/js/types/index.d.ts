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


export interface PageProps extends InertiaPageProps {
  auth: {
    user: User | null;
  };
  errors: Record<string, string>;
  success?: string;
}


export type Personnel = {
  id: number;
  fname: string;
  mname: string | null;
  lname: string;
  contactnum: string;
  avatar: string | null;
  username: string;
  password: string;
  position: string;
  agency: string;
};
