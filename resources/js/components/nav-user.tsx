import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronsUpDown } from 'lucide-react';

export function NavUser() {
    const user: {
        id: number;
        name: string;
        email: string;
        avatar?: string;
        email_verified_at: string | null;
        created_at: string;
        updated_at: string;
        [key: string]: unknown;
    } = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        avatar: undefined,
        email_verified_at: null,
        created_at: '',
        updated_at: '',
    };


    const { state } = useSidebar();
    const isMobile = useIsMobile();

    return (
        <SidebarMenu className=" text-black">
            <SidebarMenuItem>

            </SidebarMenuItem>
        </SidebarMenu>
    );
}
