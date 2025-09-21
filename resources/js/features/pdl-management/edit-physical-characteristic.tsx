'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { PhysicalCharacteristic } from '@/types';
import { usePage } from '@inertiajs/react';

export function EditPhysicalCharacteristic({ characteristic }: { characteristic: PhysicalCharacteristic }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        pdl_id: characteristic.pdl_id?.toString() || '',
        height: characteristic.height?.toString() || '',
        weight: characteristic.weight?.toString() || '',
        build: characteristic.build || '',
        complexion: characteristic.complexion || '',
        hair_color: characteristic.hair_color || '',
        eye_color: characteristic.eye_color || '',
        identification_marks: characteristic.identification_marks || '',
        mark_location: characteristic.mark_location || '',
        remark: characteristic.remark || '',
        pc_remark: characteristic.pc_remark || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('physical-characteristics.update', characteristic.characteristic_id), {
            preserveScroll: true,
            onSuccess: () => {
                // Don't reset the form on success, just close the dialog
            },
            onError: (errors) => {
                console.error('Update failed:', errors);
            }
        });
    };

    const { props } = usePage();
    const successMessage = (props as any).success;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Edit Physical Characteristic</DialogTitle>
                    <DialogDescription>Update the physical details</DialogDescription>
                </DialogHeader>

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
                    {successMessage && (
                        <Alert variant="default">
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{successMessage}</AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Height */}
                        <div className="space-y-2">
                            <Label htmlFor="height">Height (cm)</Label>
                            <Input
                                type="number"
                                id="height"
                                min="100"
                                max="250"
                                step="0.01"
                                value={data.height || ''}
                                onChange={(e) => setData('height', e.target.value)}
                            />
                        </div>

                        {/* Weight */}
                        <div className="space-y-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input
                                type="number"
                                id="weight"
                                min="30"
                                max="300"
                                step="0.01"
                                value={data.weight || ''}
                                onChange={(e) => setData('weight', e.target.value)}
                            />
                        </div>

                        {/* Build */}
                        <div className="space-y-2">
                            <Label htmlFor="build">Build</Label>
                            <Input
                                id="build"
                                value={data.build || ''}
                                onChange={(e) => setData('build', e.target.value)}
                            />
                        </div>

                        {/* Complexion */}
                        <div className="space-y-2">
                            <Label htmlFor="complexion">Complexion</Label>
                            <Input
                                id="complexion"
                                value={data.complexion || ''}
                                onChange={(e) => setData('complexion', e.target.value)}
                            />
                        </div>

                        {/* Hair Color */}
                        <div className="space-y-2">
                            <Label htmlFor="hair_color">Hair Color</Label>
                            <Input
                                id="hair_color"
                                value={data.hair_color || ''}
                                onChange={(e) => setData('hair_color', e.target.value)}
                            />
                        </div>

                        {/* Eye Color */}
                        <div className="space-y-2">
                            <Label htmlFor="eye_color">Eye Color</Label>
                            <Input
                                id="eye_color"
                                value={data.eye_color || ''}
                                onChange={(e) => setData('eye_color', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Identification Marks */}
                    <div className="space-y-2">
                        <Label htmlFor="identification_marks">Identification Marks</Label>
                        <Textarea
                            id="identification_marks"
                            value={data.identification_marks || ''}
                            onChange={(e) => setData('identification_marks', e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Mark Location */}
                    <div className="space-y-2">
                        <Label htmlFor="mark_location">Mark Location</Label>
                        <Textarea
                            id="mark_location"
                            value={data.mark_location || ''}
                            onChange={(e) => setData('mark_location', e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Remarks */}
                    <div className="space-y-2">
                        <Label htmlFor="remark">Remarks</Label>
                        <Textarea
                            id="remark"
                            value={data.remark || ''}
                            onChange={(e) => setData('remark', e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* PC Remarks */}
                    <div className="space-y-2">
                        <Label htmlFor="pc_remark">Physical Characteristic Remarks</Label>
                        <Textarea
                            id="pc_remark"
                            value={data.pc_remark || ''}
                            onChange={(e) => setData('pc_remark', e.target.value)}
                            rows={3}
                        />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Record'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
