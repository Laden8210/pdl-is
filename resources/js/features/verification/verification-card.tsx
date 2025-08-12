'use client';

import { useState } from 'react';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Pdl, Personnel, Verification } from '@/types';

interface VerificationCardProps {
  verification: Verification & {
    pdl: Pdl;
    personnel: Personnel;
  };
  onUpdate: () => void;
}

export default function VerificationCard({ verification, onUpdate }: VerificationCardProps) {
  const [feedback, setFeedback] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pdlName = `${verification.pdl.fname} ${verification.pdl.lname}`;
  const personnelName = verification.personnel
    ? `${verification.personnel.fname} ${verification.personnel.lname}`
    : 'Unknown Personnel';

  const submitFeedback = () => {
    setIsSubmitting(true);

    router.patch(`/admin/verification/${verification.verification_id}/update`, {
      feedback,
      status: statusUpdate,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        onUpdate();
        setIsDialogOpen(false);
        setFeedback('');
        setStatusUpdate('');
      },
      onFinish: () => setIsSubmitting(false),
    });
  };

  return (
    <li>
      <Card className="p-4 h-full flex flex-col">
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium">{pdlName}</h3>
              <p className="text-sm text-muted-foreground">
                Requested by: {personnelName}
              </p>
            </div>
            <Badge
              variant={
                verification.status === 'approved' ? 'default' :
                verification.status === 'rejected' ? 'destructive' : 'secondary'
              }
            >
              {verification.status}
            </Badge>
          </div>

          <div className="mt-3 space-y-2">
            <p className="text-sm">
              <span className="font-medium">Reason:</span> {verification.reason}
            </p>
            <p className="text-sm">
              <span className="font-medium">Submitted:</span>{" "}
              {format(new Date(verification.created_at), "MMM dd, yyyy")}
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Review Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Verification Request Details</DialogTitle>
                <DialogDescription>
                  Review verification request for <strong>{pdlName}</strong>
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">PDL Information</Label>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Full Name:</span> {pdlName}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Birthdate:</span>{" "}
                      {verification.pdl.birthdate
                        ? format(new Date(verification.pdl.birthdate), "MMM dd, yyyy")
                        : "N/A"}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location:</span>{" "}
                      {[verification.pdl.brgy, verification.pdl.city, verification.pdl.province]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>{" "}
                      <Badge>{verification.pdl.status || "N/A"}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Verification Details</Label>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Requested by:</span> {personnelName}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Requested on:</span>{" "}
                      {format(new Date(verification.created_at), "MMM dd, yyyy")}
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Reason:</span> {verification.reason}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`feedback-${verification.verification_id}`} className="text-sm font-medium">
                    Your Feedback
                  </Label>
                  <Textarea
                    id={`feedback-${verification.verification_id}`}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter your feedback or comments..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Update Status</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={statusUpdate === "approved" ? "default" : "outline"}
                      onClick={() => setStatusUpdate("approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant={statusUpdate === "rejected" ? "destructive" : "outline"}
                      onClick={() => setStatusUpdate("rejected")}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  onClick={submitFeedback}
                  disabled={
                    isSubmitting ||
                    !statusUpdate ||
                    (statusUpdate === "rejected" && !feedback.trim())
                  }
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </li>
  );
}
