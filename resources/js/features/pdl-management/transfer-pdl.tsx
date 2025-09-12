'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {Alert, AlertTitle, AlertDescription} from '@/components/ui/alert';

export function TransferPDL({ pdl }: { pdl: { id: number; full_name: string } }) {
    const [isOpen, setIsOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        reason: '',
        pdl_id: pdl.id,
    });

    const { props } = usePage();
    const successMessage = (props as any).success;

    const handleSubmit = () => {
        post(route('pdl-management.transfer', pdl.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setTimeout(() => setIsOpen(false), 2000);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" >
                    Transfer PDL
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Confirm PDL Transfer</DialogTitle>
                    <DialogDescription>Transfer {pdl.full_name} to another facility</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {successMessage && (
                        <Alert variant="success" className="mb-4">
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{successMessage}</AlertDescription>
                        </Alert>
                    )}
                    {Object.keys(errors).length > 0 && (
                        <div className="rounded-md bg-red-100 p-3 text-red-700">
                            <ul className="list-disc pl-5">
                                {Object.values(errors).map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="reason">Transfer Reason *</Label>
                        <Textarea
                            id="reason"
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            placeholder="Explain the reason for transfer..."
                            rows={3}
                            required
                        />
                    </div>

                    <div className="mt-2 rounded bg-yellow-50 p-4">
                        <p className="text-sm text-yellow-700">
                            <span className="font-bold">Final Confirmation:</span> This action will immediately initiate the transfer process. Are you
                            sure you want to transfer this PDL?
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={processing || !data.reason.trim()}
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
                    >
                        {processing ? 'Processing...' : 'Confirm Transfer'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
