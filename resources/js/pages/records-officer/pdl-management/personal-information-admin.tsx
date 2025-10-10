import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { ViewPdlInformation } from '@/features/pdl-management/view-pdl-information';
import AppLayout from '@/layouts/app-layout';
import { getAge } from '@/lib/dateUtils';
import { PageProps, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Archive, Edit } from 'lucide-react';
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

    const {
        data: custodyData,
        setData: setCustodyData,
        post: postCustody,
        processing: custodyProcessing,
    } = useForm({
        admission_date: '',
        release_date: '',
    });

    const {
        data: courtOrderData,
        setData: setCourtOrderData,
        post: postCourtOrder,
        processing: courtOrderProcessing,
    } = useForm({
        court_order_number: '',
        order_type: '',
        order_date: '',
        received_date: '',
        remarks: '',
        document_type: '',
        court_branch: '',
    });

    const {
        data: archiveData,
        setData: setArchiveData,
        post: postArchive,
        processing: archiveProcessing,
    } = useForm({
        archive_status: '',
        archive_reason: '',
        archive_court_order_type: '',
        archive_court_order_file: null as File | null,
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
            archive_court_order_type: '',
            archive_court_order_file: null,
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
                },
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
                },
            });
        }
    };

    const handleArchiveSubmit = () => {
        if (selectedPdl) {
            console.log('Submitting archive data:', archiveData);
            console.log('Selected PDL:', selectedPdl);
            console.log('Route URL:', route('pdl.archive', selectedPdl.id));

            postArchive(route('pdl.archive', selectedPdl.id), {
                onSuccess: (page) => {
                    console.log('Archive successful', page);
                    // Keep dialog open to show success message
                    // setArchiveDialogOpen(false);
                    setArchiveData({
                        archive_status: '',
                        archive_reason: '',
                        archive_court_order_type: '',
                        archive_court_order_file: null,
                    });
                },
                onError: (errors) => {
                    console.error('Archive errors:', errors);
                    // Keep dialog open to show error messages
                },
                onFinish: () => {
                    console.log('Archive request finished');
                },
            });
        }
    };
    const successMessage = props.success;

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

                                <div className="flex gap-2">
                                    {!isAdmin && (
                                        <Link
                                            href="/pdl-management/personal-information/create"
                                            className="flex items-center gap-2 rounded-sm bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
                                        >
                                            Add PDL Information
                                        </Link>
                                    )}
                                </div>
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
                                                <TableCell>
                                                    {`${verification.pdl.fname} ${verification.pdl.mname} ${verification.pdl.lname}`
                                                        .split(' ')
                                                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                                        .join(' ')}
                                                </TableCell>
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
                                                    {!isAdmin && (
                                                        <Button variant="outline" size="sm" onClick={() => handleArchive(verification.pdl)}>
                                                            <Archive className="mr-1 h-4 w-4" />
                                                            Archive
                                                        </Button>
                                                    )}

                                                    {!isAdmin && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                window.location.href = `/record-officer/pdl-management/personal-information/${verification.pdl.id}`;
                                                            }}
                                                        >
                                                            <Edit className="mr-1 h-4 w-4" />
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
                            {Object.keys(errors).length > 0 && (
                                <Alert variant="destructive" className="mt-4 mb-4">
                                    <AlertTitle>Unable to process request</AlertTitle>
                                    <AlertDescription>
                                        {Object.values(errors).map((error, index) => (
                                            <ul className="list-inside list-disc text-sm" key={index}>
                                                <li>{error}</li>
                                            </ul>
                                        ))}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {successMessage && (
                                <Alert variant="default" className="mb-4">
                                    <AlertTitle>Success</AlertTitle>
                                    <AlertDescription>{successMessage}</AlertDescription>
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
                            {Object.keys(errors).length > 0 && (
                                <Alert variant="destructive" className="mt-4 mb-4">
                                    <AlertTitle>Unable to process request</AlertTitle>
                                    <AlertDescription>
                                        {Object.values(errors).map((error, index) => (
                                            <ul className="list-inside list-disc text-sm" key={index}>
                                                <li>{error}</li>
                                            </ul>
                                        ))}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {successMessage && (
                                <Alert variant="default" className="mb-4">
                                    <AlertTitle>Success</AlertTitle>
                                    <AlertDescription>{successMessage}</AlertDescription>
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
                                Archive {selectedPdl?.fname} {selectedPdl?.lname}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                     

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
                                <Label htmlFor="archive_court_order_type">Court Order Type *</Label>
                                <Select
                                    value={archiveData.archive_court_order_type}
                                    onValueChange={(value) => setArchiveData('archive_court_order_type', value)}
                                >
                                    <SelectTrigger className={errors?.archive_court_order_type ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Select court order type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="RELEASE">Release Order</SelectItem>
                                        <SelectItem value="BAIL">Bail Order</SelectItem>
                                        <SelectItem value="SERVED_SENTENCE">Served Sentence</SelectItem>
                                        <SelectItem value="PROBATION">Probation Order</SelectItem>
                                        <SelectItem value="PAROLE">Parole Order</SelectItem>
                                        <SelectItem value="TRANSFER">Transfer Order</SelectItem>
                                        <SelectItem value="OTHER">Other Court Order</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="archive_court_order_file">Court Order Document *</Label>
                                <Input
                                    id="archive_court_order_file"
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => setArchiveData('archive_court_order_file', e.target.files?.[0] || null)}
                                    className={errors?.archive_court_order_file ? 'border-red-500' : ''}
                                />
                                <p className="text-sm text-gray-500">Upload PDF, JPG, JPEG, or PNG file (max 10MB)</p>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setArchiveDialogOpen(false)}>
                                    Cancel
                                </Button>
                                {flash?.success ? (
                                    <Button onClick={() => setArchiveDialogOpen(false)}>Close</Button>
                                ) : (
                                    <Button
                                        onClick={handleArchiveSubmit}
                                        disabled={
                                            archiveProcessing ||
                                            !archiveData.archive_status ||
                                            !archiveData.archive_reason ||
                                            !archiveData.archive_court_order_type ||
                                            !archiveData.archive_court_order_file
                                        }
                                    >
                                        {archiveProcessing ? 'Archiving...' : 'Archive PDL'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
