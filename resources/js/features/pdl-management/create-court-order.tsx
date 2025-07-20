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
import { Pdl } from '@/types';
import { useForm } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

export function CreateCourtOrder({ pdls }: { pdls: Pdl[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        court_order_number: '',
        order_type: '',
        order_date: '',
        received_date: '',
        document_type: '',
        court_branch: '',
        pdl_id: '',
        remarks: '',
    });

    const { props } = usePage();
    const successMessage = (props as any).success;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('court-orders.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
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

                {Object.keys(errors).length > 0 && (
                    <Alert variant="destructive" className="mt-4 mb-4">
                        <AlertTitle>Unable to process request</AlertTitle>
                        <AlertDescription>
                            <ul className="list-inside list-disc text-sm">
                                {Object.values(errors).map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

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
                        {/* Court Order Number */}
                        <div className="space-y-2">
                            <Label htmlFor="court_order_number">Court Order Number</Label>
                            <Input
                                id="court_order_number"
                                value={data.court_order_number}
                                onChange={(e) => setData('court_order_number', e.target.value)}
                                required
                            />
                        </div>

                        {/* Order Type */}
                        <div className="space-y-2">
                            <Label htmlFor="order_type">Order Type</Label>
                            <Input id="order_type" value={data.order_type} onChange={(e) => setData('order_type', e.target.value)} required />
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

                        {/* Document Type */}
                        <div className="space-y-2">
                            <Label htmlFor="document_type">Document Type</Label>
                            <Input
                                id="document_type"
                                placeholder="e.g., PDF, IMS"
                                value={data.document_type}
                                onChange={(e) => setData('document_type', e.target.value)}
                                required
                            />
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
                        <Label htmlFor="remarks">Remarks</Label>
                        <Textarea id="remarks" value={data.remarks} onChange={(e) => setData('remarks', e.target.value)} rows={3} />
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
