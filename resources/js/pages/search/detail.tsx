import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  UserCheck,
  FileText,
  Gavel,
  Stethoscope,
  Eye,
  Building,
  Search,
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  FileCheck,
  Scale,
  Heart,
  EyeIcon,
  Home,
  Phone,
  Mail,
  Clock,
  AlertCircle
} from 'lucide-react';

interface SearchDetailProps extends PageProps {
  query: string;
  type: string;
  result: any;
  relatedData: Record<string, any>;
}

export default function SearchDetail({ query, type, result, relatedData }: SearchDetailProps) {
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      pdl: 'Person Deprived of Liberty',
      personnel: 'Personnel',
      case: 'Case Information',
      court_order: 'Court Order',
      medical_record: 'Medical Record',
      physical_characteristic: 'Physical Characteristic',
      cell: 'Cell',
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      pdl: Users,
      personnel: UserCheck,
      case: FileText,
      court_order: Gavel,
      medical_record: Stethoscope,
      physical_characteristic: Eye,
      cell: Building,
    };
    const IconComponent = icons[type] || Search;
    return <IconComponent className="h-6 w-6" />;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <Head title={`${getTypeLabel(type)} - ${result?.fname || result?.case_number || result?.order_type || result?.complaint || result?.cell_name || 'Details'}`} />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.history.back()}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      {getTypeIcon(type)}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {getTypeLabel(type)}
                      </h1>
                      <p className="text-gray-600 mt-1">
                        Search query: "<span className="font-medium">{query}</span>"
                      </p>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {type.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Details */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {getTypeIcon(type)}
                    <span>Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {type === 'pdl' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Full Name:</span>
                              <span className="font-medium">{result.fname} {result.lname}</span>
                            </div>
                            {result.alias && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Alias:</span>
                                <span className="font-medium">{result.alias}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-600">Age:</span>
                              <span className="font-medium">{result.age || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Gender:</span>
                              <span className="font-medium">{result.gender || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Civil Status:</span>
                              <span className="font-medium">{result.civil_status || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Ethnic Group:</span>
                              <span className="font-medium">{result.ethnic_group || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-4">Address</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Barangay:</span>
                              <span className="font-medium">{result.brgy || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">City:</span>
                              <span className="font-medium">{result.city || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Province:</span>
                              <span className="font-medium">{result.province || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Birth Date:</span>
                              <span className="font-medium">{formatDate(result.birthdate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {type === 'personnel' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Full Name:</span>
                              <span className="font-medium">{result.fname} {result.lname}</span>
                            </div>
                            {result.mname && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Middle Name:</span>
                                <span className="font-medium">{result.mname}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-600">Username:</span>
                              <span className="font-medium">{result.username}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Position:</span>
                              <span className="font-medium">{result.position}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Agency:</span>
                              <span className="font-medium">{result.agency}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Contact Number:</span>
                              <span className="font-medium">{result.contactnum || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Status:</span>
                              <Badge variant={result.status === 'active' ? 'default' : 'secondary'}>
                                {result.status}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Created:</span>
                              <span className="font-medium">{formatDateTime(result.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {type === 'case' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold text-lg mb-4">Case Information</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Case Number:</span>
                              <span className="font-medium">{result.case_number}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Crime Committed:</span>
                              <span className="font-medium">{result.crime_committed}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Status:</span>
                              <Badge variant="outline">{result.case_status}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Security Classification:</span>
                              <span className="font-medium">{result.security_classification || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-4">Timeline</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Date Committed:</span>
                              <span className="font-medium">{formatDate(result.date_committed)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Time Committed:</span>
                              <span className="font-medium">{result.time_committed || 'N/A'}</span>
                            </div>
                          </div>
                          {result.case_remarks && (
                            <div className="mt-4">
                              <h4 className="font-medium text-gray-600 mb-2">Remarks:</h4>
                              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                {result.case_remarks}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {type === 'court_order' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold text-lg mb-4">Order Information</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Order Number:</span>
                              <span className="font-medium">{result.court_order_number}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Order Type:</span>
                              <span className="font-medium">{result.order_type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Court Branch:</span>
                              <span className="font-medium">{result.court_branch}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Document Type:</span>
                              <span className="font-medium">{result.document_type || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-4">Dates</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Order Date:</span>
                              <span className="font-medium">{formatDate(result.order_date)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Received Date:</span>
                              <span className="font-medium">{formatDate(result.received_date)}</span>
                            </div>
                          </div>
                          {result.remarks && (
                            <div className="mt-4">
                              <h4 className="font-medium text-gray-600 mb-2">Remarks:</h4>
                              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                {result.remarks}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {type === 'medical_record' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold text-lg mb-4">Medical Information</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Complaint:</span>
                              <span className="font-medium">{result.complaint}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Prognosis:</span>
                              <span className="font-medium">{result.prognosis || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Date:</span>
                              <span className="font-medium">{formatDate(result.date)}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-4">Medical Details</h3>
                          <div className="space-y-3">
                            {result.laboratory && (
                              <div>
                                <h4 className="font-medium text-gray-600 mb-2">Laboratory:</h4>
                                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                  {result.laboratory}
                                </p>
                              </div>
                            )}
                            {result.prescription && (
                              <div>
                                <h4 className="font-medium text-gray-600 mb-2">Prescription:</h4>
                                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                  {result.prescription}
                                </p>
                              </div>
                            )}
                            {result.findings && (
                              <div>
                                <h4 className="font-medium text-gray-600 mb-2">Findings:</h4>
                                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                  {result.findings}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {type === 'physical_characteristic' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold text-lg mb-4">Physical Details</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Height:</span>
                              <span className="font-medium">{result.height || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Weight:</span>
                              <span className="font-medium">{result.weight || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Build:</span>
                              <span className="font-medium">{result.build || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Complexion:</span>
                              <span className="font-medium">{result.complexion || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Hair Color:</span>
                              <span className="font-medium">{result.hair_color || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Eye Color:</span>
                              <span className="font-medium">{result.eye_color || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-4">Identification Marks</h3>
                          <div className="space-y-3">
                            {result.identification_marks && (
                              <div>
                                <h4 className="font-medium text-gray-600 mb-2">Marks:</h4>
                                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                  {result.identification_marks}
                                </p>
                              </div>
                            )}
                            {result.mark_location && (
                              <div>
                                <h4 className="font-medium text-gray-600 mb-2">Location:</h4>
                                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                  {result.mark_location}
                                </p>
                              </div>
                            )}
                            {result.remark && (
                              <div>
                                <h4 className="font-medium text-gray-600 mb-2">Remarks:</h4>
                                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                  {result.remark}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {type === 'cell' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold text-lg mb-4">Cell Information</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Cell Name:</span>
                              <span className="font-medium">{result.cell_name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Capacity:</span>
                              <span className="font-medium">{result.capacity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Status:</span>
                              <Badge variant={result.status === 'active' ? 'default' : 'secondary'}>
                                {result.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-4">Description</h3>
                          <div className="space-y-3">
                            {result.description ? (
                              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                {result.description}
                              </p>
                            ) : (
                              <p className="text-sm text-gray-500 italic">No description available</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Related Data */}
            <div className="space-y-6">
              {type === 'pdl' && relatedData && (
                <Tabs defaultValue="cases" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="cases">Cases</TabsTrigger>
                    <TabsTrigger value="orders">Court Orders</TabsTrigger>
                  </TabsList>

                  <TabsContent value="cases" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Related Cases</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {relatedData.cases && relatedData.cases.length > 0 ? (
                          <div className="space-y-3">
                            {relatedData.cases.map((caseItem: any) => (
                              <div key={caseItem.case_id} className="p-3 border rounded-lg">
                                <div className="font-medium">{caseItem.case_number}</div>
                                <div className="text-sm text-gray-600">{caseItem.crime_committed}</div>
                                <Badge variant="outline" className="mt-1">{caseItem.case_status}</Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No related cases found</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="orders" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Court Orders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {relatedData.courtOrders && relatedData.courtOrders.length > 0 ? (
                          <div className="space-y-3">
                            {relatedData.courtOrders.map((order: any) => (
                              <div key={order.court_order_id} className="p-3 border rounded-lg">
                                <div className="font-medium">{order.order_type}</div>
                                <div className="text-sm text-gray-600">{order.court_branch}</div>
                                <div className="text-xs text-gray-500">
                                  {formatDate(order.order_date)}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No court orders found</p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}

              {type === 'personnel' && relatedData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Related PDLs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {relatedData.pdls && relatedData.pdls.length > 0 ? (
                      <div className="space-y-3">
                        {relatedData.pdls.map((pdl: any) => (
                          <div key={pdl.id} className="p-3 border rounded-lg">
                            <div className="font-medium">{pdl.fname} {pdl.lname}</div>
                            <div className="text-sm text-gray-600">{pdl.city}, {pdl.province}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No related PDLs found</p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.history.back()}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Back to Search Results
                  </Button>

                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
