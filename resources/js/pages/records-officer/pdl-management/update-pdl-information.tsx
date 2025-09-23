import AppLayout from '@/layouts/app-layout';
import { PageProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Check, ChevronsUpDown, Eye, FileText, Image, Upload, X } from 'lucide-react';

// Criminal case types for dropdown
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Update PDL Management',
        href: '/pdl-management',
    },
];

const steps = [
    { id: 1, title: 'Personal Information', description: 'Basic personal details and address' },
    { id: 2, title: 'Court Order Details', description: 'Court order and legal documentation' },
    { id: 3, title: 'Case Information', description: 'Criminal case details and status' },
    { id: 4, title: 'Medical Records', description: 'Health and medical information' },
    { id: 5, title: 'Physical Characteristics', description: 'Physical description and identification marks' },
    { id: 6, title: 'Review & Submit', description: 'Review all information before submission' },
];

interface UpdatePDLInformationProps {
    pdl: any; // TODO: Define proper PDL type
    [key: string]: any;
}

export default function UpdatePDLInformation() {
    const [currentStep, setCurrentStep] = useState(1);
    const [activeCaseIndex, setActiveCaseIndex] = useState(0);

    const { props } = usePage<UpdatePDLInformationProps>();
    const { pdl } = props;

    const handleAddNewCase = () => {
        const currentCases = data.cases || [];
        setData('cases', [
            ...currentCases,
            {
                case_id: 0,
                case_number: '',
                crime_committed: '',
                date_committed: '',
                time_committed: '',
                case_status: 'open',
                case_remarks: '',
                security_classification: 'medium',
                drug_related: false,
            },
        ]);
        setActiveCaseIndex(currentCases.length);
    };

    const handleRemoveCase = (index: number) => {
        if (!data.cases || !Array.isArray(data.cases) || data.cases.length <= 1) return;
        const newCases = data.cases.filter((_, i) => i !== index);
        setData('cases', newCases);
        setActiveCaseIndex(Math.min(activeCaseIndex, newCases.length - 1));
    };

    const handleCaseChange = (index: number, field: string, value: string | boolean) => {
        if (!data.cases || !Array.isArray(data.cases) || index < 0 || index >= data.cases.length) {
            return;
        }
        const newCases = [...data.cases];
        if (newCases[index]) {
            newCases[index] = { ...newCases[index], [field]: value };
            setData('cases', newCases);
        }
    };

    const { data, setData, put, processing, errors, reset } = useForm<{
        id: number;
        fname: string;
        lname: string;
        alias: string;
        birthdate: string;
        age: string;
        gender: string;
        ethnic_group: string;
        civil_status: string;
        brgy: string;
        city: string;
        province: string;
        court_order_id: number;

        order_type: string;
        order_date: string;
        received_date: string;
        document_type: File | null;
        document_path?: string;
        original_filename?: string;
        court_branch: string;
        cod_remarks: string;
        medical_record_id: number;
        complaint: string;
        date: string;
        prognosis: string;
        laboratory: string;
        prescription: string;
        findings: string;
        physical_characteristic_id: number;
        height: number;
        weight: number;
        build: string;
        complexion: string;
        hair_color: string;
        eye_color: string;
        identification_marks: string;
        mark_location: string;
        pc_remark: string;
        medical_files: File[];
        cases: {
            case_id: number;
            case_number: string;
            crime_committed: string;
            date_committed: string;
            time_committed: string;
            case_status: string;
            case_remarks: string;
            security_classification: string;
            drug_related: boolean;
        }[];
    }>({
        id: pdl.id,
        fname: pdl.fname || '',
        lname: pdl.lname || '',
        alias: pdl.alias || '',
        birthdate: pdl.birthdate || '',
        age: pdl.age ? pdl.age.toString() : '',
        gender: pdl.gender || '',
        ethnic_group: pdl.ethnic_group || '',
        civil_status: pdl.civil_status || '',
        brgy: pdl.brgy || '',
        city: pdl.city || '',
        province: pdl.province || '',
        court_order_id: pdl.court_orders?.[0]?.court_order_id || 0,

        order_type: pdl.court_orders?.[0]?.order_type || '',
        order_date: format(new Date(pdl.court_orders?.[0]?.order_date), 'yyyy-MM-dd') || '',
        received_date: format(new Date(pdl.court_orders?.[0]?.received_date), 'yyyy-MM-dd') || '',
        document_type: null,
        document_path: pdl.court_orders?.[0]?.document_path || '',
        original_filename: pdl.court_orders?.[0]?.original_filename || '',
        court_branch: pdl.court_orders?.[0]?.court_branch || '',
        cod_remarks: pdl.court_orders?.[0]?.remarks || '',
        medical_record_id: pdl.medical_records?.[0]?.medical_record_id || 0,
        complaint: pdl.medical_records?.[0]?.complaint || '',
        date: pdl.medical_records?.[0]?.date || new Date().toISOString().split('T')[0],
        prognosis: pdl.medical_records?.[0]?.prognosis || '',
        laboratory: pdl.medical_records?.[0]?.laboratory || '',
        prescription: pdl.medical_records?.[0]?.prescription || '',
        findings: pdl.medical_records?.[0]?.findings || '',
        physical_characteristic_id: pdl.physical_characteristics?.[0]?.characteristic_id || 0,
        height: pdl.physical_characteristics?.[0]?.height ?? 170,
        weight: pdl.physical_characteristics?.[0]?.weight ?? 70,
        build: pdl.physical_characteristics?.[0]?.build || '',
        complexion: pdl.physical_characteristics?.[0]?.complexion || '',
        hair_color: pdl.physical_characteristics?.[0]?.hair_color || '',
        eye_color: pdl.physical_characteristics?.[0]?.eye_color || '',
        identification_marks: pdl.physical_characteristics?.[0]?.identification_marks || '',
        mark_location: pdl.physical_characteristics?.[0]?.mark_location || '',
        pc_remark: pdl.physical_characteristics?.[0]?.remark || '',
        medical_files: [],
        cases:
            Array.isArray(pdl.cases) && pdl.cases.length > 0
                ? pdl.cases.map((c: any) => ({
                      case_id: c?.case_id || 0,
                      case_number: c?.case_number || '',
                      crime_committed: c?.crime_committed || '',
                      date_committed: format(new Date(c?.date_committed), 'yyyy-MM-dd') || '',
                      time_committed: c?.time_committed || '',
                      case_status: c?.case_status || 'open',
                      case_remarks: c?.case_remarks || '',
                      security_classification: c?.security_classification || 'medium',
                      drug_related: c?.drug_related || false,
                  }))
                : [
                      {
                          case_id: 0,
                          case_number: '',
                          crime_committed: '',
                          date_committed: '',
                          time_committed: '',
                          case_status: 'open',
                          case_remarks: '',
                          security_classification: 'medium',
                          drug_related: false,
                      },
                  ],
    });

    const successMessage = (props as any).success;
    const errorMessage = (props as any).error;
    const [date, setDate] = useState<Date | undefined>(
        data.birthdate ? new Date(data.birthdate) : undefined
    );
    const [crimeCommittedOpen, setCrimeCommittedOpen] = useState(false);
    const [medicalFiles, setMedicalFiles] = useState<File[]>([]);
    const [documentPreview, setDocumentPreview] = useState<string | null>(null);
    const [medicalPreview, setMedicalPreview] = useState<string | null>(null);
    const [oldDocumentPreview, setOldDocumentPreview] = useState<string | null>(null);
    const [oldMedicalPreview, setOldMedicalPreview] = useState<string | null>(null);

    // Helper function to get all crime types as a flat array
    const getAllCrimeTypes = () => {
        return criminalCaseTypes.flatMap((category) => category.cases.map((crime) => ({ value: crime, label: crime, category: category.category })));
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setMedicalFiles((prev) => [...prev, ...files]);
    };

    // Handle document preview for all supported formats
    const handleDocumentPreview = (file: File) => {
        const reader = new FileReader();

        if (file.type.startsWith('image/')) {
            // Handle image files (JPG, JPEG, PNG)
            reader.onload = (e) => {
                setDocumentPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else if (file.type === 'application/pdf') {
            // Handle PDF files
            reader.onload = (e) => {
                setDocumentPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else if (file.type === 'text/plain') {
            // Handle TXT files
            reader.onload = (e) => {
                setDocumentPreview(e.target?.result as string);
            };
            reader.readAsText(file);
        } else if (file.type.includes('document') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
            // Handle DOC/DOCX files - show file info since we can't preview them directly
            setDocumentPreview('document-file');
        } else {
            setDocumentPreview(null);
        }
    };

    // Handle medical file preview for all supported formats
    const handleMedicalPreview = (file: File) => {
        const reader = new FileReader();

        if (file.type.startsWith('image/')) {
            // Handle image files (JPG, JPEG, PNG)
            reader.onload = (e) => {
                setMedicalPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else if (file.type === 'application/pdf') {
            // Handle PDF files
            reader.onload = (e) => {
                setMedicalPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else if (file.type === 'text/plain') {
            // Handle TXT files
            reader.onload = (e) => {
                setMedicalPreview(e.target?.result as string);
            };
            reader.readAsText(file);
        } else if (file.type.includes('document') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
            // Handle DOC/DOCX files - show file info since we can't preview them directly
            setMedicalPreview('document-file');
        } else {
            setMedicalPreview(null);
        }
    };

    // Handle old document preview from server
    const handleOldDocumentPreview = (filePath: string, fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
            setOldDocumentPreview(`/storage/${filePath}`);
        } else if (extension === 'pdf') {
            setOldDocumentPreview(`/storage/${filePath}`);
        } else if (extension === 'txt') {
            fetch(`/storage/${filePath}`)
                .then(response => response.text())
                .then(text => setOldDocumentPreview(text))
                .catch(() => setOldDocumentPreview('document-file'));
        } else if (['doc', 'docx'].includes(extension || '')) {
            setOldDocumentPreview('document-file');
        } else {
            setOldDocumentPreview('document-file');
        }
    };

    // Handle old medical file preview from server
    const handleOldMedicalPreview = (filePath: string, fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
            setOldMedicalPreview(`/storage/${filePath}`);
        } else if (extension === 'pdf') {
            setOldMedicalPreview(`/storage/${filePath}`);
        } else if (extension === 'txt') {
            fetch(`/storage/${filePath}`)
                .then(response => response.text())
                .then(text => setOldMedicalPreview(text))
                .catch(() => setOldMedicalPreview('document-file'));
        } else if (['doc', 'docx'].includes(extension || '')) {
            setOldMedicalPreview('document-file');
        } else {
            setOldMedicalPreview('document-file');
        }
    };

    const removeFile = (index: number) => {
        setMedicalFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const getFileIcon = (file: File) => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf':
                return <FileText className="h-5 w-5 text-red-500" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <Image className="h-5 w-5 text-blue-500" />;
            default:
                return <FileText className="h-5 w-5 text-gray-500" />;
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleDateSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        if (selectedDate) {
            const birthdateFormatted = format(selectedDate, 'yyyy-MM-dd');
            const age = new Date().getFullYear() - selectedDate.getFullYear();
            setData('birthdate', birthdateFormatted);
            setData('age', age.toString());
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const name = e.target.name as keyof typeof data;
        const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
        setData(name, value as any);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Update form data with medical files
        setData('medical_files', medicalFiles);

        put(route('pdl-management.personal-information.update', pdl.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Reset medical files after successful submission
                setMedicalFiles([]);
            },
        });
    };

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const goToStep = (step: number) => {
        setCurrentStep(step);
    };

    const getSecurityBadgeVariant = (classification: string) => {
        switch (classification) {
            case 'low':
                return 'secondary';
            case 'medium':
                return 'default';
            case 'high':
                return 'destructive';
            case 'maximum':
                return 'destructive';
            default:
                return 'default';
        }
    };

    const getCaseStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'open':
                return 'destructive';
            case 'closed':
                return 'secondary';
            case 'pending':
                return 'default';
            default:
                return 'default';
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="fname">
                                        First Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="fname"
                                        name="fname"
                                        value={data.fname}
                                        onChange={handleChange}
                                        placeholder="Enter first name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lname">
                                        Last Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="lname"
                                        name="lname"
                                        value={data.lname}
                                        onChange={handleChange}
                                        placeholder="Enter last name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="alias">Alias</Label>
                                    <Input
                                        id="alias"
                                        name="alias"
                                        value={data.alias}
                                        onChange={handleChange}
                                        placeholder="Enter alias (if any)"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>
                                        Date of Birth <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="date"
                                        value={date ? format(date, 'yyyy-MM-dd') : data.birthdate}
                                        onChange={(e) => handleDateSelect(e.target.value ? new Date(e.target.value) : undefined)}
                                    />
                                    {data.age && <p className="text-sm text-muted-foreground">Age: {data.age} years</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>
                                        Gender <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ethnic_group">Ethnic Group</Label>
                                    <Input
                                        id="ethnic_group"
                                        name="ethnic_group"
                                        value={data.ethnic_group}
                                        onChange={handleChange}
                                        placeholder="Enter ethnic group"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Civil Status</Label>
                                    <Select value={data.civil_status} onValueChange={(value) => setData('civil_status', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select civil status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Single">Single</SelectItem>
                                            <SelectItem value="Married">Married</SelectItem>
                                            <SelectItem value="Widowed">Widowed</SelectItem>
                                            <SelectItem value="Divorced">Divorced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="mb-4 text-lg font-medium">Address Information</h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="brgy">Barangay</Label>
                                        <Input id="brgy" name="brgy" value={data.brgy} onChange={handleChange} placeholder="Enter barangay" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input id="city" name="city" value={data.city} onChange={handleChange} placeholder="Enter city" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="province">Province</Label>
                                        <Input
                                            id="province"
                                            name="province"
                                            value={data.province}
                                            onChange={handleChange}
                                            placeholder="Enter province"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );

            case 2:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Court Order Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                                <div className="space-y-2">
                                    <Label htmlFor="order_type">
                                        Order Type <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="order_type"
                                        name="order_type"
                                        value={data.order_type}
                                        onChange={handleChange}
                                        placeholder="Enter order type"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>
                                        Order Date <span className="text-red-500">*</span>
                                    </Label>
                                    <Input type="date" value={data.order_date} onChange={(e) => setData('order_date', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>
                                        Received Date <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="date"
                                        value={data.received_date}
                                        onChange={(e) => setData('received_date', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="document_type">
                                        Upload Document <span className="text-red-500">*</span>
                                    </Label>
                                    <input
                                        type="file"
                                        id="document_type"
                                        name="document_type"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setData('document_type', file);
                                                handleDocumentPreview(file);
                                            }
                                        }}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    <div className="text-xs text-muted-foreground">
                                        Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG, TXT
                                    </div>
                                    {data.original_filename && (
                                        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                            <div className="flex items-center space-x-3">
                                                <FileText className="h-4 w-4 text-gray-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{data.original_filename}</p>
                                                    <p className="text-xs text-gray-500">Current file</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleOldDocumentPreview(data.document_path || '', data.original_filename || '')}
                                                    className="text-blue-500 hover:text-blue-700"
                                                    title="Preview current file"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Document Preview */}
                                    {documentPreview && (
                                        <div className="mt-4 space-y-2">
                                            <Label>New Document Preview</Label>
                                            <div className="relative">
                                                {documentPreview === 'document-file' ? (
                                                    // DOC/DOCX file info display
                                                    <div className="flex h-64 w-full items-center justify-center rounded-lg border bg-gray-50">
                                                        <div className="text-center">
                                                            <FileText className="mx-auto h-16 w-16 text-gray-400" />
                                                            <p className="mt-2 text-sm font-medium text-gray-900">{data.document_type?.name}</p>
                                                            <p className="text-xs text-gray-500">Document file - Preview not available</p>
                                                            <p className="text-xs text-gray-400">{formatFileSize(data.document_type?.size || 0)}</p>
                                                        </div>
                                                    </div>
                                                ) : documentPreview.startsWith('data:image/') ? (
                                                    // Image preview
                                                    <img
                                                        src={documentPreview}
                                                        alt="Document preview"
                                                        className="max-h-64 w-full rounded-lg border object-contain"
                                                    />
                                                ) : documentPreview.startsWith('data:application/pdf') ? (
                                                    // PDF preview
                                                    <iframe src={documentPreview} className="h-64 w-full rounded-lg border" title="PDF Preview" />
                                                ) : (
                                                    // Text file preview
                                                    <div className="h-64 w-full rounded-lg border bg-white p-4">
                                                        <pre className="h-full w-full overflow-auto text-sm whitespace-pre-wrap text-gray-900">
                                                            {documentPreview}
                                                        </pre>
                                                    </div>
                                                )}
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="absolute top-2 right-2"
                                                    onClick={() => setDocumentPreview(null)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Old Document Preview */}
                                    {oldDocumentPreview && (
                                        <div className="mt-4 space-y-2">
                                            <Label>Current Document Preview</Label>
                                            <div className="relative">
                                                {oldDocumentPreview === 'document-file' ? (
                                                    // DOC/DOCX file info display
                                                    <div className="flex h-64 w-full items-center justify-center rounded-lg border bg-gray-50">
                                                        <div className="text-center">
                                                            <FileText className="mx-auto h-16 w-16 text-gray-400" />
                                                            <p className="mt-2 text-sm font-medium text-gray-900">{data.original_filename}</p>
                                                            <p className="text-xs text-gray-500">Document file - Preview not available</p>
                                                        </div>
                                                    </div>
                                                ) : oldDocumentPreview.startsWith('/storage/') && (oldDocumentPreview.includes('.jpg') || oldDocumentPreview.includes('.jpeg') || oldDocumentPreview.includes('.png')) ? (
                                                    // Image preview
                                                    <img
                                                        src={oldDocumentPreview}
                                                        alt="Current document preview"
                                                        className="max-h-64 w-full rounded-lg border object-contain"
                                                    />
                                                ) : oldDocumentPreview.startsWith('/storage/') && oldDocumentPreview.includes('.pdf') ? (
                                                    // PDF preview
                                                    <iframe src={oldDocumentPreview} className="h-64 w-full rounded-lg border" title="PDF Preview" />
                                                ) : (
                                                    // Text file preview
                                                    <div className="h-64 w-full rounded-lg border bg-white p-4">
                                                        <pre className="h-full w-full overflow-auto text-sm whitespace-pre-wrap text-gray-900">
                                                            {oldDocumentPreview}
                                                        </pre>
                                                    </div>
                                                )}
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="absolute top-2 right-2"
                                                    onClick={() => setOldDocumentPreview(null)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="court_branch">
                                        Court Branch <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="court_branch"
                                        name="court_branch"
                                        value={data.court_branch}
                                        onChange={handleChange}
                                        placeholder="Enter court branch"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cod_remarks">Remarks</Label>
                                <Textarea
                                    id="cod_remarks"
                                    name="cod_remarks"
                                    value={data.cod_remarks}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Enter any additional remarks..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                );

            case 3:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    Case Information
                                    {data.cases[activeCaseIndex]?.case_status && (
                                        <Badge variant={getCaseStatusBadgeVariant(data.cases[activeCaseIndex]?.case_status || '')}>
                                            {(data.cases[activeCaseIndex]?.case_status || '').charAt(0).toUpperCase() +
                                                (data.cases[activeCaseIndex]?.case_status || '').slice(1)}
                                        </Badge>
                                    )}
                                    {data.cases[activeCaseIndex]?.security_classification && (
                                        <Badge variant={getSecurityBadgeVariant(data.cases[activeCaseIndex]?.security_classification || '')}>
                                            {(data.cases[activeCaseIndex]?.security_classification || '').charAt(0).toUpperCase() +
                                                (data.cases[activeCaseIndex]?.security_classification || '').slice(1)}{' '}
                                            Security
                                        </Badge>
                                    )}
                                </div>
                                <Button variant="outline" size="sm" type="button" onClick={handleAddNewCase}>
                                    Add New Case
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Case Navigation Tabs */}
                            <div className="flex gap-2 overflow-x-auto py-2">
                                {data.cases.map((_, index) => (
                                    <Button
                                        key={index}
                                        variant={activeCaseIndex === index ? 'default' : 'outline'}
                                        size="sm"
                                        type="button"
                                        onClick={() => setActiveCaseIndex(index)}
                                        className="relative"
                                    >
                                        Case {index + 1}
                                        {data.cases.length > 1 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveCase(index);
                                                }}
                                                className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </Button>
                                ))}
                            </div>

                            {/* Case Form Fields */}
                            {data.cases && Array.isArray(data.cases) && data.cases.length > 0 && (
                                <>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="case_number">
                                                Case Number <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="case_number"
                                                value={data.cases[activeCaseIndex]?.case_number || ''}
                                                onChange={(e) => handleCaseChange(activeCaseIndex, 'case_number', e.target.value)}
                                                placeholder="Enter case number"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="crime_committed">
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
                                                        {data.cases[activeCaseIndex]?.crime_committed || 'Select or type crime committed...'}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0" align="start">
                                                    <Command>
                                                        <CommandInput
                                                            placeholder="Search crimes or type custom..."
                                                            value={data.cases[activeCaseIndex]?.crime_committed || ''}
                                                            onValueChange={(value) => handleCaseChange(activeCaseIndex, 'crime_committed', value)}
                                                        />
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                <div className="p-2 text-sm text-muted-foreground">
                                                                    No crime found. Press Enter to add "{data.cases[activeCaseIndex]?.crime_committed || ''}"
                                                                    as custom crime.
                                                                </div>
                                                            </CommandEmpty>
                                                            {criminalCaseTypes.map((category) => (
                                                                <CommandGroup key={category.category} heading={category.category}>
                                                                    {category.cases.map((crime) => (
                                                                        <CommandItem
                                                                            key={crime}
                                                                            value={crime}
                                                                            onSelect={(currentValue) => {
                                                                                handleCaseChange(activeCaseIndex, 'crime_committed', currentValue);
                                                                                setCrimeCommittedOpen(false);
                                                                            }}
                                                                        >
                                                                            <Check
                                                                                className={`mr-2 h-4 w-4 ${
                                                                                    data.cases[activeCaseIndex]?.crime_committed === crime
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
                                        <div className="space-y-2">
                                            <Label htmlFor="date_committed">
                                                Date Committed <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                type="date"
                                                value={data.cases[activeCaseIndex]?.date_committed || ''}
                                                onChange={(e) => handleCaseChange(activeCaseIndex, 'date_committed', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="time_committed">
                                                Time Committed <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                type="time"
                                                value={data.cases[activeCaseIndex]?.time_committed || ''}
                                                onChange={(e) => handleCaseChange(activeCaseIndex, 'time_committed', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="case_status">
                                                Case Status <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={data.cases[activeCaseIndex]?.case_status || ''}
                                                onValueChange={(value) => handleCaseChange(activeCaseIndex, 'case_status', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="on_trial">On Trial</SelectItem>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="convicted">Convicted</SelectItem>
                                                    <SelectItem value="deceased">Deceased</SelectItem>
                                                    <SelectItem value="case_closed">Case Closed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="security_classification">
                                                Security Classification <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={data.cases[activeCaseIndex]?.security_classification || ''}
                                                onValueChange={(value) => handleCaseChange(activeCaseIndex, 'security_classification', value)}
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
                                        <div className="space-y-2">
                                            <Label>Drug Related</Label>
                                            <RadioGroup
                                                value={data.cases[activeCaseIndex]?.drug_related ? 'yes' : 'no'}
                                                onValueChange={(value) => handleCaseChange(activeCaseIndex, 'drug_related', value === 'yes')}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="yes" id="drug_yes" />
                                                    <Label htmlFor="drug_yes">Yes</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="no" id="drug_no" />
                                                    <Label htmlFor="drug_no">No</Label>
                                                </div>
                                            </RadioGroup>
                                            <div className="text-xs text-muted-foreground">Indicate if this case is related to drug offenses</div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="case_remarks">Case Remarks</Label>
                                        <Textarea
                                            id="case_remarks"
                                            value={data.cases[activeCaseIndex]?.case_remarks || ''}
                                            onChange={(e) => handleCaseChange(activeCaseIndex, 'case_remarks', e.target.value)}
                                            rows={3}
                                            placeholder="Enter case-related remarks..."
                                        />
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                );

            case 4:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Medical Records</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="date">
                                        Date <span className="text-red-500">*</span>
                                    </Label>
                                    <Input type="date" id="date" value={data.date} onChange={(e) => setData('date', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="complaint">
                                        Complaint <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="complaint"
                                        name="complaint"
                                        value={data.complaint}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Describe the medical complaint or symptoms..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="findings">
                                        Medical Findings <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="findings"
                                        name="findings"
                                        value={data.findings}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Enter medical findings and observations..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="prognosis">
                                        Prognosis <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="prognosis"
                                        name="prognosis"
                                        value={data.prognosis}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Enter medical prognosis (e.g., Good prognosis with treatment, Poor prognosis due to complications, etc.)"
                                    />
                                    <div className="text-xs text-muted-foreground">Specify prognosis details in parentheses for clarity</div>
                                </div>

                                {/* Medical Document Upload Section */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Medical Documents</Label>
                                        <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400">
                                            <input
                                                type="file"
                                                id="medical_files"
                                                name="medical_files"
                                                multiple
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                            />
                                            <label htmlFor="medical_files" className="cursor-pointer">
                                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="mt-2">
                                                    <span className="text-sm font-medium text-gray-900">Upload medical documents and images</span>
                                                    <p className="text-xs text-gray-500">Click to upload or drag and drop</p>
                                                    <p className="mt-1 text-xs text-gray-400">Supports: Images (JPG, PNG, GIF), PDF, DOC, DOCX, TXT</p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Display uploaded files */}
                                    {medicalFiles.length > 0 && (
                                        <div className="space-y-2">
                                            <Label>Uploaded Files</Label>
                                            <div className="space-y-2">
                                                {medicalFiles.map((file, index) => (
                                                    <div key={index} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                                        <div className="flex items-center space-x-3">
                                                            {getFileIcon(file)}
                                                            <div>
                                                                <p className="text-sm font-medium">{file.name}</p>
                                                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleMedicalPreview(file)}
                                                                className="text-blue-500 hover:text-blue-700"
                                                                title="Preview file"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeFile(index)}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Medical Files Preview */}
                                    {medicalPreview && (
                                        <div className="mt-4 space-y-2">
                                            <Label>New File Preview</Label>
                                            <div className="relative">
                                                {medicalPreview === 'document-file' ? (
                                                    // DOC/DOCX file info display
                                                    <div className="flex h-64 w-full items-center justify-center rounded-lg border bg-gray-50">
                                                        <div className="text-center">
                                                            <FileText className="mx-auto h-16 w-16 text-gray-400" />
                                                            <p className="mt-2 text-sm font-medium text-gray-900">
                                                                Document file - Preview not available
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG, TXT
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : medicalPreview.startsWith('data:image/') ? (
                                                    // Image preview
                                                    <img
                                                        src={medicalPreview}
                                                        alt="File preview"
                                                        className="max-h-64 w-full rounded-lg border object-contain"
                                                    />
                                                ) : medicalPreview.startsWith('data:application/pdf') ? (
                                                    // PDF preview
                                                    <iframe src={medicalPreview} className="h-64 w-full rounded-lg border" title="PDF Preview" />
                                                ) : (
                                                    // Text file preview
                                                    <div className="h-64 w-full rounded-lg border bg-white p-4">
                                                        <pre className="h-full w-full overflow-auto text-sm whitespace-pre-wrap text-gray-900">
                                                            {medicalPreview}
                                                        </pre>
                                                    </div>
                                                )}
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="absolute top-2 right-2"
                                                    onClick={() => setMedicalPreview(null)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Single Medical File */}
                                    {pdl.medical_records?.[0]?.single_file && (
                                        <div className="mt-4 space-y-2">
                                            <Label>Current Medical Record File</Label>
                                            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                                <div className="flex items-center space-x-3">
                                                    <FileText className="h-4 w-4 text-gray-400" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{pdl.medical_records[0].single_file.original_filename}</p>
                                                        <p className="text-xs text-gray-500">{pdl.medical_records[0].single_file.extension?.toUpperCase()} • Medical record</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleOldMedicalPreview(pdl.medical_records[0].single_file.file_path, pdl.medical_records[0].single_file.original_filename)}
                                                        className="text-blue-500 hover:text-blue-700"
                                                        title="Preview file"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Multiple Medical Files */}
                                    {(pdl.medical_records?.[0]?.files && pdl.medical_records[0].files.length > 0) ||
                                     (pdl.medical_records?.[0]?.original_filename && pdl.medical_records[0].original_filename) ? (
                                        <div className="mt-4 space-y-2">
                                            <Label>Current Medical Documents</Label>
                                            <div className="space-y-2">
                                                {/* New structure with files array */}
                                                {pdl.medical_records[0].files && pdl.medical_records[0].files.length > 0 ? (
                                                    pdl.medical_records[0].files.map((file: any, index: number) => (
                                                        <div key={index} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                                            <div className="flex items-center space-x-3">
                                                                <FileText className="h-4 w-4 text-gray-400" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">{file.original_filename}</p>
                                                                    <p className="text-xs text-gray-500">{file.extension?.toUpperCase()} • Medical document</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleOldMedicalPreview(file.file_path, file.original_filename)}
                                                                    className="text-blue-500 hover:text-blue-700"
                                                                    title="Preview file"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    /* Fallback for old structure */
                                                    pdl.medical_records[0].original_filename.split(',').map((filename: string, index: number) => {
                                                        const filePath = pdl.medical_records[0].file_path?.split(',')[index];
                                                        return (
                                                            <div key={index} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                                                <div className="flex items-center space-x-3">
                                                                    <FileText className="h-4 w-4 text-gray-400" />
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-900">{filename}</p>
                                                                        <p className="text-xs text-gray-500">Medical document</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleOldMedicalPreview(filePath || '', filename)}
                                                                        className="text-blue-500 hover:text-blue-700"
                                                                        title="Preview file"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    ) : null}

                                    {/* Old Medical Files Preview */}
                                    {oldMedicalPreview && (
                                        <div className="mt-4 space-y-2">
                                            <Label>Current Medical File Preview</Label>
                                            <div className="relative">
                                                {oldMedicalPreview === 'document-file' ? (
                                                    // DOC/DOCX file info display
                                                    <div className="flex h-64 w-full items-center justify-center rounded-lg border bg-gray-50">
                                                        <div className="text-center">
                                                            <FileText className="mx-auto h-16 w-16 text-gray-400" />
                                                            <p className="mt-2 text-sm font-medium text-gray-900">
                                                                Document file - Preview not available
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG, TXT
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : oldMedicalPreview.startsWith('/storage/') && (oldMedicalPreview.includes('.jpg') || oldMedicalPreview.includes('.jpeg') || oldMedicalPreview.includes('.png')) ? (
                                                    // Image preview
                                                    <img
                                                        src={oldMedicalPreview}
                                                        alt="Current medical file preview"
                                                        className="max-h-64 w-full rounded-lg border object-contain"
                                                    />
                                                ) : oldMedicalPreview.startsWith('/storage/') && oldMedicalPreview.includes('.pdf') ? (
                                                    // PDF preview
                                                    <iframe src={oldMedicalPreview} className="h-64 w-full rounded-lg border" title="PDF Preview" />
                                                ) : (
                                                    // Text file preview
                                                    <div className="h-64 w-full rounded-lg border bg-white p-4">
                                                        <pre className="h-full w-full overflow-auto text-sm whitespace-pre-wrap text-gray-900">
                                                            {oldMedicalPreview}
                                                        </pre>
                                                    </div>
                                                )}
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="absolute top-2 right-2"
                                                    onClick={() => setOldMedicalPreview(null)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor="medical_records_preview">Medical Records Preview</Label>

                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="laboratory">
                                        Laboratory Results <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="laboratory"
                                        name="laboratory"
                                        value={data.laboratory}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Enter laboratory test results..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="prescription">
                                        Prescription <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="prescription"
                                        name="prescription"
                                        value={data.prescription}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Enter prescribed medications and treatments..."
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );

            case 5:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                Physical Characteristics
                                {data.height && data.weight && (
                                    <Badge variant="secondary">
                                        {data.height}cm / {data.weight}kg
                                    </Badge>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="height">
                                        Height (cm) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="number"
                                        id="height"
                                        name="height"
                                        min="100"
                                        max="250"
                                        value={data.height}
                                        onChange={handleChange}
                                        placeholder="170"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="weight">
                                        Weight (kg) <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="number"
                                        id="weight"
                                        name="weight"
                                        min="30"
                                        max="300"
                                        value={data.weight}
                                        onChange={handleChange}
                                        placeholder="70"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="build">
                                        Build <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="build"
                                        name="build"
                                        value={data.build}
                                        onChange={handleChange}
                                        placeholder="e.g., Slim, Medium, Heavy"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="complexion">
                                        Complexion <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="complexion"
                                        name="complexion"
                                        value={data.complexion}
                                        onChange={handleChange}
                                        placeholder="e.g., Fair, Dark, Medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hair_color">
                                        Hair Color <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="hair_color"
                                        name="hair_color"
                                        value={data.hair_color}
                                        onChange={handleChange}
                                        placeholder="e.g., Black, Brown, Gray"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="eye_color">
                                        Eye Color <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="eye_color"
                                        name="eye_color"
                                        value={data.eye_color}
                                        onChange={handleChange}
                                        placeholder="e.g., Brown, Black, Blue"
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="mb-4 text-lg font-medium">Identification Marks</h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="identification_marks">
                                            Identification Marks <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="identification_marks"
                                            name="identification_marks"
                                            value={data.identification_marks}
                                            onChange={handleChange}
                                            placeholder="e.g., Scar, Tattoo, Birthmark"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="mark_location">
                                            Mark Location <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="mark_location"
                                            name="mark_location"
                                            value={data.mark_location}
                                            onChange={handleChange}
                                            placeholder="e.g., Left arm, Right cheek"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="pc_remark">Physical Characteristics Remarks</Label>
                                        <Textarea
                                            id="pc_remark"
                                            name="pc_remark"
                                            value={data.pc_remark}
                                            onChange={handleChange}
                                            rows={3}
                                            placeholder="Enter any additional physical characteristic remarks..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );

            case 6:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Review & Update</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Personal Information Summary */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg">Personal Information</h3>
                                    <div className="space-y-2 text-sm">
                                        <div><span className="font-medium">Name:</span> {data.fname} {data.lname}</div>
                                        {data.alias && <div><span className="font-medium">Alias:</span> {data.alias}</div>}
                                        {data.age && <div><span className="font-medium">Age:</span> {data.age} years</div>}
                                        {data.gender && <div><span className="font-medium">Gender:</span> {data.gender}</div>}
                                        {data.civil_status && <div><span className="font-medium">Civil Status:</span> {data.civil_status}</div>}
                                        {(data.brgy || data.city || data.province) && (
                                            <div><span className="font-medium">Address:</span> {[data.brgy, data.city, data.province].filter(Boolean).join(', ')}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Court Order Summary */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg">Court Order</h3>
                                    <div className="space-y-2 text-sm">

                                        {data.order_type && <div><span className="font-medium">Order Type:</span> {data.order_type}</div>}
                                        {data.court_branch && <div><span className="font-medium">Court Branch:</span> {data.court_branch}</div>}
                                        {data.order_date && <div><span className="font-medium">Order Date:</span> {data.order_date}</div>}
                                    </div>
                                </div>

                                {/* Cases Summary */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg">Cases ({data.cases.length})</h3>
                                    <div className="space-y-3">
                                        {data.cases.map((caseItem, index) => (
                                            <div key={index} className="border rounded-lg p-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-medium">Case {index + 1}</span>
                                                    <Badge variant={getCaseStatusBadgeVariant(caseItem.case_status)}>
                                                        {caseItem.case_status}
                                                    </Badge>
                                                    <Badge variant={getSecurityBadgeVariant(caseItem.security_classification)}>
                                                        {caseItem.security_classification}
                                                    </Badge>
                                                </div>
                                                <div className="text-sm space-y-1">
                                                    {caseItem.case_number && <div><span className="font-medium">Case Number:</span> {caseItem.case_number}</div>}
                                                    {caseItem.crime_committed && <div><span className="font-medium">Crime:</span> {caseItem.crime_committed}</div>}
                                                    {caseItem.date_committed && <div><span className="font-medium">Date:</span> {caseItem.date_committed}</div>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Physical Characteristics Summary */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg">Physical Characteristics</h3>
                                    <div className="space-y-2 text-sm">
                                        {data.height && data.weight && (
                                            <div><span className="font-medium">Measurements:</span> {data.height}cm, {data.weight}kg</div>
                                        )}
                                        {data.build && <div><span className="font-medium">Build:</span> {data.build}</div>}
                                        {data.complexion && <div><span className="font-medium">Complexion:</span> {data.complexion}</div>}
                                        {data.hair_color && <div><span className="font-medium">Hair Color:</span> {data.hair_color}</div>}
                                        {data.eye_color && <div><span className="font-medium">Eye Color:</span> {data.eye_color}</div>}
                                        {data.identification_marks && data.mark_location && (
                                            <div><span className="font-medium">Marks:</span> {data.identification_marks} ({data.mark_location})</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );

            default:
                return null;
        }
    };

    const progressPercentage = (currentStep / steps.length) * 100;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Update PDL Information" />

            <div className="mx-auto w-full space-y-6 p-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Update PDL Information</h1>
                        <p className="mt-2 text-muted-foreground">Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.description}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Progress</span>
                        <span>{Math.round(progressPercentage)}% Complete</span>
                    </div>
                    <Progress value={progressPercentage} className="w-full" />
                </div>

                {/* Step Navigation */}
                <div className="flex flex-wrap gap-2">
                    {steps.map((step) => (
                        <Button
                            key={step.id}
                            variant={currentStep === step.id ? 'default' : currentStep > step.id ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={() => goToStep(step.id)}
                            className="flex items-center gap-2"
                        >
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background text-xs">
                                {step.id}
                            </span>
                            {step.title}
                        </Button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Alert */}
                    {(Object.keys(errors).length > 0 || errorMessage) && (
                        <div data-alert-container className="relative">
                            <Alert variant="destructive">
                                <button
                                    type="button"
                                    aria-label="Close"
                                    onClick={(e) => {
                                        const container = (e.currentTarget.closest('[data-alert-container]') as HTMLElement) || undefined;
                                        if (container) container.style.display = 'none';
                                    }}
                                    className="absolute top-2 right-2 rounded p-1 text-lg leading-none hover:bg-muted"
                                >
                                    ×
                                </button>
                                <AlertTitle>Unable to process request</AlertTitle>
                                <AlertDescription>
                                    {errorMessage ? (
                                        <div className="text-sm">{errorMessage}</div>
                                    ) : (
                                        <ul className="list-inside list-disc space-y-1">
                                            {Object.values(errors).map((error, index) => (
                                                <li key={index} className="text-sm">
                                                    {error}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}

                    {/* Success Alert (auto-dismiss in 3s, closable) */}
                    {successMessage && (
                        <div
                            data-alert-container
                            className="relative"
                            style={{
                                animation: 'fadeIn 0.3s ease-in-out',
                            }}
                        >
                            <Alert className="border-green-200 bg-green-50 text-green-800">
                                <button
                                    type="button"
                                    aria-label="Close"
                                    onClick={(e) => {
                                        const container = (e.currentTarget.closest('[data-alert-container]') as HTMLElement) || undefined;
                                        if (container) container.style.display = 'none';
                                    }}
                                    className="absolute top-2 right-2 rounded p-1 text-sm leading-none hover:bg-muted"
                                >
                                    ×
                                </button>
                                <AlertTitle>Success</AlertTitle>
                                <AlertDescription>{successMessage}</AlertDescription>
                            </Alert>
                        </div>
                    )}

                    {/* Step Content */}
                    {renderStepContent()}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between border-t pt-6">
                        <div className="flex gap-2">
                            {currentStep > 1 && (
                                <Button type="button" variant="outline" onClick={prevStep}>
                                    Previous
                                </Button>
                            )}
                        </div>

                        <div className="text-sm text-muted-foreground">
                            <span className="text-red-500">*</span> Required fields
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    window.location.href = route('pdl-management.personal-information');
                                }}
                                disabled={processing}
                            >
                                Cancel
                            </Button>

                            {currentStep < steps.length ? (
                                <Button type="button" onClick={nextStep}>
                                    Next
                                </Button>
                            ) : (
                                <Button type="submit" disabled={processing} className="min-w-[120px]">
                                    {processing ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                                            Updating...
                                        </div>
                                    ) : (
                                        'Update PDL Record'
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
