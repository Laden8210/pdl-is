import AppLayout from '@/layouts/app-layout';
import { PageProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { useState } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Update PDL Management',
        href: '/pdl-management',
    },
];

export default function UpdatePDLInformation() {

    const { props } = usePage();

    const { pdl } = props;
    console.log('PDL:', pdl);

    const [activeCaseIndex, setActiveCaseIndex] = useState(0);
    const handleAddNewCase = () => {
        setData('cases', [
            ...data.cases,
            {
                case_id: '',
                case_number: '',
                crime_committed: '',
                date_committed: '',
                time_committed: '',
                case_status: 'open',
                case_remarks: '',
                security_classification: 'medium',
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

    const handleCaseChange = (index: number, field: string, value: string) => {
        const newCases = [...data.cases];
        newCases[index] = { ...newCases[index], [field]: value };
        setData('cases', newCases);
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
        court_order_number: string;
        order_type: string;
        order_date: string;
        received_date: string;
        document_type: string;
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

        cases: {
            case_id: number;
            case_number: string;
            crime_committed: string;
            date_committed: string;
            time_committed: string;
            case_status: string;
            case_remarks: string;
            security_classification: string;
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

        // Court order
        court_order_id: pdl.court_orders?.[0]?.court_order_id || 0,
        court_order_number: pdl.court_orders?.[0]?.court_order_number || '',
        order_type: pdl.court_orders?.[0]?.order_type || '',
        order_date: pdl.court_orders?.[0]?.order_date || '',
        received_date: pdl.court_orders?.[0]?.received_date || '',
        document_type: pdl.court_orders?.[0]?.document_type || '',
        court_branch: pdl.court_orders?.[0]?.court_branch || '',
        cod_remarks: pdl.court_orders?.[0]?.remarks || '',

        // Medical record
        medical_record_id: pdl.medical_records?.[0]?.medical_record_id || 0,
        complaint: pdl.medical_records?.[0]?.complaint || '',
        date: pdl.medical_records?.[0]?.date || new Date().toISOString().split('T')[0],
        prognosis: pdl.medical_records?.[0]?.prognosis || '',
        laboratory: pdl.medical_records?.[0]?.laboratory || '',
        prescription: pdl.medical_records?.[0]?.prescription || '',
        findings: pdl.medical_records?.[0]?.findings || '',

        // Physical characteristic
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

        // Cases
        cases:
            Array.isArray(pdl.cases) && pdl.cases.length > 0
                ? pdl.cases.map((c) => ({
                      case_id: c.case_id,
                      case_number: c.case_number || '',
                      crime_committed: c.crime_committed || '',
                      date_committed: c.date_committed || '',
                      time_committed: c.time_committed || '',
                      case_status: c.case_status || 'open',
                      case_remarks: c.case_remarks || '',
                      security_classification: c.security_classification || 'medium',
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
                      },
                  ],
    });

    const successMessage = (props as any).success;


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

        put(route('pdl-management.personal-information.update', pdl.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setDate(undefined);
                setActiveCaseIndex(0);

                // Show success alert for 5 seconds, then redirect
                setTimeout(() => {
                    window.location.href = route('pdl-management.index');
                }, 5000);
            },
        });
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



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create PDL Information" />

            <div className="mx-auto w-full space-y-6 p-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Update PDL Information</h1>
                        <p className="mt-2 text-muted-foreground">Fill in the required information to create a new PDL record.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Alert */}
                    {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive">
                            <AlertTitle>Unable to process request</AlertTitle>
                            <AlertDescription>
                                <ul className="list-inside list-disc space-y-1">
                                    {Object.values(errors).map((error, index) => (
                                        <li key={index} className="text-sm">
                                            {error}
                                        </li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Success Alert */}
                    {successMessage && (
                        <Alert>
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{successMessage}</AlertDescription>
                        </Alert>
                    )}

                    <Accordion type="multiple" defaultValue={['personal', 'court', 'case', 'medical', 'physical']} className="w-full space-y-4">
                        {/* Personal Information */}
                        <AccordionItem value="personal">
                            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                <div className="flex items-center gap-2">
                                    Personal Information
                                    <Badge variant="outline">Required</Badge>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <Card>
                                    <CardContent className="pt-6">
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

                                        <Separator className="my-6" />

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
                                    </CardContent>
                                </Card>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Court Order Information */}
                        <AccordionItem value="court">
                            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                <div className="flex items-center gap-2">
                                    Court Order Information
                                    <Badge variant="outline">Required</Badge>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="court_order_number">
                                                    Court Order Number <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="court_order_number"
                                                    name="court_order_number"
                                                    value={data.court_order_number}
                                                    onChange={handleChange}
                                                    placeholder="Enter court order number"
                                                />
                                            </div>
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
                                                    Document Type <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="document_type"
                                                    name="document_type"
                                                    placeholder="e.g., PDF, IMS"
                                                    value={data.document_type}
                                                    onChange={handleChange}
                                                />
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
                                        <div className="mt-6 space-y-2">
                                            <Label htmlFor="remarks">Remarks</Label>
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
                            </AccordionContent>
                        </AccordionItem>

                        {/* Case Information */}
                        <AccordionItem value="case">
                            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                <div className="flex w-full justify-between">
                                    <div className="flex items-center gap-2">
                                        Case Information
                                        <Badge variant="outline">Required</Badge>
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
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddNewCase();
                                            }}
                                        >
                                            Add New Case
                                        </Button>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <Card>
                                    <CardContent className="pt-6">
                                        {/* Case Navigation Tabs */}
                                        <div className="mb-4 flex gap-2 overflow-x-auto py-2 pb-2">
                                            {data.cases.map(
                                                (
                                                    _caseItem: {
                                                        case_number: string;
                                                        crime_committed: string;
                                                        date_committed: string;
                                                        time_committed: string;
                                                        case_status: string;
                                                        case_remarks: string;
                                                        security_classification: string;
                                                    },
                                                    index: number,
                                                ) => (
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
                                                                className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 p-1 text-xs text-white"
                                                            >
                                                                ×
                                                            </button>
                                                        )}
                                                    </Button>
                                                ),
                                            )}
                                        </div>

                                        {/* Case Form Fields */}
                                        {data.cases.length > 0 && (
                                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="case_number">
                                                        Case Number <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="case_number"
                                                        name="case_number"
                                                        value={data.cases[activeCaseIndex].case_number}
                                                        onChange={(e) => handleCaseChange(activeCaseIndex, 'case_number', e.target.value)}
                                                        placeholder="Enter case number"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="crime_committed">
                                                        Crime Committed <span className="text-red-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="crime_committed"
                                                        name="crime_committed"
                                                        value={data.cases[activeCaseIndex].crime_committed}
                                                        onChange={(e) => handleCaseChange(activeCaseIndex, 'crime_committed', e.target.value)}
                                                        placeholder="Enter crime committed"
                                                    />
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
                                                            <SelectItem value="open">Open</SelectItem>
                                                            <SelectItem value="closed">Closed</SelectItem>
                                                            <SelectItem value="pending">Pending</SelectItem>
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
                                            </div>
                                        )}

                                        <div className="mt-6 space-y-2">
                                            <Label htmlFor="case_remarks">Case Remarks</Label>
                                            <Textarea
                                                id="case_remarks"
                                                name="case_remarks"
                                                value={data.cases[activeCaseIndex]?.case_remarks || ''}
                                                onChange={(e) => handleCaseChange(activeCaseIndex, 'case_remarks', e.target.value)}
                                                rows={3}
                                                placeholder="Enter case-related remarks..."
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Medical Record */}
                        <AccordionItem value="medical">
                            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                <div className="flex items-center gap-2">
                                    Medical Record
                                    <Badge variant="outline">Required</Badge>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="grid grid-cols-2 gap-6">
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
                                                    placeholder="Enter medical prognosis..."
                                                />
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
                            </AccordionContent>
                        </AccordionItem>

                        {/* Physical Characteristics */}
                        <AccordionItem value="physical">
                            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                <div className="flex items-center gap-2">
                                    Physical Characteristics
                                    <Badge variant="outline">Required</Badge>
                                    {data.height && data.weight && (
                                        <Badge variant="secondary">
                                            {data.height}cm / {data.weight}kg
                                        </Badge>
                                    )}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <Card>
                                    <CardContent className="pt-6">
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

                                        <Separator className="my-6" />

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
                                    </CardContent>
                                </Card>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    {/* Form Actions */}
                    <div className="flex items-center justify-between border-t pt-6">
                        <div className="text-sm text-muted-foreground">
                            <span className="text-red-500">*</span> Required fields
                        </div>
                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    reset();
                                    setDate(undefined);
                                }}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
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
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
