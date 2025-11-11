import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowRightLeft } from 'lucide-react';
import { router } from '@inertiajs/react';
import { Cells } from '@/types';
import { toast } from "sonner"

interface CellAssignment {
  assignment_id: number;
  cell_number: string;
  cell_id: number;
  cell_gender: string;
  pdl_id: number;
  pdl_name: string;
  pdl_gender: string;
  assigned_date: string;

}

interface TransferCellProps {
  assignment: CellAssignment;
  cells?: Cells[];
}

export function TransferCell({ assignment, cells = [] }: TransferCellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCellId, setSelectedCellId] = useState<string>('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter cells to exclude current cell and only show cells with matching gender
  const availableCells = cells.filter(cell =>
    cell.cell_id !== assignment.cell_id &&
    cell.gender.toLowerCase() === assignment.cell_gender.toLowerCase()
  );

  const handleTransfer = async () => {
    if (!selectedCellId) {
      toast.error('Please select a destination cell');
      return;
    }

    setIsSubmitting(true);
    setErrors({}); // Clear previous errors

    try {
      router.post('/pdl-management/cell-assignment/transfer', {
        assignment_id: assignment.assignment_id,
        to_cell_id: selectedCellId,
        reason: reason,
      }, {
        onSuccess: () => {
          setIsOpen(false);
          setSelectedCellId('');
          setReason('');
          setErrors({});
          toast.success('PDL transferred successfully');
        },
        onError: (errors) => {
          setIsSubmitting(false);

          // Handle specific field errors from Laravel validation
          if (errors && typeof errors === 'object') {
            setErrors(errors);

            // Show the first error as a toast notification
            const firstError = Object.values(errors)[0];
            if (firstError) {
              toast.error(firstError as string);
            }
          } else {
            toast.error('Failed to transfer PDL');
          }
        }
      });
    } catch (error) {
      setIsSubmitting(false);
      console.error('Transfer error:', error);
      toast.error('An unexpected error occurred during transfer');
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form when dialog closes
      setSelectedCellId('');
      setReason('');
      setErrors({});
    }
    setIsOpen(open);
  };

  // Get the selected cell object for additional validation
  const selectedCell = cells.find(cell => cell.cell_id.toString() === selectedCellId);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ArrowRightLeft className="h-4 w-4 mr-1" />
          Transfer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transfer PDL to Another Cell</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">PDL</Label>
            <p className="text-sm text-gray-600">{assignment.pdl_name}</p>
          </div>

          <div>
            <Label className="text-sm font-medium">Current Cell</Label>
            <p className="text-sm text-gray-600">{assignment.cell_number}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination-cell">Destination Cell</Label>
            <Select value={selectedCellId} onValueChange={setSelectedCellId}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination cell" />
              </SelectTrigger>
              <SelectContent>
                {availableCells.map((cell) => (
                  <SelectItem key={cell.cell_id} value={cell.cell_id.toString()}>
                    {cell.cell_name} ({cell.gender}) - Capacity: {cell.capacity} - Classification : {cell.classification}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Show available cells message */}
            {availableCells.length === 0 && (
              <p className="text-sm text-red-600">No available cells with matching gender</p>
            )}

            {/* Show gender mismatch warning if selected cell doesn't match */}
            {selectedCell && selectedCell.gender.toLowerCase() !== assignment.cell_gender.toLowerCase() && (
              <p className="text-sm text-yellow-600">
                Warning: Selected cell gender ({selectedCell.gender}) doesn't match PDL gender ({assignment.cell_gender})
              </p>
            )}

            {/* Show server validation errors */}
            {errors.to_cell_id && (
              <p className="text-sm text-red-600">{errors.to_cell_id}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Transfer Reason (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for transfer..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
            {errors.reason && (
              <p className="text-sm text-red-600">{errors.reason}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTransfer}
              disabled={!selectedCellId || isSubmitting || availableCells.length === 0}
            >
              {isSubmitting ? 'Transferring...' : 'Transfer PDL'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
