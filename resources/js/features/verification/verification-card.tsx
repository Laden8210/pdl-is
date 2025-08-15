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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Pdl, Personnel, Verification } from '@/types';

interface VerificationCardProps {
  verification: Verification & {
    pdl: Pdl & {
      physical_characteristics?: any[];
      court_orders?: any[];
      medical_records?: any[];
      cases?: any[];
    };
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
            <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
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

                <Accordion type="multiple" className="w-full">
                  {/* Physical Characteristics */}
                  <AccordionItem value="physical">
                    <AccordionTrigger className="text-sm font-medium">
                      Physical Characteristics
                    </AccordionTrigger>
                    <AccordionContent className="grid grid-cols-2 gap-2 text-sm p-2">
                      {verification.pdl.physical_characteristics?.length ? (
                        verification.pdl.physical_characteristics.map((characteristic, index) => (
                          <div key={index} className="space-y-1">
                            <div>
                              <span className="text-muted-foreground">Height:</span> {characteristic.height} cm
                            </div>
                            <div>
                              <span className="text-muted-foreground">Weight:</span> {characteristic.weight} kg
                            </div>
                            <div>
                              <span className="text-muted-foreground">Build:</span> {characteristic.build}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Complexion:</span> {characteristic.complexion}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Hair Color:</span> {characteristic.hair_color}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Eye Color:</span> {characteristic.eye_color}
                            </div>
                            <div>
                              <span className="text-muted-foreground">ID Marks:</span> {characteristic.identification_marks}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Mark Location:</span> {characteristic.mark_location}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-muted-foreground">No physical characteristics recorded</div>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Court Orders */}
                  <AccordionItem value="court">
                    <AccordionTrigger className="text-sm font-medium">
                      Court Orders
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 p-2">
                      {verification.pdl.court_orders?.length ? (
                        verification.pdl.court_orders.map((order, index) => (
                          <div key={index} className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Order #:</span> {order.court_order_number}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Type:</span> {order.order_type}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Order Date:</span>{" "}
                              {format(new Date(order.order_date), "MMM dd, yyyy")}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Received:</span>{" "}
                              {format(new Date(order.received_date), "MMM dd, yyyy")}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Court Branch:</span> {order.court_branch}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Document Type:</span> {order.document_type}
                            </div>
                            {order.remarks && (
                              <div className="col-span-2">
                                <span className="text-muted-foreground">Remarks:</span> {order.remarks}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-muted-foreground">No court orders recorded</div>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Medical Records */}
                  <AccordionItem value="medical">
                    <AccordionTrigger className="text-sm font-medium">
                      Medical Records
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 p-2">
                      {verification.pdl.medical_records?.length ? (
                        verification.pdl.medical_records.map((record, index) => (
                          <div key={index} className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Date:</span>{" "}
                              {format(new Date(record.date), "MMM dd, yyyy")}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Complaint:</span> {record.complaint}
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground">Findings:</span> {record.findings}
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground">Prognosis:</span> {record.prognosis}
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground">Laboratory:</span> {record.laboratory}
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground">Prescription:</span> {record.prescription}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-muted-foreground">No medical records recorded</div>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Case Information */}
                  <AccordionItem value="cases">
                    <AccordionTrigger className="text-sm font-medium">
                      Case Information
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 p-2">
                      {verification.pdl.cases?.length ? (
                        verification.pdl.cases.map((caseInfo, index) => (
                          <div key={index} className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Case #:</span> {caseInfo.case_number}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Status:</span>{" "}
                              <Badge variant={
                                caseInfo.case_status === 'open' ? 'destructive' :
                                caseInfo.case_status === 'closed' ? 'secondary' : 'default'
                              }>
                                {caseInfo.case_status}
                              </Badge>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Crime:</span> {caseInfo.crime_committed}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Date Committed:</span>{" "}
                              {format(new Date(caseInfo.date_committed), "MMM dd, yyyy")}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Time Committed:</span> {caseInfo.time_committed}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Security:</span>{" "}
                              <Badge variant={
                                caseInfo.security_classification === 'low' ? 'secondary' :
                                caseInfo.security_classification === 'medium' ? 'default' :
                                caseInfo.security_classification === 'high' ? 'destructive' : 'destructive'
                              }>
                                {caseInfo.security_classification}
                              </Badge>
                            </div>
                            {caseInfo.case_remarks && (
                              <div className="col-span-2">
                                <span className="text-muted-foreground">Remarks:</span> {caseInfo.case_remarks}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-muted-foreground">No case information recorded</div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

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

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={submitFeedback}
                  disabled={
                    isSubmitting ||
                    !statusUpdate ||
                    (statusUpdate === "rejected" && !feedback.trim())
                  }
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </li>
  );
}
