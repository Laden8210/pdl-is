import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';

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
import { usePSGCLocation } from '@/hooks/usePSGCLocation';
import { Check, ChevronsUpDown, Eye, FileText, Image, Loader2, Upload, X } from 'lucide-react';

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
    const [activeCourtOrderIndex, setActiveCourtOrderIndex] = useState(0);
    const [activeMedicalRecordIndex, setActiveMedicalRecordIndex] = useState(0);
    const [crimeCommittedOpen, setCrimeCommittedOpen] = useState(false);
    const [medicalFiles, setMedicalFiles] = useState<File[]>([]);
    const [mugshotFile, setMugshotFile] = useState<File | null>(null);
    const [documentPreviews, setDocumentPreviews] = useState<(string | null)[]>([]);
    const [medicalPreviews, setMedicalPreviews] = useState<(string | null)[]>([]);
    const [mugshotPreview, setMugshotPreview] = useState<string | null>(null);
    const [isCustomOrderType, setIsCustomOrderType] = useState<boolean>(false);
    const [orderTypeOpen, setOrderTypeOpen] = useState(false);

    // PSGC Location hook
    const {
        provinces,
        citiesMunicipalities,
        barangays,
        selectedProvince,
        selectedCityMunicipality,
        selectedBarangay,
        loading,
        error: locationError,
        handleProvinceChange,
        handleCityMunicipalityChange,
        handleBarangayChange,
        getSelectedLocationNames,
        resetSelections,
    } = usePSGCLocation();

    // Helper function to get all crime types as a flat array
    const getAllCrimeTypes = () => {
        return criminalCaseTypes.flatMap((category) => category.cases.map((crime) => ({ value: crime, label: crime, category: category.category })));
    };

    // Handle order type selection
    const handleOrderTypeChange = (value: string) => {
        if (value === 'Others') {
            setIsCustomOrderType(true);
            handleCourtOrderChange(activeCourtOrderIndex, 'order_type', '');
        } else {
            setIsCustomOrderType(false);
            handleCourtOrderChange(activeCourtOrderIndex, 'order_type', value);
        }
    };

    // Handle order type input change for custom input
    const handleOrderTypeInputChange = (value: string) => {
        handleCourtOrderChange(activeCourtOrderIndex, 'order_type', value);
    };

    // Handle location changes
    const handleLocationChange = (type: 'province' | 'city' | 'barangay', code: string) => {
        if (type === 'province') {
            const province = provinces.find((p) => p.code === code);
            handleProvinceChange(code);
            setData('province', province?.name || '');
            setData('city', '');
            setData('brgy', '');
        } else if (type === 'city') {
            const city = citiesMunicipalities.find((c) => c.code === code);
            handleCityMunicipalityChange(code);
            setData('city', city?.name || '');
            setData('brgy', '');
        } else if (type === 'barangay') {
            const barangay = barangays.find((b) => b.code === code);
            handleBarangayChange(code);
            setData('brgy', barangay?.name || '');
        }
    };

    // Handle document preview for all supported formats
    const handleDocumentPreview = (file: File) => {
        const reader = new FileReader();

        if (file.type.startsWith('image/')) {
            // Handle image files (JPG, JPEG, PNG)
            reader.onload = (e) => {
                const newPreviews = [...documentPreviews];
                newPreviews[activeCourtOrderIndex] = e.target?.result as string;
                setDocumentPreviews(newPreviews);
            };
            reader.readAsDataURL(file);
        } else if (file.type === 'application/pdf') {
            // Handle PDF files
            reader.onload = (e) => {
                const newPreviews = [...documentPreviews];
                newPreviews[activeCourtOrderIndex] = e.target?.result as string;
                setDocumentPreviews(newPreviews);
            };
            reader.readAsDataURL(file);
        } else if (file.type === 'text/plain') {
            // Handle TXT files
            reader.onload = (e) => {
                const newPreviews = [...documentPreviews];
                newPreviews[activeCourtOrderIndex] = e.target?.result as string;
                setDocumentPreviews(newPreviews);
            };
            reader.readAsText(file);
        } else if (file.type.includes('document') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
            // Handle DOC/DOCX files - show file info since we can't preview them directly
            const newPreviews = [...documentPreviews];
            newPreviews[activeCourtOrderIndex] = 'document-file';
            setDocumentPreviews(newPreviews);
        } else {
            const newPreviews = [...documentPreviews];
            newPreviews[activeCourtOrderIndex] = null;
            setDocumentPreviews(newPreviews);
        }
    };

    // Handle medical file preview for all supported formats
    const handleMedicalPreview = (file: File) => {
        const reader = new FileReader();

        if (file.type.startsWith('image/')) {
            // Handle image files (JPG, JPEG, PNG)
            reader.onload = (e) => {
                const newPreviews = [...medicalPreviews];
                newPreviews[activeMedicalRecordIndex] = e.target?.result as string;
                setMedicalPreviews(newPreviews);
            };
            reader.readAsDataURL(file);
        } else if (file.type === 'application/pdf') {
            // Handle PDF files
            reader.onload = (e) => {
                const newPreviews = [...medicalPreviews];
                newPreviews[activeMedicalRecordIndex] = e.target?.result as string;
                setMedicalPreviews(newPreviews);
            };
            reader.readAsDataURL(file);
        } else if (file.type === 'text/plain') {
            // Handle TXT files
            reader.onload = (e) => {
                const newPreviews = [...medicalPreviews];
                newPreviews[activeMedicalRecordIndex] = e.target?.result as string;
                setMedicalPreviews(newPreviews);
            };
            reader.readAsText(file);
        } else if (file.type.includes('document') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
            // Handle DOC/DOCX files - show file info since we can't preview them directly
            const newPreviews = [...medicalPreviews];
            newPreviews[activeMedicalRecordIndex] = 'document-file';
            setMedicalPreviews(newPreviews);
        } else {
            const newPreviews = [...medicalPreviews];
            newPreviews[activeMedicalRecordIndex] = null;
            setMedicalPreviews(newPreviews);
        }
    };
    const handleAddNewCase = () => {
        const newCaseIndex = data.cases.length;
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
        setActiveCaseIndex(newCaseIndex);
    };

    const handleAddNewCourtOrder = () => {
        setData('court_orders', [
            ...data.court_orders,
            {
                order_type: '',
                order_date: '',
                received_date: '',
                document_type: null,
                court_id: '',
                cod_remarks: '',
            },
        ]);
        setActiveCourtOrderIndex(data.court_orders.length);
    };

    const handleRemoveCourtOrder = (index: number) => {
        if (data.court_orders.length <= 1) return;
        const newCourtOrders = data.court_orders.filter((_, i) => i !== index);
        setData('court_orders', newCourtOrders);
        setActiveCourtOrderIndex(Math.min(activeCourtOrderIndex, newCourtOrders.length - 1));
    };

    const handleCourtOrderChange = (index: number, field: string, value: string | File | null) => {
        // Prevent accidental empty strings
        if (field === 'court_id' && value === '') {
            console.log('Prevented empty court_id');
            return;
        }

        const newCourtOrders = [...data.court_orders];
        newCourtOrders[index] = { ...newCourtOrders[index], [field]: value };
        setData('court_orders', newCourtOrders);
        console.log('Court order updated:', newCourtOrders[index]);
    };

    const restoreCourtOrderIfEmpty = (index: number) => {
        if (!data.court_orders[index]?.court_id && dataRef.current?.court_orders[index]?.court_id) {
            // Restore from ref if current data lost the value
            setData('court_orders', dataRef.current.court_orders);
            console.log('Restored court order data from backup');
        }
    };

    useEffect(() => {
        if (activeCourtOrderIndex !== undefined) {
            restoreCourtOrderIfEmpty(activeCourtOrderIndex);
        }
    }, [activeCourtOrderIndex]);
    const handleAddNewMedicalRecord = () => {
        setData('medical_records', [
            ...data.medical_records,
            {
                complaint: '',
                date: new Date().toISOString().split('T')[0],
                prognosis: '',
                prescription: '',
                findings: '',
                medical_file: null,
            },
        ]);
        setActiveMedicalRecordIndex(data.medical_records.length);
    };

    const handleRemoveMedicalRecord = (index: number) => {
        if (data.medical_records.length <= 1) return;
        const newMedicalRecords = data.medical_records.filter((_, i) => i !== index);
        setData('medical_records', newMedicalRecords);
        setActiveMedicalRecordIndex(Math.min(activeMedicalRecordIndex, newMedicalRecords.length - 1));
    };

    const handleMedicalRecordChange = (index: number, field: string, value: string | File | null) => {
        const newMedicalRecords = [...data.medical_records];
        newMedicalRecords[index] = { ...newMedicalRecords[index], [field]: value };
        setData('medical_records', newMedicalRecords);
    };

    const handleRemoveCase = (index: number) => {
        if (data.cases.length <= 1) return;
        const newCases = data.cases.filter((_, i) => i !== index);
        setData('cases', newCases);
        setActiveCaseIndex(Math.min(activeCaseIndex, newCases.length - 1));
    };

    const handleCaseChange = (index: number, field: string, value: string | boolean) => {
        // Prevent resetting certain fields to empty
        if ((field === 'case_status' || field === 'crime_committed') && value === '') {
            console.log(`Prevented empty ${field}`);
            return;
        }

        const newCases = [...data.cases];
        newCases[index] = { ...newCases[index], [field]: value };
        setData('cases', newCases);
    };
    const restoreCaseIfEmpty = (index: number) => {
        if (!data.cases[index]?.case_status && dataRef.current?.cases[index]?.case_status) {
            // Restore entire case from ref if current data lost values
            const newCases = [...data.cases];
            newCases[index] = dataRef.current.cases[index];
            setData('cases', newCases);
            console.log('Restored case data from backup');
        }
    };
    useEffect(() => {
        if (activeCaseIndex !== undefined) {
            restoreCaseIfEmpty(activeCaseIndex);
        }
    }, [activeCaseIndex]);
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setMedicalFiles([...medicalFiles, file]);
            handleMedicalRecordChange(activeMedicalRecordIndex, 'medical_file', file);
            handleMedicalPreview(file);
        }
    };

    const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleCourtOrderChange(activeCourtOrderIndex, 'document_type', file);
            handleDocumentPreview(file);
        }
    };

    const handleMugshotUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setMugshotFile(file);
            setData('mugshot', file);
            handleMugshotPreview(file);
        }
    };

    const handleMugshotPreview = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setMugshotPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeFile = (index: number) => {
        const newMedicalFiles = medicalFiles.filter((_, i) => i !== index);
        setMedicalFiles(newMedicalFiles);
        handleMedicalRecordChange(activeMedicalRecordIndex, 'medical_file', null);
        const newPreviews = [...medicalPreviews];
        newPreviews[activeMedicalRecordIndex] = null;
        setMedicalPreviews(newPreviews);
    };

    const removeDocument = (index: number) => {
        handleCourtOrderChange(activeCourtOrderIndex, 'document_type', null);
        const newPreviews = [...documentPreviews];
        newPreviews[activeCourtOrderIndex] = null;
        setDocumentPreviews(newPreviews);
    };

    const removeMugshot = () => {
        setMugshotFile(null);
        setData('mugshot', null);
        setMugshotPreview(null);
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
        suffix: string;
        birthdate: string;
        age: string;
        gender: string;
        ethnic_group: string;
        civil_status: string;
        brgy: string;
        city: string;
        province: string;

        court_orders: {
            order_type: string;
            order_date: string;
            received_date: string;
            document_type: File | null;
            court_id: string;
            cod_remarks: string;
        }[];
        medical_records: {
            complaint: string;
            date: string;
            prognosis: string;
            prescription: string;
            findings: string;
            medical_file: File | null;
        }[];
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
        mugshot: File | null;
    }>({
        fname: '',
        lname: '',
        mname: '',
        alias: '',
        suffix: '',
        birthdate: '',
        age: '',
        gender: '',
        ethnic_group: '',
        civil_status: '',

        brgy: '',
        city: '',
        province: '',
        court_orders: [
            {
                order_type: '',
                order_date: '',
                received_date: '',
                document_type: null,
                court_id: '',
                cod_remarks: '',
            },
        ],
        medical_records: [
            {
                complaint: '',
                date: new Date().toISOString().split('T')[0],
                prognosis: '',
                prescription: '',
                findings: '',
                medical_file: null,
            },
        ],
        height: 0,
        weight: 0,
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
        mugshot: null,
    });
    const dataRef = useRef(data);
    useEffect(() => {
        dataRef.current = data;
    }, [data]);
    const { props } = usePage();
    const { auth } = props;
    const { courts } = props;

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
        setData('mugshot', mugshotFile);

        // Use the post method from useForm to handle flash messages properly
        post(route('pdl-management.personal-information.create'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setDate(undefined);
                setActiveCaseIndex(0);
                setActiveCourtOrderIndex(0);
                setActiveMedicalRecordIndex(0);
                setCurrentStep(1);
                setMedicalFiles([]);
                setMugshotFile(null);
                resetSelections();
                setDocumentPreviews([]);
                setMedicalPreviews([]);
                setMugshotPreview(null);
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
                                    <Label htmlFor="suffix">
                                        Suffix

                                    </Label>
                                    <Input id="suffix" name="suffix" value={data.suffix} onChange={handleChange} placeholder="Enter suffix (if any)" />
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
                                            <SelectItem value="Annulment">Annulment</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="mb-4 text-lg font-medium">Address Information</h3>

                                {/* Location Error Alert */}
                                {locationError && (
                                    <Alert variant="destructive" className="mb-4">
                                        <AlertTitle>Location Service Error</AlertTitle>
                                        <AlertDescription>{locationError}. Please refresh the page or try again later.</AlertDescription>
                                    </Alert>
                                )}

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="province">
                                            Province
                                            <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={selectedProvince}
                                            onValueChange={(value) => handleLocationChange('province', value)}
                                            disabled={loading.provinces}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={loading.provinces ? 'Loading provinces...' : 'Select province'} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {provinces.map((province) => (
                                                    <SelectItem key={province.code} value={province.code}>
                                                        {province.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {loading.provinces && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                Loading provinces...
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="city">
                                            City/Municipality
                                            <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={selectedCityMunicipality}
                                            onValueChange={(value) => handleLocationChange('city', value)}
                                            disabled={!selectedProvince || loading.citiesMunicipalities}
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={
                                                        !selectedProvince
                                                            ? 'Select province first'
                                                            : loading.citiesMunicipalities
                                                              ? 'Loading cities/municipalities...'
                                                              : 'Select city/municipality'
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {citiesMunicipalities.map((city) => (
                                                    <SelectItem key={city.code} value={city.code}>
                                                        {city.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {loading.citiesMunicipalities && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                Loading cities/municipalities...
                                            </div>
                                        )}
                                        {!selectedProvince && <div className="text-xs text-muted-foreground">Please select a province first</div>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="brgy">
                                            Barangay
                                            <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={selectedBarangay}
                                            onValueChange={(value) => handleLocationChange('barangay', value)}
                                            disabled={!selectedCityMunicipality || loading.barangays}
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={
                                                        !selectedCityMunicipality
                                                            ? 'Select city/municipality first'
                                                            : loading.barangays
                                                              ? 'Loading barangays...'
                                                              : 'Select barangay'
                                                    }
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {barangays.map((barangay) => (
                                                    <SelectItem key={barangay.code} value={barangay.code}>
                                                        {barangay.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {loading.barangays && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                Loading barangays...
                                            </div>
                                        )}
                                        {!selectedCityMunicipality && (
                                            <div className="text-xs text-muted-foreground">Please select a city/municipality first</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="mb-4 text-lg font-medium">Mugshot Photo</h3>
                                <div className="space-y-4">
                                    {/* Mugshot Upload Area */}
                                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400">
                                        <input
                                            type="file"
                                            id="mugshot"
                                            accept="image/jpeg,image/jpg,image/png"
                                            onChange={handleMugshotUpload}
                                            className="hidden"
                                        />
                                        <label htmlFor="mugshot" className="cursor-pointer">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="mt-2">
                                                <span className="text-sm font-medium text-gray-900">Upload mugshot photo</span>
                                                <p className="text-xs text-gray-500">Click to upload or drag and drop</p>
                                                <p className="mt-1 text-xs text-gray-400">Supports: JPG, JPEG, PNG (Max 5MB)</p>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Uploaded Mugshot */}
                                    {mugshotFile && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium">Uploaded Mugshot</h4>
                                            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                                <div className="flex items-center space-x-3">
                                                    <Image className="h-5 w-5 text-blue-500" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{mugshotFile.name}</p>
                                                        <p className="text-xs text-gray-500">{formatFileSize(mugshotFile.size)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleMugshotPreview(mugshotFile)}
                                                        className="text-blue-500 hover:text-blue-700"
                                                        title="Preview mugshot"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={removeMugshot}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Mugshot Preview */}
                                    {mugshotPreview && (
                                        <div className="mt-4 space-y-2">
                                            <Label>Mugshot Preview</Label>
                                            <div className="relative">
                                                <img
                                                    src={mugshotPreview}
                                                    alt="Mugshot preview"
                                                    className="max-h-96 w-full rounded-lg border object-contain"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="absolute top-2 right-2"
                                                    onClick={() => setMugshotPreview(null)}
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

            case 2:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">Court Order Information</div>
                                <Button variant="outline" size="sm" type="button" onClick={handleAddNewCourtOrder}>
                                    Add New Court Order
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Court Order Navigation Tabs */}
                            <div className="flex gap-2 overflow-x-auto py-2">
                                {data.court_orders.map((_, index) => (
                                    <Button
                                        key={index}
                                        variant={activeCourtOrderIndex === index ? 'default' : 'outline'}
                                        size="sm"
                                        type="button"
                                        onClick={() => setActiveCourtOrderIndex(index)}
                                        className="relative"
                                    >
                                        Court Order {index + 1}
                                        {data.court_orders.length > 1 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveCourtOrder(index);
                                                }}
                                                className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </Button>
                                ))}
                            </div>

                            {/* Court Order Form Fields */}
                            {data.court_orders.length > 0 && (
                                <>
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
                                                        {data.court_orders[activeCourtOrderIndex].order_type || 'Select or type order type...'}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-full p-0" align="start">
                                                    <Command>
                                                        <CommandInput
                                                            placeholder="Search order types or type custom..."
                                                            value={data.court_orders[activeCourtOrderIndex].order_type}
                                                            onValueChange={(value) =>
                                                                handleCourtOrderChange(activeCourtOrderIndex, 'order_type', value)
                                                            }
                                                        />
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                <div className="p-2 text-sm text-muted-foreground">
                                                                    No order type found. Press Enter to add "
                                                                    {data.court_orders[activeCourtOrderIndex].order_type}" as custom order type.
                                                                </div>
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {orderTypeSuggestions.map((orderType) => (
                                                                    <CommandItem
                                                                        key={orderType}
                                                                        value={orderType}
                                                                        onSelect={(currentValue) => {
                                                                            handleCourtOrderChange(activeCourtOrderIndex, 'order_type', currentValue);
                                                                            setOrderTypeOpen(false);
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={`mr-2 h-4 w-4 ${
                                                                                data.court_orders[activeCourtOrderIndex].order_type === orderType
                                                                                    ? 'opacity-100'
                                                                                    : 'opacity-0'
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
                                            <div className="text-xs text-muted-foreground">
                                                Select from common order types or type a custom order type
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>
                                                Order Date <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                type="date"
                                                value={data.court_orders[activeCourtOrderIndex].order_date}
                                                onChange={(e) => handleCourtOrderChange(activeCourtOrderIndex, 'order_date', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>
                                                Received Date <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                type="date"
                                                value={data.court_orders[activeCourtOrderIndex].received_date}
                                                onChange={(e) => handleCourtOrderChange(activeCourtOrderIndex, 'received_date', e.target.value)}
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
                                                onChange={handleDocumentUpload}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                            />
                                            <div className="text-xs text-muted-foreground">
                                                Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG, TXT
                                            </div>

                                            {/* Document Preview */}
                                            {documentPreviews[activeCourtOrderIndex] && (
                                                <div className="mt-4 space-y-2">
                                                    <Label>Document Preview</Label>
                                                    <div className="relative">
                                                        {documentPreviews[activeCourtOrderIndex] === 'document-file' ? (
                                                            // DOC/DOCX file info display
                                                            <div className="flex h-64 w-full items-center justify-center rounded-lg border bg-gray-50">
                                                                <div className="text-center">
                                                                    <FileText className="mx-auto h-16 w-16 text-gray-400" />
                                                                    <p className="mt-2 text-sm font-medium text-gray-900">
                                                                        {data.court_orders[activeCourtOrderIndex].document_type?.name}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">Document file - Preview not available</p>
                                                                    <p className="text-xs text-gray-400">
                                                                        {formatFileSize(
                                                                            data.court_orders[activeCourtOrderIndex].document_type?.size || 0,
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ) : documentPreviews[activeCourtOrderIndex].startsWith('data:image/') ? (
                                                            // Image preview
                                                            <img
                                                                src={documentPreviews[activeCourtOrderIndex]}
                                                                alt="Document preview"
                                                                className="max-h-64 w-full rounded-lg border object-contain"
                                                            />
                                                        ) : documentPreviews[activeCourtOrderIndex].startsWith('data:application/pdf') ? (
                                                            // PDF preview
                                                            <iframe
                                                                src={documentPreviews[activeCourtOrderIndex]}
                                                                className="h-64 w-full rounded-lg border"
                                                                title="PDF Preview"
                                                            />
                                                        ) : (
                                                            // Text file preview
                                                            <div className="h-64 w-full rounded-lg border bg-white p-4">
                                                                <pre className="h-full w-full overflow-auto text-sm whitespace-pre-wrap text-gray-900">
                                                                    {documentPreviews[activeCourtOrderIndex]}
                                                                </pre>
                                                            </div>
                                                        )}
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="absolute top-2 right-2"
                                                            onClick={() => {
                                                                const newPreviews = [...documentPreviews];
                                                                newPreviews[activeCourtOrderIndex] = null;
                                                                setDocumentPreviews(newPreviews);
                                                            }}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* File Info */}
                                            {data.court_orders[activeCourtOrderIndex].document_type && (
                                                <div className="mt-2 rounded-lg bg-gray-50 p-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            {getFileIcon(data.court_orders[activeCourtOrderIndex].document_type)}
                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    {data.court_orders[activeCourtOrderIndex].document_type.name}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {formatFileSize(data.court_orders[activeCourtOrderIndex].document_type.size)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    data.court_orders[activeCourtOrderIndex].document_type &&
                                                                    handleDocumentPreview(data.court_orders[activeCourtOrderIndex].document_type)
                                                                }
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
                                                                    handleCourtOrderChange(activeCourtOrderIndex, 'document_type', null);
                                                                    const newPreviews = [...documentPreviews];
                                                                    newPreviews[activeCourtOrderIndex] = null;
                                                                    setDocumentPreviews(newPreviews);
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
                                            <Select
                                                value={data.court_orders[activeCourtOrderIndex].court_id}
                                                onValueChange={(value) => handleCourtOrderChange(activeCourtOrderIndex, 'court_id', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select court branch" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(courts as any[]).map((court: any) => (
                                                        <SelectItem key={court.court_id} value={court.court_id.toString()}>
                                                            {court.branch_code} - {court.branch_name || court.branch_code}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cod_remarks">Remarks</Label>
                                        <Textarea
                                            id="cod_remarks"
                                            name="cod_remarks"
                                            value={data.court_orders[activeCourtOrderIndex].cod_remarks}
                                            onChange={(e) => handleCourtOrderChange(activeCourtOrderIndex, 'cod_remarks', e.target.value)}
                                            rows={3}
                                            placeholder="Enter any additional remarks..."
                                        />
                                    </div>
                                </>
                            )}
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
                                                                    No crime found. Press Enter to add "
                                                                    {data.cases[activeCaseIndex]?.crime_committed || ''}" as custom crime.
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
                                                    <SelectItem value="convicted">Convicted</SelectItem>
                                                    <SelectItem value="deceased">Deceased</SelectItem>
                                                    <SelectItem value="bonded">Bonded</SelectItem>
                                                    <SelectItem value="transferred">Transferred</SelectItem>
                                                    <SelectItem value="served_sentence">Served Sentence</SelectItem>
                                                    <SelectItem value="dismissed">Dismissed</SelectItem>

                                                    {(auth as any)?.user?.position === 'law-enforcement' && (
                                                        <SelectItem value="arraignment">Arraignment</SelectItem>
                                                    )}
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
                                            <Label>Drug Related Case</Label>
                                            <RadioGroup
                                                value={data.cases[activeCaseIndex]?.drug_related?.toString() || 'false'}
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
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">Medical Records</div>
                                <Button variant="outline" size="sm" type="button" onClick={handleAddNewMedicalRecord}>
                                    Add New Medical Record
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Medical Record Navigation Tabs */}
                            <div className="flex gap-2 overflow-x-auto py-2">
                                {data.medical_records.map((_, index) => (
                                    <Button
                                        key={index}
                                        variant={activeMedicalRecordIndex === index ? 'default' : 'outline'}
                                        size="sm"
                                        type="button"
                                        onClick={() => setActiveMedicalRecordIndex(index)}
                                        className="relative"
                                    >
                                        Medical Record {index + 1}
                                        {data.medical_records.length > 1 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveMedicalRecord(index);
                                                }}
                                                className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </Button>
                                ))}
                            </div>

                            {/* Medical Record Form Fields */}
                            {data.medical_records.length > 0 && (
                                <>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="date">
                                                Date <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                type="date"
                                                id="date"
                                                value={data.medical_records[activeMedicalRecordIndex].date}
                                                onChange={(e) => handleMedicalRecordChange(activeMedicalRecordIndex, 'date', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="complaint">
                                                Complaint <span className="text-red-500">*</span>
                                            </Label>
                                            <Textarea
                                                id="complaint"
                                                name="complaint"
                                                value={data.medical_records[activeMedicalRecordIndex].complaint}
                                                onChange={(e) => handleMedicalRecordChange(activeMedicalRecordIndex, 'complaint', e.target.value)}
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
                                                value={data.medical_records[activeMedicalRecordIndex].findings}
                                                onChange={(e) => handleMedicalRecordChange(activeMedicalRecordIndex, 'findings', e.target.value)}
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
                                                value={data.medical_records[activeMedicalRecordIndex].prognosis}
                                                onChange={(e) => handleMedicalRecordChange(activeMedicalRecordIndex, 'prognosis', e.target.value)}
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
                                                value={data.medical_records[activeMedicalRecordIndex].prescription}
                                                onChange={(e) => handleMedicalRecordChange(activeMedicalRecordIndex, 'prescription', e.target.value)}
                                                rows={3}
                                                placeholder="Enter prescribed medications and treatments..."
                                            />
                                        </div>
                                    </div>

                                    {/* Medical Documents Upload Section */}
                                    <Separator />
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">
                                            Medical Documents & Images
                                            <span className="text-red-500"> *</span>
                                        </h3>
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
                                                        <p className="mt-1 text-xs text-gray-400">
                                                            Supports: Images (JPG, PNG, GIF), PDF, DOC, DOCX, TXT
                                                        </p>
                                                    </div>
                                                </label>
                                            </div>

                                            {/* Uploaded File */}
                                            {data.medical_records[activeMedicalRecordIndex].medical_file && (
                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-medium">Uploaded File</h4>
                                                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                                        <div className="flex items-center space-x-3">
                                                            {getFileIcon(data.medical_records[activeMedicalRecordIndex].medical_file)}
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    {data.medical_records[activeMedicalRecordIndex].medical_file.name}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {formatFileSize(data.medical_records[activeMedicalRecordIndex].medical_file.size)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    data.medical_records[activeMedicalRecordIndex].medical_file &&
                                                                    handleMedicalPreview(data.medical_records[activeMedicalRecordIndex].medical_file)
                                                                }
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
                                                                    handleMedicalRecordChange(activeMedicalRecordIndex, 'medical_file', null);
                                                                    const newPreviews = [...medicalPreviews];
                                                                    newPreviews[activeMedicalRecordIndex] = null;
                                                                    setMedicalPreviews(newPreviews);
                                                                }}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Medical Files Preview */}
                                            {medicalPreviews[activeMedicalRecordIndex] && (
                                                <div className="mt-4 space-y-2">
                                                    <Label>File Preview</Label>
                                                    <div className="relative">
                                                        {medicalPreviews[activeMedicalRecordIndex] === 'document-file' ? (
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
                                                        ) : medicalPreviews[activeMedicalRecordIndex].startsWith('data:image/') ? (
                                                            // Image preview
                                                            <img
                                                                src={medicalPreviews[activeMedicalRecordIndex]}
                                                                alt="File preview"
                                                                className="max-h-64 w-full rounded-lg border object-contain"
                                                            />
                                                        ) : medicalPreviews[activeMedicalRecordIndex].startsWith('data:application/pdf') ? (
                                                            // PDF preview
                                                            <iframe
                                                                src={medicalPreviews[activeMedicalRecordIndex]}
                                                                className="h-64 w-full rounded-lg border"
                                                                title="PDF Preview"
                                                            />
                                                        ) : (
                                                            // Text file preview
                                                            <div className="h-64 w-full rounded-lg border bg-white p-4">
                                                                <pre className="h-full w-full overflow-auto text-sm whitespace-pre-wrap text-gray-900">
                                                                    {medicalPreviews[activeMedicalRecordIndex]}
                                                                </pre>
                                                            </div>
                                                        )}
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="absolute top-2 right-2"
                                                            onClick={() => {
                                                                const newPreviews = [...medicalPreviews];
                                                                newPreviews[activeMedicalRecordIndex] = null;
                                                                setMedicalPreviews(newPreviews);
                                                            }}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
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
                                        {(() => {
                                            const locationNames = getSelectedLocationNames();
                                            const addressParts = [
                                                locationNames.barangay,
                                                locationNames.cityMunicipality,
                                                locationNames.province,
                                            ].filter(Boolean);
                                            return (
                                                addressParts.length > 0 && (
                                                    <div>
                                                        <span className="font-medium">Address:</span> {addressParts.join(', ')}
                                                    </div>
                                                )
                                            );
                                        })()}
                                    </div>
                                </div>

                                {/* Court Order Summary */}
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold">Court Orders ({data.court_orders.length})</h3>
                                    <div className="space-y-3">
                                        {data.court_orders.map((courtOrder, index) => (
                                            <div key={index} className="rounded-lg border p-3">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <span className="font-medium">Court Order {index + 1}</span>
                                                </div>
                                                <div className="space-y-1 text-sm">
                                                    {courtOrder.order_type && (
                                                        <div>
                                                            <span className="font-medium">Order Type:</span> {courtOrder.order_type}
                                                        </div>
                                                    )}
                                                    {courtOrder.court_id && (
                                                        <div>
                                                            <span className="font-medium">Court Branch:</span> {courtOrder.court_id}
                                                        </div>
                                                    )}
                                                    {courtOrder.order_date && (
                                                        <div>
                                                            <span className="font-medium">Order Date:</span> {courtOrder.order_date}
                                                        </div>
                                                    )}
                                                    {courtOrder.received_date && (
                                                        <div>
                                                            <span className="font-medium">Received Date:</span> {courtOrder.received_date}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Medical Records Summary */}
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold">Medical Records ({data.medical_records.length})</h3>
                                    <div className="space-y-3">
                                        {data.medical_records.map((medicalRecord, index) => (
                                            <div key={index} className="rounded-lg border p-3">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <span className="font-medium">Medical Record {index + 1}</span>
                                                </div>
                                                <div className="space-y-1 text-sm">
                                                    {medicalRecord.date && (
                                                        <div>
                                                            <span className="font-medium">Date:</span> {medicalRecord.date}
                                                        </div>
                                                    )}
                                                    {medicalRecord.complaint && (
                                                        <div>
                                                            <span className="font-medium">Complaint:</span> {medicalRecord.complaint}
                                                        </div>
                                                    )}
                                                    {medicalRecord.findings && (
                                                        <div>
                                                            <span className="font-medium">Findings:</span> {medicalRecord.findings}
                                                        </div>
                                                    )}
                                                    {medicalRecord.prognosis && (
                                                        <div>
                                                            <span className="font-medium">Prognosis:</span> {medicalRecord.prognosis}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
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
                                    setActiveCaseIndex(0);
                                    setActiveCourtOrderIndex(0);
                                    setActiveMedicalRecordIndex(0);
                                    resetSelections();
                                    setDocumentPreviews([]);
                                    setMedicalPreviews([]);
                                    setMugshotPreview(null);
                                    setMedicalFiles([]);
                                    setMugshotFile(null);
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
