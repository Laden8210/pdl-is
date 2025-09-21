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
  CheckCircle,
  FileX,
  UserPlus
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
    pendingVerifications: {
      id: number;
      pdl_id: number;
      pdl_name: string;
      verification_type: string;
      submitted_at: string;
      days_pending: number;
      priority: string;
    }[];
    verificationStatusData: { status: string; count: number; color: string }[];
    recentPDLRecords: {
      id: number;
      name: string;
      created_at: string;
      age: string;
      gender: string;
      status: string;
    }[];
    incompleteRecords: {
      id: number;
      name: string;
      missing_fields: string;
      created_at: string;
    }[];
    caseStatusData: { status: string; count: number; color: string }[];
    monthlyProcessing: {
      month: string;
      records_created: number;
      verifications_processed: number;
    }[];
    recentActivities: { type: string; title: string; description: string; badge: string; color: string; priority?: string }[];
    timeAllowanceData: {
      type: string;
      count: number;
      color: string;
      description: string;
    }[];
    metrics: {
      totalPDL: number;
      pendingVerifications: number;
      approvedVerifications: number;
      rejectedVerifications: number;
      totalVerifications: number;
      incompleteRecords: number;
      totalCases: number;
      activeCases: number;
      recordsCreatedThisMonth: number;
    };
  };
}

export default function RecordsOfficerDashboard() {
    const {props} = usePage<DashboardProps>();
    const { dashboardData } = props;
    const {
      pendingVerifications,
      verificationStatusData,
      recentPDLRecords,
      incompleteRecords,
      caseStatusData,
      monthlyProcessing,
      recentActivities,
      timeAllowanceData,
      metrics
    } = dashboardData;

    const {
        totalPDL,
        pendingVerifications: pendingCount,
        approvedVerifications,
        rejectedVerifications,
        totalVerifications,
        incompleteRecords: incompleteCount,
        totalCases,
        activeCases,
        recordsCreatedThisMonth
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

  const getPriorityBadgeStyle = (priority) => {
    return priority === 'High' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700';
  };

  return (
    <>
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Records Officer Dashboard" />
        <div className="min-h-screen">
          <div className="mx-auto space-y-6 p-4">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h1 className="text-2xl font-bold">Records Officer Dashboard</h1>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total PDL Records</CardTitle>
                  <Users className="h-5 w-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{totalPDL}</div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>{recordsCreatedThisMonth} created this month</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending Verifications</CardTitle>
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{pendingCount}</div>
                  <p className="text-sm text-gray-500">Awaiting review</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Incomplete Records</CardTitle>
                  <FileX className="h-5 w-5 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{incompleteCount}</div>
                  <p className="text-sm text-gray-500">Require attention</p>
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
            </div>

            {/* Second Row Metrics */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Verifications</CardTitle>
                  <UserCheck className="h-5 w-5 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{totalVerifications}</div>
                  <p className="text-sm text-gray-500">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{approvedVerifications}</div>
                  <p className="text-sm text-gray-500">Verifications</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{rejectedVerifications}</div>
                  <p className="text-sm text-gray-500">Verifications</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Records This Month</CardTitle>
                  <UserPlus className="h-5 w-5 text-cyan-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{recordsCreatedThisMonth}</div>
                  <p className="text-sm text-gray-500">New records</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Verification Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Verification Status
                  </CardTitle>
                  <CardDescription>Distribution of verification requests</CardDescription>
                </CardHeader>
                <CardContent>
                  {verificationStatusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={verificationStatusData}
                          dataKey="count"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          innerRadius={60}
                          label={({ status, percent }) => `${status}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {verificationStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} verifications`, 'Count']} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-8 text-gray-500">No verification data available</div>
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
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-8 text-gray-500">No case data available</div>
                  )}
                </CardContent>
              </Card>

              {/* Monthly Processing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Monthly Processing
                  </CardTitle>
                  <CardDescription>Records created and verifications processed</CardDescription>
                </CardHeader>
                <CardContent>
                  {monthlyProcessing.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyProcessing}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="records_created" stroke="#3b82f6" strokeWidth={2} name="Records Created" />
                        <Line type="monotone" dataKey="verifications_processed" stroke="#10b981" strokeWidth={2} name="Verifications Processed" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-8 text-gray-500">No processing data available</div>
                  )}
                </CardContent>
              </Card>

              {/* Pending Verifications List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Pending Verifications
                  </CardTitle>
                  <CardDescription>Verification requests awaiting review</CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingVerifications.length > 0 ? (
                    <div className="space-y-3">
                      {pendingVerifications.slice(0, 5).map((verification) => (
                        <div key={verification.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{verification.pdl_name}</p>
                            <p className="text-xs text-gray-500">
                              {verification.verification_type} • {verification.days_pending} days pending
                            </p>
                          </div>
                          <Badge variant={verification.priority === 'High' ? 'destructive' : 'secondary'} className="text-xs">
                            {verification.priority}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">No pending verifications</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Additional Data Sections */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Recent PDL Records */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Recent PDL Records
                  </CardTitle>
                  <CardDescription>Latest PDL records created (last 30 days)</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentPDLRecords.length > 0 ? (
                    <div className="space-y-3">
                      {recentPDLRecords.slice(0, 5).map((record) => (
                        <div key={record.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{record.name}</p>
                            <p className="text-xs text-gray-500">
                              {record.age} years • {record.gender} • Created {record.created_at}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {record.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">No recent records</div>
                  )}
                </CardContent>
              </Card>

              {/* Incomplete Records */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileX className="h-5 w-5" />
                    Incomplete Records
                  </CardTitle>
                  <CardDescription>Records missing required information</CardDescription>
                </CardHeader>
                <CardContent>
                  {incompleteRecords.length > 0 ? (
                    <div className="space-y-3">
                      {incompleteRecords.slice(0, 5).map((record) => (
                        <div key={record.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{record.name}</p>
                            <p className="text-xs text-gray-500">
                              Missing: {record.missing_fields}
                            </p>
                          </div>
                          <Badge variant="destructive" className="text-xs">
                            Incomplete
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">No incomplete records</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Time Allowances Section */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* GCTA Time Allowances */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    GCTA Time Allowances
                  </CardTitle>
                  <CardDescription>Good Conduct Time Allowance distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const gctaData = timeAllowanceData.find(item => item.type === 'GCTA');
                    const totalTimeAllowances = timeAllowanceData.reduce((sum, item) => sum + item.count, 0);
                    return gctaData ? (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: gctaData.color }} />
                            <span className="text-lg font-semibold">{gctaData.type}</span>
                          </div>
                          <Badge variant="secondary" className="text-lg px-3 py-1">{gctaData.count}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">{gctaData.description}</div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="h-3 rounded-full transition-all duration-300"
                            style={{
                              width: `${totalTimeAllowances > 0 ? (gctaData.count / totalTimeAllowances * 100) : 0}%`,
                              backgroundColor: gctaData.color
                            }}
                          />
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {totalTimeAllowances > 0 ? (gctaData.count / totalTimeAllowances * 100).toFixed(1) : 0}% of total allowances
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">No GCTA data available</div>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* TASTM Time Allowances */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    TASTM Time Allowances
                  </CardTitle>
                  <CardDescription>Time Allowance for Study, Teaching, and Mentoring distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const tastmData = timeAllowanceData.find(item => item.type === 'TASTM');
                    const totalTimeAllowances = timeAllowanceData.reduce((sum, item) => sum + item.count, 0);
                    return tastmData ? (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: tastmData.color }} />
                            <span className="text-lg font-semibold">{tastmData.type}</span>
                          </div>
                          <Badge variant="secondary" className="text-lg px-3 py-1">{tastmData.count}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">{tastmData.description}</div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="h-3 rounded-full transition-all duration-300"
                            style={{
                              width: `${totalTimeAllowances > 0 ? (tastmData.count / totalTimeAllowances * 100) : 0}%`,
                              backgroundColor: tastmData.color
                            }}
                          />
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {totalTimeAllowances > 0 ? (tastmData.count / totalTimeAllowances * 100).toFixed(1) : 0}% of total allowances
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">No TASTM data available</div>
                    );
                  })()}
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
                        <div className="flex gap-2">
                          {activity.priority && (
                            <Badge variant={activity.priority === 'High' ? 'destructive' : 'secondary'} className="text-xs">
                              {activity.priority}
                            </Badge>
                          )}
                          <Badge variant="outline" className={`text-xs ${getActivityBadgeStyle(activity.color)}`}>
                            {activity.badge}
                          </Badge>
                        </div>
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
