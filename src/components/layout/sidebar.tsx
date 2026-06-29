"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserPlus,
  DollarSign,
  Calendar,
  Megaphone,
  BarChart3,
  Settings,
  BookOpen,
  ClipboardList,
  FileText,
  Library,
  Bus,
  MessageSquare,
  CalendarDays,
  PieChart,
  Receipt,
  CreditCard,
  Wallet,
  TrendingUp,
  BookMarked,
  RotateCcw,
  AlertTriangle,
  Package,
  ChevronLeft,
  School,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth-store";
import { useSidebarStore } from "@/store/sidebar-store";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { UserRole } from "@/types";

interface NavItemConfig {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  roles: UserRole[];
  section: string;
}

const navigationItems: NavItemConfig[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["admin"], section: "Main" },
  { label: "Users", href: "/admin/users", icon: Users, roles: ["admin"], section: "Main" },
  { label: "Students", href: "/admin/students", icon: GraduationCap, roles: ["admin"], section: "Management" },
  { label: "Staff", href: "/admin/staff", icon: Users, roles: ["admin"], section: "Management" },
  { label: "Admissions", href: "/admin/admissions", icon: UserPlus, roles: ["admin"], badge: 12, section: "Management" },
  { label: "Fees & Finance", href: "/admin/fees", icon: DollarSign, roles: ["admin"], section: "Finance" },
  { label: "Calendar", href: "/admin/calendar", icon: Calendar, roles: ["admin"], section: "Tools" },
  { label: "Announcements", href: "/admin/announcements", icon: Megaphone, roles: ["admin"], section: "Tools" },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3, roles: ["admin"], section: "Tools" },
  { label: "Settings", href: "/admin/settings", icon: Settings, roles: ["admin"], section: "Tools" },
  { label: "Exam Schedule", href: "/admin/exam-schedule", icon: Calendar, roles: ["admin"], section: "Academic" },
  { label: "Notifications", href: "/admin/notifications", icon: Megaphone, roles: ["admin"], section: "Tools" },

  { label: "Dashboard", href: "/teacher", icon: LayoutDashboard, roles: ["teacher"], section: "Main" },
  { label: "My Classes", href: "/teacher/classes", icon: BookOpen, roles: ["teacher"], section: "Teaching" },
  { label: "Attendance", href: "/teacher/attendance", icon: ClipboardList, roles: ["teacher"], section: "Teaching" },
  { label: "Gradebook", href: "/teacher/gradebook", icon: FileText, roles: ["teacher"], section: "Teaching" },
  { label: "Assignments", href: "/teacher/assignments", icon: ClipboardList, roles: ["teacher"], badge: 5, section: "Teaching" },
  { label: "Lesson Plans", href: "/teacher/lesson-plans", icon: BookMarked, roles: ["teacher"], section: "Teaching" },
  { label: "Students", href: "/teacher/students", icon: GraduationCap, roles: ["teacher"], section: "Management" },
  { label: "Messages", href: "/teacher/messaging", icon: MessageSquare, roles: ["teacher"], badge: 3, section: "Communication" },
  { label: "Leave", href: "/teacher/leave", icon: CalendarDays, roles: ["teacher"], section: "Personal" },
  { label: "Homework", href: "/teacher/homework", icon: ClipboardList, roles: ["teacher"], section: "Teaching" },
  { label: "Meetings", href: "/teacher/meetings", icon: CalendarDays, roles: ["teacher"], section: "Communication" },
  { label: "Notifications", href: "/teacher/notifications", icon: Megaphone, roles: ["teacher"], section: "Communication" },

  { label: "Dashboard", href: "/student", icon: LayoutDashboard, roles: ["student"], section: "Main" },
  { label: "Assignments", href: "/student/assignments", icon: ClipboardList, roles: ["student"], badge: 2, section: "Academic" },
  { label: "Results", href: "/student/results", icon: PieChart, roles: ["student"], section: "Academic" },
  { label: "Timetable", href: "/student/timetable", icon: Calendar, roles: ["student"], section: "Academic" },
  { label: "Library", href: "/student/library", icon: Library, roles: ["student"], section: "Services" },
  { label: "Fees", href: "/student/fees", icon: Receipt, roles: ["student"], section: "Finance" },
  { label: "Attendance", href: "/student/attendance", icon: ClipboardList, roles: ["student"], section: "Academic" },
  { label: "Notices", href: "/student/notices", icon: Megaphone, roles: ["student"], section: "Communication" },
  { label: "Homework", href: "/student/homework", icon: ClipboardList, roles: ["student"], section: "Academic" },
  { label: "Notifications", href: "/student/notifications", icon: Megaphone, roles: ["student"], section: "Communication" },

  { label: "Dashboard", href: "/parent", icon: LayoutDashboard, roles: ["parent"], section: "Main" },
  { label: "Children", href: "/parent/children", icon: GraduationCap, roles: ["parent"], section: "Family" },
  { label: "Performance", href: "/parent/performance", icon: TrendingUp, roles: ["parent"], section: "Academic" },
  { label: "Fees", href: "/parent/fees", icon: DollarSign, roles: ["parent"], section: "Finance" },
  { label: "Attendance", href: "/parent/attendance", icon: ClipboardList, roles: ["parent"], section: "Academic" },
  { label: "Messages", href: "/parent/messaging", icon: MessageSquare, roles: ["parent"], badge: 1, section: "Communication" },
  { label: "Calendar", href: "/parent/calendar", icon: Calendar, roles: ["parent"], section: "Tools" },
  { label: "Transport", href: "/parent/transport", icon: Bus, roles: ["parent"], section: "Services" },
  { label: "Meetings", href: "/parent/meetings", icon: CalendarDays, roles: ["parent"], section: "Communication" },
  { label: "Notifications", href: "/parent/notifications", icon: Megaphone, roles: ["parent"], section: "Communication" },

  { label: "Dashboard", href: "/accountant", icon: LayoutDashboard, roles: ["accountant"], section: "Main" },
  { label: "Invoicing", href: "/accountant/invoicing", icon: Receipt, roles: ["accountant"], section: "Finance" },
  { label: "Payments", href: "/accountant/payments", icon: CreditCard, roles: ["accountant"], section: "Finance" },
  { label: "Payroll", href: "/accountant/payroll", icon: Wallet, roles: ["accountant"], section: "Finance" },
  { label: "Expenses", href: "/accountant/expenses", icon: DollarSign, roles: ["accountant"], section: "Finance" },
  { label: "Reports", href: "/accountant/reports", icon: BarChart3, roles: ["accountant"], section: "Reports" },
  { label: "Notifications", href: "/accountant/notifications", icon: Megaphone, roles: ["accountant"], section: "Reports" },

  { label: "Dashboard", href: "/librarian", icon: LayoutDashboard, roles: ["librarian"], section: "Main" },
  { label: "Catalog", href: "/librarian/catalog", icon: BookMarked, roles: ["librarian"], section: "Library" },
  { label: "Issue & Return", href: "/librarian/issue-return", icon: RotateCcw, roles: ["librarian"], badge: 4, section: "Library" },
  { label: "Fines", href: "/librarian/fines", icon: AlertTriangle, roles: ["librarian"], section: "Finance" },
  { label: "Inventory", href: "/librarian/inventory", icon: Package, roles: ["librarian"], section: "Management" },
  { label: "Notifications", href: "/librarian/notifications", icon: Megaphone, roles: ["librarian"], section: "Management" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const { isOpen, isMobileOpen, toggleSidebar, closeMobileSidebar } = useSidebarStore();

  const userRole = user?.role || "admin";
  const filteredItems = navigationItems.filter((item) =>
    item.roles.includes(userRole)
  );

  const sections = filteredItems.reduce<Record<string, NavItemConfig[]>>(
    (acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = [];
      }
      acc[item.section].push(item);
      return acc;
    },
    {}
  );

  const handleNavClick = (href: string) => {
    router.push(href);
    closeMobileSidebar();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <School className="h-4 w-4" />
        </div>
        {isOpen && (
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">EduSync</span>
            <span className="text-[10px] text-muted-foreground leading-none">School Management</span>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 py-3">
        {Object.entries(sections).map(([section, items], idx) => (
          <div key={section}>
            {idx > 0 && <Separator className="my-2" />}
            {isOpen && (
              <p className="px-4 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {section}
              </p>
            )}
            <div className="space-y-0.5 px-2">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== `/${userRole}` && pathname.startsWith(item.href));

                const navButton = (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      !isOpen && "justify-center px-0"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {isOpen && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </button>
                );

                if (!isOpen) {
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>{navButton}</TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return navButton;
              })}
            </div>
          </div>
        ))}
      </ScrollArea>

      {user && isOpen && (
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex h-screen flex-col border-r bg-card transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-16"
        )}
      >
        {sidebarContent}
        <div className="flex items-center justify-center border-t p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                !isOpen && "rotate-180"
              )}
            />
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeMobileSidebar}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
