import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, Calendar, AlertCircle, Shield, Activity, Building, Stethoscope } from 'lucide-react';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart } from 'recharts';

// Sample data based on the database schema
const pdlByGender = [
    { name: 'Male', value: 342, color: '#3b82f6' },
    { name: 'Female', value: 145, color: '#ec4899' },
];

const caseStatusData = [
    { name: 'Active', value: 289 },
    { name: 'Closed', value: 156 },
    { name: 'Pending', value: 42 },
];

const monthlyAdmissions = [
    { month: 'Jan', admissions: 45 },
    { month: 'Feb', admissions: 38 },
    { month: 'Mar', admissions: 52 },
    { month: 'Apr', admissions: 41 },
    { month: 'May', admissions: 47 },
    { month: 'Jun', admissions: 39 },
];

const cellOccupancy = [
    { cell: 'Cell A', capacity: 50, occupied: 48 },
    { cell: 'Cell B', capacity: 45, occupied: 42 },
    { cell: 'Cell C', capacity: 40, occupied: 35 },
    { cell: 'Cell D', capacity: 55, occupied: 53 },
];

const timeAllowanceData = [
    { type: 'GCTA', count: 89, color: '#10b981' },
    { type: 'TASTM', count: 34, color: '#f59e0b' },
];

export default function PDLDashboard() {
    const totalPDL = pdlByGender.reduce((sum, item) => sum + item.value, 0);
    const totalCases = caseStatusData.reduce((sum, item) => sum + item.value, 0);
    const activeCases = caseStatusData.find(item => item.name === 'Active')?.value || 0;
    const totalTimeAllowances = timeAllowanceData.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">PDL Management Dashboard</h1>
                    <p className="text-gray-600">Person Deprived of Liberty Management System</p>
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
                            <p className="text-sm text-gray-500">Active detainees</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Active Cases</CardTitle>
                            <FileText className="h-5 w-5 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{activeCases}</div>
                            <p className="text-sm text-gray-500">Out of {totalCases} total</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Time Allowances</CardTitle>
                            <Calendar className="h-5 w-5 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{totalTimeAllowances}</div>
                            <p className="text-sm text-gray-500">GCTA & TASTM awarded</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-red-500">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Pending Verifications</CardTitle>
                            <AlertCircle className="h-5 w-5 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">23</div>
                            <p className="text-sm text-gray-500">Awaiting review</p>
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
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    {pdlByGender.map((item, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div
                                                className="h-3 w-3 rounded-full"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="h-32 w-32">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pdlByGender}
                                                dataKey="value"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={50}
                                                innerRadius={25}
                                            >
                                                {pdlByGender.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
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
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={caseStatusData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Monthly Admissions Trend */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Monthly Admissions Trend
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={monthlyAdmissions}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="admissions" stroke="#10b981" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Cell Occupancy */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5" />
                                Cell Occupancy Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {cellOccupancy.map((cell, index) => {
                                    const occupancyRate = (cell.occupied / cell.capacity) * 100;
                                    const isNearCapacity = occupancyRate > 90;

                                    return (
                                        <div key={index} className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">{cell.cell}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-600">
                                                        {cell.occupied}/{cell.capacity}
                                                    </span>
                                                    {isNearCapacity && (
                                                        <Badge variant="destructive" className="text-xs">
                                                            Near Capacity
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="h-2 rounded-full bg-gray-200">
                                                <div
                                                    className={`h-2 rounded-full ${isNearCapacity ? 'bg-red-500' : 'bg-blue-500'}`}
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

                {/* Time Allowances and Recent Activity */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Time Allowances
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {timeAllowanceData.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-3 w-3 rounded-full"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <span className="text-sm font-medium">{item.type}</span>
                                        </div>
                                        <Badge variant="secondary">{item.count}</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Stethoscope className="h-5 w-5" />
                                Medical Records
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Total Records:</span>
                                <span className="font-medium">1,247</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">This Month:</span>
                                <span className="font-medium">89</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Pending Review:</span>
                                <Badge variant="outline">12</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                System Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Active Personnel:</span>
                                <Badge variant="default">47</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Court Orders:</span>
                                <Badge variant="secondary">156</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Notifications:</span>
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
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 border-b border-gray-100 pb-3">
                                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                                <div>
                                    <p className="text-sm font-medium">New PDL admission - John Doe</p>
                                    <p className="text-xs text-gray-500">2 hours ago • Cell Assignment pending</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 border-b border-gray-100 pb-3">
                                <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                                <div>
                                    <p className="text-sm font-medium">GCTA approved for Case #2024-1156</p>
                                    <p className="text-xs text-gray-500">4 hours ago • 30 days awarded</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 border-b border-gray-100 pb-3">
                                <div className="h-2 w-2 rounded-full bg-orange-500 mt-2" />
                                <div>
                                    <p className="text-sm font-medium">Medical examination scheduled</p>
                                    <p className="text-xs text-gray-500">6 hours ago • 15 PDL scheduled for tomorrow</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="h-2 w-2 rounded-full bg-red-500 mt-2" />
                                <div>
                                    <p className="text-sm font-medium">Verification request submitted</p>
                                    <p className="text-xs text-gray-500">8 hours ago • Awaiting supervisor review</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
