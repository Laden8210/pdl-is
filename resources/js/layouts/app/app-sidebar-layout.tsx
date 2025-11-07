import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type PropsWithChildren, useEffect } from 'react';
import { toast } from 'sonner';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { props, setProps } = usePage<PageProps>();
    const { auth, notifications } = props;

    useEffect(() => {
        const successMessage = (props as any).success;
        const errors = (props as any).errors;

        if (successMessage) {
            toast.success(successMessage, { duration: 5000 });
            
            // Clear success message after displaying
            setTimeout(() => {
                setProps({
                    ...props,
                    success: undefined
                });
            }, 100);
        }

        if (errors && Object.keys(errors).length > 0) {
            const firstErrorKey = Object.keys(errors)[0];
            const firstErrorMessage = errors[firstErrorKey];
            toast.error(firstErrorMessage, { duration: 5000 });
            
            // Clear errors after displaying
            setTimeout(() => {
                setProps({
                    ...props,
                    errors: undefined
                });
            }, 100);
        }
    }, [props, setProps]);

    return (
        <AppShell variant="sidebar">            
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} auth={auth} notifications={notifications || []} />
                <div className="p-4">{children}</div>
            </AppContent>
        </AppShell>
    );
}