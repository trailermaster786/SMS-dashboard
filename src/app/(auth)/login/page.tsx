"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { School, Loader2 } from "lucide-react";
import { AuthFormSplitScreen } from "@/components/ui/login";
import { AdmissionForm } from "@/components/admission-form";
import { useAuthStore, getMockUser } from "@/store/auth-store";
import { toast } from "sonner";
import type { UserRole } from "@/types";

const demoRoles: Array<{ role: UserRole; label: string; color: string }> = [
  { role: "admin", label: "Admin", color: "bg-blue-500 hover:bg-blue-600" },
  { role: "teacher", label: "Teacher", color: "bg-emerald-500 hover:bg-emerald-600" },
  { role: "student", label: "Student", color: "bg-violet-500 hover:bg-violet-600" },
  { role: "parent", label: "Parent", color: "bg-amber-500 hover:bg-amber-600" },
  { role: "accountant", label: "Accountant", color: "bg-rose-500 hover:bg-rose-600" },
  { role: "librarian", label: "Librarian", color: "bg-cyan-500 hover:bg-cyan-600" },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, setLoading, isLoading } = useAuthStore();
  const [admissionOpen, setAdmissionOpen] = useState(false);

  const handleLogin = async (data: { email: string; password: string; rememberMe?: boolean }) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const { allUsers } = await import("@/lib/mock-data");
      const emailLower = data.email.toLowerCase();
      const foundUser = allUsers.find((u) => u.email.toLowerCase() === emailLower);
      const mockUser = foundUser || getMockUser("admin");
      login(mockUser);
      toast.success("Welcome back!", {
        description: `Logged in as ${mockUser.name}`,
      });
      router.push(`/${mockUser.role}`);
    } catch {
      toast.error("Login failed", {
        description: "Invalid email or password",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockUser = getMockUser(role);
      login(mockUser);
      toast.success("Demo login successful!", {
        description: `Logged in as ${mockUser.name} (${role})`,
      });
      router.push(`/${role}`);
    } catch {
      toast.error("Login failed", {
        description: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthFormSplitScreen
        logo={
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <School className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">EduSync</span>
          </div>
        }
        title="Welcome back"
        description="Sign in to your account to continue"
        imageSrc="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        imageAlt="Beautiful mountain landscape"
        onSubmit={handleLogin}
        forgotPasswordHref="/forgot-password"
        onRegisterClick={() => setAdmissionOpen(true)}
        demoRoles={demoRoles.map(({ role, label, color }) => ({
          role,
          label,
          color,
          onClick: () => handleDemoLogin(role),
        }))}
      />
      
      <AdmissionForm open={admissionOpen} onOpenChange={setAdmissionOpen} />
    </>
  );
}