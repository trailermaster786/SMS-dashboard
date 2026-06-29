"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  School,
  ArrowRight,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  BarChart3,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdmissionForm } from "@/components/admission-form";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useAuthStore } from "@/store/auth-store";

const features = [
  {
    icon: Users,
    title: "User Management",
    description: "Manage students, teachers, staff, and parents with role-based access control.",
  },
  {
    icon: GraduationCap,
    title: "Student Tracking",
    description: "Track attendance, grades, and academic progress in real-time.",
  },
  {
    icon: BookOpen,
    title: "Library System",
    description: "Catalog management, issue tracking, and digital resource organization.",
  },
  {
    icon: Calendar,
    title: "Calendar & Events",
    description: "Schedule classes, exams, events, and manage academic calendars.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Comprehensive reports and analytics for data-driven decisions.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with encrypted data and regular backups.",
  },
];

const stats = [
  { value: "2,500+", label: "Students" },
  { value: "150+", label: "Staff Members" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Support" },
];

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [admissionOpen, setAdmissionOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push(`/${user.role}`);
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/10 rounded-full blur-2xl animate-pulse-scale" />
      </div>

      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 animate-slide-down">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground animate-pulse-scale">
              <School className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent animate-gradient-shift">
              EduSync
            </span>
          </div>
          <div className="flex items-center gap-3 animate-fade-in delay-100">
            <ThemeToggle />
            <LanguageToggle />
            <Button 
              variant="ghost" 
              onClick={() => setAdmissionOpen(true)}
              className="transition-all duration-300 hover:scale-105 hover:bg-primary/10"
            >
              Registration
            </Button>
            <Button 
              asChild 
              className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
            >
              <Link href="/login">
                Get Started
                <ArrowRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/20" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob delay-1000" />
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-primary/15 rounded-full blur-2xl animate-float" style={{ animationDuration: "6s" }} />
        </div>
        
        {/* Cherry Blossom Background Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 dark:opacity-10">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 bg-pink-300 dark:bg-pink-200 rounded-full animate-float"
              style={{
                left: `${(i * 3.3) % 100}%`,
                top: `${(i * 7) % 100}%`,
                animationDuration: `${4 + (i % 3) * 2}s`,
                animationDelay: `${i * 0.1}s`,
                opacity: 0.3 + (i % 5) * 0.1,
                boxShadow: '0 0 10px rgba(236, 72, 153, 0.5)',
              }}
            />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`petal-${i}`}
              className="absolute w-6 h-6 bg-pink-200 dark:bg-pink-100/50 rounded-full animate-float"
              style={{
                left: `${(i * 5) % 100}%`,
                top: `${(i * 8) % 100}%`,
                animationDuration: `${5 + (i % 4) * 3}s`,
                animationDelay: `${i * 0.15}s`,
                opacity: 0.2 + (i % 4) * 0.15,
                boxShadow: '0 0 15px rgba(236, 72, 153, 0.3)',
              }}
            />
          ))}
        </div>
        
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 relative">
          <div className="mx-auto max-w-3xl text-center">
            <div 
              className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm animate-slide-down"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Now serving 50+ schools nationwide
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              <span className="inline-block animate-flip-in">Modern School</span>{" "}
              <span className="text-primary inline-block animate-flip-in delay-100">Management</span>{" "}
              <span className="inline-block animate-flip-in delay-200">System</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto animate-fade-in delay-300">
              EduSync is a comprehensive platform that streamlines school operations,
              from student enrollment to financial reporting. Empower your educators,
              engage parents, and enhance student outcomes.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4 animate-fade-in delay-500">
              <Button 
                size="lg" 
                asChild
                className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
              >
                <Link href="/login">
                  <span className="relative overflow-hidden">
                    Start Free Trial
                    <span className="absolute inset-0 -translate-x-full hover:translate-x-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700" />
                  </span>
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                asChild
                className="transition-all duration-300 hover:scale-105"
              >
                <Link href="/login">View Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30 relative py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <p className="text-3xl font-bold text-primary animate-slide-down">
                  {stat.value.split("").map((char, i) => (
                    <span 
                      key={i} 
                      className="inline-block animate-scale-in"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      {char}
                    </span>
                  ))}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-4 h-4 bg-primary rounded-full animate-float" style={{ animationDuration: "4s" }} />
          <div className="absolute top-20 right-20 w-3 h-3 bg-primary rounded-full animate-float" style={{ animationDuration: "5s", animationDelay: "0.5s" }} />
          <div className="absolute bottom-20 left-20 w-5 h-5 bg-primary rounded-full animate-float" style={{ animationDuration: "6s", animationDelay: "1s" }} />
          <div className="absolute bottom-40 right-40 w-3 h-3 bg-primary rounded-full animate-float" style={{ animationDuration: "4.5s", animationDelay: "1.5s" }} />
          <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-primary rounded-full animate-float" style={{ animationDuration: "5.5s", animationDelay: "2s" }} />
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-primary rounded-full animate-float" style={{ animationDuration: "4s", animationDelay: "2.5s" }} />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="mx-auto max-w-2xl text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to manage your school
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A complete suite of tools designed to simplify school administration
              and improve educational outcomes.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 animate-pulse-scale">
                      <Icon className="h-6 w-6 transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl animate-fade-in">
              Ready to transform your school?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground animate-fade-in delay-200">
              Join thousands of schools that trust EduSync for their daily operations.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 animate-fade-in delay-300">
              <Button 
                size="lg" 
                onClick={() => setAdmissionOpen(true)}
                className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
              >
                <span className="relative overflow-hidden">
                  Get Started Now
                  <span className="absolute inset-0 -translate-x-full hover:translate-x-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700" />
                </span>
                <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {["Free 30-day trial", "No credit card required", "Cancel anytime"].map((text, i) => (
                  <div 
                    key={text} 
                    className="flex items-center gap-1 animate-fade-in"
                    style={{ animationDelay: `${400 + i * 100}ms` }}
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 animate-pulse" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 animate-fade-in">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <School className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
              </div>
              <span className="font-semibold">EduSync</span>
            </div>
            <p className="text-sm text-muted-foreground animate-fade-in delay-100">
              &copy; {new Date().getFullYear()} EduSync. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <AdmissionForm open={admissionOpen} onOpenChange={setAdmissionOpen} />
    </div>
  );
}