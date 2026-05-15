export const timetableData = {
  Monday: [
    { id: 1, subject: 'Data Structures', code: 'CS301', faculty: 'Dr. Sharma', room: 'LH-201', start: '09:00', end: '10:00', type: 'Lecture' },
    { id: 2, subject: 'Algorithms', code: 'CS302', faculty: 'Prof. Gupta', room: 'LH-202', start: '10:00', end: '11:00', type: 'Lecture' },
    { id: 3, subject: 'DBMS', code: 'CS303', faculty: 'Dr. Patel', room: 'Lab-101', start: '11:30', end: '13:00', type: 'Lab' },
    { id: 4, subject: 'Software Engineering', code: 'CS304', faculty: 'Prof. Singh', room: 'LH-203', start: '14:00', end: '15:00', type: 'Lecture' },
    { id: 5, subject: 'Computer Networks', code: 'CS305', faculty: 'Dr. Kumar', room: 'LH-204', start: '15:00', end: '16:00', type: 'Tutorial' },
  ],
  Tuesday: [
    { id: 6, subject: 'Theory of Computation', code: 'CS306', faculty: 'Dr. Verma', room: 'LH-201', start: '09:00', end: '10:00', type: 'Lecture' },
    { id: 7, subject: 'Data Structures', code: 'CS301', faculty: 'Dr. Sharma', room: 'Lab-102', start: '10:00', end: '11:30', type: 'Lab' },
    { id: 8, subject: 'Algorithms', code: 'CS302', faculty: 'Prof. Gupta', room: 'LH-202', start: '12:00', end: '13:00', type: 'Lecture' },
    { id: 9, subject: 'Computer Networks', code: 'CS305', faculty: 'Dr. Kumar', room: 'LH-204', start: '14:00', end: '15:00', type: 'Lecture' },
    { id: 10, subject: 'DBMS', code: 'CS303', faculty: 'Dr. Patel', room: 'LH-203', start: '15:00', end: '16:00', type: 'Tutorial' },
  ],
  Wednesday: [
    { id: 11, subject: 'Software Engineering', code: 'CS304', faculty: 'Prof. Singh', room: 'LH-201', start: '09:00', end: '10:00', type: 'Lecture' },
    { id: 12, subject: 'Theory of Computation', code: 'CS306', faculty: 'Dr. Verma', room: 'LH-202', start: '10:00', end: '11:00', type: 'Lecture' },
    { id: 13, subject: 'Data Structures', code: 'CS301', faculty: 'Dr. Sharma', room: 'LH-203', start: '11:30', end: '12:30', type: 'Lecture' },
    { id: 14, subject: 'Algorithms', code: 'CS302', faculty: 'Prof. Gupta', room: 'Lab-101', start: '14:00', end: '15:30', type: 'Lab' },
    { id: 15, subject: 'Computer Networks', code: 'CS305', faculty: 'Dr. Kumar', room: 'LH-204', start: '16:00', end: '17:00', type: 'Lecture' },
  ],
  Thursday: [
    { id: 16, subject: 'DBMS', code: 'CS303', faculty: 'Dr. Patel', room: 'LH-201', start: '09:00', end: '10:00', type: 'Lecture' },
    { id: 17, subject: 'Software Engineering', code: 'CS304', faculty: 'Prof. Singh', room: 'Lab-103', start: '10:00', end: '11:30', type: 'Lab' },
    { id: 18, subject: 'Theory of Computation', code: 'CS306', faculty: 'Dr. Verma', room: 'LH-202', start: '12:00', end: '13:00', type: 'Lecture' },
    { id: 19, subject: 'Data Structures', code: 'CS301', faculty: 'Dr. Sharma', room: 'LH-203', start: '14:00', end: '15:00', type: 'Tutorial' },
    { id: 20, subject: 'Algorithms', code: 'CS302', faculty: 'Prof. Gupta', room: 'LH-204', start: '15:00', end: '16:00', type: 'Lecture' },
  ],
  Friday: [
    { id: 21, subject: 'Computer Networks', code: 'CS305', faculty: 'Dr. Kumar', room: 'Lab-101', start: '09:00', end: '10:30', type: 'Lab' },
    { id: 22, subject: 'Theory of Computation', code: 'CS306', faculty: 'Dr. Verma', room: 'LH-201', start: '11:00', end: '12:00', type: 'Lecture' },
    { id: 23, subject: 'DBMS', code: 'CS303', faculty: 'Dr. Patel', room: 'LH-202', start: '12:00', end: '13:00', type: 'Lecture' },
    { id: 24, subject: 'Software Engineering', code: 'CS304', faculty: 'Prof. Singh', room: 'LH-203', start: '14:00', end: '15:00', type: 'Lecture' },
    { id: 25, subject: 'Data Structures', code: 'CS301', faculty: 'Dr. Sharma', room: 'LH-204', start: '15:00', end: '16:00', type: 'Tutorial' },
  ],
  Saturday: [
    { id: 26, subject: 'Algorithms', code: 'CS302', faculty: 'Prof. Gupta', room: 'LH-201', start: '09:00', end: '10:00', type: 'Lecture' },
    { id: 27, subject: 'DBMS', code: 'CS303', faculty: 'Dr. Patel', room: 'Lab-101', start: '10:00', end: '11:30', type: 'Lab' },
    { id: 28, subject: 'Computer Networks', code: 'CS305', faculty: 'Dr. Kumar', room: 'LH-202', start: '12:00', end: '13:00', type: 'Tutorial' },
  ],
};

export const subjects = [
  { id: 'cs301', name: 'Data Structures', code: 'CS301', faculty: 'Dr. Sharma', color: '#6366f1', attendance: 85 },
  { id: 'cs302', name: 'Algorithms', code: 'CS302', faculty: 'Prof. Gupta', color: '#8b5cf6', attendance: 78 },
  { id: 'cs303', name: 'Database Management Systems', code: 'CS303', faculty: 'Dr. Patel', color: '#06b6d4', attendance: 92 },
  { id: 'cs304', name: 'Software Engineering', code: 'CS304', faculty: 'Prof. Singh', color: '#10b981', attendance: 88 },
  { id: 'cs305', name: 'Computer Networks', code: 'CS305', faculty: 'Dr. Kumar', color: '#f59e0b', attendance: 72 },
  { id: 'cs306', name: 'Theory of Computation', code: 'CS306', faculty: 'Dr. Verma', color: '#ef4444', attendance: 80 },
];

export const studentProfile = {
  name: 'Devansh',
  fullName: 'Devansh Kumar',
  rollNo: 'CS2023045',
  semester: '5th Semester',
  branch: 'Computer Science & Engineering',
  college: 'National Institute of Technology',
  cgpa: 8.7,
  avatar: null,
  streak: 12,
  goals: { completed: 3, total: 5 },
};

export const recentActivity = [
  { id: 1, type: 'attendance', message: 'Marked present in Data Structures', time: '2 hours ago', icon: '✅' },
  { id: 2, type: 'ai', message: 'Asked AI Tutor about Binary Trees', time: '3 hours ago', icon: '🤖' },
  { id: 3, type: 'streak', message: 'Study streak extended to 12 days!', time: '5 hours ago', icon: '🔥' },
  { id: 4, type: 'goal', message: 'Completed: Review DBMS normalization', time: '1 day ago', icon: '🎯' },
  { id: 5, type: 'attendance', message: 'Marked present in Algorithms', time: '1 day ago', icon: '✅' },
];

export const notifications = [
  { id: 1, title: 'Assignment Due', message: 'DBMS assignment due tomorrow', type: 'warning', time: '1h ago', read: false },
  { id: 2, title: 'Class Cancelled', message: 'TOC lecture cancelled today', type: 'info', time: '2h ago', read: false },
  { id: 3, title: 'New Study Material', message: 'CN notes uploaded by Dr. Kumar', type: 'success', time: '3h ago', read: true },
  { id: 4, title: 'Attendance Alert', message: 'CN attendance below 75%', type: 'danger', time: '1d ago', read: true },
];
