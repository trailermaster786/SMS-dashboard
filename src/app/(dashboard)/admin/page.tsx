'use client';

import { useState } from 'react';
import {
  GraduationCap,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Megaphone,
  Plus,
  UserPlus,
  CreditCard,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  dashboardStats,
  adminUser,
  events,
  recentActivities,
} from '@/lib/mock-data';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';

const activityIcons: Record<string, React.ElementType> = {
  enrollment: UserPlus,
  payment: CreditCard,
  exam: FileText,
  attendance: CheckCircle2,
  event: Calendar,
  notice: Megaphone,
  library: BookOpen,
};

const activityColors: Record<string, string> = {
  enrollment: 'bg-blue-100 text-blue-600',
  payment: 'bg-emerald-100 text-emerald-600',
  exam: 'bg-purple-100 text-purple-600',
  attendance: 'bg-amber-100 text-amber-600',
  event: 'bg-pink-100 text-pink-600',
  notice: 'bg-red-100 text-red-600',
  library: 'bg-cyan-100 text-cyan-600',
};

export default function AdminDashboardPage() {
  const [period] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  const statCards = [
    {
      title: 'Total Students',
      value: dashboardStats.totalStudents.toLocaleString(),
      change: '+12%',
      trend: 'up' as const,
      icon: GraduationCap,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Teachers',
      value: dashboardStats.totalTeachers.toLocaleString(),
      change: '+3%',
      trend: 'up' as const,
      icon: Users,
      color: 'bg-emerald-500',
    },
    {
      title: 'Total Revenue',
      value: `$${(dashboardStats.totalRevenue / 1000).toFixed(0)}k`,
      change: '+8.5%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'bg-violet-500',
    },
    {
      title: 'Attendance Rate',
      value: `${dashboardStats.attendanceRate}%`,
      change: '+2.1%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'bg-amber-500',
    },
  ];

  const upcomingEvents = events
    .filter((e) => e.status === 'upcoming')
    .slice(0, 5);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {adminUser.name.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm">
            <UserPlus className="h-4 w-4" />
            Add Student
          </Button>
          <Button size="sm" variant="outline">
            <CreditCard className="h-4 w-4" />
            Create Fee
          </Button>
          <Button size="sm" variant="outline">
            <Bell className="h-4 w-4" />
            Send Notice
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center gap-1">
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-500" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground">vs last month</span>
                    </div>
                  </div>
                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Student Enrollment Trend</CardTitle>
            <CardDescription>Monthly enrollment over the past year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardStats.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--card-foreground))',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Next scheduled events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      · {event.startTime} - {event.endTime}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {event.type}
                  </Badge>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No upcoming events
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue for the current year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardStats.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--card-foreground))',
                    }}
                  />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest school activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.slice(0, 6).map((activity) => {
                const Icon = activityIcons[activity.type] || CheckCircle2;
                const colorClass =
                  activityColors[activity.type] || 'bg-gray-100 text-gray-600';
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`rounded-lg p-2 ${colorClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
