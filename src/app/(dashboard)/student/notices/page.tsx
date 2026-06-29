'use client'

import { useMemo, useState } from 'react'
import {
  Bell,
  Calendar,
  Filter,
  Pin,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  GraduationCap,
  PartyPopper,
  MessageSquare,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { notices } from '@/lib/mock-data'

type NoticeType = 'all' | 'academic' | 'event' | 'general' | 'urgent'

const typeConfig: Record<string, { label: string; variant: 'default' | 'destructive' | 'secondary' | 'success' | 'warning'; icon: typeof Bell }> = {
  academic: { label: 'Academic', variant: 'default', icon: GraduationCap },
  event: { label: 'Event', variant: 'success', icon: PartyPopper },
  general: { label: 'General', variant: 'secondary', icon: MessageSquare },
  urgent: { label: 'Urgent', variant: 'destructive', icon: AlertTriangle },
  holiday: { label: 'Holiday', variant: 'warning', icon: Calendar },
  meeting: { label: 'Meeting', variant: 'default', icon: MessageSquare },
}

export default function NoticesPage() {
  const [filterType, setFilterType] = useState<NoticeType>('all')
  const [expandedNotice, setExpandedNotice] = useState<string | null>(null)
  const [pinnedNotices, setPinnedNotices] = useState<Set<string>>(new Set(['notice-006']))

  const filteredNotices = useMemo(() => {
    const studentNotices = notices.filter(
      (n) => n.isPublished && n.targetAudience.includes('student')
    )

    const filtered = filterType === 'all'
      ? studentNotices
      : studentNotices.filter((n) => n.type === filterType)

    const pinned = filtered.filter((n) => pinnedNotices.has(n.id))
    const unpinned = filtered.filter((n) => !pinnedNotices.has(n.id))

    return [
      ...pinned.sort(
        (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      ),
      ...unpinned.sort(
        (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      ),
    ]
  }, [filterType, pinnedNotices])

  const togglePin = (noticeId: string) => {
    setPinnedNotices((prev) => {
      const next = new Set(prev)
      if (next.has(noticeId)) {
        next.delete(noticeId)
      } else {
        next.add(noticeId)
      }
      return next
    })
  }

  const toggleExpand = (noticeId: string) => {
    setExpandedNotice((prev) => (prev === noticeId ? null : noticeId))
  }

  const formatNoticeType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  const urgentCount = notices.filter(
    (n) => n.isPublished && n.targetAudience.includes('student') && n.type === 'urgent'
  ).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notice Board</h1>
          <p className="text-muted-foreground">
            Stay updated with the latest announcements.
          </p>
        </div>
        {urgentCount > 0 && (
          <Badge variant="destructive" className="w-fit gap-1">
            <AlertTriangle className="h-3 w-3" />
            {urgentCount} Urgent Notice{urgentCount > 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select
          value={filterType}
          onValueChange={(v) => setFilterType(v as NoticeType)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="academic">Academic</SelectItem>
            <SelectItem value="event">Event</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredNotices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="mb-3 h-12 w-12 text-muted-foreground/40" />
            <p className="text-lg font-medium">No notices found</p>
            <p className="text-sm text-muted-foreground">
              {filterType === 'all'
                ? 'There are no notices at the moment.'
                : `No ${filterType} notices.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotices.map((notice) => {
            const config = typeConfig[notice.type] || typeConfig.general
            const Icon = config.icon
            const isExpanded = expandedNotice === notice.id
            const isPinned = pinnedNotices.has(notice.id)
            const publishDate = new Date(notice.publishDate)
            const expiryDate = new Date(notice.expiryDate)
            const isExpired = expiryDate < new Date()

            return (
              <Card
                key={notice.id}
                className={`transition-all ${
                  isPinned ? 'border-primary/30 bg-primary/5' : ''
                } ${isExpired ? 'opacity-60' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        notice.type === 'urgent'
                          ? 'bg-destructive/10'
                          : notice.type === 'event'
                          ? 'bg-emerald-50'
                          : 'bg-muted'
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          notice.type === 'urgent'
                            ? 'text-destructive'
                            : notice.type === 'event'
                            ? 'text-emerald-600'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {isPinned && (
                            <Pin className="h-3.5 w-3.5 text-primary" />
                          )}
                          <h3 className="font-semibold">{notice.title}</h3>
                          <Badge variant={config.variant}>
                            {config.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => togglePin(notice.id)}
                          >
                            <Pin
                              className={`h-3.5 w-3.5 ${
                                isPinned ? 'fill-primary text-primary' : 'text-muted-foreground'
                              }`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => toggleExpand(notice.id)}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {isExpanded ? (
                        <div className="mt-3 space-y-3">
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {notice.content}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Published: {publishDate.toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Expires: {expiryDate.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {notice.content}
                        </p>
                      )}

                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{publishDate.toLocaleDateString()}</span>
                        {isExpired && (
                          <Badge variant="outline" className="text-[10px]">
                            Expired
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
