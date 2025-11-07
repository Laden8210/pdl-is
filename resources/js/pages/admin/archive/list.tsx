import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { PageProps, type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { ArchiveRestore, Check, ChevronsUpDown, Eye, FileText, Plus, Search, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Archives',
        href: '/archives',
    },
];

const criminalCaseTypes = [
    // Violent Crimes
    {
        category: 'Violent Crimes',
        cases: [
            'Murder',
            'Homicide',
            'Manslaughter',
            'Assault',
            'Battery',
            'Robbery',
            'Armed Robbery',
            'Kidnapping',
            'Abduction',
            'Rape',
            'Sexual Assault',
            'Domestic Violence',
            'Child Abuse',
            'Elder Abuse',
            'Hate Crime',
            'Terrorism',
            'Mass Shooting',
            'Gang Violence',
        ],
    },
    // Property Crimes
    {
        category: 'Property Crimes',
        cases: [
            'Theft',
            'Burglary',
            'Larceny',
            'Embezzlement',
            'Fraud',
            'Identity Theft',
            'Credit Card Fraud',
            'Insurance Fraud',
            'Tax Evasion',
            'Money Laundering',
            'Arson',
            'Vandalism',
            'Trespassing',
            'Shoplifting',
            'Auto Theft',
            'Grand Theft',
            'Petty Theft',
        ],
    },
    // Drug Crimes
    {
        category: 'Drug Crimes',
        cases: [
            'Drug Possession',
            'Drug Trafficking',
            'Drug Manufacturing',
            'Drug Distribution',
            'Drug Importation',
            'Prescription Drug Fraud',
            'Drug Paraphernalia',
            'Marijuana Possession',
            'Cocaine Possession',
            'Heroin Possession',
            'Methamphetamine',
            'Ecstasy',
            'LSD',
            'Synthetic Drugs',
        ],
    },
    // White Collar Crimes
    {
        category: 'White Collar Crimes',
        cases: [
            'Corporate Fraud',
            'Securities Fraud',
            'Bank Fraud',
            'Wire Fraud',
            'Mail Fraud',
            'Internet Fraud',
            'Ponzi Scheme',
            'Insider Trading',
            'Bribery',
            'Corruption',
            'Extortion',
            'Racketeering',
            'Organized Crime',
            'Cybercrime',
            'Identity Theft',
            'Forgery',
            'Counterfeiting',
        ],
    },
    // Traffic Violations
    {
        category: 'Traffic Violations',
        cases: [
            'DUI/DWI',
            'Reckless Driving',
            'Hit and Run',
            'Driving Without License',
            'Driving Under Suspension',
            'Speeding',
            'Running Red Light',
            'Illegal Parking',
            'Vehicle Registration Violation',
            'Driving Without Insurance',
            'Vehicular Manslaughter',
            'Street Racing',
        ],
    },
    // Public Order Crimes
    {
        category: 'Public Order Crimes',
        cases: [
            'Disorderly Conduct',
            'Public Intoxication',
            'Disturbing the Peace',
            'Loitering',
            'Prostitution',
            'Solicitation',
            'Public Indecency',
            'Trespassing',
            'Vagrancy',
            'Panhandling',
            'Noise Violation',
            'Public Nuisance',
            'Obstruction of Justice',
            'Resisting Arrest',
            'Escape from Custody',
        ],
    },
    // Juvenile Crimes
    {
        category: 'Juvenile Crimes',
        cases: [
            'Truancy',
            'Curfew Violation',
            'Underage Drinking',
            'Underage Smoking',
            'Graffiti',
            'Vandalism',
            'Shoplifting',
            'Fighting',
            'Bullying',
            'Cyberbullying',
            'Sexting',
            'Gang Activity',
        ],
    },
    // Federal Crimes
    {
        category: 'Federal Crimes',
        cases: [
            'Tax Evasion',
            'Immigration Violation',
            'Customs Violation',
            'Border Crossing',
            'Human Trafficking',
            'Drug Trafficking',
            'Weapons Trafficking',
            'Terrorism',
            'Espionage',
            'Treason',
            'Sedition',
            'Federal Fraud',
            'Bank Robbery',
            'Postal Crime',
            'Interstate Crime',
        ],
    },
    // Other Crimes
    {
        category: 'Other Crimes',
        cases: [
            'Contempt of Court',
            'Perjury',
            'Obstruction of Justice',
            'Escape',
            'Parole Violation',
            'Probation Violation',
            'Failure to Appear',
            'Bail Jumping',
            'Witness Tampering',
            'Jury Tampering',
            'Election Fraud',
            'Environmental Crime',
            'Animal Cruelty',
            'Stalking',
            'Harassment',
        ],
    },
];

interface ArchiveIndexProps extends PageProps {
    archivedUsers: {
        personnel: any[];
        pdls: any[];
    };
    userRole: string;
    [key: string]: unknown;
}

export default function ArchiveIndex({ archivedUsers, userRole }: ArchiveIndexProps) {
    const { props } = usePage<ArchiveIndexProps>();
    const { flash, errors } = props;

    const [selectedPdl, setSelectedPdl] = useState<any>(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [unarchiveDialogOpen, setUnarchiveDialogOpen] = useState(false);
    const [pdlToUnarchive, setPdlToUnarchive] = useState<any>(null);
    const [restorePersonnelDialogOpen, setRestorePersonnelDialogOpen] = useState(false);
    const [personnelToRestore, setPersonnelToRestore] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [newCases, setNewCases] = useState<any[]>([]);
    const [unarchiveReason, setUnarchiveReason] = useState('');
    const [unarchiveRemarks, setUnarchiveRemarks] = useState('');
    const [crimeCommittedOpen, setCrimeCommittedOpen] = useState(false);

    const { post: postRestorePersonnel, processing: restorePersonnelProcessing } = useForm();

    const {
        post: postUnarchive,
        processing: unarchiveProcessing,
        data: unarchiveData,
        setData: setUnarchiveData,
    } = useForm({
        cases: [
            {
                case_number: '',
                crime_committed: '',
                date_committed: '',
                time_committed: '',
                case_status: 'open',
                case_remarks: '',
                security_classification: 'medium',
                drug_related: false,
            },
        ] as any[],
        unarchive_reason: '',
        unarchive_remarks: '',
    });

    const handleUnarchive = (pdl: any) => {
        setPdlToUnarchive(pdl);
        const initialCases = [
            {
                case_number: '',
                crime_committed: '',
                date_committed: '',
                time_committed: '',
                case_status: 'open',
                case_remarks: '',
                security_classification: 'medium',
                drug_related: false,
            },
        ];

        setNewCases(initialCases);
        setUnarchiveReason('');
        setUnarchiveRemarks('');

        // Also set the form data
        setUnarchiveData({
            cases: initialCases,
            unarchive_reason: '',
            unarchive_remarks: '',
        });

        setUnarchiveDialogOpen(true);
    };

    const addNewCase = () => {
        const updatedCases = [
            ...newCases,
            {
                case_number: '',
                crime_committed: '',
                date_committed: '',
                time_committed: '',
                case_status: 'open',
                case_remarks: '',
                security_classification: 'medium',
                drug_related: false,
            },
        ];
        setNewCases(updatedCases);
        // Also update form data
        setUnarchiveData(prev => ({ ...prev, cases: updatedCases }));
    };


    const removeCase = (index: number) => {
        if (newCases.length > 1) {
            setNewCases(newCases.filter((_, i) => i !== index));
        }
    };

    const updateCase = (index: number, field: string, value: any) => {
        const updatedCases = [...newCases];
        updatedCases[index] = { ...updatedCases[index], [field]: value };
        setNewCases(updatedCases);
        // Also update form data
        setUnarchiveData(prev => ({ ...prev, cases: updatedCases }));
    };

    const confirmUnarchive = () => {
        if (pdlToUnarchive) {

            postUnarchive(route('user-pdl-archive.unarchive', pdlToUnarchive.id), {
                onSuccess: () => {
                    setUnarchiveDialogOpen(false);
                    setPdlToUnarchive(null);
                    setNewCases([]);
                    setUnarchiveReason('');
                    setUnarchiveRemarks('');
                },
                onError: (errors) => {
                    console.error('Unarchive errors:', errors);
                },
            });
        }
    };

    const handleViewDetails = (pdl: any) => {
        setSelectedPdl(pdl);
        setViewDialogOpen(true);
    };

    const handleRestorePersonnel = (personnel: any) => {
        setPersonnelToRestore(personnel);
        setRestorePersonnelDialogOpen(true);
    };

    const confirmRestorePersonnel = () => {
        console.log('Personnel ID:', personnelToRestore.id);
        if (personnelToRestore) {
            postRestorePersonnel(route('user-personnel-archive.restore', { personnelId: personnelToRestore.id }), {
                preserveScroll: true,
                onSuccess: () => {
                    setRestorePersonnelDialogOpen(false);
                    setPersonnelToRestore(null);
                },
                onError: (errors) => {
                    console.error('Restore personnel errors:', errors);
                },
            });
        }
    };
    // Filter data based on search term
    const filteredPdls = archivedUsers.pdls.filter(
        (pdl) =>
            pdl.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pdl.lname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pdl.alias?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pdl.archive_status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pdl.archive_case_number?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const filteredPersonnel = archivedUsers.personnel.filter(
        (personnel) =>
            personnel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            personnel.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            personnel.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
            personnel.agency.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const getCourtOrderTypeLabel = (type: string) => {
        const types: { [key: string]: string } = {
            RELEASE: 'Release Order',
            BAIL: 'Bail Order',
            SERVED_SENTENCE: 'Served Sentence',
            PROBATION: 'Probation Order',
            PAROLE: 'Parole Order',
            TRANSFER: 'Transfer Order',
            OTHER: 'Other Court Order',
        };
        return types[type] || type;
    };

    const getArchiveStatusBadge = (status: string) => {
        const statusColors: { [key: string]: string } = {
            BONDED: 'bg-green-100 text-green-800',
            SERVED_SENTENCE: 'bg-blue-100 text-blue-800',
            PROV_DISMISSED: 'bg-yellow-100 text-yellow-800',
            DISMISSED: 'bg-gray-100 text-gray-800',
            TRANSFER_TO_OTHER_FACILITY: 'bg-purple-100 text-purple-800',
            DAPECOL: 'bg-orange-100 text-orange-800',
            PROBATION: 'bg-indigo-100 text-indigo-800',
            DECEASED: 'bg-red-100 text-red-800',
            ACQUITTED: 'bg-green-100 text-green-800',
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800';
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Archived Users" />

            <div className="flex flex-col gap-6 p-4">
                {/* Success Message */}
                {(flash as any)?.success && (
                    <Alert className="border-green-200 bg-green-50">
                        <AlertDescription className="text-green-800">{(flash as any).success}</AlertDescription>
                    </Alert>
                )}

                {/* Error Message */}
                {(errors as any)?.error && (
                    <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-800">{(errors as any).error}</AlertDescription>
                    </Alert>
                )}

                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Archived Users Management</h1>
                        <p className="text-muted-foreground">View and manage all archived PDLs and Personnel records</p>
                    </div>
                    <div className="flex gap-2">
                        {/* <Button variant="outline" size="sm">
                            <ArchiveRestore className="mr-2 h-4 w-4" />
                            Bulk Restore
                        </Button> */}
                    </div>
                </div>

                <Card>
                    <CardHeader className="border-b p-4">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                            <CardTitle className="text-lg">Archived Records</CardTitle>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search archives..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Tabs defaultValue="pdls" className="w-full">
                            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                                <TabsTrigger
                                    value="pdls"
                                    className="relative h-12 rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-background data-[state=active]:shadow-none"
                                >
                                    PDLs
                                    <Badge variant="secondary" className="ml-2">
                                        {filteredPdls.length}
                                    </Badge>
                                </TabsTrigger>
                                {userRole === 'admin' && (
                                    <TabsTrigger
                                        value="personnel"
                                        className="relative h-12 rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:bg-background data-[state=active]:shadow-none"
                                    >
                                        Personnel
                                        <Badge variant="secondary" className="ml-2">
                                            {filteredPersonnel.length}
                                        </Badge>
                                    </TabsTrigger>
                                )}
                            </TabsList>

                            {/* PDLs Tab Content */}
                            <TabsContent value="pdls" className="m-0">
                                <div className="rounded-b-lg">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">ID</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Archive Status</TableHead>
                                                <TableHead>Court Order Type</TableHead>
                                                <TableHead>Case Number</TableHead>
                                                <TableHead>Archived At</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredPdls.length > 0 ? (
                                                filteredPdls.map((pdl: any) => (
                                                    <TableRow key={`pdl-${pdl.id}`} className="hover:bg-muted/50">
                                                        <TableCell className="font-medium">{pdl.id}</TableCell>
                                                        <TableCell>
                                                            <div className="font-medium">
                                                                {pdl.fname} {pdl.lname}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {pdl.alias && `Alias: ${pdl.alias}`}
                                                                {pdl.age && ` • Age: ${pdl.age}`}
                                                                {pdl.gender && ` • ${pdl.gender}`}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={getArchiveStatusBadge(pdl.archive_status)}>{pdl.archive_status}</Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-sm">{getCourtOrderTypeLabel(pdl.archive_court_order_type)}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="font-mono text-sm">{pdl.archive_case_number}</div>
                                                        </TableCell>
                                                        <TableCell>{format(new Date(pdl.archived_at), 'MMM dd, yyyy HH:mm')}</TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8"
                                                                    onClick={() => handleViewDetails(pdl)}
                                                                >
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8"
                                                                    onClick={() => handleUnarchive(pdl)}
                                                                    disabled={unarchiveProcessing}
                                                                >
                                                                    <ArchiveRestore className="mr-2 h-4 w-4" />
                                                                    Restore
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="h-24 text-center">
                                                        <div className="py-8 text-center">
                                                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                                                <ArchiveRestore className="h-6 w-6 text-muted-foreground" />
                                                            </div>
                                                            <h3 className="text-lg font-medium">No archived PDLs found</h3>
                                                            <p className="text-sm text-muted-foreground">All PDL records are currently active</p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>

                            {/* Personnel Tab Content */}
                            <TabsContent value="personnel" className="m-0">
                                <div className="rounded-b-lg">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">ID</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Username</TableHead>
                                                <TableHead>Position</TableHead>
                                                <TableHead>Agency</TableHead>
                                                <TableHead>Archived At</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredPersonnel.length > 0 ? (
                                                filteredPersonnel.map((personnel: any) => (
                                                    <TableRow key={`personnel-${personnel.id}`} className="hover:bg-muted/50">
                                                        <TableCell className="font-medium">{personnel.id}</TableCell>
                                                        <TableCell>
                                                            <div className="font-medium">{personnel.name}</div>
                                                            <div className="text-sm text-muted-foreground">{personnel.type}</div>
                                                        </TableCell>
                                                        <TableCell>{personnel.username}</TableCell>
                                                        <TableCell>{personnel.position}</TableCell>
                                                        <TableCell>{personnel.agency}</TableCell>
                                                        <TableCell>{format(new Date(personnel.deleted_at), 'MMM dd, yyyy HH:mm')}</TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8"
                                                                onClick={() => handleRestorePersonnel(personnel)}
                                                                disabled={restorePersonnelProcessing}
                                                            >
                                                                <ArchiveRestore className="mr-2 h-4 w-4" />
                                                                Restore
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="h-24 text-center">
                                                        <div className="py-8 text-center">
                                                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                                                <ArchiveRestore className="h-6 w-6 text-muted-foreground" />
                                                            </div>
                                                            <h3 className="text-lg font-medium">No archived personnel found</h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                All personnel records are currently active
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* View Details Dialog */}
                <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>
                                Archive Details - {selectedPdl?.fname} {selectedPdl?.lname}
                            </DialogTitle>
                            <DialogDescription>Complete archive information and court order documentation</DialogDescription>
                        </DialogHeader>
                        {selectedPdl && (
                            <div className="space-y-6">
                                {/* Basic Information */}
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <h3 className="mb-3 text-lg font-semibold">Basic Information</h3>
                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <strong>ID:</strong> {selectedPdl.id}
                                            </div>
                                            <div>
                                                <strong>Name:</strong> {selectedPdl.fname} {selectedPdl.lname}
                                            </div>
                                            {selectedPdl.alias && (
                                                <div>
                                                    <strong>Alias:</strong> {selectedPdl.alias}
                                                </div>
                                            )}
                                            <div>
                                                <strong>Age:</strong> {selectedPdl.age}
                                            </div>
                                            <div>
                                                <strong>Gender:</strong> {selectedPdl.gender}
                                            </div>
                                            {selectedPdl.birthdate && (
                                                <div>
                                                    <strong>Birthdate:</strong> {format(new Date(selectedPdl.birthdate), 'MMM dd, yyyy')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="mb-3 text-lg font-semibold">Archive Information</h3>
                                        <div className="space-y-2 text-sm">
                                            <div>
                                                <strong>Archive Status:</strong>
                                                <Badge className={`ml-2 ${getArchiveStatusBadge(selectedPdl.archive_status)}`}>
                                                    {selectedPdl.archive_status}
                                                </Badge>
                                            </div>
                                            <div>
                                                <strong>Archive Reason:</strong> {selectedPdl.archive_reason}
                                            </div>
                                            <div>
                                                <strong>Archived At:</strong> {format(new Date(selectedPdl.archived_at), 'MMM dd, yyyy HH:mm')}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Court Order Information */}
                                <div>
                                    <h3 className="mb-3 text-lg font-semibold">Court Order Documentation</h3>
                                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                                        <div className="space-y-2">
                                            <div>
                                                <strong>Court Order Type:</strong> {getCourtOrderTypeLabel(selectedPdl.archive_court_order_type)}
                                            </div>
                                            <div>
                                                <strong>Case Number:</strong> <span className="font-mono">{selectedPdl.archive_case_number}</span>
                                            </div>
                                            {selectedPdl.archive_court_order_date && (
                                                <div>
                                                    <strong>Court Order Date:</strong>{' '}
                                                    {format(new Date(selectedPdl.archive_court_order_date), 'MMM dd, yyyy HH:mm')}
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            {selectedPdl.archive_court_order_file && (
                                                <div>
                                                    <strong>Court Order Document:</strong>
                                                    <div className="mt-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => window.open(`/storage/${selectedPdl.archive_court_order_file}`, '_blank')}
                                                        >
                                                            <FileText className="mr-2 h-4 w-4" />
                                                            View Document
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end space-x-2 border-t pt-4">
                                    <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                                        Close
                                    </Button>
                                    <Button onClick={() => handleUnarchive(selectedPdl)} disabled={unarchiveProcessing}>
                                        <ArchiveRestore className="mr-2 h-4 w-4" />
                                        Unarchive PDL
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Unarchive Confirmation Dialog */}
                <Dialog open={unarchiveDialogOpen} onOpenChange={setUnarchiveDialogOpen}>
                    <DialogContent className="max-h-[90vh] overflow-auto" style={{ width: '500px' }}>
                        <DialogHeader>
                            <DialogTitle>Confirm Unarchive</DialogTitle>
                            <DialogDescription>Are you sure you want to unarchive this PDL record?</DialogDescription>
                        </DialogHeader>
                        {pdlToUnarchive && (
                            <div className="space-y-4">
                                <div className="rounded-md bg-gray-50 p-4">
                                    <h3 className="mb-2 font-semibold text-gray-900">PDL Information</h3>
                                    <div className="space-y-1 text-sm text-gray-700">
                                        <div>
                                            <strong>Name:</strong> {pdlToUnarchive.fname} {pdlToUnarchive.lname}
                                        </div>
                                        <div>
                                            <strong>ID:</strong> {pdlToUnarchive.id}
                                        </div>
                                        <div>
                                            <strong>Archive Status:</strong>
                                            <Badge className={`ml-2 ${getArchiveStatusBadge(pdlToUnarchive.archive_status)}`}>
                                                {pdlToUnarchive.archive_status}
                                            </Badge>
                                        </div>
                                        <div>
                                            <strong>Archived At:</strong> {format(new Date(pdlToUnarchive.archived_at), 'MMM dd, yyyy HH:mm')}
                                        </div>
                                    </div>
                                </div>

                                {/* Unarchive Reason and Remarks */}
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="unarchive_reason">
                                            Reason for Unarchiving <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="unarchive_reason"
                                            value={unarchiveData.unarchive_reason}
                                            onChange={(e) => setUnarchiveData('unarchive_reason', e.target.value)}
                                            placeholder="Enter the reason for unarchiving this PDL..."
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="unarchive_remarks">Additional Remarks</Label>
                                        <Textarea
                                            id="unarchive_remarks"
                                            value={unarchiveData.unarchive_remarks}
                                            onChange={(e) => setUnarchiveData('unarchive_remarks', e.target.value)}
                                            placeholder="Enter any additional remarks or notes..."
                                            rows={2}
                                        />
                                    </div>
                                </div>

                                {/* Cases Information */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">New Case Information</h3>
                                        <Button type="button" variant="outline" size="sm" onClick={addNewCase} className="flex items-center gap-2">
                                            <Plus className="h-4 w-4" />
                                            Add Case
                                        </Button>
                                    </div>

                                    <Accordion type="single" collapsible className="w-full">
                                        {newCases.map((caseItem, index) => (
                                            <AccordionItem key={index} value={`case-${index}`}>
                                                <AccordionTrigger className="hover:no-underline">
                                                    <div className="flex w-full items-center justify-between pr-4">
                                                        <span>Case {index + 1}</span>
                                                        {newCases.length > 1 && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    removeCase(index);
                                                                }}
                                                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="space-y-4 pt-4">
                                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                            <div className="col-span-2">
                                                                <Label htmlFor={`case_number_${index}`}>
                                                                    Case Number <span className="text-red-500">*</span>
                                                                </Label>
                                                                <Input
                                                                    id={`case_number_${index}`}
                                                                    value={caseItem.case_number}
                                                                    onChange={(e) => updateCase(index, 'case_number', e.target.value)}
                                                                    placeholder="Enter case number"
                                                                />
                                                            </div>
                                                            <div className="col-span-2">
                                                                <Label htmlFor={`crime_committed_${index}`}>
                                                                    Crime Committed <span className="text-red-500">*</span>
                                                                </Label>
                                                                <Popover open={crimeCommittedOpen} onOpenChange={setCrimeCommittedOpen}>
                                                                    <PopoverTrigger asChild>
                                                                        <Button
                                                                            variant="outline"
                                                                            role="combobox"
                                                                            aria-expanded={crimeCommittedOpen}
                                                                            className="w-full justify-between"
                                                                        >
                                                                            {caseItem.crime_committed || 'Select or type crime committed...'}
                                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                        </Button>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-full p-0" align="start">
                                                                        <Command>
                                                                            <CommandInput
                                                                                placeholder="Search crimes or type custom..."
                                                                                value={caseItem.crime_committed}
                                                                                onValueChange={(value) => updateCase(index, 'crime_committed', value)}
                                                                            />
                                                                            <CommandList>
                                                                                <CommandEmpty>
                                                                                    <div className="p-2 text-sm text-muted-foreground">
                                                                                        No crime found. Press Enter to add "
                                                                                        {caseItem.crime_committed || ''}" as custom crime.
                                                                                    </div>
                                                                                </CommandEmpty>
                                                                                {criminalCaseTypes.map((category) => (
                                                                                    <CommandGroup key={category.category} heading={category.category}>
                                                                                        {category.cases.map((crime) => (
                                                                                            <CommandItem
                                                                                                key={crime}
                                                                                                value={crime}
                                                                                                onSelect={(currentValue) => {
                                                                                                    updateCase(
                                                                                                        index,
                                                                                                        'crime_committed',
                                                                                                        currentValue,
                                                                                                    );
                                                                                                    setCrimeCommittedOpen(false);
                                                                                                }}
                                                                                            >
                                                                                                <Check
                                                                                                    className={`mr-2 h-4 w-4 ${
                                                                                                        caseItem.crime_committed?.crime_committed ===
                                                                                                        crime
                                                                                                            ? 'opacity-100'
                                                                                                            : 'opacity-0'
                                                                                                    }`}
                                                                                                />
                                                                                                {crime}
                                                                                            </CommandItem>
                                                                                        ))}
                                                                                    </CommandGroup>
                                                                                ))}
                                                                            </CommandList>
                                                                        </Command>
                                                                    </PopoverContent>
                                                                </Popover>
                                                            </div>
                                                            <div>
                                                                <Label htmlFor={`date_committed_${index}`}>
                                                                    Date Committed <span className="text-red-500">*</span>
                                                                </Label>
                                                                <Input
                                                                    id={`date_committed_${index}`}
                                                                    type="date"
                                                                    value={caseItem.date_committed}
                                                                    onChange={(e) => updateCase(index, 'date_committed', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label htmlFor={`time_committed_${index}`}>
                                                                    Time Committed <span className="text-red-500">*</span>
                                                                </Label>
                                                                <Input
                                                                    id={`time_committed_${index}`}
                                                                    type="time"
                                                                    value={caseItem.time_committed}
                                                                    onChange={(e) => updateCase(index, 'time_committed', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label htmlFor={`case_status_${index}`}>
                                                                    Case Status <span className="text-red-500">*</span>
                                                                </Label>
                                                                <Select
                                                                    value={caseItem.case_status}
                                                                    onValueChange={(value) => updateCase(index, 'case_status', value)}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select case status" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>

                                                                        <SelectItem value="on_trial">On Trial</SelectItem>
                                                                        <SelectItem value="convicted">Convicted</SelectItem>

                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <Label htmlFor={`security_classification_${index}`}>
                                                                    Security Classification <span className="text-red-500">*</span>
                                                                </Label>
                                                                <Select
                                                                    value={caseItem.security_classification}
                                                                    onValueChange={(value) => updateCase(index, 'security_classification', value)}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select classification" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="low">Low</SelectItem>
                                                                        <SelectItem value="medium">Medium</SelectItem>
                                                                        <SelectItem value="high">High</SelectItem>
                                                                        <SelectItem value="maximum">Maximum</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Label>Drug Related</Label>
                                                            <RadioGroup
                                                                value={caseItem.drug_related ? 'yes' : 'no'}
                                                                onValueChange={(value) => updateCase(index, 'drug_related', value === 'yes')}
                                                            >
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value="yes" id={`drug_yes_${index}`} />
                                                                    <Label htmlFor={`drug_yes_${index}`}>Yes</Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <RadioGroupItem value="no" id={`drug_no_${index}`} />
                                                                    <Label htmlFor={`drug_no_${index}`}>No</Label>
                                                                </div>
                                                            </RadioGroup>
                                                        </div>
                                                        <div>
                                                            <Label htmlFor={`case_remarks_${index}`}>Case Remarks</Label>
                                                            <Textarea
                                                                id={`case_remarks_${index}`}
                                                                value={caseItem.case_remarks}
                                                                onChange={(e) => updateCase(index, 'case_remarks', e.target.value)}
                                                                placeholder="Enter case-related remarks..."
                                                                rows={3}
                                                            />
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>

                                <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
                                            <div className="mt-2 text-sm text-yellow-700">
                                                <p>
                                                    This action will restore the PDL record to active status and remove all archive information. The
                                                    PDL will appear in the main list again.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setUnarchiveDialogOpen(false);
                                            setPdlToUnarchive(null);
                                        }}
                                        disabled={unarchiveProcessing}
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={confirmUnarchive} disabled={unarchiveProcessing} className="bg-red-600 hover:bg-red-700">
                                        {unarchiveProcessing ? 'Unarchiving...' : 'Yes, Unarchive PDL'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Personnel Restore Confirmation Dialog */}
                <Dialog open={restorePersonnelDialogOpen} onOpenChange={setRestorePersonnelDialogOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Confirm Restore Personnel</DialogTitle>
                            <DialogDescription>Are you sure you want to restore this personnel record?</DialogDescription>
                        </DialogHeader>
                        {personnelToRestore && (
                            <div className="space-y-4">
                                <div className="rounded-md bg-gray-50 p-4">
                                    <h3 className="mb-2 font-semibold text-gray-900">Personnel Information</h3>
                                    <div className="space-y-1 text-sm text-gray-700">
                                        <div>
                                            <strong>Name:</strong> {personnelToRestore.name}
                                        </div>
                                        <div>
                                            <strong>ID:</strong> {personnelToRestore.id}
                                        </div>
                                        <div>
                                            <strong>Username:</strong> {personnelToRestore.username}
                                        </div>
                                        <div>
                                            <strong>Position:</strong> {personnelToRestore.position}
                                        </div>
                                        <div>
                                            <strong>Agency:</strong> {personnelToRestore.agency}
                                        </div>
                                        <div>
                                            <strong>Archived At:</strong> {format(new Date(personnelToRestore.deleted_at), 'MMM dd, yyyy HH:mm')}
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
                                            <div className="mt-2 text-sm text-yellow-700">
                                                <p>
                                                    This action will restore the personnel record to active status. The personnel will be able to log
                                                    in again and access the system.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setRestorePersonnelDialogOpen(false);
                                            setPersonnelToRestore(null);
                                        }}
                                        disabled={restorePersonnelProcessing}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={confirmRestorePersonnel}
                                        disabled={restorePersonnelProcessing}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {restorePersonnelProcessing ? 'Restoring...' : 'Yes, Restore Personnel'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
