// CreateCellAssignment.tsx
'use client';

import { useForm } from '@inertiajs/react';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cells, Pdl } from '@/types';

interface CreateCellAssignmentProps {
  cells: Cells[];
  pdls: Pdl[];
}

export function CreateCellAssignment({ cells, pdls }: CreateCellAssignmentProps) {
  const { data, setData, post, processing, errors, reset } = useForm<{
    cell_id: string;
    pdl_id: string;
  }>({
    cell_id: '',
    pdl_id: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('cell-assignments.store'), {
      preserveScroll: true,
      onSuccess: () => reset(),
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Assign Cell</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Cell to PDL</DialogTitle>
          <DialogDescription>Select a cell and a PDL to create a new assignment.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mx-auto w-full space-y-4">
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

          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label>Cell</Label>
              <Select
                value={data.cell_id}
                onValueChange={(value) => setData('cell_id', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a cell" />
                </SelectTrigger>
                <SelectContent>
                  {cells.map((cell) => (
                    <SelectItem key={cell.cell_id} value={cell.cell_id.toString()}>
                      {cell.cell_name} (Capacity: {cell.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>PDL (Persons Deprived of Liberty)</Label>
              <Select
                value={data.pdl_id}
                onValueChange={(value) => setData('pdl_id', value)}
                required
              >
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

          <DialogFooter>
            <Button type="submit" disabled={processing}>
              {processing ? 'Assigning...' : 'Assign Cell'}
            </Button>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
