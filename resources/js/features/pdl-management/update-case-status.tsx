'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Edit, CheckCircle, XCircle, Clock, Skull, FileX } from 'lucide-react';
import { router } from '@inertiajs/react';

interface UpdateCaseStatusProps {
    caseInfo: {
        case_id: number;
        case_number: string;
        case_status: string;
        crime_committed: string;
    };
}

const caseStatusOptions = [
    { value: 'open', label: 'Open', icon: Clock, color: 'destructive' },
    { value: 'pending', label: 'Pending', icon: Clock, color: 'default' },
    { value: 'convicted', label: 'Convicted', icon: CheckCircle, color: 'secondary' },
    { value: 'deceased', label: 'Deceased', icon: Skull, color: 'destructive' },
    { value: 'case closed', label: 'Case Closed', icon: FileX, color: 'secondary' },
];

export function UpdateCaseStatus({ caseInfo }: UpdateCaseStatusProps) {
    const [open, setOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(caseInfo.case_status);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = async () => {
        if (selectedStatus === caseInfo.case_status) {
            setOpen(false);
            return;
        }

        setIsUpdating(true);

        try {
            const response = await fetch(route('case-information.update-status', caseInfo.case_id), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    case_status: selectedStatus,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setOpen(false);
                // Refresh the page to show updated status
                router.reload();
            } else {
                console.error('Failed to update case status:', data.message);
            }
        } catch (error) {
            console.error('Error updating case status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusOption = caseStatusOptions.find(option => option.value === status);
        if (!statusOption) return null;

        const IconComponent = statusOption.icon;

        return (
            <Badge variant={statusOption.color as any} className="flex items-center gap-1">
                <IconComponent className="h-3 w-3" />
                {statusOption.label}
            </Badge>
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 px-2">
                    <Edit className="h-3 w-3 mr-1" />
                    Update Status
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Case Status</DialogTitle>
                    <DialogDescription>
                        Update the status for case: <span className="font-medium">{caseInfo.case_number}</span>
                        <br />
                        <span className="text-sm text-muted-foreground">Crime: {caseInfo.crime_committed}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Current Status</label>
                        <div className="flex items-center gap-2">
                            {getStatusBadge(caseInfo.case_status)}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">New Status</label>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select new status" />
                            </SelectTrigger>
                            <SelectContent>
                                {caseStatusOptions.map((option) => {
                                    const IconComponent = option.icon;
                                    return (
                                        <SelectItem key={option.value} value={option.value}>
                                            <div className="flex items-center gap-2">
                                                <IconComponent className="h-4 w-4" />
                                                {option.label}
                                            </div>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedStatus !== caseInfo.case_status && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Preview</label>
                            <div className="flex items-center gap-2">
                                {getStatusBadge(selectedStatus)}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdate}
                        disabled={isUpdating || selectedStatus === caseInfo.case_status}
                    >
                        {isUpdating ? 'Updating...' : 'Update Status'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
