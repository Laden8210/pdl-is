import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { useState } from 'react';

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

// Location data for South Cotabato Province
const locationData = {
    province: 'South Cotabato',
    cities: {
        'Koronadal City': [
            'Assumption',
            'Avanceña',
            'Cacub',
            'Caloocan',
            'Concepcion',
            'Esperanza',
            'General Paulino Santos',
            'Mabini',
            'Magsaysay',
            'Mambucal',
            'Morales',
            'Namnama',
            'New Pangasinan',
            'Paraiso',
            'Rotonda',
            'San Isidro',
            'San Jose',
            'San Roque',
            'Santa Cruz',
            'Saravia',
            'Santo Niño',
            'Topland',
            'Zone I',
            'Zone II',
            'Zone III',
            'Zone IV',
            'Carpenter Hill',
        ],
        'General Santos City': [
            'Apopong',
            'Baluan',
            'Batomelong',
            'Buayan',
            'Bula',
            'Calumpang',
            'City Heights',
            'Dadiangas East',
            'Dadiangas North',
            'Dadiangas South',
            'Dadiangas West',
            'Fatima',
            'Katangawan',
            'Labangal',
            'Lagao',
            'Ligaya',
            'Mabuhay',
            'Nalum',
            'Olympog',
            'San Isidro',
            'San Jose',
            'Sinawal',
            'Tambler',
            'Tinagacan',
            'Upper Labay',
            'Conel',
        ],
        Polomolok: [
            'Bentung',
            'Cannery Site',
            'Crossing Palkan',
            'Glamang',
            'Kinilis',
            'Klinan 6',
            'Koronadal Proper',
            'Lam-Caliaf',
            'Landan',
            'Lapu',
            'Lumakil',
            'Magsaysay',
            'Maligo',
            'Pagalungan',
            'Palkan',
            'Poblacion',
            'Polo',
            'Rubber',
            'Silway 7',
            'Silway 8',
            'Sulit',
            'Sumbakil',
            'Upper Klinan',
        ],
        Tupi: [
            'Acmonan',
            'Bololmala',
            'Bunao',
            'Cebuano',
            'Crossing Rubber',
            'Kalkam',
            'Linan',
            'Lunen',
            'Miasong',
            'Palian',
            'Poblacion',
            'Polonuling',
            'Simbo',
            'Tamayo',
            'Tubeng',
        ],
        Tampakan: [
            'Albagan',
            'Buto',
            'Danlag',
            'Kipalbig',
            'Lambayong',
            'Lampitak',
            'Liberty',
            'Maltana',
            'Palo',
            'Poblacion',
            'Pula-bato',
            'San Isidro',
            'Santa Cruz',
            'Tablu',
        ],
        'Santo Niño': [
            'Ambalgan',
            'Guinsang-an',
            'Katipunan',
            'Manuel Roxas',
            'Panay',
            'Poblacion',
            'Sajaneba',
            'San Isidro',
            'San Vicente',
            'Teresita',
        ],
        Surallah: [
            'Ala',
            'Buenavista',
            'Centrala',
            'Dajay',
            'Duhay-Labi',
            'Lambontong',
            'Libertad',
            'Littler',
            'Moloy',
            'Naci',
            'Tala',
            'Tibio',
            'Tubi-Alla',
            'Upper Sepaka',
            'Columbio',
            'Sultan Miralam',
            'Lambingi',
        ],
        Norala: [
            'Benigno Aquino',
            'Esperanza',
            'Five Storey',
            'J.P. Laurel',
            'Kahilwayan',
            'Katipunan',
            'Lambontong',
            'Liberty',
            'Poblacion',
            'Puting Bato',
            'San Jose',
            'San Miguel',
            'Sto. Niño',
            'Tinublaran',
        ],
        'Lake Sebu': [
            'Bacdulong',
            'Denlag',
            'Halilan',
            'Hanoon',
            'Klubi',
            'Lake Lahit',
            'Lamcade',
            'Lamdalag',
            'Lamfugon',
            'Lamlahak',
            'Lower Maculan',
            'Luhib',
            'Ned',
            'Poblacion',
            'Siluton',
            'Takunel',
            'Talisay',
            'Tasiman',
            'Upper Maculan',
        ],
        Banga: [
            'Benitez',
            'Cabudian',
            'Cabuling',
            'Cinco',
            'Derilon',
            'El Nonok',
            'Improgo Village',
            'Kusan',
            'Lam-apos',
            'Lamba',
            'Lambingi',
            'Lampari',
            'Liwanay',
            'Malaya',
            'Punong Grande',
            'Rang-ay',
            'Reyes',
            'Rizal',
            'Rizal Poblacion',
            'San Jose',
            'San Vicente',
            'Yangco Poblacion',
        ],
    },
};

// Order type suggestions
const orderTypeSuggestions = [
    'Commitment Order',
    'Detention Order',
    'Transfer Order',
    'Release Order',
    'Bail Order',
    'Arrest Warrant',
    'Search Warrant',
    'Subpoena',
    'Court Order',
    'Administrative Order',
    'Medical Order',
    'Visitation Order',
    'Classification Order',
    'Disciplinary Order',
    'Work Assignment Order',
    'Educational Order',
    'Rehabilitation Order',
    'Parole Order',
    'Probation Order',
    'Appeal Order',
    'Motion Order',
    'Hearing Order',
    'Trial Order',
    'Sentencing Order',
    'Execution Order',
    'Others',
];

const getSecurityClassification = (crime: string): string => {
    const highSecurityCrimes = [
        'Murder',
        'Homicide',
        'Manslaughter',
        'Terrorism',
        'Mass Shooting',
        'Kidnapping',
        'Abduction',
        'Rape',
        'Sexual Assault',
        'Armed Robbery',
        'Drug Trafficking',
        'Drug Manufacturing',
        'Drug Distribution',
        'Drug Importation',
        'Human Trafficking',
        'Weapons Trafficking',
        'Espionage',
        'Treason',
        'Sedition',
        'Bank Robbery',
        'Organized Crime',
        'Racketeering',
    ];

    const mediumSecurityCrimes = [
        'Assault',
        'Battery',
        'Robbery',
        'Domestic Violence',
        'Child Abuse',
        'Elder Abuse',
        'Hate Crime',
        'Gang Violence',
        'Drug Possession',
        'Methamphetamine',
        'Cocaine Possession',
        'Heroin Possession',
        'Fraud',
        'Identity Theft',
        'Credit Card Fraud',
        'Insurance Fraud',
        'Money Laundering',
        'Arson',
        'Vandalism',
        'Auto Theft',
        'Grand Theft',
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
        'Cybercrime',
        'Forgery',
        'Counterfeiting',
        'DUI/DWI',
        'Reckless Driving',
        'Hit and Run',
        'Vehicular Manslaughter',
        'Street Racing',
        'Prostitution',
        'Solicitation',
        'Public Indecency',
        'Obstruction of Justice',
        'Resisting Arrest',
        'Escape from Custody',
        'Escape',
        'Parole Violation',
        'Probation Violation',
        'Bail Jumping',
        'Witness Tampering',
        'Jury Tampering',
        'Election Fraud',
        'Environmental Crime',
        'Animal Cruelty',
        'Stalking',
        'Harassment',
    ];

    if (highSecurityCrimes.includes(crime)) {
        return 'high';
    } else if (mediumSecurityCrimes.includes(crime)) {
        return 'medium';
    } else {
        return 'low';
    }
};

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
        title: 'Create PDL Management',
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

export default function CreatePDLInformation() {
    const [currentStep, setCurrentStep] = useState(1);
    const [activeCaseIndex, setActiveCaseIndex] = useState(0);
    const [crimeCommittedOpen, setCrimeCommittedOpen] = useState(false);
    const [medicalFile, setMedicalFile] = useState<File | null>(null);
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [availableBarangays, setAvailableBarangays] = useState<string[]>([]);
    const [documentPreview, setDocumentPreview] = useState<string | null>(null);
    const [isCustomOrderType, setIsCustomOrderType] = useState<boolean>(false);
    const [orderTypeOpen, setOrderTypeOpen] = useState(false);

    // Helper function to get all crime types as a flat array
    const getAllCrimeTypes = () => {
        return criminalCaseTypes.flatMap((category) => category.cases.map((crime) => ({ value: crime, label: crime, category: category.category })));
    };

    // Handle order type selection
    const handleOrderTypeChange = (value: string) => {
        if (value === 'Others') {
            setIsCustomOrderType(true);
            setData('order_type', '');
        } else {
            setIsCustomOrderType(false);
            setData('order_type', value);
        }
    };

    // Handle order type input change for custom input
    const handleOrderTypeInputChange = (value: string) => {
        setData('order_type', value);
    };

    // Handle city selection and update barangays
    const handleCityChange = (city: string) => {
        setSelectedCity(city);
        setData('city', city);
        if (city && locationData.cities[city as keyof typeof locationData.cities]) {
            setAvailableBarangays(locationData.cities[city as keyof typeof locationData.cities]);
        } else {
            setAvailableBarangays([]);
        }
        // Clear barangay selection when city changes
        setData('brgy', '');
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

    const handleAddNewCase = () => {
        setData('cases', [
            ...data.cases,
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
        ]);
        setActiveCaseIndex(data.cases.length);
    };

    const handleRemoveCase = (index: number) => {
        if (data.cases.length <= 1) return;
        const newCases = data.cases.filter((_, i) => i !== index);
        setData('cases', newCases);
        setActiveCaseIndex(Math.min(activeCaseIndex, newCases.length - 1));
    };

    const handleCaseChange = (index: number, field: string, value: string | boolean) => {
        const newCases = [...data.cases];
        newCases[index] = { ...newCases[index], [field]: value };

        // Auto-set security classification when crime is selected
        if (field === 'crime_committed' && typeof value === 'string') {
            const securityClassification = getSecurityClassification(value);
            newCases[index].security_classification = securityClassification;
        }

        setData('cases', newCases);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setMedicalFile(file);
            setData('medical_file', file);
        }
    };

    const removeFile = () => {
        setMedicalFile(null);
        setData('medical_file', null);
    };

    const getFileIcon = (file: File) => {
        if (file.type.startsWith('image/')) {
            return <Image className="h-4 w-4" />;
        } else if (file.type === 'application/pdf') {
            return <FileText className="h-4 w-4 text-red-500" />;
        } else if (file.type === 'text/plain') {
            return <FileText className="h-4 w-4 text-blue-500" />;
        } else if (file.type.includes('document') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
            return <FileText className="h-4 w-4 text-green-500" />;
        }
        return <FileText className="h-4 w-4" />;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const { data, setData, post, processing, errors, reset } = useForm<{
        fname: string;
        lname: string;
        mname: string;
        alias: string;
        birthdate: string;
        age: string;
        gender: string;
        ethnic_group: string;
        civil_status: string;
        brgy: string;
        city: string;
        province: string;

        order_type: string;
        order_date: string;
        received_date: string;
        document_type: File | null;
        court_branch: string;
        cod_remarks: string;
        complaint: string;
        date: string;
        prognosis: string;

        prescription: string;
        findings: string;
        height: number;
        weight: number;
        build: string;
        complexion: string;
        hair_color: string;
        eye_color: string;
        identification_marks: string;
        mark_location: string;
        pc_remark: string;
        cases: {
            case_number: string;
            crime_committed: string;
            date_committed: string;
            time_committed: string;
            case_status: string;
            case_remarks: string;
            security_classification: string;
            drug_related: boolean;
        }[];
        medical_file: File | null;
    }>({
        fname: '',
        lname: '',
        mname: '',
        alias: '',
        birthdate: '',
        age: '',
        gender: '',
        ethnic_group: '',
        civil_status: '',
        brgy: '',
        city: '',
        province: locationData.province,
        order_type: '',
        order_date: '',
        received_date: '',
        document_type: null,
        court_branch: '',
        cod_remarks: '',
        complaint: '',
        date: new Date().toISOString().split('T')[0],
        prognosis: '',

        prescription: '',
        findings: '',
        height: 170,
        weight: 70,
        build: '',
        complexion: '',
        hair_color: '',
        eye_color: '',
        identification_marks: '',
        mark_location: '',
        pc_remark: '',
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
        ],
        medical_file: null,
    });

    const { props } = usePage();
    const successMessage = (props as any).success;
    const errorMessage = (props as any).error;

    const [date, setDate] = useState<Date | undefined>(undefined);

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
        setData('medical_file', medicalFile);

        // Use the post method from useForm to handle flash messages properly
        post(route('pdl-management.personal-information.create'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setDate(undefined);
                setActiveCaseIndex(0);
                setCurrentStep(1);
                setMedicalFile(null);
                setSelectedCity('');
                setAvailableBarangays([]);
                setDocumentPreview(null);
                setIsCustomOrderType(false);
                setOrderTypeOpen(false);
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
                                    <Input id="fname" name="fname" value={data.fname} onChange={handleChange} placeholder="Enter first name" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lname">
                                        Last Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input id="lname" name="lname" value={data.lname} onChange={handleChange} placeholder="Enter last name" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mname">Middle Name</Label>
                                    <Input id="mname" name="mname" value={data.mname} onChange={handleChange} placeholder="Enter middle name" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="alias">
                                        Alias
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input id="alias" name="alias" value={data.alias} onChange={handleChange} placeholder="Enter alias (if any)" />
                                </div>
                                <div className="space-y-2">
                                    <Label>
                                        Date of Birth <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="date"
                                        value={date ? format(date, 'yyyy-MM-dd') : ''}
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
                                    <Label htmlFor="ethnic_group">
                                        Ethnic Group <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="ethnic_group"
                                        name="ethnic_group"
                                        value={data.ethnic_group}
                                        onChange={handleChange}
                                        placeholder="Enter ethnic group"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>
                                        Civil Status <span className="text-red-500">*</span>
                                    </Label>
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
                                        <Label htmlFor="province">Province</Label>
                                        <Input id="province" name="province" value={data.province} disabled className="bg-gray-100" />
                                        <div className="text-xs text-muted-foreground">Default: South Cotabato</div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">
                                            City/Municipality
                                            <span className="text-red-500">*</span>
                                        </Label>
                                        <Select value={selectedCity} onValueChange={handleCityChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select city/municipality" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.keys(locationData.cities).map((city) => (
                                                    <SelectItem key={city} value={city}>
                                                        {city}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="brgy">
                                            Barangay
                                            <span className="text-red-500">*</span>
                                        </Label>
                                        <Select value={data.brgy} onValueChange={(value) => setData('brgy', value)} disabled={!selectedCity}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={selectedCity ? 'Select barangay' : 'Select city first'} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableBarangays.map((barangay) => (
                                                    <SelectItem key={barangay} value={barangay}>
                                                        {barangay}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {!selectedCity && (
                                            <div className="text-xs text-muted-foreground">Please select a city/municipality first</div>
                                        )}
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
                                    <Popover open={orderTypeOpen} onOpenChange={setOrderTypeOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={orderTypeOpen}
                                                className="w-full justify-between"
                                            >
                                                {data.order_type || 'Select or type order type...'}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0" align="start">
                                            <Command>
                                                <CommandInput
                                                    placeholder="Search order types or type custom..."
                                                    value={data.order_type}
                                                    onValueChange={handleOrderTypeInputChange}
                                                />
                                                <CommandList>
                                                    <CommandEmpty>
                                                        <div className="p-2 text-sm text-muted-foreground">
                                                            No order type found. Press Enter to add "{data.order_type}" as custom order type.
                                                        </div>
                                                    </CommandEmpty>
                                                    <CommandGroup>
                                                        {orderTypeSuggestions.map((orderType) => (
                                                            <CommandItem
                                                                key={orderType}
                                                                value={orderType}
                                                                onSelect={(currentValue) => {
                                                                    handleOrderTypeChange(currentValue);
                                                                    setOrderTypeOpen(false);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={`mr-2 h-4 w-4 ${
                                                                        data.order_type === orderType ? 'opacity-100' : 'opacity-0'
                                                                    }`}
                                                                />
                                                                {orderType}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <div className="text-xs text-muted-foreground">Select from common order types or type a custom order type</div>
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
                                    <Input type="date" value={data.received_date} onChange={(e) => setData('received_date', e.target.value)} />
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
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    <div className="text-xs text-muted-foreground">Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG, TXT</div>

                                    {/* Document Preview */}
                                    {documentPreview && (
                                        <div className="mt-4 space-y-2">
                                            <Label>Document Preview</Label>
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

                                    {/* File Info */}
                                    {data.document_type && (
                                        <div className="mt-2 rounded-lg bg-gray-50 p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    {getFileIcon(data.document_type)}
                                                    <div>
                                                        <p className="text-sm font-medium">{data.document_type.name}</p>
                                                        <p className="text-xs text-gray-500">{formatFileSize(data.document_type.size)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => data.document_type && handleDocumentPreview(data.document_type)}
                                                        className="text-blue-500 hover:text-blue-700"
                                                        title="Preview file"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setData('document_type', null);
                                                            setDocumentPreview(null);
                                                        }}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
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
                                        <Badge variant={getCaseStatusBadgeVariant(data.cases[activeCaseIndex].case_status)}>
                                            {data.cases[activeCaseIndex].case_status.charAt(0).toUpperCase() +
                                                data.cases[activeCaseIndex].case_status.slice(1)}
                                        </Badge>
                                    )}
                                    {data.cases[activeCaseIndex]?.security_classification && (
                                        <Badge variant={getSecurityBadgeVariant(data.cases[activeCaseIndex].security_classification)}>
                                            {data.cases[activeCaseIndex].security_classification.charAt(0).toUpperCase() +
                                                data.cases[activeCaseIndex].security_classification.slice(1)}{' '}
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
                            {data.cases.length > 0 && (
                                <>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="case_number">
                                                Case Number <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="case_number"
                                                value={data.cases[activeCaseIndex].case_number}
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
                                                        {data.cases[activeCaseIndex].crime_committed || 'Select or type crime committed...'}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0" align="start">
                                                    <Command>
                                                        <CommandInput
                                                            placeholder="Search crimes or type custom..."
                                                            value={data.cases[activeCaseIndex].crime_committed}
                                                            onValueChange={(value) => handleCaseChange(activeCaseIndex, 'crime_committed', value)}
                                                        />
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                <div className="p-2 text-sm text-muted-foreground">
                                                                    No crime found. Press Enter to add "{data.cases[activeCaseIndex].crime_committed}"
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
                                                                                    data.cases[activeCaseIndex].crime_committed === crime
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
                                            <div className="text-xs text-muted-foreground">
                                                Select from common crimes or type a custom crime description
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="date_committed">
                                                Date Committed <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                type="date"
                                                value={data.cases[activeCaseIndex].date_committed}
                                                onChange={(e) => handleCaseChange(activeCaseIndex, 'date_committed', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="time_committed">
                                                Time Committed <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                type="time"
                                                value={data.cases[activeCaseIndex].time_committed}
                                                onChange={(e) => handleCaseChange(activeCaseIndex, 'time_committed', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="case_status">
                                                Case Status <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={data.cases[activeCaseIndex].case_status}
                                                onValueChange={(value) => handleCaseChange(activeCaseIndex, 'case_status', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="on trial">On Trial</SelectItem>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="convicted">Convicted</SelectItem>
                                                    <SelectItem value="deceased">Deceased</SelectItem>
                                                    <SelectItem value="case closed">Case Closed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="security_classification">
                                                Security Classification <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={data.cases[activeCaseIndex].security_classification}
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
                                            <Label>Drug Related Case</Label>
                                            <RadioGroup
                                                value={data.cases[activeCaseIndex].drug_related.toString()}
                                                onValueChange={(value) => handleCaseChange(activeCaseIndex, 'drug_related', value === 'true')}
                                                className="flex flex-row space-x-6"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="true" id={`drug_related_yes_${activeCaseIndex}`} />
                                                    <Label htmlFor={`drug_related_yes_${activeCaseIndex}`} className="text-sm font-normal">
                                                        Yes
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="false" id={`drug_related_no_${activeCaseIndex}`} />
                                                    <Label htmlFor={`drug_related_no_${activeCaseIndex}`} className="text-sm font-normal">
                                                        No
                                                    </Label>
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

                            {/* Medical Documents Upload Section */}
                            <Separator />
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Medical Documents & Images</h3>
                                <div className="space-y-4">
                                    {/* File Upload Area */}
                                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400">
                                        <input
                                            type="file"
                                            id="medical-file"
                                            accept="image/*,.pdf,.doc,.docx,.txt"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                        <label htmlFor="medical-file" className="cursor-pointer">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="mt-2">
                                                <span className="text-sm font-medium text-gray-900">Upload medical document</span>
                                                <p className="text-xs text-gray-500">Click to upload or drag and drop</p>
                                                <p className="mt-1 text-xs text-gray-400">Supports: Images (JPG, PNG, GIF), PDF, DOC, DOCX, TXT</p>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Uploaded File */}
                                    {medicalFile && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium">Uploaded File</h4>
                                            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                                <div className="flex items-center space-x-3">
                                                    {getFileIcon(medicalFile)}
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{medicalFile.name}</p>
                                                        <p className="text-xs text-gray-500">{formatFileSize(medicalFile.size)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDocumentPreview(medicalFile)}
                                                        className="text-blue-500 hover:text-blue-700"
                                                        title="Preview file"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={removeFile}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Medical Files Preview */}
                                    {documentPreview && (
                                        <div className="mt-4 space-y-2">
                                            <Label>File Preview</Label>
                                            <div className="relative">
                                                {documentPreview === 'document-file' ? (
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
                                                ) : documentPreview.startsWith('data:image/') ? (
                                                    // Image preview
                                                    <img
                                                        src={documentPreview}
                                                        alt="File preview"
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
                            <CardTitle>Review & Submit</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Personal Information Summary */}
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold">Personal Information</h3>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="font-medium">Name:</span> {data.fname} {data.lname}
                                        </div>
                                        {data.alias && (
                                            <div>
                                                <span className="font-medium">Alias:</span> {data.alias}
                                            </div>
                                        )}
                                        {data.age && (
                                            <div>
                                                <span className="font-medium">Age:</span> {data.age} years
                                            </div>
                                        )}
                                        {data.gender && (
                                            <div>
                                                <span className="font-medium">Gender:</span> {data.gender}
                                            </div>
                                        )}
                                        {data.civil_status && (
                                            <div>
                                                <span className="font-medium">Civil Status:</span> {data.civil_status}
                                            </div>
                                        )}
                                        {(data.brgy || data.city || data.province) && (
                                            <div>
                                                <span className="font-medium">Address:</span>{' '}
                                                {[data.brgy, data.city, data.province].filter(Boolean).join(', ')}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Court Order Summary */}
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold">Court Order</h3>
                                    <div className="space-y-2 text-sm">
                                        {data.order_type && (
                                            <div>
                                                <span className="font-medium">Order Type:</span> {data.order_type}
                                            </div>
                                        )}
                                        {data.court_branch && (
                                            <div>
                                                <span className="font-medium">Court Branch:</span> {data.court_branch}
                                            </div>
                                        )}
                                        {data.order_date && (
                                            <div>
                                                <span className="font-medium">Order Date:</span> {data.order_date}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Cases Summary */}
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold">Cases ({data.cases.length})</h3>
                                    <div className="space-y-3">
                                        {data.cases.map((caseItem, index) => (
                                            <div key={index} className="rounded-lg border p-3">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <span className="font-medium">Case {index + 1}</span>
                                                    <Badge variant={getCaseStatusBadgeVariant(caseItem.case_status)}>{caseItem.case_status}</Badge>
                                                    <Badge variant={getSecurityBadgeVariant(caseItem.security_classification)}>
                                                        {caseItem.security_classification}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1 text-sm">
                                                    {caseItem.case_number && (
                                                        <div>
                                                            <span className="font-medium">Case Number:</span> {caseItem.case_number}
                                                        </div>
                                                    )}
                                                    {caseItem.crime_committed && (
                                                        <div>
                                                            <span className="font-medium">Crime:</span> {caseItem.crime_committed}
                                                        </div>
                                                    )}
                                                    {caseItem.date_committed && (
                                                        <div>
                                                            <span className="font-medium">Date:</span> {caseItem.date_committed}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Physical Characteristics Summary */}
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold">Physical Characteristics</h3>
                                    <div className="space-y-2 text-sm">
                                        {data.height && data.weight && (
                                            <div>
                                                <span className="font-medium">Measurements:</span> {data.height}cm, {data.weight}kg
                                            </div>
                                        )}
                                        {data.build && (
                                            <div>
                                                <span className="font-medium">Build:</span> {data.build}
                                            </div>
                                        )}
                                        {data.complexion && (
                                            <div>
                                                <span className="font-medium">Complexion:</span> {data.complexion}
                                            </div>
                                        )}
                                        {data.hair_color && (
                                            <div>
                                                <span className="font-medium">Hair Color:</span> {data.hair_color}
                                            </div>
                                        )}
                                        {data.eye_color && (
                                            <div>
                                                <span className="font-medium">Eye Color:</span> {data.eye_color}
                                            </div>
                                        )}
                                        {data.identification_marks && data.mark_location && (
                                            <div>
                                                <span className="font-medium">Marks:</span> {data.identification_marks} ({data.mark_location})
                                            </div>
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
            <Head title="Create PDL Information" />

            <div className="mx-auto w-full space-y-6 p-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Create PDL Information</h1>
                        <p className="mt-2 text-muted-foreground">
                            Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.description}
                        </p>
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
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background text-xs">{step.id}</span>
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
                            ref={(el) => {
                                if (!el) return;
                                el.style.display = '';
                                const anyEl = el as any;
                                if (anyEl._timer) clearTimeout(anyEl._timer);
                                anyEl._timer = setTimeout(() => {
                                    el.style.display = 'none';
                                }, 3000);
                            }}
                        >
                            <Alert>
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
                                    reset();
                                    setDate(undefined);
                                    setCurrentStep(1);
                                    setSelectedCity('');
                                    setAvailableBarangays([]);
                                    setDocumentPreview(null);
                                    setMedicalFile(null);
                                    setIsCustomOrderType(false);
                                    setOrderTypeOpen(false);
                                }}
                                disabled={processing}
                            >
                                Reset Form
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
                                            Creating...
                                        </div>
                                    ) : (
                                        'Create PDL Record'
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
