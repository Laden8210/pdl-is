'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export function TransferPDL({ pdl }: { pdl: { id: number; full_name: string } }) {
    const [isOpen, setIsOpen] = useState(false);
    const [reasonOpen, setReasonOpen] = useState(false);
    const [transferReasons, setTransferReasons] = useState<string[]>([]);
    const [isLoadingReasons, setIsLoadingReasons] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        reason: '',
        pdl_id: pdl.id,
    });

    const { props } = usePage();
    const successMessage = (props as any).success;
    const errorMessage = (props as any).error;

    // Fetch transfer reasons when dialog opens
    useEffect(() => {
        if (isOpen) {
            fetchTransferReasons();
        }
    }, [isOpen]);

    const fetchTransferReasons = async () => {
        setIsLoadingReasons(true);
        try {
            const response = await axios.get(route('pdl-management.transfer-reasons'));
            setTransferReasons(response.data);
        } catch (error) {
            console.error('Failed to fetch transfer reasons:', error);
        } finally {
            setIsLoadingReasons(false);
        }
    };

    const handleSubmit = () => {
        post(route('pdl-management.transfer', pdl.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                // Refresh transfer reasons to include the newly saved one
                fetchTransferReasons();
                setTimeout(() => setIsOpen(false), 2000);
            },
        });
    };


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost">Transfer PDL</Button>
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
                    {errorMessage && (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}
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

                    <div className="space-y-2">
                        <Label htmlFor="reason">Transfer Reason *</Label>
                        <Popover open={reasonOpen} onOpenChange={setReasonOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={reasonOpen}
                                    className="w-full justify-between"
                                >
                                    {data.reason || "Select or type transfer reason..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0" align="start">
                                <Command>
                                    <CommandInput
                                        placeholder="Search reasons or type custom..."
                                        value={data.reason}
                                        onValueChange={(value) => setData('reason', value)}
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            <div className="p-2 text-sm text-muted-foreground">
                                                No reason found. Type your custom reason and press Enter to use it.
                                            </div>
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {isLoadingReasons ? (
                                                <div className="p-2 text-sm text-muted-foreground">Loading reasons...</div>
                                            ) : (
                                                transferReasons.map((reason) => (
                                                    <CommandItem
                                                        key={reason}
                                                        value={reason}
                                                        onSelect={(currentValue) => {
                                                            setData('reason', currentValue);
                                                            setReasonOpen(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={`mr-2 h-4 w-4 ${
                                                                data.reason === reason ? "opacity-100" : "opacity-0"
                                                            }`}
                                                        />
                                                        {reason}
                                                    </CommandItem>
                                                ))
                                            )}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <div className="text-xs text-muted-foreground">
                            Select from common reasons or type a custom transfer reason. Custom reasons will be saved for future use.
                        </div>
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
