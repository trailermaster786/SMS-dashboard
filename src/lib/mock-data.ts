import type {
  User,
  Student,
  Teacher,
  Parent,
  Accountant,
  Librarian,
  Class,
  Section,
  Subject,
  Attendance,
  Grade,
  Exam,
  Fee,
  Payment,
  LibraryBook,
  LibraryIssue,
  Transport,
  Route,
  Message,
  Notice,
  Event,
  Assignment,
  Timetable,
  DashboardStats,
  Activity,
  Department,
  HomeworkSubmission,
  LeaveRequest,
  Meeting,
  Notification,
  ExamSchedule,
} from '@/types'

export const adminUser: User = {
  id: 'usr-admin-001',
  name: 'Dr. James Mitchell',
  email: 'admin@greenfieldacademy.edu',
  role: 'admin',
  avatar: '/avatars/admin.jpg',
  phone: '+1-555-0100',
  address: '1200 University Blvd, Springfield, IL 62701',
  createdAt: '2020-01-15T08:00:00Z',
}

export const teachers: Teacher[] = [
  {
    id: 'usr-teacher-001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@greenfieldacademy.edu',
    role: 'teacher',
    avatar: '/avatars/teacher1.jpg',
    phone: '+1-555-0101',
    address: '45 Oak Lane, Springfield, IL 62702',
    createdAt: '2019-08-01T08:00:00Z',
    employeeId: 'TCH-2019-001',
    departmentId: 'dept-math',
    qualification: 'M.Sc. Mathematics',
    specialization: 'Algebra & Calculus',
    experience: 8,
    salary: 55000,
    joiningDate: '2019-08-01',
    status: 'active',
  },
  {
    id: 'usr-teacher-002',
    name: 'Michael Chen',
    email: 'michael.chen@greenfieldacademy.edu',
    role: 'teacher',
    avatar: '/avatars/teacher2.jpg',
    phone: '+1-555-0102',
    address: '78 Pine Street, Springfield, IL 62703',
    createdAt: '2020-01-10T08:00:00Z',
    employeeId: 'TCH-2020-002',
    departmentId: 'dept-science',
    qualification: 'Ph.D. Physics',
    specialization: 'Quantum Mechanics',
    experience: 6,
    salary: 58000,
    joiningDate: '2020-01-10',
    status: 'active',
  },
  {
    id: 'usr-teacher-003',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@greenfieldacademy.edu',
    role: 'teacher',
    avatar: '/avatars/teacher3.jpg',
    phone: '+1-555-0103',
    address: '234 Maple Avenue, Springfield, IL 62704',
    createdAt: '2021-06-15T08:00:00Z',
    employeeId: 'TCH-2021-003',
    departmentId: 'dept-english',
    qualification: 'M.A. English Literature',
    specialization: 'Creative Writing',
    experience: 5,
    salary: 52000,
    joiningDate: '2021-06-15',
    status: 'active',
  },
  {
    id: 'usr-teacher-004',
    name: 'David Kim',
    email: 'david.kim@greenfieldacademy.edu',
    role: 'teacher',
    avatar: '/avatars/teacher4.jpg',
    phone: '+1-555-0104',
    address: '56 Cedar Road, Springfield, IL 62705',
    createdAt: '2018-03-20T08:00:00Z',
    employeeId: 'TCH-2018-004',
    departmentId: 'dept-history',
    qualification: 'M.A. History',
    specialization: 'World History',
    experience: 10,
    salary: 60000,
    joiningDate: '2018-03-20',
    status: 'active',
  },
]

export const parents: Parent[] = [
  {
    id: 'usr-parent-001',
    name: 'Robert Williams',
    email: 'robert.williams@email.com',
    role: 'parent',
    avatar: '/avatars/parent1.jpg',
    phone: '+1-555-0201',
    address: '100 Elm Street, Springfield, IL 62710',
    createdAt: '2023-09-01T08:00:00Z',
    occupation: 'Software Engineer',
    relationship: 'father',
  },
  {
    id: 'usr-parent-002',
    name: 'Jennifer Davis',
    email: 'jennifer.davis@email.com',
    role: 'parent',
    avatar: '/avatars/parent2.jpg',
    phone: '+1-555-0202',
    address: '200 Birch Lane, Springfield, IL 62711',
    createdAt: '2023-09-01T08:00:00Z',
    occupation: 'Doctor',
    relationship: 'mother',
  },
  {
    id: 'usr-parent-003',
    name: 'Thomas Brown',
    email: 'thomas.brown@email.com',
    role: 'parent',
    avatar: '/avatars/parent3.jpg',
    phone: '+1-555-0203',
    address: '300 Walnut Drive, Springfield, IL 62712',
    createdAt: '2023-09-05T08:00:00Z',
    occupation: 'Lawyer',
    relationship: 'father',
  },
  {
    id: 'usr-parent-004',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    role: 'parent',
    avatar: '/avatars/parent4.jpg',
    phone: '+1-555-0204',
    address: '400 Cherry Court, Springfield, IL 62713',
    createdAt: '2024-01-10T08:00:00Z',
    occupation: 'Accountant',
    relationship: 'mother',
  },
]

export const accountantUser: Accountant = {
  id: 'usr-accountant-001',
  name: 'Patricia Moore',
  email: 'patricia.moore@greenfieldacademy.edu',
  role: 'accountant',
  avatar: '/avatars/accountant.jpg',
  phone: '+1-555-0105',
  address: '500 Spruce Way, Springfield, IL 62706',
  createdAt: '2021-04-01T08:00:00Z',
  employeeId: 'ACC-2021-001',
  department: 'Finance',
  joiningDate: '2021-04-01',
  salary: 48000,
}

export const librarianUser: Librarian = {
  id: 'usr-librarian-001',
  name: 'Andrew Taylor',
  email: 'andrew.taylor@greenfieldacademy.edu',
  role: 'librarian',
  avatar: '/avatars/librarian.jpg',
  phone: '+1-555-0106',
  address: '600 Ash Boulevard, Springfield, IL 62707',
  createdAt: '2020-07-01T08:00:00Z',
  employeeId: 'LIB-2020-001',
  joiningDate: '2020-07-01',
}

export const students: Student[] = [
  {
    id: 'usr-student-001',
    name: 'Alex Williams',
    email: 'alex.williams@student.greenfieldacademy.edu',
    role: 'student',
    avatar: '/avatars/student1.jpg',
    phone: '+1-555-0301',
    createdAt: '2024-09-01T08:00:00Z',
    studentId: 'STU-2024-001',
    classId: 'cls-grade10',
    sectionId: 'sec-10a',
    parentId: 'usr-parent-001',
    dateOfBirth: '2010-03-15',
    gender: 'male',
    bloodGroup: 'O+',
    admissionDate: '2024-09-01',
    status: 'active',
  },
  {
    id: 'usr-student-002',
    name: 'Sophia Davis',
    email: 'sophia.davis@student.greenfieldacademy.edu',
    role: 'student',
    avatar: '/avatars/student2.jpg',
    phone: '+1-555-0302',
    createdAt: '2024-09-01T08:00:00Z',
    studentId: 'STU-2024-002',
    classId: 'cls-grade10',
    sectionId: 'sec-10a',
    parentId: 'usr-parent-002',
    dateOfBirth: '2010-07-22',
    gender: 'female',
    bloodGroup: 'A+',
    admissionDate: '2024-09-01',
    status: 'active',
  },
  {
    id: 'usr-student-003',
    name: 'Liam Brown',
    email: 'liam.brown@student.greenfieldacademy.edu',
    role: 'student',
    avatar: '/avatars/student3.jpg',
    phone: '+1-555-0303',
    createdAt: '2024-09-01T08:00:00Z',
    studentId: 'STU-2024-003',
    classId: 'cls-grade10',
    sectionId: 'sec-10b',
    parentId: 'usr-parent-003',
    dateOfBirth: '2010-11-08',
    gender: 'male',
    bloodGroup: 'B+',
    admissionDate: '2024-09-01',
    status: 'active',
  },
  {
    id: 'usr-student-004',
    name: 'Olivia Garcia',
    email: 'olivia.garcia@student.greenfieldacademy.edu',
    role: 'student',
    avatar: '/avatars/student4.jpg',
    phone: '+1-555-0304',
    createdAt: '2024-09-01T08:00:00Z',
    studentId: 'STU-2024-004',
    classId: 'cls-grade11',
    sectionId: 'sec-11a',
    parentId: 'usr-parent-004',
    dateOfBirth: '2009-05-30',
    gender: 'female',
    bloodGroup: 'AB+',
    admissionDate: '2023-09-01',
    status: 'active',
  },
  {
    id: 'usr-student-005',
    name: 'Noah Martinez',
    email: 'noah.martinez@student.greenfieldacademy.edu',
    role: 'student',
    avatar: '/avatars/student5.jpg',
    phone: '+1-555-0305',
    createdAt: '2024-09-01T08:00:00Z',
    studentId: 'STU-2024-005',
    classId: 'cls-grade11',
    sectionId: 'sec-11a',
    parentId: 'usr-parent-001',
    dateOfBirth: '2009-09-12',
    gender: 'male',
    bloodGroup: 'O-',
    admissionDate: '2023-09-01',
    status: 'active',
  },
  {
    id: 'usr-student-006',
    name: 'Ava Anderson',
    email: 'ava.anderson@student.greenfieldacademy.edu',
    role: 'student',
    avatar: '/avatars/student6.jpg',
    phone: '+1-555-0306',
    createdAt: '2024-09-01T08:00:00Z',
    studentId: 'STU-2024-006',
    classId: 'cls-grade12',
    sectionId: 'sec-12a',
    parentId: 'usr-parent-002',
    dateOfBirth: '2008-01-18',
    gender: 'female',
    bloodGroup: 'A-',
    admissionDate: '2022-09-01',
    status: 'active',
  },
  {
    id: 'usr-student-007',
    name: 'Ethan Thomas',
    email: 'ethan.thomas@student.greenfieldacademy.edu',
    role: 'student',
    avatar: '/avatars/student7.jpg',
    phone: '+1-555-0307',
    createdAt: '2024-09-01T08:00:00Z',
    studentId: 'STU-2024-007',
    classId: 'cls-grade9',
    sectionId: 'sec-9a',
    parentId: 'usr-parent-003',
    dateOfBirth: '2011-04-25',
    gender: 'male',
    bloodGroup: 'B-',
    admissionDate: '2024-09-01',
    status: 'active',
  },
  {
    id: 'usr-student-008',
    name: 'Isabella Jackson',
    email: 'isabella.jackson@student.greenfieldacademy.edu',
    role: 'student',
    avatar: '/avatars/student8.jpg',
    phone: '+1-555-0308',
    createdAt: '2024-09-01T08:00:00Z',
    studentId: 'STU-2024-008',
    classId: 'cls-grade9',
    sectionId: 'sec-9b',
    parentId: 'usr-parent-004',
    dateOfBirth: '2011-08-03',
    gender: 'female',
    bloodGroup: 'O+',
    admissionDate: '2024-09-01',
    status: 'active',
  },
  {
    id: 'usr-student-009',
    name: 'Mason White',
    email: 'mason.white@student.greenfieldacademy.edu',
    role: 'student',
    avatar: '/avatars/student9.jpg',
    phone: '+1-555-0309',
    createdAt: '2023-09-01T08:00:00Z',
    studentId: 'STU-2023-009',
    classId: 'cls-grade8',
    sectionId: 'sec-8a',
    parentId: 'usr-parent-001',
    dateOfBirth: '2012-12-10',
    gender: 'male',
    bloodGroup: 'A+',
    admissionDate: '2023-09-01',
    status: 'active',
  },
  {
    id: 'usr-student-010',
    name: 'Mia Harris',
    email: 'mia.harris@student.greenfieldacademy.edu',
    role: 'student',
    avatar: '/avatars/student10.jpg',
    phone: '+1-555-0310',
    createdAt: '2023-09-01T08:00:00Z',
    studentId: 'STU-2023-010',
    classId: 'cls-grade8',
    sectionId: 'sec-8b',
    parentId: 'usr-parent-002',
    dateOfBirth: '2012-06-28',
    gender: 'female',
    bloodGroup: 'B+',
    admissionDate: '2023-09-01',
    status: 'active',
  },
]

export const departments: Department[] = [
  { id: 'dept-math', name: 'Mathematics', headId: 'usr-teacher-001', teachers: [teachers[0]] },
  { id: 'dept-science', name: 'Science', headId: 'usr-teacher-002', teachers: [teachers[1]] },
  { id: 'dept-english', name: 'English', headId: 'usr-teacher-003', teachers: [teachers[2]] },
  { id: 'dept-history', name: 'History', headId: 'usr-teacher-004', teachers: [teachers[3]] },
]

export const sections: Section[] = [
  { id: 'sec-9a', name: 'A', classId: 'cls-grade9', capacity: 40, classTeacherId: 'usr-teacher-001' },
  { id: 'sec-9b', name: 'B', classId: 'cls-grade9', capacity: 40, classTeacherId: 'usr-teacher-002' },
  { id: 'sec-10a', name: 'A', classId: 'cls-grade10', capacity: 40, classTeacherId: 'usr-teacher-003' },
  { id: 'sec-10b', name: 'B', classId: 'cls-grade10', capacity: 40, classTeacherId: 'usr-teacher-004' },
  { id: 'sec-11a', name: 'A', classId: 'cls-grade11', capacity: 35, classTeacherId: 'usr-teacher-001' },
  { id: 'sec-11b', name: 'B', classId: 'cls-grade11', capacity: 35, classTeacherId: 'usr-teacher-002' },
  { id: 'sec-12a', name: 'A', classId: 'cls-grade12', capacity: 35, classTeacherId: 'usr-teacher-003' },
  { id: 'sec-12b', name: 'B', classId: 'cls-grade12', capacity: 35, classTeacherId: 'usr-teacher-004' },
]

export const classes: Class[] = [
  { id: 'cls-grade1', name: 'Grade 1', grade: 1, sections: [sections[0]], capacity: 80, createdAt: '2020-01-01T08:00:00Z' },
  { id: 'cls-grade2', name: 'Grade 2', grade: 2, sections: [sections[1]], capacity: 80, createdAt: '2020-01-01T08:00:00Z' },
  { id: 'cls-grade3', name: 'Grade 3', grade: 3, sections: [], capacity: 80, createdAt: '2020-01-01T08:00:00Z' },
  { id: 'cls-grade4', name: 'Grade 4', grade: 4, sections: [], capacity: 80, createdAt: '2020-01-01T08:00:00Z' },
  { id: 'cls-grade5', name: 'Grade 5', grade: 5, sections: [], capacity: 80, createdAt: '2020-01-01T08:00:00Z' },
  { id: 'cls-grade6', name: 'Grade 6', grade: 6, sections: [], capacity: 80, createdAt: '2020-01-01T08:00:00Z' },
  { id: 'cls-grade7', name: 'Grade 7', grade: 7, sections: [], capacity: 80, createdAt: '2020-01-01T08:00:00Z' },
  { id: 'cls-grade8', name: 'Grade 8', grade: 8, sections: [sections[0], sections[1]], capacity: 80, createdAt: '2020-01-01T08:00:00Z' },
  { id: 'cls-grade9', name: 'Grade 9', grade: 9, sections: [sections[0], sections[1]], capacity: 80, createdAt: '2020-01-01T08:00:00Z' },
  { id: 'cls-grade10', name: 'Grade 10', grade: 10, sections: [sections[2], sections[3]], capacity: 80, createdAt: '2020-01-01T08:00:00Z' },
  { id: 'cls-grade11', name: 'Grade 11', grade: 11, sections: [sections[4], sections[5]], capacity: 70, createdAt: '2020-01-01T08:00:00Z' },
  { id: 'cls-grade12', name: 'Grade 12', grade: 12, sections: [sections[6], sections[7]], capacity: 70, createdAt: '2020-01-01T08:00:00Z' },
]

export const subjects: Subject[] = [
  { id: 'sub-math-10', name: 'Mathematics', code: 'MATH10', classId: 'cls-grade10', teacherId: 'usr-teacher-001', credits: 4, description: 'Advanced algebra, geometry, and trigonometry' },
  { id: 'sub-phys-10', name: 'Physics', code: 'PHY10', classId: 'cls-grade10', teacherId: 'usr-teacher-002', credits: 3, description: 'Mechanics, thermodynamics, and waves' },
  { id: 'sub-eng-10', name: 'English', code: 'ENG10', classId: 'cls-grade10', teacherId: 'usr-teacher-003', credits: 3, description: 'Literature and composition' },
  { id: 'sub-hist-10', name: 'History', code: 'HIS10', classId: 'cls-grade10', teacherId: 'usr-teacher-004', credits: 2, description: 'World History: Modern Era' },
  { id: 'sub-chem-10', name: 'Chemistry', code: 'CHEM10', classId: 'cls-grade10', teacherId: 'usr-teacher-002', credits: 3, description: 'Basic chemistry principles' },
  { id: 'sub-bio-10', name: 'Biology', code: 'BIO10', classId: 'cls-grade10', teacherId: 'usr-teacher-002', credits: 3, description: 'Cell biology and genetics' },
  { id: 'sub-math-11', name: 'Mathematics', code: 'MATH11', classId: 'cls-grade11', teacherId: 'usr-teacher-001', credits: 4, description: 'Calculus and statistics' },
  { id: 'sub-phys-11', name: 'Physics', code: 'PHY11', classId: 'cls-grade11', teacherId: 'usr-teacher-002', credits: 3, description: 'Advanced physics concepts' },
  { id: 'sub-eng-11', name: 'English', code: 'ENG11', classId: 'cls-grade11', teacherId: 'usr-teacher-003', credits: 3, description: 'Advanced literature analysis' },
  { id: 'sub-math-12', name: 'Mathematics', code: 'MATH12', classId: 'cls-grade12', teacherId: 'usr-teacher-001', credits: 4, description: 'Advanced calculus and linear algebra' },
  { id: 'sub-phys-12', name: 'Physics', code: 'PHY12', classId: 'cls-grade12', teacherId: 'usr-teacher-002', credits: 4, description: 'University-level physics' },
  { id: 'sub-eng-12', name: 'English', code: 'ENG12', classId: 'cls-grade12', teacherId: 'usr-teacher-003', credits: 3, description: 'College-prep English' },
  { id: 'sub-math-9', name: 'Mathematics', code: 'MATH9', classId: 'cls-grade9', teacherId: 'usr-teacher-001', credits: 4, description: 'Algebra I' },
  { id: 'sub-science-9', name: 'General Science', code: 'SCI9', classId: 'cls-grade9', teacherId: 'usr-teacher-002', credits: 3, description: 'Foundational science' },
  { id: 'sub-eng-9', name: 'English', code: 'ENG9', classId: 'cls-grade9', teacherId: 'usr-teacher-003', credits: 3, description: 'English fundamentals' },
]

function generateAttendanceHistory(): Attendance[] {
  const attendance: Attendance[] = []
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dayOfWeek = date.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) continue
    const dateStr = date.toISOString().split('T')[0]
    students.forEach((student) => {
      const rand = Math.random()
      let status: 'present' | 'absent' | 'late' | 'excused'
      if (rand < 0.85) status = 'present'
      else if (rand < 0.92) status = 'late'
      else if (rand < 0.97) status = 'absent'
      else status = 'excused'
      attendance.push({
        id: `att-${student.id}-${dateStr}`,
        studentId: student.id,
        classId: student.classId,
        sectionId: student.sectionId,
        date: dateStr,
        status,
        markedBy: teachers[0].id,
      })
    })
  }
  return attendance
}

export const attendanceRecords: Attendance[] = generateAttendanceHistory()

export const exams: Exam[] = [
  { id: 'exam-mid-10', name: 'Mid-Term Examination', type: 'mid-term', classId: 'cls-grade10', startDate: '2025-10-15', endDate: '2025-10-25', totalMarks: 100, passingMarks: 40, status: 'completed' },
  { id: 'exam-final-10', name: 'Final Examination', type: 'final', classId: 'cls-grade10', startDate: '2026-03-10', endDate: '2026-03-25', totalMarks: 100, passingMarks: 40, status: 'completed' },
  { id: 'exam-quiz-10-1', name: 'Weekly Quiz - Week 5', type: 'quiz', classId: 'cls-grade10', startDate: '2026-02-05', endDate: '2026-02-05', totalMarks: 20, passingMarks: 8, status: 'completed' },
  { id: 'exam-mid-11', name: 'Mid-Term Examination', type: 'mid-term', classId: 'cls-grade11', startDate: '2025-10-15', endDate: '2025-10-25', totalMarks: 100, passingMarks: 40, status: 'completed' },
  { id: 'exam-final-11', name: 'Final Examination', type: 'final', classId: 'cls-grade11', startDate: '2026-03-10', endDate: '2026-03-25', totalMarks: 100, passingMarks: 40, status: 'completed' },
  { id: 'exam-mid-12', name: 'Mid-Term Examination', type: 'mid-term', classId: 'cls-grade12', startDate: '2025-10-15', endDate: '2025-10-25', totalMarks: 100, passingMarks: 40, status: 'completed' },
  { id: 'exam-mid-9', name: 'Mid-Term Examination', type: 'mid-term', classId: 'cls-grade9', startDate: '2025-10-15', endDate: '2025-10-25', totalMarks: 100, passingMarks: 40, status: 'completed' },
  { id: 'exam-quiz-10-2', name: 'Weekly Quiz - Week 10', type: 'quiz', classId: 'cls-grade10', startDate: '2026-04-10', endDate: '2026-04-10', totalMarks: 20, passingMarks: 8, status: 'completed' },
  { id: 'exam-upcoming-10', name: 'Annual Examination', type: 'final', classId: 'cls-grade10', startDate: '2026-06-01', endDate: '2026-06-15', totalMarks: 100, passingMarks: 40, status: 'upcoming' },
]

function generateGrades(): Grade[] {
  const grades: Grade[] = []
  const completedExams = exams.filter((e) => e.status === 'completed')
  const grade10Students = students.filter((s) => s.classId === 'cls-grade10')
  const grade11Students = students.filter((s) => s.classId === 'cls-grade11')
  const grade12Students = students.filter((s) => s.classId === 'cls-grade12')

  completedExams.forEach((exam) => {
    let examStudents: Student[]
    if (exam.classId === 'cls-grade10') examStudents = grade10Students
    else if (exam.classId === 'cls-grade11') examStudents = grade11Students
    else examStudents = grade12Students

    const examSubjects = subjects.filter((s) => s.classId === exam.classId)

    examSubjects.forEach((subject) => {
      examStudents.forEach((student) => {
        const marksObtained = Math.floor(Math.random() * 40) + 60
        const percentage = (marksObtained / exam.totalMarks) * 100
        const letterGrade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B+' : percentage >= 60 ? 'B' : percentage >= 50 ? 'C+' : percentage >= 40 ? 'C' : 'F'
        grades.push({
          id: `grade-${student.id}-${subject.id}-${exam.id}`,
          studentId: student.id,
          subjectId: subject.id,
          examId: exam.id,
          marksObtained,
          totalMarks: exam.totalMarks,
          percentage,
          grade: letterGrade,
          remarks: percentage >= 80 ? 'Excellent performance' : percentage >= 60 ? 'Good work' : 'Needs improvement',
          createdAt: exam.endDate,
        })
      })
    })
  })
  return grades
}

export const grades: Grade[] = generateGrades()

export const fees: Fee[] = [
  { id: 'fee-001', studentId: 'usr-student-001', feeType: 'tuition', amount: 15000, dueDate: '2026-01-15', paidAmount: 15000, status: 'paid', academicYear: '2025-2026', semester: 'Fall' },
  { id: 'fee-002', studentId: 'usr-student-001', feeType: 'tuition', amount: 15000, dueDate: '2026-07-15', paidAmount: 7500, status: 'partial', academicYear: '2025-2026', semester: 'Spring' },
  { id: 'fee-003', studentId: 'usr-student-001', feeType: 'exam', amount: 500, dueDate: '2026-03-01', paidAmount: 500, status: 'paid', academicYear: '2025-2026' },
  { id: 'fee-004', studentId: 'usr-student-001', feeType: 'library', amount: 200, dueDate: '2026-01-15', paidAmount: 200, status: 'paid', academicYear: '2025-2026' },
  { id: 'fee-005', studentId: 'usr-student-001', feeType: 'transport', amount: 3000, dueDate: '2026-01-15', paidAmount: 3000, status: 'paid', academicYear: '2025-2026', semester: 'Fall' },
  { id: 'fee-006', studentId: 'usr-student-002', feeType: 'tuition', amount: 15000, dueDate: '2026-01-15', paidAmount: 15000, status: 'paid', academicYear: '2025-2026', semester: 'Fall' },
  { id: 'fee-007', studentId: 'usr-student-002', feeType: 'tuition', amount: 15000, dueDate: '2026-07-15', paidAmount: 0, status: 'pending', academicYear: '2025-2026', semester: 'Spring' },
  { id: 'fee-008', studentId: 'usr-student-002', feeType: 'exam', amount: 500, dueDate: '2026-03-01', paidAmount: 500, status: 'paid', academicYear: '2025-2026' },
  { id: 'fee-009', studentId: 'usr-student-003', feeType: 'tuition', amount: 15000, dueDate: '2026-01-15', paidAmount: 10000, status: 'partial', academicYear: '2025-2026', semester: 'Fall' },
  { id: 'fee-010', studentId: 'usr-student-003', feeType: 'tuition', amount: 15000, dueDate: '2026-07-15', paidAmount: 0, status: 'overdue', academicYear: '2025-2026', semester: 'Spring' },
  { id: 'fee-011', studentId: 'usr-student-003', feeType: 'exam', amount: 500, dueDate: '2026-03-01', paidAmount: 0, status: 'pending', academicYear: '2025-2026' },
  { id: 'fee-012', studentId: 'usr-student-004', feeType: 'tuition', amount: 16000, dueDate: '2026-01-15', paidAmount: 16000, status: 'paid', academicYear: '2025-2026', semester: 'Fall' },
  { id: 'fee-013', studentId: 'usr-student-004', feeType: 'tuition', amount: 16000, dueDate: '2026-07-15', paidAmount: 16000, status: 'paid', academicYear: '2025-2026', semester: 'Spring' },
  { id: 'fee-014', studentId: 'usr-student-005', feeType: 'tuition', amount: 16000, dueDate: '2026-01-15', paidAmount: 16000, status: 'paid', academicYear: '2025-2026', semester: 'Fall' },
  { id: 'fee-015', studentId: 'usr-student-005', feeType: 'transport', amount: 3200, dueDate: '2026-01-15', paidAmount: 3200, status: 'paid', academicYear: '2025-2026', semester: 'Fall' },
  { id: 'fee-016', studentId: 'usr-student-006', feeType: 'tuition', amount: 17000, dueDate: '2026-01-15', paidAmount: 17000, status: 'paid', academicYear: '2025-2026', semester: 'Fall' },
  { id: 'fee-017', studentId: 'usr-student-007', feeType: 'tuition', amount: 14000, dueDate: '2026-01-15', paidAmount: 14000, status: 'paid', academicYear: '2025-2026', semester: 'Fall' },
  { id: 'fee-018', studentId: 'usr-student-008', feeType: 'tuition', amount: 14000, dueDate: '2026-01-15', paidAmount: 7000, status: 'partial', academicYear: '2025-2026', semester: 'Fall' },
  { id: 'fee-019', studentId: 'usr-student-009', feeType: 'tuition', amount: 13000, dueDate: '2026-01-15', paidAmount: 13000, status: 'paid', academicYear: '2025-2026', semester: 'Fall' },
  { id: 'fee-020', studentId: 'usr-student-010', feeType: 'tuition', amount: 13000, dueDate: '2026-01-15', paidAmount: 0, status: 'overdue', academicYear: '2025-2026', semester: 'Fall' },
]

export const payments: Payment[] = [
  { id: 'pay-001', feeId: 'fee-001', studentId: 'usr-student-001', amount: 15000, paymentDate: '2026-01-10', paymentMethod: 'bank-transfer', transactionId: 'TXN-20260110-001', receiptNumber: 'RCP-001', receivedBy: accountantUser.id },
  { id: 'pay-002', feeId: 'fee-002', studentId: 'usr-student-001', amount: 7500, paymentDate: '2026-07-10', paymentMethod: 'online', transactionId: 'TXN-20260710-002', receiptNumber: 'RCP-002', receivedBy: accountantUser.id },
  { id: 'pay-003', feeId: 'fee-003', studentId: 'usr-student-001', amount: 500, paymentDate: '2026-02-25', paymentMethod: 'cash', receiptNumber: 'RCP-003', receivedBy: accountantUser.id },
  { id: 'pay-004', feeId: 'fee-004', studentId: 'usr-student-001', amount: 200, paymentDate: '2026-01-12', paymentMethod: 'card', transactionId: 'TXN-20260112-004', receiptNumber: 'RCP-004', receivedBy: accountantUser.id },
  { id: 'pay-005', feeId: 'fee-005', studentId: 'usr-student-001', amount: 3000, paymentDate: '2026-01-14', paymentMethod: 'bank-transfer', transactionId: 'TXN-20260114-005', receiptNumber: 'RCP-005', receivedBy: accountantUser.id },
  { id: 'pay-006', feeId: 'fee-006', studentId: 'usr-student-002', amount: 15000, paymentDate: '2026-01-13', paymentMethod: 'bank-transfer', transactionId: 'TXN-20260113-006', receiptNumber: 'RCP-006', receivedBy: accountantUser.id },
  { id: 'pay-007', feeId: 'fee-008', studentId: 'usr-student-002', amount: 500, paymentDate: '2026-02-28', paymentMethod: 'online', transactionId: 'TXN-20260228-007', receiptNumber: 'RCP-007', receivedBy: accountantUser.id },
  { id: 'pay-008', feeId: 'fee-009', studentId: 'usr-student-003', amount: 10000, paymentDate: '2026-01-20', paymentMethod: 'cheque', transactionId: 'CHQ-20260120-008', receiptNumber: 'RCP-008', receivedBy: accountantUser.id },
  { id: 'pay-009', feeId: 'fee-012', studentId: 'usr-student-004', amount: 16000, paymentDate: '2026-01-08', paymentMethod: 'bank-transfer', transactionId: 'TXN-20260108-009', receiptNumber: 'RCP-009', receivedBy: accountantUser.id },
  { id: 'pay-010', feeId: 'fee-013', studentId: 'usr-student-004', amount: 16000, paymentDate: '2026-07-05', paymentMethod: 'bank-transfer', transactionId: 'TXN-20260705-010', receiptNumber: 'RCP-010', receivedBy: accountantUser.id },
]

export const libraryBooks: LibraryBook[] = [
  { id: 'lib-001', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', category: 'Computer Science', publisher: 'MIT Press', publishYear: 2009, edition: '3rd', totalCopies: 5, availableCopies: 2, shelfLocation: 'CS-A1', status: 'limited' },
  { id: 'lib-002', title: 'Calculus: Early Transcendentals', author: 'James Stewart', isbn: '978-1285740621', category: 'Mathematics', publisher: 'Cengage Learning', publishYear: 2015, edition: '8th', totalCopies: 8, availableCopies: 5, shelfLocation: 'MATH-B2', status: 'available' },
  { id: 'lib-003', title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0061120084', category: 'Literature', publisher: 'Harper Perennial', publishYear: 1960, edition: '1st', totalCopies: 12, availableCopies: 8, shelfLocation: 'LIT-C3', status: 'available' },
  { id: 'lib-004', title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '978-0553380163', category: 'Science', publisher: 'Bantam', publishYear: 1998, edition: '10th', totalCopies: 4, availableCopies: 1, shelfLocation: 'SCI-D4', status: 'limited' },
  { id: 'lib-005', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0743273565', category: 'Literature', publisher: 'Scribner', publishYear: 1925, edition: '1st', totalCopies: 10, availableCopies: 7, shelfLocation: 'LIT-C4', status: 'available' },
  { id: 'lib-006', title: 'Physics for Scientists and Engineers', author: 'Serway & Jewett', isbn: '978-1133947271', category: 'Physics', publisher: 'Cengage Learning', publishYear: 2013, edition: '9th', totalCopies: 6, availableCopies: 3, shelfLocation: 'PHY-E1', status: 'available' },
  { id: 'lib-007', title: 'Organic Chemistry', author: 'Paula Yurkanis Bruice', isbn: '978-0321962546', category: 'Chemistry', publisher: 'Pearson', publishYear: 2016, edition: '7th', totalCopies: 5, availableCopies: 0, shelfLocation: 'CHEM-F2', status: 'unavailable' },
  { id: 'lib-008', title: '1984', author: 'George Orwell', isbn: '978-0451524935', category: 'Literature', publisher: 'Signet Classics', publishYear: 1949, edition: '1st', totalCopies: 15, availableCopies: 11, shelfLocation: 'LIT-C5', status: 'available' },
  { id: 'lib-009', title: 'World History: Patterns of Interaction', author: 'Roger B. Beck', isbn: '978-0547879437', category: 'History', publisher: 'McDougal Littell', publishYear: 2011, edition: '1st', totalCopies: 7, availableCopies: 4, shelfLocation: 'HIS-G1', status: 'available' },
  { id: 'lib-010', title: 'The Elements of Style', author: 'Strunk & White', isbn: '978-0205309023', category: 'English', publisher: 'Longman', publishYear: 1999, edition: '4th', totalCopies: 10, availableCopies: 6, shelfLocation: 'ENG-H1', status: 'available' },
]

export const libraryIssues: LibraryIssue[] = [
  { id: 'issue-001', bookId: 'lib-001', userId: 'usr-student-001', issueDate: '2026-06-01', dueDate: '2026-06-15', status: 'issued' },
  { id: 'issue-002', bookId: 'lib-003', userId: 'usr-student-002', issueDate: '2026-05-20', dueDate: '2026-06-03', returnDate: '2026-06-02', status: 'returned' },
  { id: 'issue-003', bookId: 'lib-004', userId: 'usr-student-003', issueDate: '2026-05-10', dueDate: '2026-05-24', returnDate: '2026-05-22', status: 'returned' },
  { id: 'issue-004', bookId: 'lib-007', userId: 'usr-student-004', issueDate: '2026-05-15', dueDate: '2026-05-29', returnDate: '2026-05-28', status: 'returned' },
  { id: 'issue-005', bookId: 'lib-001', userId: 'usr-student-005', issueDate: '2026-06-05', dueDate: '2026-06-19', status: 'issued' },
  { id: 'issue-006', bookId: 'lib-002', userId: 'usr-student-006', issueDate: '2026-06-10', dueDate: '2026-06-24', status: 'issued' },
  { id: 'issue-007', bookId: 'lib-001', userId: 'usr-teacher-001', issueDate: '2026-05-01', dueDate: '2026-05-15', status: 'overdue', fine: 50 },
  { id: 'issue-008', bookId: 'lib-006', userId: 'usr-student-001', issueDate: '2026-04-20', dueDate: '2026-05-04', returnDate: '2026-05-03', status: 'returned' },
  { id: 'issue-009', bookId: 'lib-005', userId: 'usr-student-007', issueDate: '2026-06-12', dueDate: '2026-06-26', status: 'issued' },
  { id: 'issue-010', bookId: 'lib-008', userId: 'usr-student-008', issueDate: '2026-06-08', dueDate: '2026-06-22', status: 'issued' },
]

export const routes: Route[] = [
  { id: 'route-001', name: 'Springfield North', startPoint: 'Greenfield Academy', endPoint: 'North Springfield Mall', stops: ['Elm Street', 'Oak Avenue', 'Pine Road', 'Maple Court', 'Cedar Lane'], distance: 12.5, estimatedTime: 35, fare: 150 },
  { id: 'route-002', name: 'Springfield South', startPoint: 'Greenfield Academy', endPoint: 'South Plaza', stops: ['Birch Drive', 'Walnut Street', 'Cherry Lane', 'Spruce Way', 'Ash Boulevard'], distance: 10.8, estimatedTime: 30, fare: 120 },
  { id: 'route-003', name: 'Downtown Express', startPoint: 'Greenfield Academy', endPoint: 'City Center', stops: ['Main Street', 'Park Avenue', 'River Road'], distance: 8.2, estimatedTime: 22, fare: 100 },
  { id: 'route-004', name: 'Eastside Circuit', startPoint: 'Greenfield Academy', endPoint: 'Eastside Community Center', stops: ['Harbor View', 'Lighthouse Point', 'Seaside Drive', 'Coastal Road'], distance: 15.3, estimatedTime: 42, fare: 180 },
]

export const transports: Transport[] = [
  { id: 'trn-001', routeId: 'route-001', vehicleNumber: 'BUS-001', vehicleType: 'bus', driverName: 'Frank Henderson', driverPhone: '+1-555-0401', capacity: 45, status: 'active' },
  { id: 'trn-002', routeId: 'route-002', vehicleNumber: 'BUS-002', vehicleType: 'bus', driverName: 'George Patterson', driverPhone: '+1-555-0402', capacity: 40, status: 'active' },
  { id: 'trn-003', routeId: 'route-003', vehicleNumber: 'VAN-001', vehicleType: 'van', driverName: 'Henry Collins', driverPhone: '+1-555-0403', capacity: 15, status: 'active' },
  { id: 'trn-004', routeId: 'route-004', vehicleNumber: 'BUS-003', vehicleType: 'bus', driverName: 'Ivan Morris', driverPhone: '+1-555-0404', capacity: 45, status: 'maintenance' },
]

export const messages: Message[] = [
  { id: 'msg-001', senderId: 'usr-student-001', receiverId: 'usr-teacher-001', subject: 'Question about Homework', content: 'Dear Ms. Johnson, I have a question about the calculus homework assigned today. Can you clarify problem #5?', isRead: true, sentAt: '2026-06-25T10:30:00Z', readAt: '2026-06-25T14:00:00Z' },
  { id: 'msg-002', senderId: 'usr-teacher-001', receiverId: 'usr-student-001', subject: 'Re: Question about Homework', content: 'Hi Alex, for problem #5, remember to apply the chain rule first before using integration by parts. Let me know if you need more help.', isRead: true, sentAt: '2026-06-25T14:30:00Z', readAt: '2026-06-25T15:00:00Z' },
  { id: 'msg-003', senderId: 'usr-parent-001', receiverId: 'usr-teacher-003', subject: 'Parent-Teacher Meeting', content: 'Dear Ms. Rodriguez, I would like to schedule a meeting to discuss Alex\'s progress in English. Are you available this Friday?', isRead: false, sentAt: '2026-06-26T09:00:00Z' },
  { id: 'msg-004', senderId: 'usr-admin-001', receiverId: 'usr-teacher-001', subject: 'Department Meeting Notice', content: 'Dear faculty, there will be a department meeting on Monday at 3 PM in Conference Room A. Please confirm your attendance.', isRead: true, sentAt: '2026-06-24T08:00:00Z', readAt: '2026-06-24T09:30:00Z' },
  { id: 'msg-005', senderId: 'usr-student-002', receiverId: 'usr-librarian-001', subject: 'Book Extension Request', content: 'Dear Mr. Taylor, Could you please extend the due date for "Introduction to Algorithms" by one week? I\'m still using it for my project.', isRead: false, sentAt: '2026-06-27T11:00:00Z' },
  { id: 'msg-006', senderId: 'usr-parent-002', receiverId: 'usr-admin-001', subject: 'Fee Payment Query', content: 'Dear Dr. Mitchell, I wanted to inquire about the installment plan for the spring semester tuition fees. Is it possible to split the payment into three installments?', isRead: true, sentAt: '2026-06-23T16:00:00Z', readAt: '2026-06-23T17:00:00Z' },
  { id: 'msg-007', senderId: 'usr-teacher-002', receiverId: 'usr-admin-001', subject: 'Lab Equipment Request', content: 'Dear Dr. Mitchell, The physics lab needs new oscilloscopes for the upcoming practical exams. Could you approve the purchase of 10 units?', isRead: false, sentAt: '2026-06-27T08:30:00Z' },
  { id: 'msg-008', senderId: 'usr-accountant-001', receiverId: 'usr-admin-001', subject: 'Monthly Financial Report', content: 'Dear Dr. Mitchell, Please find attached the monthly financial report for June 2026. Total collection: $245,000 with 92% recovery rate.', isRead: true, sentAt: '2026-06-28T09:00:00Z', readAt: '2026-06-28T10:00:00Z' },
]

export const notices: Notice[] = [
  { id: 'notice-001', title: 'Summer Vacation Announcement', content: 'School will remain closed from July 1 to July 31 for summer vacation. Classes will resume on August 1, 2026.', type: 'holiday', targetAudience: ['admin', 'teacher', 'student', 'parent', 'accountant', 'librarian'], publishedBy: adminUser.id, publishDate: '2026-06-20', expiryDate: '2026-08-01', isPublished: true, createdAt: '2026-06-20T08:00:00Z' },
  { id: 'notice-002', title: 'Annual Day Celebration', content: 'The annual day celebration will be held on July 15, 2026. All students are expected to participate. Rehearsals will begin from July 5.', type: 'event', targetAudience: ['admin', 'teacher', 'student', 'parent'], publishedBy: adminUser.id, publishDate: '2026-06-15', expiryDate: '2026-07-15', isPublished: true, createdAt: '2026-06-15T08:00:00Z' },
  { id: 'notice-003', title: 'Fee Deadline Extension', content: 'The deadline for spring semester fee payment has been extended to July 15, 2026. A late fee of $50 will be charged after this date.', type: 'academic', targetAudience: ['student', 'parent'], publishedBy: adminUser.id, publishDate: '2026-06-18', expiryDate: '2026-07-15', isPublished: true, createdAt: '2026-06-18T08:00:00Z' },
  { id: 'notice-004', title: 'Parent-Teacher Meeting', content: 'A parent-teacher meeting is scheduled for July 8, 2026, from 9 AM to 1 PM. Parents are requested to attend.', type: 'meeting', targetAudience: ['teacher', 'parent'], publishedBy: adminUser.id, publishDate: '2026-06-22', expiryDate: '2026-07-08', isPublished: true, createdAt: '2026-06-22T08:00:00Z' },
  { id: 'notice-005', title: 'Science Exhibition', content: 'The inter-school science exhibition will be held on July 20, 2026. Students interested in participating should register by July 10.', type: 'event', targetAudience: ['student', 'teacher'], publishedBy: teachers[1].id, publishDate: '2026-06-25', expiryDate: '2026-07-20', isPublished: true, createdAt: '2026-06-25T08:00:00Z' },
  { id: 'notice-006', title: 'Library Book Return Reminder', content: 'All library books must be returned before July 1, 2026 for annual inventory. Failure to comply will result in a fine.', type: 'urgent', targetAudience: ['student', 'teacher'], publishedBy: librarianUser.id, publishDate: '2026-06-26', expiryDate: '2026-07-01', isPublished: true, createdAt: '2026-06-26T08:00:00Z' },
]

export const events: Event[] = [
  { id: 'evt-001', title: 'Annual Day Celebration', description: 'Annual day celebration with cultural performances, prize distribution, and special guest address.', type: 'cultural', startDate: '2026-07-15', endDate: '2026-07-15', startTime: '09:00', endTime: '17:00', location: 'Main Auditorium', organizer: 'Cultural Committee', targetAudience: ['admin', 'teacher', 'student', 'parent'], maxParticipants: 500, currentParticipants: 350, status: 'upcoming', createdAt: '2026-06-15T08:00:00Z' },
  { id: 'evt-002', title: 'Science Exhibition', description: 'Inter-school science exhibition showcasing student projects and innovations.', type: 'academic', startDate: '2026-07-20', endDate: '2026-07-20', startTime: '10:00', endTime: '16:00', location: 'Science Block', organizer: 'Science Department', targetAudience: ['student', 'teacher'], maxParticipants: 200, currentParticipants: 85, status: 'upcoming', createdAt: '2026-06-25T08:00:00Z' },
  { id: 'evt-003', title: 'Parent-Teacher Meeting', description: 'Quarterly parent-teacher meeting to discuss student progress and academic performance.', type: 'meeting', startDate: '2026-07-08', endDate: '2026-07-08', startTime: '09:00', endTime: '13:00', location: 'Classrooms', organizer: 'Academic Office', targetAudience: ['teacher', 'parent'], maxParticipants: 300, currentParticipants: 180, status: 'upcoming', createdAt: '2026-06-22T08:00:00Z' },
  { id: 'evt-004', title: 'Sports Day', description: 'Annual sports day featuring track and field events, team sports, and prize distribution.', type: 'sports', startDate: '2026-08-10', endDate: '2026-08-11', startTime: '07:00', endTime: '17:00', location: 'Sports Complex', organizer: 'Sports Department', targetAudience: ['admin', 'teacher', 'student', 'parent'], maxParticipants: 600, currentParticipants: 0, status: 'upcoming', createdAt: '2026-06-20T08:00:00Z' },
  { id: 'evt-005', title: 'Workshop on Digital Literacy', description: 'A workshop for teachers on integrating digital tools in education.', type: 'workshop', startDate: '2026-07-05', endDate: '2026-07-05', startTime: '14:00', endTime: '17:00', location: 'Computer Lab', organizer: 'IT Department', targetAudience: ['teacher'], maxParticipants: 40, currentParticipants: 28, status: 'upcoming', createdAt: '2026-06-24T08:00:00Z' },
  { id: 'evt-006', title: 'Board Meeting', description: 'Quarterly board meeting to review school performance and budget.', type: 'meeting', startDate: '2026-07-02', endDate: '2026-07-02', startTime: '10:00', endTime: '13:00', location: 'Conference Room', organizer: 'Administration', targetAudience: ['admin'], maxParticipants: 15, currentParticipants: 12, status: 'upcoming', createdAt: '2026-06-26T08:00:00Z' },
]

export const assignments: Assignment[] = [
  { id: 'asgn-001', title: 'Calculus Problem Set', description: 'Complete problems 1-20 from Chapter 5: Integration Techniques. Show all work and include diagrams where necessary.', subjectId: 'sub-math-10', classId: 'cls-grade10', sectionId: 'sec-10a', teacherId: 'usr-teacher-001', totalMarks: 50, dueDate: '2026-07-05', status: 'published', createdAt: '2026-06-25T08:00:00Z' },
  { id: 'asgn-002', title: 'Physics Lab Report', description: 'Write a detailed lab report on the pendulum experiment conducted in class. Include hypothesis, procedure, observations, and conclusion.', subjectId: 'sub-phys-10', classId: 'cls-grade10', sectionId: 'sec-10a', teacherId: 'usr-teacher-002', totalMarks: 30, dueDate: '2026-07-03', status: 'published', createdAt: '2026-06-24T08:00:00Z' },
  { id: 'asgn-003', title: 'Essay: Modern Literature Analysis', description: 'Write a 1500-word essay analyzing the themes of identity and belonging in contemporary American literature. Choose at least two works for comparison.', subjectId: 'sub-eng-10', classId: 'cls-grade10', sectionId: 'sec-10a', teacherId: 'usr-teacher-003', totalMarks: 40, dueDate: '2026-07-08', status: 'published', createdAt: '2026-06-23T08:00:00Z' },
  { id: 'asgn-004', title: 'History Timeline Project', description: 'Create a detailed timeline of major events from 1914 to 1945. Include at least 30 events with descriptions and their global impact.', subjectId: 'sub-hist-10', classId: 'cls-grade10', sectionId: 'sec-10b', teacherId: 'usr-teacher-004', totalMarks: 35, dueDate: '2026-07-10', status: 'published', createdAt: '2026-06-22T08:00:00Z' },
  { id: 'asgn-005', title: 'Advanced Calculus Assignment', description: 'Solve the differential equations provided. Apply appropriate methods and verify your solutions.', subjectId: 'sub-math-11', classId: 'cls-grade11', sectionId: 'sec-11a', teacherId: 'usr-teacher-001', totalMarks: 60, dueDate: '2026-07-06', status: 'published', createdAt: '2026-06-26T08:00:00Z' },
  { id: 'asgn-006', title: 'Chemistry Lab Practical', description: 'Complete the titration experiment and submit your observations, calculations, and conclusions.', subjectId: 'sub-chem-10', classId: 'cls-grade10', sectionId: 'sec-10b', teacherId: 'usr-teacher-002', totalMarks: 25, dueDate: '2026-06-30', status: 'graded', createdAt: '2026-06-15T08:00:00Z' },
]

export const timetables: Timetable[] = [
  {
    id: 'tt-10a-mon',
    classId: 'cls-grade10',
    sectionId: 'sec-10a',
    dayOfWeek: 'monday',
    periods: [
      { id: 'p-10a-mon-1', periodNumber: 1, subjectId: 'sub-math-10', teacherId: 'usr-teacher-001', startTime: '08:00', endTime: '08:45', room: 'Room 101' },
      { id: 'p-10a-mon-2', periodNumber: 2, subjectId: 'sub-phys-10', teacherId: 'usr-teacher-002', startTime: '08:50', endTime: '09:35', room: 'Room 102' },
      { id: 'p-10a-mon-3', periodNumber: 3, subjectId: 'sub-eng-10', teacherId: 'usr-teacher-003', startTime: '09:40', endTime: '10:25', room: 'Room 103' },
      { id: 'p-10a-mon-4', periodNumber: 4, subjectId: 'sub-hist-10', teacherId: 'usr-teacher-004', startTime: '10:40', endTime: '11:25', room: 'Room 104' },
      { id: 'p-10a-mon-5', periodNumber: 5, subjectId: 'sub-chem-10', teacherId: 'usr-teacher-002', startTime: '11:30', endTime: '12:15', room: 'Lab 1' },
      { id: 'p-10a-mon-6', periodNumber: 6, subjectId: 'sub-bio-10', teacherId: 'usr-teacher-002', startTime: '13:00', endTime: '13:45', room: 'Lab 2' },
    ],
  },
  {
    id: 'tt-10a-tue',
    classId: 'cls-grade10',
    sectionId: 'sec-10a',
    dayOfWeek: 'tuesday',
    periods: [
      { id: 'p-10a-tue-1', periodNumber: 1, subjectId: 'sub-eng-10', teacherId: 'usr-teacher-003', startTime: '08:00', endTime: '08:45', room: 'Room 103' },
      { id: 'p-10a-tue-2', periodNumber: 2, subjectId: 'sub-math-10', teacherId: 'usr-teacher-001', startTime: '08:50', endTime: '09:35', room: 'Room 101' },
      { id: 'p-10a-tue-3', periodNumber: 3, subjectId: 'sub-phys-10', teacherId: 'usr-teacher-002', startTime: '09:40', endTime: '10:25', room: 'Room 102' },
      { id: 'p-10a-tue-4', periodNumber: 4, subjectId: 'sub-chem-10', teacherId: 'usr-teacher-002', startTime: '10:40', endTime: '11:25', room: 'Lab 1' },
      { id: 'p-10a-tue-5', periodNumber: 5, subjectId: 'sub-hist-10', teacherId: 'usr-teacher-004', startTime: '11:30', endTime: '12:15', room: 'Room 104' },
      { id: 'p-10a-tue-6', periodNumber: 6, subjectId: 'sub-bio-10', teacherId: 'usr-teacher-002', startTime: '13:00', endTime: '13:45', room: 'Lab 2' },
    ],
  },
  {
    id: 'tt-10a-wed',
    classId: 'cls-grade10',
    sectionId: 'sec-10a',
    dayOfWeek: 'wednesday',
    periods: [
      { id: 'p-10a-wed-1', periodNumber: 1, subjectId: 'sub-phys-10', teacherId: 'usr-teacher-002', startTime: '08:00', endTime: '08:45', room: 'Room 102' },
      { id: 'p-10a-wed-2', periodNumber: 2, subjectId: 'sub-math-10', teacherId: 'usr-teacher-001', startTime: '08:50', endTime: '09:35', room: 'Room 101' },
      { id: 'p-10a-wed-3', periodNumber: 3, subjectId: 'sub-eng-10', teacherId: 'usr-teacher-003', startTime: '09:40', endTime: '10:25', room: 'Room 103' },
      { id: 'p-10a-wed-4', periodNumber: 4, subjectId: 'sub-bio-10', teacherId: 'usr-teacher-002', startTime: '10:40', endTime: '11:25', room: 'Lab 2' },
      { id: 'p-10a-wed-5', periodNumber: 5, subjectId: 'sub-hist-10', teacherId: 'usr-teacher-004', startTime: '11:30', endTime: '12:15', room: 'Room 104' },
      { id: 'p-10a-wed-6', periodNumber: 6, subjectId: 'sub-chem-10', teacherId: 'usr-teacher-002', startTime: '13:00', endTime: '13:45', room: 'Lab 1' },
    ],
  },
  {
    id: 'tt-10a-thu',
    classId: 'cls-grade10',
    sectionId: 'sec-10a',
    dayOfWeek: 'thursday',
    periods: [
      { id: 'p-10a-thu-1', periodNumber: 1, subjectId: 'sub-math-10', teacherId: 'usr-teacher-001', startTime: '08:00', endTime: '08:45', room: 'Room 101' },
      { id: 'p-10a-thu-2', periodNumber: 2, subjectId: 'sub-eng-10', teacherId: 'usr-teacher-003', startTime: '08:50', endTime: '09:35', room: 'Room 103' },
      { id: 'p-10a-thu-3', periodNumber: 3, subjectId: 'sub-hist-10', teacherId: 'usr-teacher-004', startTime: '09:40', endTime: '10:25', room: 'Room 104' },
      { id: 'p-10a-thu-4', periodNumber: 4, subjectId: 'sub-phys-10', teacherId: 'usr-teacher-002', startTime: '10:40', endTime: '11:25', room: 'Room 102' },
      { id: 'p-10a-thu-5', periodNumber: 5, subjectId: 'sub-bio-10', teacherId: 'usr-teacher-002', startTime: '11:30', endTime: '12:15', room: 'Lab 2' },
      { id: 'p-10a-thu-6', periodNumber: 6, subjectId: 'sub-chem-10', teacherId: 'usr-teacher-002', startTime: '13:00', endTime: '13:45', room: 'Lab 1' },
    ],
  },
  {
    id: 'tt-10a-fri',
    classId: 'cls-grade10',
    sectionId: 'sec-10a',
    dayOfWeek: 'friday',
    periods: [
      { id: 'p-10a-fri-1', periodNumber: 1, subjectId: 'sub-eng-10', teacherId: 'usr-teacher-003', startTime: '08:00', endTime: '08:45', room: 'Room 103' },
      { id: 'p-10a-fri-2', periodNumber: 2, subjectId: 'sub-math-10', teacherId: 'usr-teacher-001', startTime: '08:50', endTime: '09:35', room: 'Room 101' },
      { id: 'p-10a-fri-3', periodNumber: 3, subjectId: 'sub-hist-10', teacherId: 'usr-teacher-004', startTime: '09:40', endTime: '10:25', room: 'Room 104' },
      { id: 'p-10a-fri-4', periodNumber: 4, subjectId: 'sub-phys-10', teacherId: 'usr-teacher-002', startTime: '10:40', endTime: '11:25', room: 'Room 102' },
      { id: 'p-10a-fri-5', periodNumber: 5, subjectId: 'sub-chem-10', teacherId: 'usr-teacher-002', startTime: '11:30', endTime: '12:15', room: 'Lab 1' },
    ],
  },
]

function generateRecentActivities(): Activity[] {
  return [
    { id: 'act-001', type: 'enrollment', title: 'New Student Enrolled', description: 'Isabella Jackson enrolled in Grade 9-B', timestamp: '2026-06-27T09:30:00Z', userId: 'usr-student-008' },
    { id: 'act-002', type: 'payment', title: 'Fee Payment Received', description: 'Alex Williams paid $7,500 for Spring semester tuition', timestamp: '2026-06-26T14:20:00Z', userId: 'usr-student-001' },
    { id: 'act-003', type: 'exam', title: 'Exam Results Published', description: 'Mid-term exam results for Grade 10 have been published', timestamp: '2026-06-25T16:00:00Z' },
    { id: 'act-004', type: 'attendance', title: 'Attendance Alert', description: '12 students absent today in Grade 11-A', timestamp: '2026-06-27T08:30:00Z' },
    { id: 'act-005', type: 'event', title: 'Event Scheduled', description: 'Annual Day Celebration scheduled for July 15', timestamp: '2026-06-20T10:00:00Z', userId: adminUser.id },
    { id: 'act-006', type: 'notice', title: 'Notice Published', description: 'Summer vacation notice published for all users', timestamp: '2026-06-20T08:00:00Z', userId: adminUser.id },
    { id: 'act-007', type: 'library', title: 'Book Overdue', description: 'Introduction to Algorithms is overdue - 5 days past due', timestamp: '2026-06-26T08:00:00Z', userId: 'usr-teacher-001' },
    { id: 'act-008', type: 'payment', title: 'Fee Overdue Alert', description: 'Liam Brown has overdue fees of $15,500', timestamp: '2026-06-25T09:00:00Z', userId: 'usr-student-003' },
    { id: 'act-009', type: 'enrollment', title: 'New Student Enrolled', description: 'Mason White enrolled in Grade 8-A', timestamp: '2026-06-15T11:00:00Z', userId: 'usr-student-009' },
    { id: 'act-010', type: 'exam', title: 'Quiz Scheduled', description: 'Weekly Quiz - Week 10 scheduled for April 10', timestamp: '2026-06-24T14:00:00Z' },
  ]
}

export const recentActivities: Activity[] = generateRecentActivities()

export const dashboardStats: DashboardStats = {
  totalStudents: 450,
  totalTeachers: 28,
  totalClasses: 12,
  totalRevenue: 2450000,
  pendingFees: 185000,
  attendanceRate: 92.5,
  upcomingEvents: 6,
  activeNotices: 6,
  libraryBooks: 12500,
  issuedBooks: 845,
  monthlyRevenue: [
    { month: 'Jan', amount: 285000 },
    { month: 'Feb', amount: 195000 },
    { month: 'Mar', amount: 310000 },
    { month: 'Apr', amount: 225000 },
    { month: 'May', amount: 340000 },
    { month: 'Jun', amount: 295000 },
    { month: 'Jul', amount: 180000 },
    { month: 'Aug', amount: 0 },
    { month: 'Sep', amount: 290000 },
    { month: 'Oct', amount: 215000 },
    { month: 'Nov', amount: 325000 },
    { month: 'Dec', amount: 265000 },
  ],
  studentDistribution: [
    { grade: 'Grade 1', count: 35 },
    { grade: 'Grade 2', count: 38 },
    { grade: 'Grade 3', count: 40 },
    { grade: 'Grade 4', count: 37 },
    { grade: 'Grade 5', count: 42 },
    { grade: 'Grade 6', count: 39 },
    { grade: 'Grade 7', count: 36 },
    { grade: 'Grade 8', count: 44 },
    { grade: 'Grade 9', count: 41 },
    { grade: 'Grade 10', count: 38 },
    { grade: 'Grade 11', count: 32 },
    { grade: 'Grade 12', count: 28 },
  ],
  attendanceData: Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return {
      date: date.toISOString().split('T')[0],
      present: Math.floor(Math.random() * 40) + 380,
      absent: Math.floor(Math.random() * 40) + 10,
    }
  }),
  feeCollection: [
    { type: 'Tuition', amount: 1850000 },
    { type: 'Exam', amount: 125000 },
    { type: 'Transport', amount: 180000 },
    { type: 'Library', amount: 35000 },
    { type: 'Lab', amount: 95000 },
    { type: 'Activity', amount: 75000 },
    { type: 'Other', amount: 90000 },
  ],
  recentActivities: generateRecentActivities(),
}

export const homeworkSubmissions: HomeworkSubmission[] = [
  { id: 'hw-sub-001', assignmentId: 'asgn-001', studentId: 'usr-student-001', studentName: 'Alex Williams', subjectId: 'sub-math-10', classId: 'cls-grade10', sectionId: 'sec-10a', content: 'Here are my solutions to the calculus problem set. I used integration by parts for problems 1-10 and substitution for 11-20.', submittedAt: '2026-06-28T14:30:00Z', status: 'graded', marks: 45, totalMarks: 50, feedback: 'Excellent work! Problem 15 needed more steps shown.', gradedBy: 'usr-teacher-001', gradedAt: '2026-06-29T10:00:00Z' },
  { id: 'hw-sub-002', assignmentId: 'asgn-001', studentId: 'usr-student-002', studentName: 'Sophia Davis', subjectId: 'sub-math-10', classId: 'cls-grade10', sectionId: 'sec-10a', content: 'Submitted my calculus homework. Had difficulty with problems 16-20 but attempted all.', submittedAt: '2026-06-28T16:00:00Z', status: 'graded', marks: 38, totalMarks: 50, feedback: 'Good attempt. Please see office hours for problems 16-20.', gradedBy: 'usr-teacher-001', gradedAt: '2026-06-29T11:00:00Z' },
  { id: 'hw-sub-003', assignmentId: 'asgn-002', studentId: 'usr-student-001', studentName: 'Alex Williams', subjectId: 'sub-phys-10', classId: 'cls-grade10', sectionId: 'sec-10a', content: 'Lab report on pendulum experiment. Included hypothesis, procedure, data tables, and conclusion with error analysis.', submittedAt: '2026-06-27T20:00:00Z', status: 'submitted' },
  { id: 'hw-sub-004', assignmentId: 'asgn-003', studentId: 'usr-student-001', studentName: 'Alex Williams', subjectId: 'sub-eng-10', classId: 'cls-grade10', sectionId: 'sec-10a', content: 'Essay analyzing identity themes in contemporary American literature, comparing works by Ocean Vuong and Jhumpa Lahiri.', submittedAt: '2026-06-26T18:00:00Z', status: 'returned', feedback: 'Please revise thesis statement and add more textual evidence.', gradedBy: 'usr-teacher-003' },
  { id: 'hw-sub-005', assignmentId: 'asgn-001', studentId: 'usr-student-003', studentName: 'Liam Brown', subjectId: 'sub-math-10', classId: 'cls-grade10', sectionId: 'sec-10b', content: 'Calculus problem set solutions with diagrams for geometry problems.', submittedAt: '2026-06-29T08:00:00Z', status: 'submitted' },
]

export const leaveRequests: LeaveRequest[] = [
  { id: 'leave-001', staffId: 'usr-teacher-001', staffName: 'Sarah Johnson', staffRole: 'teacher', type: 'sick', startDate: '2026-07-01', endDate: '2026-07-02', reason: 'Fever and cold - need rest as recommended by doctor.', status: 'approved', approvedBy: 'usr-admin-001', approvedAt: '2026-06-29T09:00:00Z' },
  { id: 'leave-002', staffId: 'usr-teacher-003', staffName: 'Emily Rodriguez', staffRole: 'teacher', type: 'personal', startDate: '2026-07-05', endDate: '2026-07-05', reason: 'Family function - need to attend a wedding.', status: 'pending' },
  { id: 'leave-003', staffId: 'usr-teacher-002', staffName: 'Michael Chen', staffRole: 'teacher', type: 'casual', startDate: '2026-07-10', endDate: '2026-07-12', reason: 'Personal travel plans - family vacation.', status: 'pending' },
  { id: 'leave-004', staffId: 'usr-accountant-001', staffName: 'Patricia Moore', staffRole: 'accountant', type: 'vacation', startDate: '2026-07-15', endDate: '2026-07-20', reason: 'Annual vacation with family.', status: 'pending' },
  { id: 'leave-005', staffId: 'usr-teacher-004', staffName: 'David Kim', staffRole: 'teacher', type: 'sick', startDate: '2026-06-20', endDate: '2026-06-21', reason: 'Migraine attack - unable to teach.', status: 'approved', approvedBy: 'usr-admin-001', approvedAt: '2026-06-20T07:30:00Z' },
  { id: 'leave-006', staffId: 'usr-teacher-001', staffName: 'Sarah Johnson', staffRole: 'teacher', type: 'other', startDate: '2026-07-20', endDate: '2026-07-20', reason: 'Professional development workshop at city college.', status: 'rejected', approvedBy: 'usr-admin-001', notes: 'Please arrange a substitute teacher first.' },
]

export const meetings: Meeting[] = [
  { id: 'mtg-001', parentId: 'usr-parent-001', parentName: 'Robert Williams', teacherId: 'usr-teacher-001', teacherName: 'Sarah Johnson', studentId: 'usr-student-001', studentName: 'Alex Williams', subject: 'Mathematics progress discussion', date: '2026-07-08', startTime: '09:00', endTime: '09:30', status: 'scheduled', meetingType: 'in-person', createdAt: '2026-06-25T10:00:00Z' },
  { id: 'mtg-002', parentId: 'usr-parent-001', parentName: 'Robert Williams', teacherId: 'usr-teacher-003', teacherName: 'Emily Rodriguez', studentId: 'usr-student-001', studentName: 'Alex Williams', subject: 'English essay feedback', date: '2026-07-08', startTime: '10:00', endTime: '10:30', status: 'scheduled', meetingType: 'online', createdAt: '2026-06-26T14:00:00Z' },
  { id: 'mtg-003', parentId: 'usr-parent-002', parentName: 'Jennifer Davis', teacherId: 'usr-teacher-002', teacherName: 'Michael Chen', studentId: 'usr-student-002', studentName: 'Sophia Davis', subject: 'Physics lab performance', date: '2026-06-25', startTime: '11:00', endTime: '11:30', status: 'completed', notes: 'Discussed Sophia needs to improve lab report writing. Recommended extra practice.', meetingType: 'in-person', createdAt: '2026-06-20T08:00:00Z' },
  { id: 'mtg-004', parentId: 'usr-parent-003', parentName: 'Thomas Brown', teacherId: 'usr-teacher-004', teacherName: 'David Kim', studentId: 'usr-student-003', studentName: 'Liam Brown', subject: 'History project guidance', date: '2026-07-10', startTime: '14:00', endTime: '14:30', status: 'scheduled', meetingType: 'online', createdAt: '2026-06-27T09:00:00Z' },
  { id: 'mtg-005', parentId: 'usr-parent-004', parentName: 'Maria Garcia', teacherId: 'usr-teacher-001', teacherName: 'Sarah Johnson', studentId: 'usr-student-004', studentName: 'Olivia Garcia', subject: 'Mathematics extra help needed', date: '2026-06-20', startTime: '09:30', endTime: '10:00', status: 'completed', notes: 'Recommended Olivia join after-school math tutoring sessions.', meetingType: 'in-person', createdAt: '2026-06-15T12:00:00Z' },
]

export const notifications: Notification[] = [
  { id: 'notif-001', userId: 'usr-student-001', title: 'Assignment Graded', message: 'Your Calculus Problem Set has been graded. Score: 45/50', type: 'success', category: 'homework', isRead: false, createdAt: '2026-06-29T10:05:00Z', actionUrl: '/student/assignments' },
  { id: 'notif-002', userId: 'usr-student-001', title: 'Fee Reminder', message: 'Spring semester tuition fee payment is due by July 15. Amount: $7,500', type: 'warning', category: 'fee', isRead: false, createdAt: '2026-06-28T09:00:00Z', actionUrl: '/student/fees' },
  { id: 'notif-003', userId: 'usr-teacher-001', title: 'New Leave Request', message: 'Emily Rodriguez has requested personal leave on July 5.', type: 'info', category: 'general', isRead: true, createdAt: '2026-06-27T15:00:00Z', actionUrl: '/admin/staff' },
  { id: 'notif-004', userId: 'usr-parent-001', title: 'Meeting Scheduled', message: 'Meeting with Sarah Johnson on July 8 at 9:00 AM regarding Alex\'s math progress.', type: 'info', category: 'meeting', isRead: false, createdAt: '2026-06-25T10:05:00Z', actionUrl: '/parent/calendar' },
  { id: 'notif-005', userId: 'usr-admin-001', title: 'Leave Request Pending', message: 'You have 3 pending leave requests to review.', type: 'warning', category: 'general', isRead: false, createdAt: '2026-06-28T08:00:00Z', actionUrl: '/admin/staff' },
  { id: 'notif-006', userId: 'usr-student-002', title: 'Exam Results Published', message: 'Mid-term examination results for Grade 10 are now available.', type: 'success', category: 'exam', isRead: true, createdAt: '2026-06-25T16:05:00Z', actionUrl: '/student/results' },
  { id: 'notif-007', userId: 'usr-parent-002', title: 'Attendance Alert', message: 'Sophia Davis was marked absent on June 27, 2026.', type: 'error', category: 'attendance', isRead: false, createdAt: '2026-06-27T17:00:00Z', actionUrl: '/parent/attendance' },
  { id: 'notif-008', userId: 'usr-teacher-001', title: 'Homework Submission', message: 'Alex Williams submitted the Physics Lab Report.', type: 'info', category: 'homework', isRead: false, createdAt: '2026-06-27T20:05:00Z', actionUrl: '/teacher/assignments' },
]

export const examSchedules: ExamSchedule[] = [
  { id: 'esch-001', examId: 'exam-upcoming-10', subjectId: 'sub-math-10', classId: 'cls-grade10', date: '2026-06-01', startTime: '09:00', endTime: '12:00', room: 'Hall A', totalMarks: 100, passingMarks: 40, instructions: 'Bring calculator. No electronic devices allowed.' },
  { id: 'esch-002', examId: 'exam-upcoming-10', subjectId: 'sub-phys-10', classId: 'cls-grade10', date: '2026-06-03', startTime: '09:00', endTime: '12:00', room: 'Hall A', totalMarks: 100, passingMarks: 40, instructions: 'Bring lab manual for reference.' },
  { id: 'esch-003', examId: 'exam-upcoming-10', subjectId: 'sub-eng-10', classId: 'cls-grade10', date: '2026-06-05', startTime: '09:00', endTime: '11:00', room: 'Hall B', totalMarks: 100, passingMarks: 40 },
  { id: 'esch-004', examId: 'exam-upcoming-10', subjectId: 'sub-hist-10', classId: 'cls-grade10', date: '2026-06-07', startTime: '09:00', endTime: '11:00', room: 'Hall B', totalMarks: 100, passingMarks: 40, instructions: 'Open book exam. Bring textbooks and notes.' },
  { id: 'esch-005', examId: 'exam-upcoming-10', subjectId: 'sub-chem-10', classId: 'cls-grade10', date: '2026-06-09', startTime: '09:00', endTime: '12:00', room: 'Hall A', totalMarks: 100, passingMarks: 40, instructions: 'Practical exam. Wear lab coat.' },
  { id: 'esch-006', examId: 'exam-upcoming-10', subjectId: 'sub-bio-10', classId: 'cls-grade10', date: '2026-06-11', startTime: '09:00', endTime: '12:00', room: 'Hall A', totalMarks: 100, passingMarks: 40 },
]

export const allUsers: User[] = [
  adminUser,
  ...teachers,
  ...parents,
  ...students.slice(0, 5),
  accountantUser,
  librarianUser,
]
