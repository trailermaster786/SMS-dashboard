export type UserRole = 'admin' | 'teacher' | 'student' | 'parent' | 'accountant' | 'librarian';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
}

export interface Student extends User {
  role: 'student';
  studentId: string;
  classId: string;
  sectionId: string;
  parentId: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  admissionDate: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
}

export interface Teacher extends User {
  role: 'teacher';
  employeeId: string;
  departmentId: string;
  qualification: string;
  specialization: string;
  experience: number;
  salary: number;
  joiningDate: string;
  status: 'active' | 'inactive' | 'on-leave';
}

export interface Parent extends User {
  role: 'parent';
  occupation: string;
  relationship: 'father' | 'mother' | 'guardian';
}

export interface Accountant extends User {
  role: 'accountant';
  employeeId: string;
  department: string;
  joiningDate: string;
  salary: number;
}

export interface Librarian extends User {
  role: 'librarian';
  employeeId: string;
  joiningDate: string;
}

export interface Class {
  id: string;
  name: string;
  grade: number;
  sections: Section[];
  capacity: number;
  createdAt: string;
}

export interface Section {
  id: string;
  name: string;
  classId: string;
  capacity: number;
  classTeacherId: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  classId: string;
  teacherId: string;
  credits: number;
  description: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  sectionId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  markedBy: string;
  remarks?: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  examId: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  remarks?: string;
  createdAt: string;
}

export interface Exam {
  id: string;
  name: string;
  type: 'mid-term' | 'final' | 'quiz' | 'unit-test';
  classId: string;
  startDate: string;
  endDate: string;
  totalMarks: number;
  passingMarks: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface Fee {
  id: string;
  studentId: string;
  feeType: 'tuition' | 'exam' | 'library' | 'transport' | 'lab' | 'activity' | 'other';
  amount: number;
  dueDate: string;
  paidAmount: number;
  status: 'paid' | 'pending' | 'partial' | 'overdue';
  academicYear: string;
  semester?: string;
}

export interface Payment {
  id: string;
  feeId: string;
  studentId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'card' | 'bank-transfer' | 'online' | 'cheque';
  transactionId?: string;
  receiptNumber: string;
  receivedBy: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  publishYear: number;
  edition: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
  status: 'available' | 'limited' | 'unavailable';
}

export interface LibraryIssue {
  id: string;
  bookId: string;
  userId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'issued' | 'returned' | 'overdue';
  fine?: number;
}

export interface Transport {
  id: string;
  routeId: string;
  vehicleNumber: string;
  vehicleType: 'bus' | 'van' | 'car';
  driverName: string;
  driverPhone: string;
  capacity: number;
  status: 'active' | 'inactive' | 'maintenance';
}

export interface Route {
  id: string;
  name: string;
  startPoint: string;
  endPoint: string;
  stops: string[];
  distance: number;
  estimatedTime: number;
  fare: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  subject: string;
  content: string;
  isRead: boolean;
  sentAt: string;
  readAt?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'holiday' | 'event' | 'academic' | 'meeting' | 'urgent' | 'general';
  targetAudience: UserRole[];
  publishedBy: string;
  publishDate: string;
  expiryDate: string;
  isPublished: boolean;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'cultural' | 'academic' | 'meeting' | 'sports' | 'workshop' | 'other';
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  organizer: string;
  targetAudience: UserRole[];
  maxParticipants: number;
  currentParticipants: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  classId: string;
  sectionId: string;
  teacherId: string;
  totalMarks: number;
  dueDate: string;
  status: 'draft' | 'published' | 'graded';
  createdAt: string;
}

export interface Timetable {
  id: string;
  classId: string;
  sectionId: string;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  periods: TimetablePeriod[];
}

export interface TimetablePeriod {
  id: string;
  periodNumber: number;
  subjectId: string;
  teacherId: string;
  startTime: string;
  endTime: string;
  room: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalRevenue: number;
  pendingFees: number;
  attendanceRate: number;
  upcomingEvents: number;
  activeNotices: number;
  libraryBooks: number;
  issuedBooks: number;
  monthlyRevenue: { month: string; amount: number }[];
  studentDistribution: { grade: string; count: number }[];
  attendanceData: { date: string; present: number; absent: number }[];
  feeCollection: { type: string; amount: number }[];
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  type: 'enrollment' | 'payment' | 'exam' | 'attendance' | 'event' | 'notice' | 'library';
  title: string;
  description: string;
  timestamp: string;
  userId?: string;
}

export interface Department {
  id: string;
  name: string;
  headId: string;
  teachers: Teacher[];
}

export interface HomeworkSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  classId: string;
  sectionId: string;
  content: string;
  fileUrl?: string;
  fileName?: string;
  submittedAt: string;
  status: 'submitted' | 'graded' | 'returned';
  marks?: number;
  totalMarks?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: 'teacher' | 'accountant' | 'librarian';
  type: 'sick' | 'casual' | 'personal' | 'vacation' | 'other';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export interface Meeting {
  id: string;
  parentId: string;
  parentName: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  meetingType: 'in-person' | 'online';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  category: 'fee' | 'attendance' | 'exam' | 'homework' | 'meeting' | 'general';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface ExamSchedule {
  id: string;
  examId: string;
  subjectId: string;
  classId: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  totalMarks: number;
  passingMarks: number;
  instructions?: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  roles: UserRole[];
  section?: string;
}
