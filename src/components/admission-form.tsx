"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { School, User, Calendar, Phone, Mail, MapPin, Users as UsersIcon, FileText, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

const admissionSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  grade: z.string().min(1, "Grade is required"),
  address: z.string().min(10, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Zip code is required"),
  parentName: z.string().min(2, "Parent name is required"),
  parentPhone: z.string().min(10, "Parent phone is required"),
  previousSchool: z.string().optional(),
  documents: z.any().optional(),
});

type AdmissionFormData = z.infer<typeof admissionSchema>;

interface AdmissionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const grades = ["Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

export function AdmissionForm({ open, onOpenChange }: AdmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      grade: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      parentName: "",
      parentPhone: "",
      previousSchool: "",
    },
  });

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Admission form submitted!", {
        description: "We will contact you shortly regarding the next steps.",
      });
      reset();
      onOpenChange(false);
    } catch {
      toast.error("Submission failed", {
        description: "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-0 p-0 shadow-2xl shadow-primary/20">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-background via-background to-primary/5 animate-reveal">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-blob delay-1000" />
          <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-2xl animate-float" />
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-primary/10 rounded-full blur-2xl animate-float delay-500" />
          
          <DialogHeader className="relative z-10 p-6 pb-4">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3 animate-slide-down">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 backdrop-blur-sm animate-glow">
                <School className="h-7 w-7 text-primary animate-bounce" />
              </div>
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-gradient-shift">
                Student Admission Form
              </span>
            </DialogTitle>
            <DialogDescription className="mt-2 text-base">
              Please fill in the following details to register your child for admission
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4 px-6">
            <div className="space-y-4 animate-flip-in">
              <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                <User className="h-4 w-4 animate-pulse" />
                Student Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2" style={{ animationDelay: "50ms" }}>
                  <Label htmlFor="firstName" className="transition-colors">
                    First Name *
                  </Label>
                  <div className="relative">
                    <Input
                      id="firstName"
                      placeholder="John"
                      className={`transition-all duration-300 hover:scale-105 ${errors.firstName ? "border-destructive animate-shake" : ""}`}
                      {...register("firstName")}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-xs text-destructive animate-slide-down">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2" style={{ animationDelay: "100ms" }}>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    className={`transition-all duration-300 hover:scale-105 ${errors.lastName ? "border-destructive animate-shake" : ""}`}
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-destructive animate-slide-down">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:text-primary" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@example.com"
                      className={`pl-10 transition-all duration-300 hover:scale-105 ${errors.email ? "border-destructive animate-shake" : ""}`}
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive animate-slide-down">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:text-primary" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className={`pl-10 transition-all duration-300 hover:scale-105 ${errors.phone ? "border-destructive animate-shake" : ""}`}
                      {...register("phone")}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-destructive animate-slide-down">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:text-primary" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      className={`pl-10 transition-all duration-300 hover:scale-105 ${errors.dateOfBirth ? "border-destructive animate-shake" : ""}`}
                      {...register("dateOfBirth")}
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <p className="text-xs text-destructive animate-slide-down">{errors.dateOfBirth.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade Applying For *</Label>
                  <Controller
                    name="grade"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={`transition-all duration-300 hover:scale-105 ${errors.grade ? "border-destructive animate-shake" : ""}`}>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent className="animate-scale-in">
                          {grades.map((g) => (
                            <SelectItem key={g} value={g} className="transition-all duration-200 hover:scale-110">
                              {g}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.grade && (
                    <p className="text-xs text-destructive animate-slide-down">{errors.grade.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4 animate-fade-in delay-200">
              <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                <MapPin className="h-4 w-4 animate-pulse" />
                Address Information
              </h3>
              <div className="space-y-2">
                <Label htmlFor="address">Street Address *</Label>
                <Textarea
                  id="address"
                  placeholder="123 Main Street"
                  className={`transition-all duration-300 hover:scale-105 ${errors.address ? "border-destructive animate-shake" : ""}`}
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-xs text-destructive animate-slide-down">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    className={`transition-all duration-300 hover:scale-105 ${errors.city ? "border-destructive animate-shake" : ""}`}
                    {...register("city")}
                  />
                  {errors.city && (
                    <p className="text-xs text-destructive animate-slide-down">{errors.city.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    placeholder="NY"
                    className={`transition-all duration-300 hover:scale-105 ${errors.state ? "border-destructive animate-shake" : ""}`}
                    {...register("state")}
                  />
                  {errors.state && (
                    <p className="text-xs text-destructive animate-slide-down">{errors.state.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code *</Label>
                  <Input
                    id="zipCode"
                    placeholder="10001"
                    className={`transition-all duration-300 hover:scale-105 ${errors.zipCode ? "border-destructive animate-shake" : ""}`}
                    {...register("zipCode")}
                  />
                  {errors.zipCode && (
                    <p className="text-xs text-destructive animate-slide-down">{errors.zipCode.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4 animate-fade-in delay-300">
              <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                <UsersIcon className="h-4 w-4 animate-pulse" />
                Parent/Guardian Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parentName">Parent Name *</Label>
                  <Input
                    id="parentName"
                    placeholder="Jane Doe"
                    className={`transition-all duration-300 hover:scale-105 ${errors.parentName ? "border-destructive animate-shake" : ""}`}
                    {...register("parentName")}
                  />
                  {errors.parentName && (
                    <p className="text-xs text-destructive animate-slide-down">{errors.parentName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentPhone">Parent Phone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:text-primary" />
                    <Input
                      id="parentPhone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className={`pl-10 transition-all duration-300 hover:scale-105 ${errors.parentPhone ? "border-destructive animate-shake" : ""}`}
                      {...register("parentPhone")}
                    />
                  </div>
                  {errors.parentPhone && (
                    <p className="text-xs text-destructive animate-slide-down">{errors.parentPhone.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="previousSchool">Previous School (if any)</Label>
                <Input
                  id="previousSchool"
                  placeholder="Previous school name"
                  className="transition-all duration-300 hover:scale-105"
                  {...register("previousSchool")}
                />
              </div>
            </div>

            <div className="space-y-4 animate-fade-in delay-500">
              <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                <FileText className="h-4 w-4 animate-pulse" />
                Documents
              </h3>
              <div className="border-2 border-dashed border-muted rounded-xl p-6 text-center hover:border-primary/50 transition-all duration-500 hover:scale-[1.03] hover:bg-primary/5 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3 transition-all duration-500 group-hover:scale-110 group-hover:text-primary animate-pulse" />
                <p className="text-sm text-muted-foreground mb-3 relative z-10">
                  Upload required documents (Birth Certificate, Previous Marksheet, etc.)
                </p>
                <Input
                  id="documents"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="max-w-xs mx-auto transition-all duration-300"
                  {...register("documents")}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 animate-fade-in delay-700">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/30 relative overflow-hidden" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <span className="relative overflow-hidden">
                    Submit Application
                    <span className="absolute inset-0 -translate-x-full hover:translate-x-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}