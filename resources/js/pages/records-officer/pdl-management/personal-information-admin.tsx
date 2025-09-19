import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ViewPdlInformation } from '@/features/pdl-management/view-pdl-information';
import AppLayout from '@/layouts/app-layout';
import { getAge } from '@/lib/dateUtils';
import { PageProps, type BreadcrumbItem } from '@/types';
import { Head, usePage, Link, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Archive, Calendar, FileText, Edit, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'PDL Management',
        href: '/pdl-management',
    },
];

interface PersonalInformationProps extends PageProps {
    verifications: any[];
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: any;
}

export default function PersonalInformation() {
    const { props } = usePage<PersonalInformationProps>();
    const { verifications, flash } = props;
    console.log('Verifications:', verifications);

    const { auth, errors } = props;
    const isAdmin = auth?.user?.position === 'admin';

    const [selectedPdl, setSelectedPdl] = useState<any>(null);
    const [custodyDialogOpen, setCustodyDialogOpen] = useState(false);
    const [courtOrderDialogOpen, setCourtOrderDialogOpen] = useState(false);
    const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);

    const { data: custodyData, setData: setCustodyData, post: postCustody, processing: custodyProcessing } = useForm({
        admission_date: '',
        release_date: '',
    });

    const { data: courtOrderData, setData: setCourtOrderData, post: postCourtOrder, processing: courtOrderProcessing } = useForm({
        court_order_number: '',
        order_type: '',
        order_date: '',
        received_date: '',
        remarks: '',
        document_type: '',
        court_branch: '',
    });

    const { data: archiveData, setData: setArchiveData, post: postArchive, processing: archiveProcessing } = useForm({
        archive_status: '',
        archive_reason: '',
        archive_case_number: '',
        archive_court_order: null as File | null,
        archive_notes: '',
    });

    const handleCustodyDates = (pdl: any) => {
        setSelectedPdl(pdl);
        setCustodyData({
            admission_date: pdl.admission_date ? pdl.admission_date.split('T')[0] : '',
            release_date: pdl.release_date ? pdl.release_date.split('T')[0] : '',
        });
        setCustodyDialogOpen(true);
    };

    const handleUpdateCourtOrder = (pdl: any) => {
        setSelectedPdl(pdl);
        // Get the first court order for this PDL
        const firstCourtOrder = pdl.courtOrders?.[0];
        setCourtOrderData({
            court_order_number: firstCourtOrder?.court_order_number || '',
            order_type: firstCourtOrder?.order_type || '',
            order_date: firstCourtOrder?.order_date ? firstCourtOrder.order_date.split('T')[0] : '',
            received_date: firstCourtOrder?.received_date ? firstCourtOrder.received_date.split('T')[0] : '',
            remarks: firstCourtOrder?.remarks || '',
            document_type: firstCourtOrder?.document_type || '',
            court_branch: firstCourtOrder?.court_branch || '',
        });
        setCourtOrderDialogOpen(true);
    };

    const handleArchive = (pdl: any) => {
        setSelectedPdl(pdl);
        setArchiveData({
            archive_status: '',
            archive_reason: '',
            archive_case_number: '',
            archive_court_order: null,
            archive_notes: '',
        });
        setArchiveDialogOpen(true);
    };

    const handleCustodySubmit = () => {
        if (selectedPdl) {
            postCustody(route('pdl.custody-dates', selectedPdl.id), {
                onSuccess: () => {
                    setCustodyDialogOpen(false);
                    setCustodyData({
                        admission_date: '',
                        release_date: '',
                    });
                },
                onError: (errors) => {
                    console.error('Custody dates update errors:', errors);
                }
            });
        }
    };

    const handleCourtOrderSubmit = () => {
        if (selectedPdl) {
            postCourtOrder(route('pdl.court-order-update', selectedPdl.id), {
                onSuccess: () => {
                    setCourtOrderDialogOpen(false);
                    setCourtOrderData({
                        court_order_number: '',
                        order_type: '',
                        order_date: '',
                        received_date: '',
                        remarks: '',
                        document_type: '',
                        court_branch: '',
                    });
                },
                onError: (errors) => {
                    console.error('Court order update errors:', errors);
                }
            });
        }
    };

    const handleArchiveSubmit = () => {
        if (selectedPdl) {
            postArchive(route('pdl.archive', selectedPdl.id), {
                onSuccess: () => {
                    setArchiveDialogOpen(false);
                    setArchiveData({
                        archive_status: '',
                        archive_reason: '',
                        archive_case_number: '',
                        archive_court_order: null,
                        archive_notes: '',
                    });
                },
                onError: (errors) => {
                    console.error('Archive errors:', errors);
                }
            });
        }
    };

    console.log('Is Admin:', isAdmin);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Personal Information" />

            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-2xl font-bold">Personal Information</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <div className="flex items-center justify-between">
                                <span>Personal Information List</span>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Full Name</TableHead>
                                    <TableHead>Alias</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Ethnic Group</TableHead>
                                    <TableHead>Civil Status</TableHead>
                                    <TableHead>Date of Birth</TableHead>
                                    <TableHead>Age</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Added By</TableHead>

                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {verifications?.map(
                                    (verification: any) =>
                                        verification.pdl && (
                                            <TableRow key={verification.pdl.id}>
                                                <TableCell>{verification.pdl.id}</TableCell>
                                                <TableCell>{`${verification.pdl.fname} ${verification.pdl.lname}`}</TableCell>
                                                <TableCell>{verification.pdl.alias ?? '-'}</TableCell>
                                                <TableCell>{verification.pdl.gender ?? '-'}</TableCell>
                                                <TableCell>{verification.pdl.ethnic_group ?? '-'}</TableCell>
                                                <TableCell>{verification.pdl.civil_status ?? '-'}</TableCell>
                                                <TableCell>{format(new Date(verification.pdl.birthdate), 'MMMM dd, yyyy')}</TableCell>
                                                <TableCell>{getAge(verification.pdl.birthdate)}</TableCell>
                                                <TableCell>{`${verification.pdl.brgy ?? ''}, ${verification.pdl.city ?? ''}, ${verification.pdl.province ?? ''}`}</TableCell>
                                                <TableCell>
                                                    {verification.pdl.personnel
                                                        ? `${verification.pdl.personnel.fname} ${verification.pdl.personnel.lname}`
                                                        : '—'}
                                                </TableCell>

                                                <TableCell className="space-x-1">
                                                    <ViewPdlInformation pdl={verification.pdl} />

                                                    {/* <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleArchive(verification.pdl)}
                                                    >
                                                        <Archive className="h-4 w-4 mr-1" />
                                                        Archive
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleCustodyDates(verification.pdl)}
                                                    >
                                                        <Calendar className="h-4 w-4 mr-1" />
                                                        Manage Custody Dates
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleUpdateCourtOrder(verification.pdl)}
                                                    >
                                                        <FileText className="h-4 w-4 mr-1" />
                                                        Update Court Order
                                                    </Button> */}

                                                    {!isAdmin && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                window.location.href = `/record-officer/pdl-management/personal-information/${verification.pdl.id}`;
                                                            }}
                                                        >
                                                            <Edit className="h-4 w-4 mr-1" />
                                                            Edit
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ),
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Manage Custody Dates Dialog */}
                <Dialog open={custodyDialogOpen} onOpenChange={setCustodyDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Manage Custody Dates</DialogTitle>
                            <DialogDescription>
                                Update admission and release dates for {selectedPdl?.fname} {selectedPdl?.lname}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            {flash?.success && (
                                <Alert className="border-green-200 bg-green-50">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-800">
                                        {flash.success}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {errors?.admission_date && (
                                <Alert className="border-red-200 bg-red-50">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <AlertDescription className="text-red-800">
                                        {errors.admission_date}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {errors?.release_date && (
                                <Alert className="border-red-200 bg-red-50">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <AlertDescription className="text-red-800">
                                        {errors.release_date}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="admission_date">Admission Date</Label>
                                <Input
                                    id="admission_date"
                                    type="date"
                                    value={custodyData.admission_date}
                                    onChange={(e) => setCustodyData('admission_date', e.target.value)}
                                    className={errors?.admission_date ? 'border-red-500' : ''}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="release_date">Release Date</Label>
                                <Input
                                    id="release_date"
                                    type="date"
                                    value={custodyData.release_date}
                                    onChange={(e) => setCustodyData('release_date', e.target.value)}
                                    className={errors?.release_date ? 'border-red-500' : ''}
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setCustodyDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCustodySubmit} disabled={custodyProcessing}>
                                    {custodyProcessing ? 'Updating...' : 'Update Dates'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Update Court Order Dialog */}
                <Dialog open={courtOrderDialogOpen} onOpenChange={setCourtOrderDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Update Court Order</DialogTitle>
                            <DialogDescription>
                                Update court order information for {selectedPdl?.fname} {selectedPdl?.lname}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            {flash?.success && (
                                <Alert className="border-green-200 bg-green-50">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-800">
                                        {flash.success}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {errors?.court_order_number && (
                                <Alert className="border-red-200 bg-red-50">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <AlertDescription className="text-red-800">
                                        {errors.court_order_number}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="court_order_number">Court Order Number</Label>
                                <Input
                                    id="court_order_number"
                                    value={courtOrderData.court_order_number}
                                    onChange={(e) => setCourtOrderData('court_order_number', e.target.value)}
                                    className={errors?.court_order_number ? 'border-red-500' : ''}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="order_type">Order Type</Label>
                                <Input
                                    id="order_type"
                                    value={courtOrderData.order_type}
                                    onChange={(e) => setCourtOrderData('order_type', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="order_date">Order Date</Label>
                                    <Input
                                        id="order_date"
                                        type="date"
                                        value={courtOrderData.order_date}
                                        onChange={(e) => setCourtOrderData('order_date', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="received_date">Received Date</Label>
                                    <Input
                                        id="received_date"
                                        type="date"
                                        value={courtOrderData.received_date}
                                        onChange={(e) => setCourtOrderData('received_date', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="court_branch">Court Branch</Label>
                                <Input
                                    id="court_branch"
                                    value={courtOrderData.court_branch}
                                    onChange={(e) => setCourtOrderData('court_branch', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="remarks">Remarks</Label>
                                <Textarea
                                    id="remarks"
                                    value={courtOrderData.remarks}
                                    onChange={(e) => setCourtOrderData('remarks', e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setCourtOrderDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleCourtOrderSubmit} disabled={courtOrderProcessing}>
                                    {courtOrderProcessing ? 'Updating...' : 'Update Court Order'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Archive Dialog */}
                <Dialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Archive PDL</DialogTitle>
                            <DialogDescription>
                                Archive {selectedPdl?.fname} {selectedPdl?.lname} with court order information
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            {flash?.success && (
                                <Alert className="border-green-200 bg-green-50">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-800">
                                        {flash.success}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {errors?.archive_status && (
                                <Alert className="border-red-200 bg-red-50">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <AlertDescription className="text-red-800">
                                        {errors.archive_status}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {errors?.archive_reason && (
                                <Alert className="border-red-200 bg-red-50">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <AlertDescription className="text-red-800">
                                        {errors.archive_reason}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {errors?.archive_case_number && (
                                <Alert className="border-red-200 bg-red-50">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <AlertDescription className="text-red-800">
                                        {errors.archive_case_number}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {errors?.archive_court_order && (
                                <Alert className="border-red-200 bg-red-50">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <AlertDescription className="text-red-800">
                                        {errors.archive_court_order}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="archive_status">Archive Status *</Label>
                                <Select value={archiveData.archive_status} onValueChange={(value) => setArchiveData('archive_status', value)}>
                                    <SelectTrigger className={errors?.archive_status ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Select archive status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BONDED">BONDED</SelectItem>
                                        <SelectItem value="SERVED_SENTENCE">SERVED SENTENCE</SelectItem>
                                        <SelectItem value="PROV_DISMISSED">PROV. DISMISSED</SelectItem>
                                        <SelectItem value="DISMISSED">DISMISSED</SelectItem>
                                        <SelectItem value="TRANSFER_TO_OTHER_FACILITY">TRANSFER TO OTHER FACILITY</SelectItem>
                                        <SelectItem value="DAPECOL">DAPECOL</SelectItem>
                                        <SelectItem value="PROBATION">PROBATION</SelectItem>
                                        <SelectItem value="DECEASED">DECEASED</SelectItem>
                                        <SelectItem value="ACQUITTED">ACQUITTED</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="archive_case_number">Case Number *</Label>
                                <Input
                                    id="archive_case_number"
                                    value={archiveData.archive_case_number}
                                    onChange={(e) => setArchiveData('archive_case_number', e.target.value)}
                                    placeholder="Enter case number"
                                    className={errors?.archive_case_number ? 'border-red-500' : ''}
                                />
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
                                                setArchiveData('archive_court_order', file);
                                            }
                                        }}
                                        className={`flex-1 ${errors?.archive_court_order ? 'border-red-500' : ''}`}
                                    />
                                    <Upload className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Upload PDF, JPG, JPEG, or PNG file (max 10MB)
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="archive_reason">Reason for Archiving *</Label>
                                <Textarea
                                    id="archive_reason"
                                    placeholder="Enter the reason for archiving this PDL record..."
                                    value={archiveData.archive_reason}
                                    onChange={(e) => setArchiveData('archive_reason', e.target.value)}
                                    rows={3}
                                    className={errors?.archive_reason ? 'border-red-500' : ''}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="archive_notes">Additional Notes (Optional)</Label>
                                <Textarea
                                    id="archive_notes"
                                    placeholder="Enter any additional notes..."
                                    value={archiveData.archive_notes}
                                    onChange={(e) => setArchiveData('archive_notes', e.target.value)}
                                    rows={2}
                                />
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setArchiveDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleArchiveSubmit}
                                    disabled={archiveProcessing || !archiveData.archive_status || !archiveData.archive_reason || !archiveData.archive_case_number || !archiveData.archive_court_order}
                                >
                                    {archiveProcessing ? 'Archiving...' : 'Archive PDL'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
