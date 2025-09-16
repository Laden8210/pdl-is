import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import {
  Users,
  FileText,
  Calendar,
  AlertCircle,
  Shield,
  Activity,
  Building,
  Scale,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Gavel,
  Lock,
  Eye
} from 'lucide-react';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart, CartesianGrid } from 'recharts';

const breadcrumbs = [
  {
    title: 'Law Enforcement Dashboard',
    href: '/law-enforcement/dashboard',
  },
];

interface LawEnforcementDashboardProps {
  dashboardData: {
    pdlByGender: { name: string; value: number; color: string }[];
    caseStatusData: { name: string; value: number; color: string }[];
    monthlyAdmissions: { month: string; admissions: number }[];
    courtOrderTypes: { type: string; count: number; color: string }[];
    securityClassificationData: { classification: string; count: number; color: string }[];
    recentAdmissions: {
      id: number;
      name: string;
      admission_date: string;
      age: string;
      gender: string;
      status: string;
    }[];
    pendingCourtOrders: {
      id: number;
      pdl_name: string;
      order_type: string;
      order_date: string;
      court: string;
      status: string;
    }[];
    recentCaseUpdates: {
      id: number;
      pdl_name: string;
      case_number: string;
      case_status: string;
      security_classification: string;
      updated_at: string;
    }[];
    recentActivities: {
      type: string;
      title: string;
      description: string;
      badge: string;
      color: string;
    }[];
    metrics: {
      totalPDL: number;
      activeCases: number;
      totalCases: number;
      pendingCourtOrders: number;
      totalCourtOrders: number;
      highSecurityPDL: number;
      mediumSecurityPDL: number;
      lowSecurityPDL: number;
    };
  };
  [key: string]: any;
}

export default function LawEnforcementDashboard() {
  const { props } = usePage<LawEnforcementDashboardProps>();
  const { dashboardData } = props;
  const {
    pdlByGender,
    caseStatusData,
    monthlyAdmissions,
    courtOrderTypes,
    securityClassificationData,
    recentAdmissions,
    pendingCourtOrders,
    recentCaseUpdates,
    recentActivities,
    metrics
  } = dashboardData;

  const {
    totalPDL,
    activeCases,
    totalCases,
    pendingCourtOrders: pendingOrdersCount,
    totalCourtOrders,
    highSecurityPDL,
    mediumSecurityPDL,
    lowSecurityPDL
  } = metrics;

  const getActivityBadgeStyle = (color: string) => {
    const styles = {
      blue: 'bg-blue-50 text-blue-700',
      green: 'bg-green-50 text-green-700',
      orange: 'bg-orange-50 text-orange-700',
      red: 'bg-red-50 text-red-700',
      purple: 'bg-purple-50 text-purple-700'
    };
    return styles[color as keyof typeof styles] || 'bg-gray-50 text-gray-700';
  };

  const getActivityDotColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500';
  };

  const getSecurityBadgeColor = (classification: string) => {
    const colors = {
      'Maximum': 'bg-red-100 text-red-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Minimum': 'bg-green-100 text-green-800'
    };
    return colors[classification as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCaseStatusBadgeColor = (status: string) => {
    const colors = {
      'Active': 'bg-blue-100 text-blue-800',
      'Closed': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'On Trial': 'bg-purple-100 text-purple-800',
      'Appealed': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Law Enforcement Dashboard" />

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Law Enforcement Dashboard</h1>
              <p className="text-muted-foreground">
                Overview of PDL management and case tracking for law enforcement operations
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Shield className="w-4 h-4 mr-1" />
                Law Enforcement
              </Badge>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total PDL</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPDL}</div>
                <p className="text-xs text-muted-foreground">
                  Currently detained persons
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeCases}</div>
                <p className="text-xs text-muted-foreground">
                  Out of {totalCases} total cases
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Court Orders</CardTitle>
                <Gavel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingOrdersCount}</div>
                <p className="text-xs text-muted-foreground">
                  Requiring immediate attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Security PDL</CardTitle>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{highSecurityPDL}</div>
                <p className="text-xs text-muted-foreground">
                  Maximum security classification
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* PDL Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>PDL Demographics</CardTitle>
                <CardDescription>Gender distribution of detained persons</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pdlByGender}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pdlByGender.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-4 mt-4">
                  {pdlByGender.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Case Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Case Status Distribution</CardTitle>
                <CardDescription>Current status of all cases</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={caseStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Admissions */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Admissions</CardTitle>
                <CardDescription>PDL admissions over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={monthlyAdmissions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="admissions" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Security Classification and Court Orders */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Security Classification */}
            <Card>
              <CardHeader>
                <CardTitle>Security Classification</CardTitle>
                <CardDescription>Distribution by security level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-sm">Maximum Security</span>
                    </div>
                    <Badge className={getSecurityBadgeColor('Maximum')}>
                      {highSecurityPDL}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-sm">Medium Security</span>
                    </div>
                    <Badge className={getSecurityBadgeColor('Medium')}>
                      {mediumSecurityPDL}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-sm">Minimum Security</span>
                    </div>
                    <Badge className={getSecurityBadgeColor('Minimum')}>
                      {lowSecurityPDL}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Court Order Types */}
            <Card>
              <CardHeader>
                <CardTitle>Court Order Types</CardTitle>
                <CardDescription>Distribution of court orders</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={courtOrderTypes}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {courtOrderTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-2 mt-4">
                  {courtOrderTypes.map((item, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs">{item.type}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Data Tables */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Recent Admissions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5" />
                  <span>Recent Admissions</span>
                </CardTitle>
                <CardDescription>Latest PDL admissions requiring processing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAdmissions.map((admission) => (
                    <div key={admission.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{admission.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {admission.gender} • Age: {admission.age}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {admission.admission_date}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {admission.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Court Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gavel className="h-5 w-5" />
                  <span>Pending Court Orders</span>
                </CardTitle>
                <CardDescription>Court orders requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingCourtOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{order.pdl_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.order_type} • {order.court}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.order_date}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Case Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Recent Case Updates</span>
                </CardTitle>
                <CardDescription>Latest case information updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentCaseUpdates.map((caseUpdate) => (
                    <div key={caseUpdate.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{caseUpdate.pdl_name}</p>
                        <p className="text-xs text-muted-foreground">
                          Case: {caseUpdate.case_number}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Updated: {caseUpdate.updated_at}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge className={getCaseStatusBadgeColor(caseUpdate.case_status)}>
                          {caseUpdate.case_status}
                        </Badge>
                        <Badge className={getSecurityBadgeColor(caseUpdate.security_classification)}>
                          {caseUpdate.security_classification}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Recent Activities</span>
              </CardTitle>
              <CardDescription>Latest activities requiring law enforcement attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${getActivityDotColor(activity.color)}`} />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{activity.title}</p>
                        <Badge className={getActivityBadgeStyle(activity.color)}>
                          {activity.badge}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </>
  );
}
