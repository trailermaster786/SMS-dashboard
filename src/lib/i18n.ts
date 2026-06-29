export type Locale = 'en' | 'hi';

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.students': 'Students',
    'nav.staff': 'Staff',
    'nav.admissions': 'Admissions',
    'nav.fees': 'Fees & Finance',
    'nav.calendar': 'Calendar',
    'nav.announcements': 'Announcements',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Settings',
    'nav.classes': 'My Classes',
    'nav.attendance': 'Attendance',
    'nav.gradebook': 'Gradebook',
    'nav.assignments': 'Assignments',
    'nav.lessonPlans': 'Lesson Plans',
    'nav.messages': 'Messages',
    'nav.leave': 'Leave',
    'nav.results': 'Results',
    'nav.timetable': 'Timetable',
    'nav.library': 'Library',
    'nav.notices': 'Notices',
    'nav.performance': 'Performance',
    'nav.transport': 'Transport',
    'nav.invoicing': 'Invoicing',
    'nav.payments': 'Payments',
    'nav.payroll': 'Payroll',
    'nav.expenses': 'Expenses',
    'nav.reports': 'Reports',
    'nav.catalog': 'Catalog',
    'nav.issueReturn': 'Issue & Return',
    'nav.fines': 'Fines',
    'nav.inventory': 'Inventory',
    'nav.homework': 'Homework',
    'nav.meetings': 'Meetings',
    'nav.notifications': 'Notifications',
    'nav.examSchedule': 'Exam Schedule',
    'nav.children': 'Children',

    // Common
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.submit': 'Submit',
    'common.approve': 'Approve',
    'common.reject': 'Reject',
    'common.loading': 'Loading...',
    'common.noData': 'No data available',
    'common.actions': 'Actions',
    'common.status': 'Status',
    'common.date': 'Date',
    'common.name': 'Name',
    'common.total': 'Total',
    'common.pending': 'Pending',
    'common.approved': 'Approved',
    'common.rejected': 'Rejected',
    'common.back': 'Back',
    'common.close': 'Close',
    'common.viewAll': 'View All',
    'common.download': 'Download',
    'common.upload': 'Upload',

    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.totalStudents': 'Total Students',
    'dashboard.totalTeachers': 'Total Teachers',
    'dashboard.totalClasses': 'Total Classes',
    'dashboard.totalRevenue': 'Total Revenue',
    'dashboard.pendingFees': 'Pending Fees',
    'dashboard.attendanceRate': 'Attendance Rate',
    'dashboard.upcomingEvents': 'Upcoming Events',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.quickActions': 'Quick Actions',

    // Auth
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.rememberMe': 'Remember me',
    'auth.forgotPassword': 'Forgot password?',
    'auth.welcomeBack': 'Welcome back',
    'auth.signInToContinue': 'Sign in to your account to continue',

    // Fees
    'fees.amount': 'Amount',
    'fees.dueDate': 'Due Date',
    'fees.paid': 'Paid',
    'fees.partial': 'Partial',
    'fees.overdue': 'Overdue',
    'fees.payNow': 'Pay Now',
    'fees.paymentHistory': 'Payment History',

    // Attendance
    'attendance.present': 'Present',
    'attendance.absent': 'Absent',
    'attendance.late': 'Late',
    'attendance.excused': 'Excused',
    'attendance.markAttendance': 'Mark Attendance',
    'attendance.history': 'Attendance History',

    // Academic
    'academic.subject': 'Subject',
    'academic.marks': 'Marks',
    'academic.grade': 'Grade',
    'academic.percentage': 'Percentage',
    'academic.rank': 'Rank',
    'academic.exam': 'Exam',
    'academic.results': 'Results',
    'academic.reportCard': 'Report Card',

    // Library
    'library.borrowed': 'Borrowed',
    'library.overdue': 'Overdue',
    'library.fines': 'Fines',
    'library.reserve': 'Reserve',
    'library.available': 'Available',

    // Messages
    'messages.newMessage': 'New Message',
    'messages.inbox': 'Inbox',
    'messages.sent': 'Sent',
    'messages.compose': 'Compose',

    // Notices
    'notices.holiday': 'Holiday',
    'notices.event': 'Event',
    'notices.academic': 'Academic',
    'notices.meeting': 'Meeting',
    'notices.urgent': 'Urgent',

    // Footer
    'footer.rights': 'All rights reserved',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.contact': 'Contact Us',
  },
  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.students': 'छात्र',
    'nav.staff': 'कर्मचारी',
    'nav.admissions': 'प्रवेश',
    'nav.fees': 'शुल्क और वित्त',
    'nav.calendar': 'कैलेंडर',
    'nav.announcements': 'घोषणाएं',
    'nav.analytics': 'विश्लेषण',
    'nav.settings': 'सेटिंग्स',
    'nav.classes': 'मेरी कक्षाएं',
    'nav.attendance': 'उपस्थिति',
    'nav.gradebook': 'ग्रेडबुक',
    'nav.assignments': 'कार्य',
    'nav.lessonPlans': 'पाठ योजनाएं',
    'nav.messages': 'संदेश',
    'nav.leave': 'छुट्टी',
    'nav.results': 'परिणाम',
    'nav.timetable': 'समय सारणी',
    'nav.library': 'पुस्तकालय',
    'nav.notices': 'सूचनाएं',
    'nav.performance': 'प्रदर्शन',
    'nav.transport': 'परिवहन',
    'nav.invoicing': 'चालान',
    'nav.payments': 'भुगतान',
    'nav.payroll': 'वेतन',
    'nav.expenses': 'व्यय',
    'nav.reports': 'रिपोर्ट',
    'nav.catalog': 'कैटलॉग',
    'nav.issueReturn': 'जारी और वापसी',
    'nav.fines': 'जुर्माना',
    'nav.inventory': 'सूची',
    'nav.homework': 'गृहकार्य',
    'nav.meetings': 'बैठकें',
    'nav.notifications': 'सूचनाएं',
    'nav.examSchedule': 'परीक्षा कार्यक्रम',
    'nav.children': 'बच्चे',

    // Common
    'common.search': 'खोजें',
    'common.filter': 'फ़िल्टर',
    'common.save': 'सहेजें',
    'common.cancel': 'रद्द करें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
    'common.add': 'जोड़ें',
    'common.submit': 'जमा करें',
    'common.approve': 'स्वीकार करें',
    'common.reject': 'अस्वीकार करें',
    'common.loading': 'लोड हो रहा है...',
    'common.noData': 'कोई डेटा उपलब्ध नहीं',
    'common.actions': 'क्रियाएं',
    'common.status': 'स्थिति',
    'common.date': 'तारीख',
    'common.name': 'नाम',
    'common.total': 'कुल',
    'common.pending': 'लंबित',
    'common.approved': 'स्वीकृत',
    'common.rejected': 'अस्वीकृत',
    'common.back': 'वापस',
    'common.close': 'बंद करें',
    'common.viewAll': 'सभी देखें',
    'common.download': 'डाउनलोड',
    'common.upload': 'अपलोड',

    // Dashboard
    'dashboard.welcome': 'वापसी पर स्वागत',
    'dashboard.totalStudents': 'कुल छात्र',
    'dashboard.totalTeachers': 'कुल शिक्षक',
    'dashboard.totalClasses': 'कुल कक्षाएं',
    'dashboard.totalRevenue': 'कुल राजस्व',
    'dashboard.pendingFees': 'लंबित शुल्क',
    'dashboard.attendanceRate': 'उपस्थिति दर',
    'dashboard.upcomingEvents': 'आगामी कार्यक्रम',
    'dashboard.recentActivity': 'हालिया गतिविधि',
    'dashboard.quickActions': 'त्वरित क्रियाएं',

    // Auth
    'auth.login': 'लॉगिन',
    'auth.logout': 'लॉगआउट',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.rememberMe': 'मुझे याद रखें',
    'auth.forgotPassword': 'पासवर्ड भूल गए?',
    'auth.welcomeBack': 'वापसी पर स्वागत',
    'auth.signInToContinue': 'जारी रखने के लिए अपने खाते में साइन इन करें',

    // Fees
    'fees.amount': 'राशि',
    'fees.dueDate': 'नियत तारीख',
    'fees.paid': 'भुगतान किया',
    'fees.partial': 'आंशिक',
    'fees.overdue': 'अतिदेय',
    'fees.payNow': 'अभी भुगतान करें',
    'fees.paymentHistory': 'भुगतान इतिहास',

    // Attendance
    'attendance.present': 'उपस्थित',
    'attendance.absent': 'अनुपस्थित',
    'attendance.late': 'देर से',
    'attendance.excused': 'अनुमत',
    'attendance.markAttendance': 'उपस्थिति दर्ज करें',
    'attendance.history': 'उपस्थिति इतिहास',

    // Academic
    'academic.subject': 'विषय',
    'academic.marks': 'अंक',
    'academic.grade': 'ग्रेड',
    'academic.percentage': 'प्रतिशत',
    'academic.rank': 'रैंक',
    'academic.exam': 'परीक्षा',
    'academic.results': 'परिणाम',
    'academic.reportCard': 'रिपोर्ट कार्ड',

    // Library
    'library.borrowed': 'उधार लिया',
    'library.overdue': 'अतिदेय',
    'library.fines': 'जुर्माना',
    'library.reserve': 'आरक्षित करें',
    'library.available': 'उपलब्ध',

    // Messages
    'messages.newMessage': 'नया संदेश',
    'messages.inbox': 'इनबॉक्स',
    'messages.sent': 'भेजे गए',
    'messages.compose': 'लिखें',

    // Notices
    'notices.holiday': 'अवकाश',
    'notices.event': 'कार्यक्रम',
    'notices.academic': 'शैक्षणिक',
    'notices.meeting': 'बैठक',
    'notices.urgent': 'अत्यावश्यक',

    // Footer
    'footer.rights': 'सर्वाधिकार सुरक्षित',
    'footer.privacy': 'गोपनीयता नीति',
    'footer.terms': 'सेवा की शर्तें',
    'footer.contact': 'संपर्क करें',
  },
};

let currentLocale: Locale = 'en';

export function setLocale(locale: Locale) {
  currentLocale = locale;
  if (typeof window !== 'undefined') {
    localStorage.setItem('edusync-locale', locale);
  }
}

export function getLocale(): Locale {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('edusync-locale') as Locale;
    if (saved && (saved === 'en' || saved === 'hi')) {
      currentLocale = saved;
      return saved;
    }
  }
  return currentLocale;
}

export function t(key: string): string {
  return translations[currentLocale][key] || translations['en'][key] || key;
}
