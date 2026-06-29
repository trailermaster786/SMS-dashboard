'use client';

import { useState } from 'react';
import {
  Settings,
  Building2,
  Palette,
  Shield,
  Puzzle,
  Save,
  Upload,
  Check,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const roles = [
  { id: 'admin', name: 'Administrator', permissions: 'Full access', users: 2 },
  { id: 'teacher', name: 'Teacher', permissions: 'Class & student management', users: 28 },
  { id: 'student', name: 'Student', permissions: 'View grades, assignments, fees', users: 450 },
  { id: 'parent', name: 'Parent', permissions: 'View child progress & fees', users: 320 },
  { id: 'accountant', name: 'Accountant', permissions: 'Finance & fee management', users: 3 },
  { id: 'librarian', name: 'Librarian', permissions: 'Library management', users: 2 },
];

const modules = [
  { id: 'attendance', name: 'Attendance Tracking', enabled: true, description: 'Track daily student attendance' },
  { id: 'grades', name: 'Gradebook', enabled: true, description: 'Manage student grades and report cards' },
  { id: 'fees', name: 'Fee Management', enabled: true, description: 'Invoice and payment processing' },
  { id: 'library', name: 'Library Management', enabled: true, description: 'Book catalog and issue tracking' },
  { id: 'transport', name: 'Transport', enabled: true, description: 'Bus routes and vehicle management' },
  { id: 'messaging', name: 'Messaging', enabled: true, description: 'Internal communication system' },
  { id: 'exams', name: 'Exam Management', enabled: true, description: 'Create and manage examinations' },
  { id: 'timetable', name: 'Timetable', enabled: false, description: 'Class schedule management' },
  { id: 'notifications', name: 'Push Notifications', enabled: false, description: 'Real-time notifications' },
  { id: 'reports', name: 'Advanced Reports', enabled: false, description: 'Detailed analytics and reports' },
];

const themeColors = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Cyan', value: '#06b6d4' },
];

export default function SettingsPage() {
  const [schoolSettings, setSchoolSettings] = useState({
    name: 'Greenfield Academy',
    address: '1200 University Blvd, Springfield, IL 62701',
    phone: '+1-555-0100',
    email: 'admin@greenfieldacademy.edu',
    website: 'www.greenfieldacademy.edu',
    established: '1998',
  });

  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [moduleStates, setModuleStates] = useState(
    modules.reduce<Record<string, boolean>>((acc, m) => {
      acc[m.id] = m.enabled;
      return acc;
    }, {})
  );

  const toggleModule = (moduleId: string) => {
    setModuleStates((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">School Settings</h1>
          <p className="text-muted-foreground">
            Configure school details, branding, and system modules
          </p>
        </div>
        <Button>
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <Puzzle className="h-4 w-4" />
            Modules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
              <CardDescription>
                Update your school's basic information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">School Name</label>
                  <Input
                    value={schoolSettings.name}
                    onChange={(e) =>
                      setSchoolSettings({
                        ...schoolSettings,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Established</label>
                  <Input
                    value={schoolSettings.established}
                    onChange={(e) =>
                      setSchoolSettings({
                        ...schoolSettings,
                        established: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={schoolSettings.phone}
                    onChange={(e) =>
                      setSchoolSettings({
                        ...schoolSettings,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={schoolSettings.email}
                    onChange={(e) =>
                      setSchoolSettings({
                        ...schoolSettings,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Website</label>
                  <Input
                    value={schoolSettings.website}
                    onChange={(e) =>
                      setSchoolSettings({
                        ...schoolSettings,
                        website: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <Input
                  value={schoolSettings.address}
                  onChange={(e) =>
                    setSchoolSettings({
                      ...schoolSettings,
                      address: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">School Logo</label>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed bg-muted">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                      Upload Logo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: 200x200px, PNG or JPG
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Customization</CardTitle>
              <CardDescription>
                Customize the look and feel of the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">Primary Color</label>
                <div className="flex flex-wrap gap-3">
                  {themeColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full transition-all',
                        selectedColor === color.value &&
                          'ring-2 ring-offset-2 ring-offset-background'
                      )}
                      style={{
                        backgroundColor: color.value,
                        boxShadow: selectedColor === color.value ? `0 0 0 2px ${color.value}` : undefined,
                      }}
                    >
                      {selectedColor === color.value && (
                        <Check className="h-5 w-5 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Custom Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="h-10 w-10 cursor-pointer rounded-lg border-0"
                  />
                  <Input
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-32 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Preview</label>
                <div className="rounded-lg border p-6 bg-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: selectedColor }}
                    >
                      GA
                    </div>
                    <div>
                      <p className="font-semibold">Greenfield Academy</p>
                      <p className="text-xs text-muted-foreground">
                        School Management System
                      </p>
                    </div>
                  </div>
                  <Button size="sm" style={{ backgroundColor: selectedColor }}>
                    Sample Button
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
              <CardDescription>
                Manage user roles and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{role.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {role.permissions}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{role.users}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Modules</CardTitle>
              <CardDescription>
                Enable or disable system modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'rounded-lg p-2',
                          moduleStates[module.id]
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-gray-100 text-gray-400'
                        )}
                      >
                        <Puzzle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{module.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {module.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={moduleStates[module.id]}
                      onCheckedChange={() => toggleModule(module.id)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
