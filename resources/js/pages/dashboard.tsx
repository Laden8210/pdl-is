import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
  Activity,
  AlertCircle,
  Building,
  Calendar,
  FileText,
  Shield,
  Stethoscope,
  Users,
  TrendingUp,
  Clock,
  Scale,
  MapPin,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

// Sample data based on the database schema
const pdlByGender = [
  { name: 'Male', value: 342, color: '#3b82f6' },
  { name: 'Female', value: 145, color: '#ec4899' },
];

const caseStatusData = [
  { name: 'Active', value: 289, color: '#3b82f6' },
  { name: 'Closed', value: 156, color: '#10b981' },
  { name: 'Pending', value: 42, color: '#f59e0b' },
];

const monthlyAdmissions = [
  { month: 'Jan', admissions: 45, releases: 12 },
  { month: 'Feb', admissions: 38, releases: 15 },
  { month: 'Mar', admissions: 52, releases: 18 },
  { month: 'Apr', admissions: 41, releases: 22 },
  { month: 'May', admissions: 47, releases: 19 },
  { month: 'Jun', admissions: 39, releases: 25 },
];

const cellOccupancy = [
  { cell: 'Cell A', capacity: 50, occupied: 48, utilization: 96 },
  { cell: 'Cell B', capacity: 45, occupied: 42, utilization: 93 },
  { cell: 'Cell C', capacity: 40, occupied: 35, utilization: 88 },
  { cell: 'Cell D', capacity: 55, occupied: 53, utilization: 96 },
  { cell: 'Cell E', capacity: 60, occupied: 45, utilization: 75 },
  { cell: 'Cell F', capacity: 35, occupied: 28, utilization: 80 },
];

const timeAllowanceData = [
  { type: 'GCTA', count: 89, color: '#10b981' },
  { type: 'TASTM', count: 34, color: '#f59e0b' },
];

const securityClassificationData = [
  { classification: 'Maximum', count: 78, color: '#ef4444' },
  { classification: 'Medium', count: 215, color: '#f59e0b' },
  { classification: 'Minimum', count: 194, color: '#10b981' },
];

const courtOrderTypes = [
  { type: 'Commitment', count: 156, color: '#3b82f6' },
  { type: 'Release', count: 42, color: '#10b981' },
  { type: 'Hearing', count: 87, color: '#f59e0b' },
  { type: 'Other', count: 23, color: '#8b5cf6' },
];

const verificationStatusData = [
  { status: 'Pending', count: 23, color: '#f59e0b' },
  { status: 'Approved', count: 156, color: '#10b981' },
  { status: 'Rejected', count: 12, color: '#ef4444' },
];

const personnelByPosition = [
  { position: 'Correctional Officer', count: 32, color: '#3b82f6' },
  { position: 'Administrative Staff', count: 12, color: '#8b5cf6' },
  { position: 'Medical Staff', count: 8, color: '#ec4899' },
  { position: 'Supervisor', count: 5, color: '#f59e0b' },
];

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

export default function PDLDashboard() {
  const totalPDL = pdlByGender.reduce((sum, item) => sum + item.value, 0);
  const totalCases = caseStatusData.reduce((sum, item) => sum + item.value, 0);
  const activeCases = caseStatusData.find((item) => item.name === 'Active')?.value || 0;
  const totalTimeAllowances = timeAllowanceData.reduce((sum, item) => sum + item.count, 0);
  const totalCapacity = cellOccupancy.reduce((sum, cell) => sum + cell.capacity, 0);
  const totalOccupied = cellOccupancy.reduce((sum, cell) => sum + cell.occupied, 0);
  const overallUtilization = Math.round((totalOccupied / totalCapacity) * 100);
  const pendingVerifications = verificationStatusData.find(item => item.status === 'Pending')?.count || 0;

  return (
    <>
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="PDL Management Dashboard" />
        <div className="min-h-screen">
          <div className="mx-auto space-y-6 p-4">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h1 className="text-2xl font-bold">Administrative Dashboard</h1>

            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total PDL</CardTitle>
                  <Users className="h-5 w-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{totalPDL}</div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>+5% from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Cases</CardTitle>
                  <FileText className="h-5 w-5 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{activeCases}</div>
                  <p className="text-sm text-gray-500">Out of {totalCases} total cases</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Facility Utilization</CardTitle>
                  <Building className="h-5 w-5 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{overallUtilization}%</div>
                  <p className="text-sm text-gray-500">{totalOccupied}/{totalCapacity} beds occupied</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending Verifications</CardTitle>
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{pendingVerifications}</div>
                  <p className="text-sm text-gray-500">Awaiting review</p>
                </CardContent>
              </Card>
            </div>

            {/* Second Row Metrics */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Time Allowances</CardTitle>
                  <Clock className="h-5 w-5 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{totalTimeAllowances}</div>
                  <p className="text-sm text-gray-500">GCTA & TASTM awarded</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Court Orders</CardTitle>
                  <Scale className="h-5 w-5 text-indigo-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">308</div>
                  <p className="text-sm text-gray-500">Processed this year</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Medical Visits</CardTitle>
                  <Stethoscope className="h-5 w-5 text-pink-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">1247</div>
                  <p className="text-sm text-gray-500">Total records</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Personnel</CardTitle>
                  <UserCheck className="h-5 w-5 text-cyan-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">57</div>
                  <p className="text-sm text-gray-500">Staff members</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* PDL Demographics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    PDL Demographics
                  </CardTitle>
                  <CardDescription>Distribution of Persons Deprived of Liberty by gender</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      {pdlByGender.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm text-gray-600">
                            {item.name}: {item.value} ({(item.value / totalPDL * 100).toFixed(1)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="h-40 w-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pdlByGender}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            innerRadius={30}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {pdlByGender.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} PDL`, 'Count']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Case Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Case Status Distribution
                  </CardTitle>
                  <CardDescription>Current status of all legal cases</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={caseStatusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Monthly Admissions and Releases */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Monthly Admissions & Releases
                  </CardTitle>
                  <CardDescription>Trends over the past 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyAdmissions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="admissions" stroke="#3b82f6" strokeWidth={2} name="Admissions" />
                      <Line type="monotone" dataKey="releases" stroke="#10b981" strokeWidth={2} name="Releases" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Security Classification */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Classification
                  </CardTitle>
                  <CardDescription>Distribution of PDL by security level</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={securityClassificationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="classification" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {securityClassificationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Cell Occupancy */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Cell Occupancy Status
                  </CardTitle>
                  <CardDescription>Current utilization of facility cells</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {cellOccupancy.map((cell, index) => {
                      const occupancyRate = (cell.occupied / cell.capacity) * 100;
                      const isNearCapacity = occupancyRate > 90;
                      const isUnderUtilized = occupancyRate < 75;

                      return (
                        <div key={index} className="space-y-2 rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{cell.cell}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                                {cell.occupied}/{cell.capacity}
                              </span>
                              {isNearCapacity ? (
                                <Badge variant="destructive" className="text-xs">
                                  <AlertTriangle className="mr-1 h-3 w-3" />
                                  {occupancyRate.toFixed(0)}% Full
                                </Badge>
                              ) : isUnderUtilized ? (
                                <Badge variant="outline" className="text-xs">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  {occupancyRate.toFixed(0)}% Full
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">
                                  {occupancyRate.toFixed(0)}% Full
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="h-2 rounded-full bg-gray-200">
                            <div
                              className={`h-2 rounded-full ${
                                isNearCapacity
                                  ? 'bg-red-500'
                                  : isUnderUtilized
                                    ? 'bg-green-500'
                                    : 'bg-blue-500'
                              }`}
                              style={{ width: `${occupancyRate}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Admin Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Court Order Types */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    Court Order Types
                  </CardTitle>
                  <CardDescription>Distribution of court orders by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={courtOrderTypes}
                        dataKey="count"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={60}
                        label={({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {courtOrderTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} orders`, 'Count']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Verification Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Verification Status
                  </CardTitle>
                  <CardDescription>Status of PDL verification requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={verificationStatusData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="status" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {verificationStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Personnel and System Status */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Personnel Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Personnel Distribution
                  </CardTitle>
                  <CardDescription>Staff members by position</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {personnelByPosition.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium">{item.position}</span>
                        </div>
                        <Badge variant="secondary">{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Time Allowances */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Time Allowances
                  </CardTitle>
                  <CardDescription>Distribution of time allowances awarded</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {timeAllowanceData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium">{item.type}</span>
                        </div>
                        <Badge variant="secondary">{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 h-4 w-full rounded-full bg-gray-200">
                    <div
                      className="h-4 rounded-full bg-blue-500"
                      style={{
                        width: `${(timeAllowanceData[0].count / totalTimeAllowances * 100)}%`
                      }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>GCTA: {(timeAllowanceData[0].count / totalTimeAllowances * 100).toFixed(1)}%</span>
                    <span>TASTM: {(timeAllowanceData[1].count / totalTimeAllowances * 100).toFixed(1)}%</span>
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    System Status
                  </CardTitle>
                  <CardDescription>Current system metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Personnel:</span>
                    <Badge variant="default">47</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Court Orders This Month:</span>
                    <Badge variant="secondary">28</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Unread Notifications:</span>
                    <Badge variant="destructive">8</Badge>
                  </div>

                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
                <CardDescription>Latest system events and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 border-b border-gray-100 pb-3">
                    <div className="mt-2 h-2 w-2 rounded-full bg-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">New PDL admission - John Doe</p>
                      <p className="text-xs text-gray-500">2 hours ago • Cell Assignment pending</p>
                    </div>
                    <Badge variant="outline">Admission</Badge>
                  </div>
                  <div className="flex items-start gap-3 border-b border-gray-100 pb-3">
                    <div className="mt-2 h-2 w-2 rounded-full bg-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">GCTA approved for Case #2024-1156</p>
                      <p className="text-xs text-gray-500">4 hours ago • 30 days awarded</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">Time Allowance</Badge>
                  </div>
                  <div className="flex items-start gap-3 border-b border-gray-100 pb-3">
                    <div className="mt-2 h-2 w-2 rounded-full bg-orange-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Medical examination scheduled</p>
                      <p className="text-xs text-gray-500">6 hours ago • 15 PDL scheduled for tomorrow</p>
                    </div>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700">Medical</Badge>
                  </div>
                  <div className="flex items-start gap-3 border-b border-gray-100 pb-3">
                    <div className="mt-2 h-2 w-2 rounded-full bg-red-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Verification request submitted</p>
                      <p className="text-xs text-gray-500">8 hours ago • Awaiting supervisor review</p>
                    </div>
                    <Badge variant="outline" className="bg-red-50 text-red-700">Verification</Badge>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-2 h-2 w-2 rounded-full bg-purple-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Court order processed for Case #2024-0987</p>
                      <p className="text-xs text-gray-500">10 hours ago • Hearing scheduled</p>
                    </div>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">Court Order</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    </>
  );
}
