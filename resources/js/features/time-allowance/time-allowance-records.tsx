import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Head, useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { AlertTriangle, Calendar, Edit, Eye, Trash2, User } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface TimeAllowanceRecord {
    id: number;
    type: 'gcta' | 'tastm';
    days: number;
    reason: string;
    awarded_by: number;
    awarded_at: string;
    supporting_document?: string;
    awardedBy?: {
        id: number;
        fname: string;
        lname: string;
    };
}

interface TimeAllowanceRecordsProps {
    pdl: any;
    records: TimeAllowanceRecord[];
}

export function TimeAllowanceRecords({ pdl, records }: TimeAllowanceRecordsProps) {
    const { props } = usePage<any>();
    const successMessage = props.success;
    const [editingRecord, setEditingRecord] = useState<TimeAllowanceRecord | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<TimeAllowanceRecord | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const {
        data,
        setData,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        type: 'gcta',
        days: 0,
        reason: '',
    });

    const handleEdit = (record: TimeAllowanceRecord) => {
        setEditingRecord(record);
        setData({
            type: record.type,
            days: record.days,
            reason: record.reason,
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate: FormEventHandler = (e) => {
        e.preventDefault();
        if (!editingRecord) return;

        put(route('admin.time-allowance.update-record', editingRecord.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsEditDialogOpen(false);
                setEditingRecord(null);
            },
        });
    };

    const handleRevoke = (record: TimeAllowanceRecord) => {
        setRecordToDelete(record);
        setIsDeleteDialogOpen(true);
    };

    const confirmRevoke = () => {
        if (!recordToDelete) return;

        destroy(route('admin.time-allowance.revoke', recordToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setRecordToDelete(null);
            },
        });
    };


    const getTypeBadge = (type: string) => {
        if (type === 'gcta') {
            return <Badge className="bg-blue-100 text-blue-800">GCTA</Badge>;
        }
        return <Badge className="bg-green-100 text-green-800">TASTM</Badge>;
    };

    const getTypeColor = (type: string) => {
        return type === 'gcta' ? 'text-blue-600' : 'text-green-600';
    };

    return (
        <>
            <Dialog>
                <Head title="Time Allowance Records" />
                <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        View Records
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Time Allowance Records for {pdl.fname} {pdl.lname}
                        </DialogTitle>
                        <DialogDescription>View and manage all time allowance records for this PDL.</DialogDescription>
                    </DialogHeader>

                    {successMessage && (
                        <Alert variant="default" className="mb-4 border-green-200 bg-green-50 text-green-800">
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{successMessage}</AlertDescription>
                        </Alert>
                    )}

                    {records.length > 0 ? (
                        <div className="space-y-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Days</TableHead>
                                        <TableHead>Reason</TableHead>
                                        <TableHead>Awarded By</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {records.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell>{getTypeBadge(record.type)}</TableCell>
                                            <TableCell className="font-medium">{record.days} days</TableCell>
                                            <TableCell className="max-w-xs truncate">{record.reason}</TableCell>
                                            <TableCell>
                                                {record.awardedBy ? (
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-gray-500" />
                                                        <span className="text-sm">
                                                            {record.awardedBy.fname} {record.awardedBy.lname}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-500">Unknown</span>
                                                )}
                                            </TableCell>
                                            <TableCell>{format(new Date(record.awarded_at), 'MMM dd, yyyy')}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">

                    
                                                    <Button variant="outline" size="sm" onClick={() => handleEdit(record)} className="h-8 w-8 p-0">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleRevoke(record)}
                                                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="py-8 text-center text-gray-500">
                            <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                            <p>No time allowance records found for this PDL.</p>
                        </div>
                    )}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <form id="edit-time-allowance-form" onSubmit={handleUpdate}>
                        <DialogHeader>
                            <DialogTitle>Edit Time Allowance Record</DialogTitle>
                            <DialogDescription>Update the details for this time allowance record.</DialogDescription>
                        </DialogHeader>

                        {Object.keys(errors).length > 0 && (
                            <Alert variant="destructive" className="mt-4 mb-4">
                                <AlertTitle>Unable to process request</AlertTitle>
                                <AlertDescription>
                                    {Object.values(errors).map((error, index) => (
                                        <ul className="list-inside list-disc text-sm" key={index}>
                                            <li>{String(error)}</li>
                                        </ul>
                                    ))}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="grid gap-4 py-2">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-type">Allowance Type</Label>
                                <Select value={data.type} onValueChange={(value: 'gcta' | 'tastm') => setData('type', value)} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select allowance type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="gcta">Good Conduct Time Allowance (GCTA)</SelectItem>
                                        <SelectItem value="tastm">Time Allowance for Study, Teaching & Mentoring (TASTM)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-days">Days</Label>
                                <Input
                                    id="edit-days"
                                    name="days"
                                    type="number"
                                    min="0"
                                    value={data.days}
                                    onChange={(e) => setData('days', parseInt(e.target.value) || 0)}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-reason">Reason</Label>
                                <Textarea
                                    id="edit-reason"
                                    name="reason"
                                    value={data.reason}
                                    onChange={(e) => setData('reason', e.target.value)}
                                    placeholder="Enter the reason for this time allowance"
                                    required
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    setIsEditDialogOpen(false);
                                    setEditingRecord(null);
                                    reset();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" form="edit-time-allowance-form" className="bg-blue-500 hover:bg-blue-600" disabled={processing}>
                                {processing ? 'Updating...' : 'Update Record'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                            Confirm Deletion
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to revoke this time allowance record? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    {recordToDelete && (
                        <div className="rounded-md border bg-gray-50 p-4">
                            <div className="mb-2 flex items-center gap-2">
                                {getTypeBadge(recordToDelete.type)}
                                <span className="font-medium">{recordToDelete.days} days</span>
                            </div>
                            <p className="mb-1 text-sm text-gray-600">
                                <strong>Reason:</strong> {recordToDelete.reason}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Date:</strong> {format(new Date(recordToDelete.awarded_at), 'MMM dd, yyyy')}
                            </p>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setIsDeleteDialogOpen(false);
                                setRecordToDelete(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmRevoke} disabled={processing}>
                            {processing ? 'Revoking...' : 'Revoke Record'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
