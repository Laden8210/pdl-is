// resources/js/Pages/Admin/RequestLogs/components/RequestLogsTable.tsx
import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RequestLogDetailsDialog } from '@/features/request-log/requestlog-details-dialog';
import { type RequestLog, type RequestLogsTableProps } from '@/types';
import { Search, Filter, Calendar } from 'lucide-react';
import { router, useForm } from '@inertiajs/react';
import { debounce } from 'lodash';

interface FilterState {
    search?: string;
    method?: string;
    status?: string;
    user_id?: string;
}

export function RequestLogsTable({ logs, filters }: RequestLogsTableProps) {
    const [selectedLog, setSelectedLog] = useState<RequestLog | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [localFilters, setLocalFilters] = useState<FilterState>(filters || {});

    const { data, setData, get } = useForm({
        search: filters?.search || '',
        method: filters?.method || 'all',
        status: filters?.status || 'all',
        user_id: filters?.user_id || 'all',
    });

    console.log(filters);
    console.log(logs);

    // Debounced search to avoid too many requests
    const debouncedSearch = debounce((filters: FilterState) => {
        router.get(route('admin.request-logs.index'), filters, {
            preserveState: true,
            replace: true,
        });
    }, 500);

    // Handle filter changes
    const handleFilterChange = (key: keyof FilterState, value: string) => {
        const newFilters = { ...localFilters, [key]: value === 'all' ? undefined : value };
        setLocalFilters(newFilters);

        // Remove 'all' values from the actual request
        const requestFilters = Object.fromEntries(
            Object.entries(newFilters).filter(([_, value]) => value && value !== 'all')
        );

        debouncedSearch(requestFilters);
    };

    // Handle search input separately with debouncing
    const handleSearchChange = (value: string) => {
        const newFilters = { ...localFilters, search: value || undefined };
        setLocalFilters(newFilters);

        const requestFilters = Object.fromEntries(
            Object.entries(newFilters).filter(([_, value]) => value && value !== 'all')
        );

        debouncedSearch(requestFilters);
    };

    // Clear all filters
    const clearFilters = () => {
        setLocalFilters({});
        router.get(route('admin.request-logs.index'));
    };

    const handleViewDetails = (log: RequestLog) => {
        setSelectedLog(log);
        setIsDialogOpen(true);
    };

    const getStatusVariant = (status: number) => {
        if (status >= 200 && status < 300) return 'success';
        if (status >= 400 && status < 500) return 'warning';
        if (status >= 500) return 'destructive';
        return 'secondary';
    };

    const getMethodVariant = (method: string) => {
        switch (method) {
            case 'GET': return 'default';
            case 'POST': return 'success';
            case 'PUT': return 'warning';
            case 'PATCH': return 'warning';
            case 'DELETE': return 'destructive';
            default: return 'secondary';
        }
    };

    const formatDuration = (duration: number) => {
        return `${duration.toFixed(2)}ms`;
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const hasActiveFilters = Object.values(localFilters).some(value => value && value !== 'all');

    return (
        <div className="space-y-4">
            {/* Filters */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-lg">Filters</CardTitle>
                    {hasActiveFilters && (
                        <Button variant="outline" size="sm" onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Search</label>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search URL, user..."
                                    className="pl-8"
                                    value={localFilters.search || ''}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Method</label>
                            <Select
                                value={localFilters.method || 'all'}
                                onValueChange={(value) => handleFilterChange('method', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All methods" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Methods</SelectItem>
                                    <SelectItem value="GET">GET</SelectItem>
                                    <SelectItem value="POST">POST</SelectItem>
                                    <SelectItem value="PUT">PUT</SelectItem>
                                    <SelectItem value="PATCH">PATCH</SelectItem>
                                    <SelectItem value="DELETE">DELETE</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <Select
                                value={localFilters.status || 'all'}
                                onValueChange={(value) => handleFilterChange('status', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="success">2xx Success</SelectItem>
                                    <SelectItem value="client_error">4xx Client Error</SelectItem>
                                    <SelectItem value="server_error">5xx Server Error</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">User</label>
                            <Select
                                value={localFilters.user_id || 'all'}
                                onValueChange={(value) => handleFilterChange('user_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All users" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Users</SelectItem>
                                    <SelectItem value="guest">Guest Users</SelectItem>
                                    <SelectItem value="authenticated">Authenticated Users</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Logs Table */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        Request Logs ({logs.data.length} of {logs.total})
                        {hasActiveFilters && (
                            <Badge variant="secondary" className="ml-2">
                                Filtered
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Method</TableHead>
                                <TableHead>URL</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>IP Address</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Message</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                                        No request logs found.
                                        {hasActiveFilters && (
                                            <div className="mt-2">
                                                <Button variant="outline" size="sm" onClick={clearFilters}>
                                                    Clear filters
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.data.map((log) => (
                                    <TableRow key={log.id} className="group">
                                        <TableCell>
                                            <Badge variant={getMethodVariant(log.method)}>
                                                {log.method}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate" title={log.url}>
                                            {log.url}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(log.status_code)}>
                                                {log.status_code}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {log.user_name ? `${log.user_name}` : 'Guest'}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {log.user_email ? `${log.user_email}` : ''}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {log.ip_address}
                                        </TableCell>
                                        <TableCell>
                                            {formatDuration(log.duration)}
                                        </TableCell>
                                        <TableCell className="max-w-[150px] truncate">
                                            {log.success_message || log.error_message || '-'}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatDateTime(log.created_at)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewDetails(log)}
                                            >
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {logs.links && logs.links.length > 3 && (
                        <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-muted-foreground">
                                Showing {logs.from} to {logs.to} of {logs.total} results
                            </div>
                            <div className="flex space-x-1">
                                {logs.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? "default" : "outline"}
                                        size="sm"
                                        disabled={!link.url}
                                        asChild={!!link.url}
                                    >
                                        {link.url ? (
                                            <a href={link.url}>
                                                {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                            </a>
                                        ) : (
                                            <span>
                                                {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                            </span>
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Details Dialog */}
            <RequestLogDetailsDialog
                log={selectedLog}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </div>
    );
}
