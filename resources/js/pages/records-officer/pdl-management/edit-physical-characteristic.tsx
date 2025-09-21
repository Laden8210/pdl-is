import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft } from 'lucide-react';
import { router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Physical Characteristics',
        href: '/pdl-management/physical-characteristics',
    },
    {
        title: 'Edit Physical Characteristic',
        href: '#',
    },
];

interface PageProps {
    characteristic: any;
    [key: string]: any;
}

export default function EditPhysicalCharacteristic() {
    const { props } = usePage<PageProps>();
    const { characteristic } = props;

    const { data, setData, put, processing, errors } = useForm({
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
                router.visit(route('physical-characteristics.index'));
            },
        });
    };

    const { props: pageProps } = usePage();
    const successMessage = (pageProps as any).success;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Physical Characteristic" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.visit(route('physical-characteristics.index'))}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Physical Characteristics
                    </Button>
                    <h1 className="text-2xl font-bold">Edit Physical Characteristic</h1>
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
                        <CardTitle>Physical Characteristic Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit(route('physical-characteristics.index'))}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Record'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
