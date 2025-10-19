// resources/js/Pages/Admin/RequestLogs/components/RequestLogDetailsDialog.tsx
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type RequestLog } from '@/types';
import { Calendar, Clock, Copy, Globe, User } from 'lucide-react';

interface RequestLogDetailsDialogProps {
    log: RequestLog | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RequestLogDetailsDialog({ log, open, onOpenChange }: RequestLogDetailsDialogProps) {
    if (!log) return null;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const formatJSON = (data: any) => {
        if (typeof data === 'string') {
            try {
                return JSON.stringify(JSON.parse(data), null, 2);
            } catch {
                return data;
            }
        }
        return JSON.stringify(data, null, 2);
    };

    const getStatusVariant = (status: number) => {
        if (status >= 200 && status < 300) return 'success';
        if (status >= 400 && status < 500) return 'warning';
        if (status >= 500) return 'destructive';
        return 'secondary';
    };

    const getMethodVariant = (method: string) => {
        switch (method) {
            case 'GET':
                return 'default';
            case 'POST':
                return 'success';
            case 'PUT':
                return 'warning';
            case 'PATCH':
                return 'warning';
            case 'DELETE':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    // Reusable JSON display component with proper width constraints
    const JSONDisplay = ({ data, title, onCopy }: { data: any; title: string; onCopy: () => void }) => (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm">
                    {title}
                    <Button variant="outline" size="sm" onClick={onCopy}>
                        <Copy className="mr-2 h-3 w-3" />
                        Copy
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <ScrollArea className="h-64 w-full">
                    <div className="min-w-0"> {/* This container forces width constraint */}
                        <pre className="w-full max-w-full overflow-x-auto rounded-md bg-muted p-3 text-xs font-mono whitespace-pre-wrap break-words">
                            {formatJSON(data)}
                        </pre>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className=" max-h-[90vh]" style={{ maxWidth: '1000px' }}> {/* Added w-[95vw] */}
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        Request Details
                        <Badge variant={getMethodVariant(log.method)}>{log.method}</Badge>
                        <Badge variant={getStatusVariant(log.status_code)}>{log.status_code}</Badge>
                    </DialogTitle>
                    <DialogDescription className="break-words">{log.url}</DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4">
                        {/* Overview Cards */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <Card className="min-w-0"> {/* Added min-w-0 */}
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">User</CardTitle>
                                    <User className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-lg font-bold truncate">{log.user_name || 'Guest'}</div>
                                    {log.user_email && <p className="text-xs text-muted-foreground truncate">{log.user_email}</p>}
                                </CardContent>
                            </Card>

                            <Card className="min-w-0">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">IP Address</CardTitle>
                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="font-mono text-lg font-bold truncate">{log.ip_address}</div>
                                    <p className="text-xs text-muted-foreground">Location</p>
                                </CardContent>
                            </Card>

                            <Card className="min-w-0">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Duration</CardTitle>
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-lg font-bold">{log.duration.toFixed(2)}ms</div>
                                    <p className="text-xs text-muted-foreground">Response time</p>
                                </CardContent>
                            </Card>

                            <Card className="min-w-0">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Time</CardTitle>
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm font-bold">{new Date(log.created_at).toLocaleDateString()}</div>
                                    <p className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleTimeString()}</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Messages */}
                        {(log.success_message || log.error_message) && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm">Messages</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 pt-0">
                                    {log.success_message && (
                                        <div className="rounded-md border border-green-200 bg-green-50 p-3">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="success" className="text-xs">Success</Badge>
                                                <span className="text-green-800 text-sm">{log.success_message}</span>
                                            </div>
                                        </div>
                                    )}
                                    {log.error_message && (
                                        <div className="rounded-md border border-red-200 bg-red-50 p-3">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="destructive" className="text-xs">Error</Badge>
                                                <span className="text-red-800 text-sm">{log.error_message}</span>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Detailed Data Tabs */}
                        <Tabs defaultValue="request" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="request">Request</TabsTrigger>
                                <TabsTrigger value="response">Response</TabsTrigger>
                                <TabsTrigger value="headers">Headers</TabsTrigger>
                                <TabsTrigger value="raw">Raw Data</TabsTrigger>
                            </TabsList>

                            <TabsContent value="request" className="space-y-3">
                                <JSONDisplay
                                    data={log.request_body}
                                    title="Request Body"
                                    onCopy={() => copyToClipboard(formatJSON(log.request_body))}
                                />
                            </TabsContent>

                            <TabsContent value="response" className="space-y-3">
                                <JSONDisplay
                                    data={log.response_body}
                                    title="Response Body"
                                    onCopy={() => copyToClipboard(formatJSON(log.response_body))}
                                />
                            </TabsContent>

                            <TabsContent value="headers" className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <JSONDisplay
                                        data={log.request_headers}
                                        title="Request Headers"
                                        onCopy={() => copyToClipboard(formatJSON(log.request_headers))}
                                    />
                                    <JSONDisplay
                                        data={log.response_headers}
                                        title="Response Headers"
                                        onCopy={() => copyToClipboard(formatJSON(log.response_headers))}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="raw" className="space-y-3">
                                <JSONDisplay
                                    data={log}
                                    title="Complete Log Data"
                                    onCopy={() => copyToClipboard(JSON.stringify(log, null, 2))}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
