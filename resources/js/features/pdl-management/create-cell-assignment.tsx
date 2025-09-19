// CreateCellAssignment.tsx
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cells, Pdl } from '@/types';
import { router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { usePage } from '@inertiajs/react';

interface CreateCellAssignmentProps {
    cells: Cells[];
    pdls: Pdl[];
}

export function CreateCellAssignment({ cells, pdls }: CreateCellAssignmentProps) {
    const [open, setOpen] = useState(false);
    const [selectedCell, setSelectedCell] = useState<string>('');
    const [selectedPdls, setSelectedPdls] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [genderFilter, setGenderFilter] = useState<string>('all');

    // Filter PDLs based on search term and selected cell gender
    const filteredPdls = useMemo(() => {
        let filtered = pdls;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (pdl) => `${pdl.fname} ${pdl.lname}`.toLowerCase().includes(searchTerm.toLowerCase()) || pdl.id.toString().includes(searchTerm),
            );
        }

        // Apply gender filter based on selected cell
        if (selectedCell) {
            const selectedCellData = cells.find(cell => cell.cell_id.toString() === selectedCell);
            if (selectedCellData) {
                // Filter PDLs to match the cell's gender
                filtered = filtered.filter(pdl => {
                    // Convert PDL gender to lowercase to match cell gender format
                    const pdlGender = pdl.gender?.toLowerCase();
                    return pdlGender === selectedCellData.gender;
                });
            }
        }

        return filtered;
    }, [pdls, searchTerm, selectedCell, cells]);

    // Filter cells based on gender filter (simplified since PDLs are now filtered by cell)
    const compatibleCells = useMemo(() => {
        let filteredCells = cells;

        // Apply gender filter
        if (genderFilter !== 'all') {
            filteredCells = filteredCells.filter(cell => cell.gender === genderFilter);
        }

        return filteredCells;
    }, [cells, genderFilter]);

    const handleCellChange = (cellId: string) => {
        setSelectedCell(cellId);
        // Clear selected PDLs when cell changes since available PDLs will change
        setSelectedPdls([]);
    };

    const handleSubmit = () => {
        if (!selectedCell || selectedPdls.length === 0) return;

        router.post(
            route('cell-assignments.store'),
            {
                cell_id: selectedCell,
                pdl_ids: selectedPdls,
            },
            {
                onSuccess: () => {
                    setOpen(false);
                    setSelectedCell('');
                    setSelectedPdls([]);
                    setSearchTerm('');
                    setGenderFilter('all');
                },
            },
        );
    };

    const togglePdlSelection = (pdlId: number) => {
        setSelectedPdls((prev) => (prev.includes(pdlId) ? prev.filter((id) => id !== pdlId) : [...prev, pdlId]));
    };

    const selectAllFiltered = () => {
        const filteredIds = filteredPdls.map((pdl) => pdl.id);
        setSelectedPdls((prev) => {
            // If all filtered are already selected, deselect all
            if (filteredIds.every((id) => prev.includes(id))) {
                return prev.filter((id) => !filteredIds.includes(id));
            }
            // Otherwise, add all filtered that aren't already selected
            return [...new Set([...prev, ...filteredIds])];
        });
    };
    const { props } = usePage<any>();
    const successMessage = props.success;
    const errors = props.errors || {};

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Assign PDL to Cell</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Assign PDLs to Cell</DialogTitle>
                    <DialogDescription>Select a cell and choose PDLs to assign to it.</DialogDescription>
                </DialogHeader>

                {/* Error Alert */}
                {Object.keys(errors).length > 0 && (
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
                                <ul className="list-inside list-disc space-y-1">
                                    {Object.values(errors).map((error, index) => (
                                        <li key={index} className="text-sm">
                                            {error}
                                        </li>
                                    ))}
                                </ul>
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

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="gender-filter">Filter by Gender</Label>
                        <Select value={genderFilter} onValueChange={setGenderFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select gender filter" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Genders</SelectItem>
                                <SelectItem value="male">Male Only</SelectItem>
                                <SelectItem value="female">Female Only</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="cell">Select Cell</Label>
                        <Select value={selectedCell} onValueChange={handleCellChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a cell" />
                            </SelectTrigger>
                            <SelectContent>
                                {compatibleCells.map((cell) => (
                                    <SelectItem key={cell.cell_id} value={cell.cell_id.toString()}>
                                        {cell.cell_name} (Capacity: {cell.capacity}, Gender: {cell.gender})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedCell && (
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="pdl-search">Select PDLs</Label>
                                <Button variant="outline" size="sm" onClick={selectAllFiltered} disabled={filteredPdls.length === 0}>
                                    Toggle All Filtered
                                </Button>
                            </div>

                            <Input
                                id="pdl-search"
                                placeholder="Search PDLs by name or ID"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            {/* Gender compatibility info */}
                            {selectedCell && (
                                <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                                    <strong>Note:</strong> Only PDLs matching the selected cell's gender are shown.
                                    {(() => {
                                        const selectedCellData = cells.find(cell => cell.cell_id.toString() === selectedCell);
                                        return selectedCellData ? ` Showing ${selectedCellData.gender} PDLs only.` : '';
                                    })()}
                                </div>
                            )}

                            <div className="max-h-60 overflow-y-auto rounded-md border p-2">
                                {filteredPdls.length > 0 ? (
                                    filteredPdls.map((pdl) => (
                                        <div key={pdl.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50">
                                            <Checkbox
                                                id={`pdl-${pdl.id}`}
                                                checked={selectedPdls.includes(pdl.id)}
                                                onCheckedChange={() => togglePdlSelection(pdl.id)}
                                            />
                                            <label
                                                htmlFor={`pdl-${pdl.id}`}
                                                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {pdl.fname} {pdl.lname} (ID: {pdl.id})
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-2 text-sm text-muted-foreground">
                                        {selectedCell ?
                                            'No PDLs available for the selected cell gender.' :
                                            (searchTerm ? 'No PDLs match your search' : 'No PDLs available')
                                        }
                                    </div>
                                )}
                            </div>

                            {selectedPdls.length > 0 && <div className="text-sm text-muted-foreground">Selected: {selectedPdls.length} PDL(s)</div>}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!selectedCell || selectedPdls.length === 0}>
                        Assign Selected
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
