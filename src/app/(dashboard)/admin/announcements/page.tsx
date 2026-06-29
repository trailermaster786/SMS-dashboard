'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Megaphone,
  Pin,
  PinOff,
  Calendar,
  Users,
  AlertTriangle,
  Info,
  PartyPopper,
  BookOpen,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { notices, adminUser } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import type { Notice } from '@/types';

const noticeTypeColors: Record<string, string> = {
  holiday: 'bg-emerald-100 text-emerald-700',
  event: 'bg-pink-100 text-pink-700',
  academic: 'bg-blue-100 text-blue-700',
  meeting: 'bg-violet-100 text-violet-700',
  urgent: 'bg-red-100 text-red-700',
  general: 'bg-gray-100 text-gray-700',
};

const noticeTypeIcons: Record<string, React.ElementType> = {
  holiday: PartyPopper,
  event: Megaphone,
  academic: BookOpen,
  meeting: Users,
  urgent: AlertTriangle,
  general: Info,
};

export default function AnnouncementsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [pinnedNotices, setPinnedNotices] = useState<Set<string>>(new Set());
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    type: 'general' as Notice['type'],
    targetAudience: [] as string[],
    expiryDate: '',
  });

  const filteredNotices = useMemo(() => {
    return notices
      .filter((notice) => {
        const matchesSearch =
          notice.title.toLowerCase().includes(search.toLowerCase()) ||
          notice.content.toLowerCase().includes(search.toLowerCase());
        const matchesType =
          typeFilter === 'all' || notice.type === typeFilter;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const aPinned = pinnedNotices.has(a.id);
        const bPinned = pinnedNotices.has(b.id);
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        return (
          new Date(b.publishDate).getTime() -
          new Date(a.publishDate).getTime()
        );
      });
  }, [search, typeFilter, pinnedNotices]);

  const togglePin = (noticeId: string) => {
    setPinnedNotices((prev) => {
      const next = new Set(prev);
      if (next.has(noticeId)) {
        next.delete(noticeId);
      } else {
        next.add(noticeId);
      }
      return next;
    });
  };

  const audienceOptions = ['admin', 'teacher', 'student', 'parent', 'accountant', 'librarian'];

  const toggleAudience = (role: string) => {
    setNewNotice((prev) => ({
      ...prev,
      targetAudience: prev.targetAudience.includes(role)
        ? prev.targetAudience.filter((r) => r !== role)
        : [...prev.targetAudience, role],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">
            Manage school notices and announcements
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          New Notice
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500 p-3">
                <Megaphone className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Notices</p>
                <p className="text-2xl font-bold">{notices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-red-500 p-3">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Urgent Notices</p>
                <p className="text-2xl font-bold">
                  {notices.filter((n) => n.type === 'urgent').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500 p-3">
                <Pin className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pinned Notices</p>
                <p className="text-2xl font-bold">{pinnedNotices.size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              All Notices ({filteredNotices.length})
            </CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search notices..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-full sm:w-[250px]"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredNotices.map((notice) => {
              const TypeIcon = noticeTypeIcons[notice.type] || Info;
              const isPinned = pinnedNotices.has(notice.id);
              return (
                <div
                  key={notice.id}
                  className={cn(
                    'rounded-lg border p-4 transition-colors',
                    isPinned && 'border-primary/30 bg-primary/[0.02]',
                    notice.type === 'urgent' && 'border-red-200 bg-red-50/50'
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'rounded-lg p-2 shrink-0',
                          noticeTypeColors[notice.type]
                        )}
                      >
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {isPinned && (
                            <Pin className="h-3 w-3 text-primary shrink-0" />
                          )}
                          <h3 className="font-semibold">{notice.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notice.content}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-[10px]',
                              noticeTypeColors[notice.type]
                            )}
                          >
                            {notice.type.charAt(0).toUpperCase() +
                              notice.type.slice(1)}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(
                              notice.publishDate
                            ).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            Expires{' '}
                            {new Date(
                              notice.expiryDate
                            ).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {notice.targetAudience.length === 6
                              ? 'All'
                              : notice.targetAudience.join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => togglePin(notice.id)}
                    >
                      {isPinned ? (
                        <PinOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Pin className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
            {filteredNotices.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-8">
                <Megaphone className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">No notices found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Notice Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Notice</DialogTitle>
            <DialogDescription>
              Publish a new announcement to the school community.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                placeholder="Enter notice title"
                value={newNotice.title}
                onChange={(e) =>
                  setNewNotice({ ...newNotice, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <textarea
                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                placeholder="Write your announcement content..."
                value={newNotice.content}
                onChange={(e) =>
                  setNewNotice({ ...newNotice, content: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Notice Type</label>
                <Select
                  value={newNotice.type}
                  onValueChange={(v) =>
                    setNewNotice({ ...newNotice, type: v as Notice['type'] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="holiday">Holiday</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Expiry Date</label>
                <Input
                  type="date"
                  value={newNotice.expiryDate}
                  onChange={(e) =>
                    setNewNotice({ ...newNotice, expiryDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Audience</label>
              <div className="flex flex-wrap gap-2">
                {audienceOptions.map((role) => (
                  <Button
                    key={role}
                    type="button"
                    variant={
                      newNotice.targetAudience.includes(role)
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    onClick={() => toggleAudience(role)}
                    className="capitalize"
                  >
                    {role}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setCreateDialogOpen(false)}>
              Publish Notice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
