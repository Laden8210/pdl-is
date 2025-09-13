import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import {
  Activity,
  AlertCircle,
  Building,
  FileText,
  Shield,
  Stethoscope,
  Users,
  TrendingUp,
  Clock,
  Scale,
  UserCheck,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const breadcrumbs = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

interface DashboardProps {
  dashboardData: {
    pdlByGender: { name: string; value: number; color: string }[];
    caseStatusData: { name: string; value: number }[];
    monthlyAdmissions: { month: string; admissions: number; releases: number }[];
    cellOccupancy: { cell: string; capacity: number; occupied: number }[];
    timeAllowanceData: { type: string; count: number; color: string }[];
    securityClassificationData: { classification: string; count: number; color: string }[];
    courtOrderTypes: { type: string; count: number; color: string }[];
    verificationStatusData: { status: string; count: number; color: string }[];
    personnelByPosition: { position: string; count: number; color: string }[];
    recentActivities: { type: string; title: string; description: string; badge: string; color: string }[];
    metrics: {
      totalPDL: number;
      activeCases: number;
      totalCases: number;
      totalCapacity: number;
      totalOccupied: number;
      overallUtilization: number;
      pendingVerifications: number;
      totalTimeAllowances: number;
      totalCourtOrders: number;
      totalMedicalRecords: number;
      activePersonnel: number;
    };
  };
}

export default function PDLDashboard() {
    const {props} = usePage<DashboardProps>();
    const { dashboardData } = props;
    const {
      pdlByGender,
      caseStatusData,
      monthlyAdmissions,
      cellOccupancy,
      timeAllowanceData,
      securityClassificationData,
      courtOrderTypes,
      verificationStatusData,
      personnelByPosition,
      recentActivities,
      metrics
    } = dashboardData;

    const {
        totalPDL,
        activeCases,
        totalCases,
        totalCapacity,
        totalOccupied,
        overallUtilization,
        pendingVerifications,
        totalTimeAllowances,
        totalCourtOrders,
        totalMedicalRecords,
        activePersonnel
    } = metrics;


  const getActivityBadgeStyle = (color) => {
    const styles = {
      blue: 'bg-blue-50 text-blue-700',
      green: 'bg-green-50 text-green-700',
      orange: 'bg-orange-50 text-orange-700',
      red: 'bg-red-50 text-red-700',
      purple: 'bg-purple-50 text-purple-700'
    };
    return styles[color] || 'bg-gray-50 text-gray-700';
  };

  const getActivityDotColor = (color) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500'
    };
    return colors[color] || 'bg-gray-500';
  };

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
                    <span>Active records</span>
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
                  <div className="text-2xl font-bold text-gray-900">{totalCourtOrders}</div>
                  <p className="text-sm text-gray-500">Total processed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Medical Records</CardTitle>
                  <Stethoscope className="h-5 w-5 text-pink-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{totalMedicalRecords}</div>
                  <p className="text-sm text-gray-500">Total records</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Personnel</CardTitle>
                  <UserCheck className="h-5 w-5 text-cyan-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{activePersonnel}</div>
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
                  {pdlByGender.length > 0 ? (
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        {pdlByGender.map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-sm text-gray-600">
                              {item.name}: {item.value} ({totalPDL > 0 ? (item.value / totalPDL * 100).toFixed(1) : 0}%)
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
                  ) : (
                    <div className="text-center py-8 text-gray-500">No demographic data available</div>
                  )}
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
                  {caseStatusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={caseStatusData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-8 text-gray-500">No case data available</div>
                  )}
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
                  {monthlyAdmissions.length > 0 ? (
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
                  ) : (
                    <div className="text-center py-8 text-gray-500">No admission/release data available</div>
                  )}
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
                  {securityClassificationData.length > 0 ? (
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
                  ) : (
                    <div className="text-center py-8 text-gray-500">No security classification data available</div>
                  )}
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
                  {cellOccupancy.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {cellOccupancy.map((cell, index) => {
                        const occupancyRate = cell.capacity > 0 ? (cell.occupied / cell.capacity) * 100 : 0;
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
                  ) : (
                    <div className="text-center py-8 text-gray-500">No cell occupancy data available</div>
                  )}
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
                  {courtOrderTypes.length > 0 ? (
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
                  ) : (
                    <div className="text-center py-8 text-gray-500">No court order data available</div>
                  )}
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
                  {verificationStatusData.length > 0 ? (
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
                  ) : (
                    <div className="text-center py-8 text-gray-500">No verification data available</div>
                  )}
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
                  {personnelByPosition.length > 0 ? (
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
                  ) : (
                    <div className="text-center py-8 text-gray-500">No personnel data available</div>
                  )}
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
                  {timeAllowanceData.length > 0 ? (
                    <div>
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
                      {timeAllowanceData.length >= 2 && (
                        <div>
                          <div className="mt-4 h-4 w-full rounded-full bg-gray-200">
                            <div
                              className="h-4 rounded-full bg-blue-500"
                              style={{
                                width: `${totalTimeAllowances > 0 ? (timeAllowanceData[0].count / totalTimeAllowances * 100) : 0}%`
                              }}
                            />
                          </div>
                          <div className="mt-2 flex justify-between text-xs text-gray-500">
                            <span>{timeAllowanceData[0].type}: {totalTimeAllowances > 0 ? (timeAllowanceData[0].count / totalTimeAllowances * 100).toFixed(1) : 0}%</span>
                            <span>{timeAllowanceData[1].type}: {totalTimeAllowances > 0 ? (timeAllowanceData[1].count / totalTimeAllowances * 100).toFixed(1) : 0}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">No time allowance data available</div>
                  )}
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
                    <Badge variant="default">{activePersonnel}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Court Orders:</span>
                    <Badge variant="secondary">{totalCourtOrders}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pending Verifications:</span>
                    <Badge variant={pendingVerifications > 0 ? "destructive" : "default"}>{pendingVerifications}</Badge>
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
                {recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-b-0">
                        <div className={`mt-2 h-2 w-2 rounded-full ${getActivityDotColor(activity.color)}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-gray-500">{activity.description}</p>
                        </div>
                        <Badge variant="outline" className={`text-xs ${getActivityBadgeStyle(activity.color)}`}>
                          {activity.badge}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No recent activities</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    </>
  );
}
