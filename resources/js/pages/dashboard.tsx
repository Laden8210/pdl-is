import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const quarterlyData = [
    { name: 'Sentence', value: 62 },
    { name: 'Parole', value: 58 },
    { name: 'Positive', value: 21 },
    { name: 'Negative', value: 10 },
];

const populationData = [
    { name: 'Male', value: 300 },
    { name: 'Female', value: 187 },
];

const COLORS = ['#4f46e5', '#a855f7'];
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-4">
                <h1 className="text-2xl font-bold">Dashboard</h1>

                {/* Top Stats */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground">Total Inmate Population</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between gap-4">
                                {/* Left: Total number */}
                                <div>
                                    <p className="text-3xl font-bold">487</p>
                                    <p className="mt-1 text-sm text-muted-foreground">Total Inmates</p>
                                </div>

                                {/* Right: Pie Chart */}
                                <div className="h-[80px] w-[80px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={populationData} innerRadius={20} outerRadius={40} paddingAngle={2} dataKey="value">
                                                {populationData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground">Quarterly Inmate Status Reports</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="flex items-start justify-between gap-4">
                                {/* Left: Summary Text */}
                                <div className="flex-1 space-y-1 text-sm">
                                    <p>• Sentence Progression: 62% complete</p>
                                    <p>• Parole Eligibility: 58 inmates eligible</p>
                                    <p>• Behavioral Remarks: 21 positive, 10 negative</p>
                                </div>

                                {/* Right: Bar Chart */}
                                <div className="h-32 w-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={quarterlyData}>
                                            <XAxis dataKey="name" fontSize={10} hide />
                                            <YAxis fontSize={10} hide />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground">Drug Clearing Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1 text-sm">
                            <p>
                                Cleared: <strong>135</strong>
                            </p>
                            <p>
                                Pending: <strong>54</strong>
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Middle Section */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground">Monthly Drug-related Cases</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1 text-sm">
                            <p>• New Admissions: 29 inmates</p>
                            <p>• Rehab Program Completed: 9 inmates</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground">Upcoming Activities</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1 text-sm">
                            <p>
                                <strong>10:00 AM</strong> – PDL Transfer
                            </p>
                            <p>
                                <strong>02:00 PM</strong> – Hearing
                            </p>
                            <p>
                                <strong>03:00 PM</strong> – System Update
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
