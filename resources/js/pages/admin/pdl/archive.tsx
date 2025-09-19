import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Archive, Calendar, User, AlertTriangle, CheckCircle, Upload, FileText } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Pdl {
    id: number;
    fname: string;
    lname: string;
    alias?: string;
    birthdate?: string;
    age?: number;
    gender?: string;
    ethnic_group?: string;
    civil_status?: string;
    brgy?: string;
    city?: string;
    province?: string;
    archive_status?: string;
    archive_reason?: string;
    archived_at?: string;
    archive_notes?: string;
    admission_date?: string;
    release_date?: string;
    personnel?: {
        id: number;
        name: string;
    };
    cases?: Array<{
        id: number;
        case_number?: string;
        crime_committed?: string;
        case_status?: string;
    }>;
}

interface PageProps {
    pdl: Pdl;
    archiveStatusOptions: Record<string, string>;
    existingCaseNumbers: string[];
}

export default function PdlArchiveForm({ pdl, archiveStatusOptions, existingCaseNumbers }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        archive_status: pdl.archive_status || '',
        archive_reason: pdl.archive_reason || '',
        archive_case_number: pdl.archive_case_number || '',
        archive_court_order: null as File | null,
        archive_notes: pdl.archive_notes || '',
        admission_date: pdl.admission_date ? pdl.admission_date.split('T')[0] : '',
        release_date: pdl.release_date ? pdl.release_date.split('T')[0] : '',
    });

    const [showArchiveDialog, setShowArchiveDialog] = useState(false);
    const [showCustodyDialog, setShowCustodyDialog] = useState(false);

    const handleArchive = () => {
        post(route('pdl.archive', pdl.id), {
            onSuccess: () => {
                setShowArchiveDialog(false);
            }
        });
    };

    const handleCustodyDates = () => {
        post(route('pdl.custody-dates', pdl.id), {
            onSuccess: () => {
                setShowCustodyDialog(false);
            }
        });
    };

    const handleUnarchive = () => {
        post(route('pdl.unarchive', pdl.id));
    };

    const isArchived = pdl.archived_at !== null;

    return (
        <AppLayout>
            <Head title={`Archive PDL - ${pdl.fname} ${pdl.lname}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">PDL Archive Management</h1>
                        <p className="text-muted-foreground">
                            Manage archiving and custody dates for {pdl.fname} {pdl.lname}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        {isArchived ? (
                            <div className="flex items-center space-x-2 text-green-600">
                                <CheckCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">Archived</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 text-orange-600">
                                <AlertTriangle className="h-5 w-5" />
                                <span className="text-sm font-medium">Active</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* PDL Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>PDL Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium">Name:</span>
                                    <span>{pdl.fname} {pdl.lname}</span>
                                    {pdl.alias && <span className="text-muted-foreground">({pdl.alias})</span>}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-green-600" />
                                    <span className="font-medium">Age:</span>
                                    <span>{pdl.age || 'N/A'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-medium">Gender:</span>
                                    <span>{pdl.gender || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <span className="font-medium">Location:</span>
                                    <span>{pdl.brgy}, {pdl.city}, {pdl.province}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="font-medium">Cases:</span>
                                    <span>{pdl.cases?.length || 0}</span>
                                </div>
                                {isArchived && (
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium">Archived:</span>
                                        <span>{new Date(pdl.archived_at!).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Archive Status */}
                {isArchived && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Archive Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium">Archive Status:</span>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                            {archiveStatusOptions[pdl.archive_status!]}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium">Archive Date:</span>
                                        <span>{new Date(pdl.archived_at!).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div>
                                        <span className="font-medium">Reason:</span>
                                        <p className="text-sm text-muted-foreground mt-1">{pdl.archive_reason}</p>
                                    </div>
                                    {pdl.archive_notes && (
                                        <div>
                                            <span className="font-medium">Notes:</span>
                                            <p className="text-sm text-muted-foreground mt-1">{pdl.archive_notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Custody Dates */}
                <Card>
                    <CardHeader>
                        <CardTitle>Custody Dates</CardTitle>
                        <CardDescription>
                            Manage admission and release dates for this PDL
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="admission_date">Admission Date</Label>
                                <Input
                                    id="admission_date"
                                    type="date"
                                    value={data.admission_date}
                                    onChange={(e) => setData('admission_date', e.target.value)}
                                />
                                {errors.admission_date && (
                                    <Alert>
                                        <AlertDescription>{errors.admission_date}</AlertDescription>
                                    </Alert>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="release_date">Release Date</Label>
                                <Input
                                    id="release_date"
                                    type="date"
                                    value={data.release_date}
                                    onChange={(e) => setData('release_date', e.target.value)}
                                />
                                {errors.release_date && (
                                    <Alert>
                                        <AlertDescription>{errors.release_date}</AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </div>
                        <div className="mt-4">
                            <Button onClick={handleCustodyDates} disabled={processing}>
                                <Calendar className="h-4 w-4 mr-2" />
                                {processing ? 'Updating...' : 'Update Custody Dates'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Archive Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Archive Actions</CardTitle>
                        <CardDescription>
                            Archive or unarchive this PDL record
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!isArchived ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="archive_status">Archive Status *</Label>
                                    <Select value={data.archive_status} onValueChange={(value) => setData('archive_status', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select archive status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(archiveStatusOptions).map(([key, value]) => (
                                                <SelectItem key={key} value={key}>
                                                    {value}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.archive_status && (
                                        <Alert>
                                            <AlertDescription>{errors.archive_status}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="archive_case_number">Case Number *</Label>
                                    <Select value={data.archive_case_number} onValueChange={(value) => setData('archive_case_number', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select case number" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {existingCaseNumbers.map((caseNumber) => (
                                                <SelectItem key={caseNumber} value={caseNumber}>
                                                    {caseNumber}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.archive_case_number && (
                                        <Alert>
                                            <AlertDescription>{errors.archive_case_number}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="archive_court_order">Court Order Document *</Label>
                                    <div className="flex items-center space-x-2">
                                        <Input
                                            id="archive_court_order"
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setData('archive_court_order', file);
                                                }
                                            }}
                                            className="flex-1"
                                        />
                                        <Upload className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Upload PDF, JPG, JPEG, or PNG file (max 10MB)
                                    </p>
                                    {errors.archive_court_order && (
                                        <Alert>
                                            <AlertDescription>{errors.archive_court_order}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="archive_reason">Reason for Archiving *</Label>
                                    <Textarea
                                        id="archive_reason"
                                        placeholder="Enter the reason for archiving this PDL record..."
                                        value={data.archive_reason}
                                        onChange={(e) => setData('archive_reason', e.target.value)}
                                        rows={3}
                                    />
                                    {errors.archive_reason && (
                                        <Alert>
                                            <AlertDescription>{errors.archive_reason}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="archive_notes">Additional Notes (Optional)</Label>
                                    <Textarea
                                        id="archive_notes"
                                        placeholder="Enter any additional notes..."
                                        value={data.archive_notes}
                                        onChange={(e) => setData('archive_notes', e.target.value)}
                                        rows={2}
                                    />
                                    {errors.archive_notes && (
                                        <Alert>
                                            <AlertDescription>{errors.archive_notes}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                <div className="flex space-x-2">
                                    <Button onClick={handleArchive} disabled={processing || !data.archive_status || !data.archive_reason || !data.archive_case_number || !data.archive_court_order}>
                                        <Archive className="h-4 w-4 mr-2" />
                                        {processing ? 'Archiving...' : 'Archive PDL'}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Alert>
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>
                                        This PDL record is currently archived. You can unarchive it if needed.
                                    </AlertDescription>
                                </Alert>
                                <Button onClick={handleUnarchive} disabled={processing} variant="outline">
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    {processing ? 'Unarchiving...' : 'Unarchive PDL'}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Archive Requirements */}
                <Card>
                    <CardHeader>
                        <CardTitle>Archive Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p>• <strong>Archive Status:</strong> Select the appropriate status from the dropdown</p>
                            <p>• <strong>Case Number:</strong> Must match an existing case number for this PDL</p>
                            <p>• <strong>Court Order:</strong> Upload PDF, JPG, JPEG, or PNG document (required)</p>
                            <p>• <strong>Reason for Archiving:</strong> Provide a detailed reason for archiving this record</p>
                            <p>• <strong>Date and Time:</strong> Automatically generated by the system upon archiving</p>
                            <p>• <strong>Additional Notes:</strong> Optional field for any additional remarks</p>
                            <p>• <strong>Custody Dates:</strong> Set admission and release dates for proper record keeping</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
