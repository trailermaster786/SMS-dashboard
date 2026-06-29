"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { notifications } from "@/lib/mock-data";
import { useAuthStore } from "@/store/auth-store";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface NotificationPageProps {
  role: string;
}

export default function NotificationPage({ role }: NotificationPageProps) {
  const { user } = useAuthStore();
  const [filter, setFilter] = useState<string>("all");

  const userNotifications = useMemo(() => {
    if (!user) return [];
    return notifications.filter((n) => n.userId === user.id);
  }, [user]);

  const filteredNotifications = useMemo(() => {
    if (filter === "all") return userNotifications;
    if (filter === "unread") return userNotifications.filter((n) => !n.isRead);
    return userNotifications.filter((n) => n.category === filter);
  }, [filter, userNotifications]);

  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      fee: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
      attendance: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      exam: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
      homework: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      meeting: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      general: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colors[category] || colors.general}`}>
        {category}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => toast.success("All notifications marked as read")}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Mark All Read
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {["all", "unread", "fee", "attendance", "exam", "homework", "meeting", "general"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize whitespace-nowrap"
          >
            {f}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="mb-3 h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm text-muted-foreground">You&apos;re all caught up!</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-colors ${!notification.isRead ? "border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20" : ""}`}
            >
              <CardContent className="flex items-start gap-4 p-4">
                <div className="mt-0.5">{getIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{notification.title}</p>
                    {!notification.isRead && (
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                    )}
                    {getCategoryBadge(notification.category)}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => toast.success("Notification deleted")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
