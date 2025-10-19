// resources/js/Pages/Admin/RequestLogs/Index.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { RequestLogsPageProps } from '@/types';
import { RequestLogsTable } from '@/features/request-log/request-logs-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin',
    },
    {
        title: 'Request Logs',
        href: '/admin/request-logs',
    },
];

export default function RequestLogs({ request_logs, filters }: RequestLogsPageProps) {
    const { auth } = usePage().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs} user={auth.user}>
            <Head title="Request Logs" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">Request Logs</h1>
                        <p className="text-muted-foreground">
                            Monitor and analyze all incoming requests to your application.
                        </p>
                    </div>
                </div>

                <RequestLogsTable logs={request_logs} filters={filters} />
            </div>
        </AppLayout>
    );
}
