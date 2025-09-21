import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Check, ChevronsUpDown, ArrowLeft } from 'lucide-react';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Case Information',
        href: '/pdl-management/case-information',
    },
    {
        title: 'Edit Case Information',
        href: '#',
    },
];

// Criminal case types for dropdown
const criminalCaseTypes = [
    // Violent Crimes
    { category: 'Violent Crimes', cases: [
        'Murder', 'Homicide', 'Manslaughter', 'Assault', 'Battery', 'Robbery', 'Armed Robbery',
        'Kidnapping', 'Abduction', 'Rape', 'Sexual Assault', 'Domestic Violence', 'Child Abuse',
        'Elder Abuse', 'Hate Crime', 'Terrorism', 'Mass Shooting', 'Gang Violence'
    ]},
    // Property Crimes
    { category: 'Property Crimes', cases: [
        'Theft', 'Burglary', 'Larceny', 'Embezzlement', 'Fraud', 'Identity Theft', 'Credit Card Fraud',
        'Insurance Fraud', 'Tax Evasion', 'Money Laundering', 'Arson', 'Vandalism', 'Trespassing',
        'Shoplifting', 'Auto Theft', 'Grand Theft', 'Petty Theft'
    ]},
    // Drug Crimes
    { category: 'Drug Crimes', cases: [
        'Drug Possession', 'Drug Trafficking', 'Drug Manufacturing', 'Drug Distribution', 'Drug Importation',
        'Prescription Drug Fraud', 'Drug Paraphernalia', 'Marijuana Possession', 'Cocaine Possession',
        'Heroin Possession', 'Methamphetamine', 'Ecstasy', 'LSD', 'Synthetic Drugs'
    ]},
    // White Collar Crimes
    { category: 'White Collar Crimes', cases: [
        'Corporate Fraud', 'Securities Fraud', 'Bank Fraud', 'Wire Fraud', 'Mail Fraud', 'Internet Fraud',
        'Ponzi Scheme', 'Insider Trading', 'Bribery', 'Corruption', 'Extortion', 'Racketeering',
        'Organized Crime', 'Cybercrime', 'Identity Theft', 'Forgery', 'Counterfeiting'
    ]},
    // Traffic Violations
    { category: 'Traffic Violations', cases: [
        'DUI/DWI', 'Reckless Driving', 'Hit and Run', 'Driving Without License', 'Driving Under Suspension',
        'Speeding', 'Running Red Light', 'Illegal Parking', 'Vehicle Registration Violation',
        'Driving Without Insurance', 'Vehicular Manslaughter', 'Street Racing'
    ]},
    // Public Order Crimes
    { category: 'Public Order Crimes', cases: [
        'Disorderly Conduct', 'Public Intoxication', 'Disturbing the Peace', 'Loitering', 'Prostitution',
        'Solicitation', 'Public Indecency', 'Trespassing', 'Vagrancy', 'Panhandling', 'Noise Violation',
        'Public Nuisance', 'Obstruction of Justice', 'Resisting Arrest', 'Escape from Custody'
    ]},
    // Juvenile Crimes
    { category: 'Juvenile Crimes', cases: [
        'Truancy', 'Curfew Violation', 'Underage Drinking', 'Underage Smoking', 'Graffiti', 'Vandalism',
        'Shoplifting', 'Fighting', 'Bullying', 'Cyberbullying', 'Sexting', 'Gang Activity'
    ]},
    // Federal Crimes
    { category: 'Federal Crimes', cases: [
        'Tax Evasion', 'Immigration Violation', 'Customs Violation', 'Border Crossing', 'Human Trafficking',
        'Drug Trafficking', 'Weapons Trafficking', 'Terrorism', 'Espionage', 'Treason', 'Sedition',
        'Federal Fraud', 'Bank Robbery', 'Postal Crime', 'Interstate Crime'
    ]},
    // Other Crimes
    { category: 'Other Crimes', cases: [
        'Contempt of Court', 'Perjury', 'Obstruction of Justice', 'Escape', 'Parole Violation',
        'Probation Violation', 'Failure to Appear', 'Bail Jumping', 'Witness Tampering', 'Jury Tampering',
        'Election Fraud', 'Environmental Crime', 'Animal Cruelty', 'Stalking', 'Harassment'
    ]}
];

interface PageProps {
    caseInfo: any;
    [key: string]: any;
}

export default function EditCaseInformation() {
    const { props } = usePage<PageProps>();
    const { caseInfo } = props;
    const [crimeCommittedOpen, setCrimeCommittedOpen] = useState(false);

    const { data, setData, put, processing, errors } = useForm<{
        case_number: string;
        crime_committed: string;
        date_committed: string;
        time_committed: string;
        case_status: string;
        case_remarks: string;
        security_classification: string;
        drug_related: boolean;
        pdl_id: string;
    }>({
        case_number: caseInfo.case_number || '',
        crime_committed: caseInfo.crime_committed || '',
        date_committed: caseInfo.date_committed ? format(new Date(caseInfo.date_committed), 'yyyy-MM-dd') : '',
        time_committed: caseInfo.time_committed || '',
        case_status: caseInfo.case_status || '',
        case_remarks: caseInfo.case_remarks || '',
        security_classification: caseInfo.security_classification || '',
        drug_related: caseInfo.drug_related || false,
        pdl_id: caseInfo.pdl_id.toString(),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('case-information.update', caseInfo.case_id), {
            preserveScroll: true,
            onSuccess: () => {
                router.visit(route('case-information.index'));
            },
        });
    };

    const { props: pageProps } = usePage();
    const successMessage = (pageProps as any).success;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Case Information" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.visit(route('case-information.index'))}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Case Information
                    </Button>
                    <h1 className="text-2xl font-bold">Edit Case Information</h1>
                </div>

                {Object.keys(errors).length > 0 && (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            <ul className="list-inside list-disc">
                                {Object.values(errors).map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                {successMessage && (
                    <Alert variant="default">
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Case Information Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Case Number */}
                                <div className="space-y-2">
                                    <Label htmlFor="case_number">Case Number</Label>
                                    <Input
                                        id="case_number"
                                        value={data.case_number}
                                        onChange={(e) => setData('case_number', e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Crime Committed */}
                                <div className="space-y-2">
                                    <Label htmlFor="crime_committed">Crime Committed</Label>
                                    <Popover open={crimeCommittedOpen} onOpenChange={setCrimeCommittedOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={crimeCommittedOpen}
                                                className="w-full justify-between"
                                            >
                                                {data.crime_committed || "Select or type crime committed..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0" align="start">
                                            <Command>
                                                <CommandInput
                                                    placeholder="Search crimes or type custom..."
                                                    value={data.crime_committed}
                                                    onValueChange={(value) => setData('crime_committed', value)}
                                                />
                                                <CommandList>
                                                    <CommandEmpty>
                                                        <div className="p-2 text-sm text-muted-foreground">
                                                            No crime found. Press Enter to add "{data.crime_committed}" as custom crime.
                                                        </div>
                                                    </CommandEmpty>
                                                    {criminalCaseTypes.map((category) => (
                                                        <CommandGroup key={category.category} heading={category.category}>
                                                            {category.cases.map((crime) => (
                                                                <CommandItem
                                                                    key={crime}
                                                                    value={crime}
                                                                    onSelect={(currentValue) => {
                                                                        setData('crime_committed', currentValue);
                                                                        setCrimeCommittedOpen(false);
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={`mr-2 h-4 w-4 ${
                                                                            data.crime_committed === crime ? "opacity-100" : "opacity-0"
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

                                {/* Date Committed */}
                                <div className="space-y-2">
                                    <Label htmlFor="date_committed">Date Committed</Label>
                                    <Input
                                        type="date"
                                        value={data.date_committed}
                                        onChange={(e) => setData('date_committed', e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Time Committed */}
                                <div className="space-y-2">
                                    <Label htmlFor="time_committed">Time Committed</Label>
                                    <Input
                                        type="time"
                                        value={data.time_committed}
                                        onChange={(e) => setData('time_committed', e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Case Status */}
                                <div className="space-y-2">
                                    <Label htmlFor="case_status">Case Status</Label>
                                    <Select
                                        value={data.case_status}
                                        onValueChange={(value) => setData('case_status', value)}
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="convicted">Convicted</SelectItem>
                                            <SelectItem value="deceased">Deceased</SelectItem>
                                            <SelectItem value="case closed">Case Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Security Classification */}
                                <div className="space-y-2">
                                    <Label htmlFor="security_classification">Security Classification</Label>
                                    <Select
                                        value={data.security_classification}
                                        onValueChange={(value) => setData('security_classification', value)}
                                        required
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

                                {/* Drug Related */}
                                <div className="space-y-2">
                                    <Label>Drug Related Case</Label>
                                    <RadioGroup
                                        value={data.drug_related.toString()}
                                        onValueChange={(value) => setData('drug_related', Boolean(value === 'true'))}
                                        className="flex flex-row space-x-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="true" id="drug_related_yes" />
                                            <Label htmlFor="drug_related_yes" className="text-sm font-normal">
                                                Yes
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="false" id="drug_related_no" />
                                            <Label htmlFor="drug_related_no" className="text-sm font-normal">
                                                No
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                    <div className="text-xs text-muted-foreground">
                                        Indicate if this case is related to drug offenses
                                    </div>
                                </div>
                            </div>

                            {/* Remarks */}
                            <div className="space-y-2">
                                <Label htmlFor="case_remarks">Remarks</Label>
                                <Textarea
                                    id="case_remarks"
                                    value={data.case_remarks}
                                    onChange={(e) => setData('case_remarks', e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit(route('case-information.index'))}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Case'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
