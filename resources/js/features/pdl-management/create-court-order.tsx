'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Pdl } from '@/types';
import { useForm } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { Check, ChevronsUpDown, FileText, Image, Upload, X, Eye } from 'lucide-react';
import { useState } from 'react';

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
    'Others'
];

export function CreateCourtOrder({ pdls }: { pdls: Pdl[] }) {
    const [orderTypeOpen, setOrderTypeOpen] = useState(false);
    const [documentPreview, setDocumentPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        order_type: '',
        order_date: '',
        received_date: '',
        document_type: null as File | null,
        court_branch: '',
        pdl_id: '',
        cod_remarks: '',
    });

    const { props } = usePage();
    const successMessage = (props as any).success;

    // Handle order type input change
    const handleOrderTypeInputChange = (value: string) => {
        setData('order_type', value);
    };

    // Handle document preview
    const handleDocumentPreview = (file: File) => {
        const reader = new FileReader();

        if (file.type.startsWith('image/')) {
            reader.onload = (e) => {
                setDocumentPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else if (file.type === 'application/pdf') {
            reader.onload = (e) => {
                setDocumentPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else if (file.type === 'text/plain') {
            reader.onload = (e) => {
                setDocumentPreview(e.target?.result as string);
            };
            reader.readAsText(file);
        } else if (file.type.includes('document') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
            setDocumentPreview('document-file');
        } else {
            setDocumentPreview(null);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('court-orders.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setDocumentPreview(null);
                setOrderTypeOpen(false);
            },
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Create Court Order</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Create Court Order</DialogTitle>
                    <DialogDescription>Fill in the details for the new court order.</DialogDescription>
                </DialogHeader>



                {successMessage && (
                    <Alert variant="default" className="mb-4">
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
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

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Order Type */}
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
                                                    No order type found. Press Enter to add "{data.order_type}"
                                                    as custom order type.
                                                </div>
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {orderTypeSuggestions.map((orderType) => (
                                                    <CommandItem
                                                        key={orderType}
                                                        value={orderType}
                                                        onSelect={(currentValue) => {
                                                            setData('order_type', currentValue);
                                                            setOrderTypeOpen(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={`mr-2 h-4 w-4 ${
                                                                data.order_type === orderType
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

                        {/* Order Date */}
                        <div className="space-y-2">
                            <Label>Order Date</Label>
                            <Input type="date" value={data.order_date} onChange={(e) => setData('order_date', e.target.value)} required />
                        </div>

                        {/* Received Date */}
                        <div className="space-y-2">
                            <Label>Received Date</Label>
                            <Input type="date" value={data.received_date} onChange={(e) => setData('received_date', e.target.value)} required />
                        </div>

                        {/* Document Upload */}
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

                            {/* Document Preview */}
                            {documentPreview && (
                                <div className="mt-4 space-y-2">
                                    <Label>Document Preview</Label>
                                    <div className="relative">
                                        {documentPreview === 'document-file' ? (
                                            <div className="flex h-64 w-full items-center justify-center rounded-lg border bg-gray-50">
                                                <div className="text-center">
                                                    <FileText className="mx-auto h-16 w-16 text-gray-400" />
                                                    <p className="mt-2 text-sm font-medium text-gray-900">
                                                        {data.document_type?.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Document file - Preview not available
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {formatFileSize(data.document_type?.size || 0)}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : documentPreview.startsWith('data:image/') ? (
                                            <img
                                                src={documentPreview}
                                                alt="Document preview"
                                                className="max-h-64 w-full rounded-lg border object-contain"
                                            />
                                        ) : documentPreview.startsWith('data:application/pdf') ? (
                                            <iframe
                                                src={documentPreview}
                                                className="h-64 w-full rounded-lg border"
                                                title="PDF Preview"
                                            />
                                        ) : (
                                            <div className="h-64 w-full rounded-lg border bg-white p-4">
                                                <pre className="h-full w-full overflow-auto text-sm text-gray-900 whitespace-pre-wrap">
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
                                            {data.document_type.type.startsWith('image/') ? (
                                                <Image className="h-4 w-4 text-blue-500" />
                                            ) : (
                                                <FileText className="h-4 w-4 text-gray-500" />
                                            )}
                                            <div>
                                                <p className="text-sm font-medium">{data.document_type.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {formatFileSize(data.document_type.size)}
                                                </p>
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

                        {/* Court Branch */}
                        <div className="space-y-2">
                            <Label htmlFor="court_branch">Court Branch</Label>
                            <Input id="court_branch" value={data.court_branch} onChange={(e) => setData('court_branch', e.target.value)} required />
                        </div>

                        {/* PDL ID */}
                        <div className="space-y-2">
                            <Label>PDL (Person Deprived of Liberty)</Label>
                            <Select value={data.pdl_id} onValueChange={(value) => setData('pdl_id', value)} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a PDL" />
                                </SelectTrigger>
                                <SelectContent>
                                    {pdls.map((pdl) => (
                                        <SelectItem key={pdl.id} value={pdl.id.toString()}>
                                            {pdl.fname} {pdl.lname} (ID: {pdl.id})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Remarks */}
                    <div className="space-y-2">
                        <Label htmlFor="cod_remarks">Remarks</Label>
                        <Textarea
                            id="cod_remarks"
                            value={data.cod_remarks}
                            onChange={(e) => setData('cod_remarks', e.target.value)}
                            rows={3}
                        />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Order'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
