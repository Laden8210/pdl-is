import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UpdateCaseStatus } from '@/features/pdl-management/update-case-status';
import { Pdl } from '@/types';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';

import { AddCaseInformation } from './add-case-information';

export function ViewPdlInformation({ pdl }: { pdl: Pdl }) {
    console.log(pdl);
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" /> View
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>PDL Information</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                    {/* Basic Information */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-muted-foreground">Full Name:</span> {`${pdl.fname} ${pdl.lname}`}
                            </div>
                            <div>
                                <span className="text-muted-foreground">Alias:</span> {pdl.alias || '-'}
                            </div>
                            <div>
                                <span className="text-muted-foreground">Gender:</span> {pdl.gender || '-'}
                            </div>
                            <div>
                                <span className="text-muted-foreground">Birthdate:</span> {format(new Date(pdl.birthdate), 'MMMM dd, yyyy')}
                            </div>
                            <div>
                                <span className="text-muted-foreground">Age:</span> {pdl.age}
                            </div>
                            <div>
                                <span className="text-muted-foreground">Ethnic Group:</span> {pdl.ethnic_group || '-'}
                            </div>
                            <div>
                                <span className="text-muted-foreground">Civil Status:</span> {pdl.civil_status || '-'}
                            </div>
                            <div>
                                <span className="text-muted-foreground">Added By:</span>{' '}
                                {pdl.personnel ? `${pdl.personnel.fname} ${pdl.personnel.lname}` : '-'}
                            </div>
                            <div className="col-span-2">
                                <span className="text-muted-foreground">Address:</span>{' '}
                                {`${pdl.brgy || ''}, ${pdl.city || ''}, ${pdl.province || ''}`}
                            </div>
                        </div>
                    </div>

                    {/* Accordion Sections */}
                    <Accordion type="multiple" className="w-full">
                        {/* Physical Characteristics */}
                        {Array.isArray(pdl.physical_characteristics) && pdl.physical_characteristics.length > 0 && (
                            <AccordionItem value="physical">
                                <AccordionTrigger className="text-sm font-medium">Physical Characteristics</AccordionTrigger>
                                <AccordionContent className="grid grid-cols-2 gap-4 p-2 text-sm">
                                    {pdl.physical_characteristics.map((characteristic, index) => (
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
                                            {characteristic.remark && (
                                                <div className="col-span-2">
                                                    <span className="text-muted-foreground">Remarks:</span> {characteristic.remark}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        )}

                        {/* Court Orders */}
                        {Array.isArray(pdl.court_orders) && pdl.court_orders.length > 0 && (
                            <AccordionItem value="court">
                                <AccordionTrigger className="text-sm font-medium">Court Orders ({pdl.court_orders.length})</AccordionTrigger>
                                <AccordionContent className="space-y-4 p-2">
                                    {pdl.court_orders.map((order, index) => (
                                        <div key={index} className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Order #:</span> {order.court_order_number}
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Type:</span> {order.order_type}
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Order Date:</span>{' '}
                                                {format(new Date(order.order_date), 'MMM dd, yyyy')}
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Received Date:</span>{' '}
                                                {format(new Date(order.received_date), 'MMM dd, yyyy')}
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Court Branch:</span> {order.court_branch}
                                            </div>

                                            <div className="">
                                                <span className="text-muted-foreground">Document:</span> <Button variant="outline" onClick={() => window.open(`/storage/${order.document_path}`, '_blank')}>Preview</Button>
                                            </div>
                                            {order.remarks && (
                                                <div className="col-span-2">
                                                    <span className="text-muted-foreground">Remarks:</span> {order.remarks}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        )}

                        {/* Medical Records */}
                        {Array.isArray(pdl.medical_records) && pdl.medical_records.length > 0 && (
                            <AccordionItem value="medical">
                                <AccordionTrigger className="text-sm font-medium">Medical Records ({pdl.medical_records.length})</AccordionTrigger>
                                <AccordionContent className="space-y-4 p-2">
                                    {pdl.medical_records.map((record, index) => (
                                        <div key={index} className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Date:</span> {format(new Date(record.date), 'MMM dd, yyyy')}
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Complaint:</span> {record.complaint}
                                            </div>
                                            <div className="">
                                                <span className="text-muted-foreground">Findings:</span> {record.findings}
                                            </div>
                                            <div className="">
                                                <span className="text-muted-foreground">Prognosis:</span> {record.prognosis}
                                            </div>
                                            <div className="">
                                                <span className="text-muted-foreground">Laboratory Results:</span> {record.laboratory}
                                            </div>

                                            <div className="">
                                                <span className="text-muted-foreground">Document:</span> <Button variant="outline" onClick={() => window.open(`/storage/${record.file_path}`, '_blank')}>Preview</Button>
                                            </div>

                                        </div>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        )}

                        {/* Case Information */}
                        {Array.isArray(pdl.cases) && pdl.cases.length > 0 && (
                            <AccordionItem value="cases">
                                <AccordionTrigger className="">
                                    <div className="flex items-center gap-2">
                                        Case Information ({pdl.cases.length})
                                        <AddCaseInformation pdl={pdl} />
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 p-2">
                                    {pdl.cases.map((caseInfo, index) => (
                                        <div key={index} className="grid grid-cols-2 gap-2 rounded-lg border p-3 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">Case #:</span> {caseInfo.case_number}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground">Status:</span>
                                                <Badge
                                                    variant={
                                                        caseInfo.case_status === 'open'
                                                            ? 'destructive'
                                                            : caseInfo.case_status === 'pending'
                                                              ? 'default'
                                                              : caseInfo.case_status === 'convicted'
                                                                ? 'secondary'
                                                                : caseInfo.case_status === 'deceased'
                                                                  ? 'destructive'
                                                                  : 'secondary'
                                                    }
                                                >
                                                    {caseInfo.case_status}
                                                </Badge>
                                                <UpdateCaseStatus caseInfo={caseInfo} />
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Crime:</span> {caseInfo.crime_committed}
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Date Committed:</span>{' '}
                                                {format(new Date(caseInfo.date_committed), 'MMM dd, yyyy')}
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Time Committed:</span> {caseInfo.time_committed}
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">Security:</span>
                                                <Badge
                                                    variant={
                                                        caseInfo.security_classification === 'low'
                                                            ? 'secondary'
                                                            : caseInfo.security_classification === 'medium'
                                                              ? 'default'
                                                              : caseInfo.security_classification === 'high'
                                                                ? 'destructive'
                                                                : 'destructive'
                                                    }
                                                >
                                                    {caseInfo.security_classification}
                                                </Badge>
                                            </div>
                                            {caseInfo.case_remarks && (
                                                <div className="col-span-2">
                                                    <span className="text-muted-foreground">Remarks:</span> {caseInfo.case_remarks}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        )}
                    </Accordion>
                </div>
            </DialogContent>
        </Dialog>
    );
}
