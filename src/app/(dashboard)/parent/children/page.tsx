'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  GraduationCap,
  CheckCircle,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { students, classes, sections, attendanceRecords, grades, fees, parents } from '@/lib/mock-data';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';

function getChildAttendanceRate(studentId: string) {
  const records = attendanceRecords.filter((a) => a.studentId === studentId);
  const present = records.filter((a) => a.status === 'present' || a.status === 'late').length;
  return records.length > 0 ? Math.round((present / records.length) * 100) : 0;
}

function getChildLatestGrade(studentId: string) {
  const studentGrades = grades.filter((g) => g.studentId === studentId);
  if (studentGrades.length === 0) return null;
  const sorted = [...studentGrades].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return sorted[0];
}

function getChildFeesStatus(studentId: string) {
  const studentFees = fees.filter((f) => f.studentId === studentId);
  if (studentFees.length === 0) return 'none';
  const hasOverdue = studentFees.some((f) => f.status === 'overdue');
  const hasPending = studentFees.some((f) => f.status === 'pending');
  const hasPartial = studentFees.some((f) => f.status === 'partial');
  if (hasOverdue) return 'overdue';
  if (hasPending) return 'pending';
  if (hasPartial) return 'partial';
  return 'paid';
}

const feeStatusColors: Record<string, string> = {
  paid: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  partial: 'bg-blue-100 text-blue-700',
  overdue: 'bg-red-100 text-red-700',
  none: 'bg-gray-100 text-gray-700',
};

function getClassName(classId: string) {
  return classes.find((c) => c.id === classId)?.name || 'N/A';
}

function getSectionName(sectionId: string) {
  return sections.find((s) => s.id === sectionId)?.name || 'N/A';
}

export default function ParentChildrenPage() {
  const { user } = useAuthStore()
  const parentChildren = students.filter(
    (s) => s.parentId === user?.id
  );
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Children</h1>
        <p className="text-muted-foreground">
          Overview of all your children enrolled in the school
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {parentChildren.map((child) => {
          const attendanceRate = getChildAttendanceRate(child.id);
          const latestGrade = getChildLatestGrade(child.id);
          const feeStatus = getChildFeesStatus(child.id);
          const getInitials = (name: string) =>
            name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

          return (
            <Card key={child.id}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={child.avatar} alt={child.name} />
                    <AvatarFallback>{getInitials(child.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{child.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {getClassName(child.classId)} &mdash; Section {getSectionName(child.sectionId)}
                    </p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border p-3 text-center">
                    <CheckCircle className="mx-auto mb-1 h-4 w-4 text-emerald-500" />
                    <p className="text-xl font-bold">{attendanceRate}%</p>
                    <p className="text-xs text-muted-foreground">Attendance</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <TrendingUp className="mx-auto mb-1 h-4 w-4 text-blue-500" />
                    <p className="text-xl font-bold">
                      {latestGrade ? latestGrade.grade : 'N/A'}
                    </p>
                    <p className="text-xs text-muted-foreground">Latest Grade</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <DollarSign className="mx-auto mb-1 h-4 w-4 text-amber-500" />
                    <Badge
                      variant="outline"
                      className={cn('mt-1 capitalize', feeStatusColors[feeStatus])}
                    >
                      {feeStatus}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">Fees</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {parentChildren.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">
              No children found
            </p>
            <p className="text-sm text-muted-foreground">
              No students are linked to your account.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
