import {
  Student,
  User,
  Course,
  Assignment,
  Exam,
  NotificationItem,
  CalendarEvent,
  BusRoute,
  CampusLocation,
  CollaborativeProject,
  Intervention
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_admin_1',
    name: 'Dr. Anand Ramanathan',
    email: 'principal@presidencycollege.ac.in',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    department: 'Office of Academic Affairs',
    designation: 'Dean of Academics & Student Welfare',
    phone: '+91 98450 12345'
  },
  {
    id: 'user_admin_2',
    name: 'Prof. Meenakshi Sundaram',
    email: 'registrar@presidencycollege.ac.in',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
    department: 'Institutional Intelligence & Quality Assurance',
    designation: 'Director, Student Retention & Success',
    phone: '+91 98450 67890'
  },
  {
    id: 'user_faculty_1',
    name: 'Dr. Rajeshwari Krishnan',
    email: 'rajeshwari.k@presidencycollege.ac.in',
    role: 'faculty',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor & HOD',
    phone: '+91 98451 22334'
  },
  {
    id: 'user_faculty_2',
    name: 'Prof. Arvind Nambiar',
    email: 'arvind.n@presidencycollege.ac.in',
    role: 'faculty',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    department: 'Artificial Intelligence & Data Science',
    designation: 'Assistant Professor',
    phone: '+91 98452 33445'
  },
  {
    id: 'user_faculty_3',
    name: 'Dr. Shalini Deshmukh',
    email: 'shalini.d@presidencycollege.ac.in',
    role: 'faculty',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&h=200&q=80',
    department: 'School of Management Studies',
    designation: 'Professor',
    phone: '+91 98453 44556'
  },
  {
    id: 'user_mentor_1',
    name: 'Smt. Kavitha Rao',
    email: 'kavitha.counselor@presidencycollege.ac.in',
    role: 'mentor',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80',
    department: 'Center for Student Wellbeing & Mentorship',
    designation: 'Lead Student Counselor & Psychologist',
    phone: '+91 98454 55667'
  },
  {
    id: 'user_student_1',
    name: 'Aditya Vardhan Rao',
    email: 'aditya.v.cs21@presidencycollege.ac.in',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&h=200&q=80',
    department: 'Computer Science & Engineering',
    studentId: 'PC2022CS084',
    semester: 5,
    phone: '+91 91234 56780'
  }
];

// Helper to generate students
export function generateDemoStudents(): Student[] {
  const departments = [
    { dept: 'Computer Science & Engineering', course: 'B.Tech Computer Science' },
    { dept: 'Artificial Intelligence & Data Science', course: 'B.Tech AI & Data Science' },
    { dept: 'School of Management Studies', course: 'BBA Financial Analytics' },
    { dept: 'Department of Commerce', course: 'B.Com Corporate Accounting' },
    { dept: 'Information Technology', course: 'Master of Computer Applications (MCA)' },
  ];

  const firstNames = [
    'Aditya', 'Rohan', 'Sneha', 'Ananya', 'Vikram', 'Divya', 'Karthik', 'Pooja', 'Rahul', 'Priya',
    'Arjun', 'Meera', 'Nikhil', 'Tanvi', 'Siddharth', 'Varsha', 'Akash', 'Ishita', 'Gaurav', 'Neha',
    'Rishabh', 'Lavanya', 'Manish', 'Kavya', 'Sanjay', 'Deepa', 'Abhishek', 'Swati', 'Harish', 'Preeti',
    'Tarun', 'Anushka', 'Sachin', 'Bhavna', 'Naveen', 'Ritu', 'Pranav', 'Simran', 'Kiran', 'Vidya',
    'Sunil', 'Monika', 'Dev', 'Shreya', 'Amit', 'Nandini', 'Vikas', 'Rashmi', 'Vivek', 'Shruti'
  ];

  const lastNames = [
    'Rao', 'Sharma', 'Patil', 'Iyer', 'Reddy', 'Nair', 'Verma', 'Menon', 'Kulkarni', 'Bhat',
    'Pillai', 'Hegde', 'Banerjee', 'Gupta', 'Chatterjee', 'Shetty', 'Joshi', 'Chauhan', 'Nambiar', 'Agarwal'
  ];

  const students: Student[] = [];

  for (let i = 0; i < 50; i++) {
    const fn = firstNames[i];
    const ln = lastNames[i % lastNames.length];
    const fullName = `${fn} ${ln}`;
    const deptInfo = departments[i % departments.length];
    const sem = ((i % 4) + 1) * 2 - 1; // 1, 3, 5, 7
    const studentIdCode = `PC2022${deptInfo.dept.slice(0, 2).toUpperCase()}${String(i + 101).padStart(3, '0')}`;

    // Carefully distribute risk:
    // First 8: HIGH risk (urgent intervention)
    // Next 14: MODERATE risk (support recommended)
    // Remaining 28: LOW risk (healthy progress)
    let riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
    let attendanceRate: number;
    let cgpa: number;
    let missedAssignments: number;
    let academicTrend: 'improving' | 'stable' | 'declining';
    let riskScore: number;

    if (i < 8) {
      riskLevel = 'HIGH';
      attendanceRate = Math.floor(54 + Math.random() * 12); // 54 - 65%
      cgpa = +(5.2 + Math.random() * 1.1).toFixed(2); // 5.2 - 6.3
      missedAssignments = Math.floor(3 + Math.random() * 4); // 3 - 6
      academicTrend = 'declining';
      riskScore = Math.floor(75 + Math.random() * 20); // 75 - 94
    } else if (i < 22) {
      riskLevel = 'MODERATE';
      attendanceRate = Math.floor(68 + Math.random() * 9); // 68 - 76%
      cgpa = +(6.4 + Math.random() * 1.2).toFixed(2); // 6.4 - 7.6
      missedAssignments = Math.floor(1 + Math.random() * 2); // 1 - 2
      academicTrend = Math.random() > 0.4 ? 'stable' : 'declining';
      riskScore = Math.floor(45 + Math.random() * 26); // 45 - 70
    } else {
      riskLevel = 'LOW';
      attendanceRate = Math.floor(82 + Math.random() * 16); // 82 - 97%
      cgpa = +(7.8 + Math.random() * 1.9).toFixed(2); // 7.8 - 9.7
      if (cgpa > 10) cgpa = 9.85;
      missedAssignments = 0;
      academicTrend = Math.random() > 0.3 ? 'improving' : 'stable';
      riskScore = Math.floor(12 + Math.random() * 25); // 12 - 36
    }

    const currentGpa = +(cgpa + (academicTrend === 'declining' ? -0.4 : academicTrend === 'improving' ? 0.3 : 0)).toFixed(2);
    const recentExamAverage = +(cgpa * 9.5 - (academicTrend === 'declining' ? 12 : 0)).toFixed(1);

    const subjectAttendance = [
      {
        subjectCode: 'CS501',
        subjectName: 'Design & Analysis of Algorithms',
        attended: Math.round((attendanceRate / 100) * 36),
        total: 36,
        percentage: attendanceRate,
        facultyName: 'Dr. Rajeshwari Krishnan'
      },
      {
        subjectCode: 'CS502',
        subjectName: 'Database Management Systems',
        attended: Math.round(((attendanceRate + (i % 5 - 2)) / 100) * 34),
        total: 34,
        percentage: Math.min(100, Math.max(40, attendanceRate + (i % 5 - 2))),
        facultyName: 'Prof. Arvind Nambiar'
      },
      {
        subjectCode: 'CS503',
        subjectName: 'Computer Networks & Security',
        attended: Math.round(((attendanceRate - (i % 4)) / 100) * 32),
        total: 32,
        percentage: Math.min(100, Math.max(42, attendanceRate - (i % 4))),
        facultyName: 'Dr. Shalini Deshmukh'
      },
      {
        subjectCode: 'CS504',
        subjectName: 'Operating Systems & System Programming',
        attended: Math.round(((attendanceRate + (i % 6 - 3)) / 100) * 30),
        total: 30,
        percentage: Math.min(100, Math.max(45, attendanceRate + (i % 6 - 3))),
        facultyName: 'Prof. Arvind Nambiar'
      }
    ];

    // SHAP Explainability Contributions
    const shapValues = [
      {
        feature: 'Attendance Rate',
        observedValue: `${attendanceRate}%`,
        impactScore: attendanceRate < 75 ? +(35 * (75 - attendanceRate) / 25).toFixed(1) : -(20 * (attendanceRate - 75) / 25).toFixed(1) as unknown as number,
        direction: (attendanceRate < 75 ? 'increases_risk' : 'decreases_risk') as 'increases_risk' | 'decreases_risk',
        explanation: attendanceRate < 75
          ? `Classroom attendance has dropped below the statutory 75% university threshold.`
          : `Regular attendance demonstrates consistent classroom engagement and interaction.`
      },
      {
        feature: 'Assignment Submission Adherence',
        observedValue: `${missedAssignments} missed of 12 assignments`,
        impactScore: missedAssignments > 0 ? +(missedAssignments * 8.5).toFixed(1) : -12.4,
        direction: (missedAssignments > 0 ? 'increases_risk' : 'decreases_risk') as 'increases_risk' | 'decreases_risk',
        explanation: missedAssignments > 0
          ? `${missedAssignments} recent assignments unsubmitted or submitted past grace deadline.`
          : `All assigned course deliverables submitted on or ahead of deadlines.`
      },
      {
        feature: 'Mid-Semester Exam Trajectory',
        observedValue: `${recentExamAverage}% (${academicTrend})`,
        impactScore: academicTrend === 'declining' ? 24.6 : academicTrend === 'improving' ? -18.2 : -4.0,
        direction: (academicTrend === 'declining' ? 'increases_risk' : 'decreases_risk') as 'increases_risk' | 'decreases_risk',
        explanation: academicTrend === 'declining'
          ? `Recent mid-term scores show an acute downward variance compared to cumulative baseline.`
          : `Examination metrics indicate stable or upward scholastic trajectory across subjects.`
      },
      {
        feature: 'LMS Platform & Lab Engagement',
        observedValue: riskLevel === 'HIGH' ? 'Low (Last active 9 days ago)' : 'Regular daily activity',
        impactScore: riskLevel === 'HIGH' ? 14.8 : -9.5,
        direction: (riskLevel === 'HIGH' ? 'increases_risk' : 'decreases_risk') as 'increases_risk' | 'decreases_risk',
        explanation: riskLevel === 'HIGH'
          ? `Diminished interaction on college LMS portals, laboratory coding sandboxes, and reading repositories.`
          : `Active participation and timely resource downloads on academic platforms.`
      }
    ];

    const riskHistory = [
      { semester: 'Semester 1', riskLevel: 'LOW' as const, score: 18, date: '2023-01-15' },
      { semester: 'Semester 2', riskLevel: 'LOW' as const, score: 22, date: '2023-06-20' },
      {
        semester: 'Semester 3',
        riskLevel: (riskLevel === 'HIGH' ? 'MODERATE' : 'LOW') as 'LOW' | 'MODERATE' | 'HIGH',
        score: riskLevel === 'HIGH' ? 52 : 26,
        date: '2024-01-18'
      },
      {
        semester: 'Semester 4 (Current)',
        riskLevel: riskLevel,
        score: riskScore,
        date: '2024-06-12'
      }
    ];

    const recommendedActions =
      riskLevel === 'HIGH'
        ? [
            'Schedule 1-on-1 counseling consultation with Student Wellbeing Center',
            'Coordinate remedial tutoring with faculty for Algorithms & Database Systems',
            'Conduct empathetic attendance check-in to identify external obstacles',
            'Engage academic mentor for personalized study schedule pacing'
          ]
        : riskLevel === 'MODERATE'
        ? [
            'Proactive mentor check-in regarding recent missed assignment',
            'Offer voluntary peer-study group connection',
            'Review classroom comprehension in mid-term review session'
          ]
        : [
            'Encourage participation in departmental research seminars and honors projects',
            'Maintain regular mentor touchpoints'
          ];

    const interventions: Intervention[] = [];
    if (riskLevel === 'HIGH' || riskLevel === 'MODERATE') {
      interventions.push({
        id: `int_${i}_1`,
        studentId: studentIdCode,
        studentName: fullName,
        department: deptInfo.dept,
        semester: sem,
        title:
          riskLevel === 'HIGH'
            ? 'Remedial Academic Support & Attendance Check-in'
            : 'Mid-Semester Performance Advisory',
        type: riskLevel === 'HIGH' ? 'remedial_classes' : 'academic_mentoring',
        status:
          i % 4 === 0
            ? 'new'
            : i % 4 === 1
            ? 'under_review'
            : i % 4 === 2
            ? 'student_contacted'
            : 'support_assigned',
        priority: riskLevel === 'HIGH' ? 'urgent' : 'medium',
        assignedTo: 'Smt. Kavitha Rao',
        assignedRole: 'Lead Counselor',
        createdAt: '2026-09-18',
        updatedAt: '2026-09-24',
        nextFollowUpDate: '2026-10-04',
        notes: [
          {
            id: `note_${i}_1`,
            author: 'Prof. Arvind Nambiar',
            authorRole: 'Faculty Mentor',
            text: 'Noticed student was absent for 3 consecutive lab sessions. Reached out via portal; student mentioned temporary family health crisis.',
            timestamp: '2026-09-20 14:30'
          },
          {
            id: `note_${i}_2`,
            author: 'Smt. Kavitha Rao',
            authorRole: 'Lead Counselor',
            text: 'Structured flexible catch-up schedule with department HOD approval. Scheduled counseling session next Tuesday.',
            timestamp: '2026-09-22 11:15'
          }
        ],
        actionItems: [
          { id: 'act_1', text: 'Schedule 1-on-1 counseling consultation', completed: true },
          { id: 'act_2', text: 'Provide recorded lectures for missed lab modules', completed: true },
          { id: 'act_3', text: 'Evaluate progress in follow-up review', completed: false }
        ]
      });
    }

    students.push({
      id: `student_${i + 1}`,
      studentId: studentIdCode,
      name: fullName,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@presidencycollege.ac.in`,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + i}?auto=format&fit=crop&w=200&h=200&q=80`,
      phone: `+91 9845${String(10000 + i).slice(0, 5)}`,
      department: deptInfo.dept,
      course: deptInfo.course,
      semester: sem,
      section: i % 2 === 0 ? 'Section A' : 'Section B',
      admissionYear: 2023,
      mentorName: i % 2 === 0 ? 'Dr. Rajeshwari Krishnan' : 'Prof. Arvind Nambiar',
      guardianName: `Mr. ${ln}`,
      guardianPhone: `+91 9845${String(20000 + i).slice(0, 5)}`,
      cgpa,
      currentGpa,
      attendanceRate,
      subjectAttendance,
      assignmentsCompleted: 12 - missedAssignments,
      assignmentsTotal: 12,
      missedAssignments,
      recentExamAverage,
      academicTrend,
      riskAssessment: {
        level: riskLevel,
        score: riskScore,
        lastEvaluated: '2026-09-25T08:30:00Z',
        isHumanReviewed: i % 3 === 0,
        reviewedBy: i % 3 === 0 ? 'Smt. Kavitha Rao (Lead Counselor)' : undefined,
        reviewedAt: i % 3 === 0 ? '2026-09-26 15:45' : undefined,
        notes:
          riskLevel === 'HIGH'
            ? 'Elevated dropout-risk indicator flagged by predictive model. Immediate human review initiated for proactive academic and pastoral assistance.'
            : undefined,
        shapValues,
        riskHistory,
        recommendedActions
      },
      interventions,
      transcripts: [
        {
          semester: 1,
          academicYear: '2023 - 2024',
          gpa: 8.24,
          cgpa: 8.24,
          totalCredits: 22,
          courses: [
            { courseCode: 'MA101', courseName: 'Engineering Mathematics I', credits: 4, internalMarks: 44, externalMarks: 45, totalMarks: 89, grade: 'A+', gradePoint: 9 },
            { courseCode: 'PH102', courseName: 'Engineering Physics & Optics', credits: 4, internalMarks: 40, externalMarks: 42, totalMarks: 82, grade: 'A', gradePoint: 8 },
            { courseCode: 'CS103', courseName: 'Problem Solving & Python Programming', credits: 4, internalMarks: 48, externalMarks: 47, totalMarks: 95, grade: 'O', gradePoint: 10 },
            { courseCode: 'EE104', courseName: 'Basic Electrical Engineering', credits: 3, internalMarks: 36, externalMarks: 38, totalMarks: 74, grade: 'B+', gradePoint: 7 },
            { courseCode: 'CS105L', courseName: 'Computing Laboratory', credits: 2, internalMarks: 49, externalMarks: 48, totalMarks: 97, grade: 'O', gradePoint: 10 },
          ]
        },
        {
          semester: 2,
          academicYear: '2023 - 2024',
          gpa: 8.42,
          cgpa: 8.33,
          totalCredits: 23,
          courses: [
            { courseCode: 'MA201', courseName: 'Discrete Mathematics & Graph Theory', credits: 4, internalMarks: 42, externalMarks: 46, totalMarks: 88, grade: 'A+', gradePoint: 9 },
            { courseCode: 'CS202', courseName: 'Data Structures & OOP with Java', credits: 4, internalMarks: 47, externalMarks: 45, totalMarks: 92, grade: 'O', gradePoint: 10 },
            { courseCode: 'EC203', courseName: 'Digital Logic & Microprocessors', credits: 4, internalMarks: 38, externalMarks: 40, totalMarks: 78, grade: 'A', gradePoint: 8 },
            { courseCode: 'CS204L', courseName: 'Data Structures Lab', credits: 2, internalMarks: 48, externalMarks: 49, totalMarks: 97, grade: 'O', gradePoint: 10 },
          ]
        }
      ]
    });
  }

  return students;
}

export const SAMPLE_STUDENTS: Student[] = generateDemoStudents();

export const SAMPLE_COURSES: Course[] = [
  {
    id: 'course_1',
    code: 'CS501',
    name: 'Design & Analysis of Algorithms',
    department: 'Computer Science & Engineering',
    semester: 5,
    credits: 4,
    facultyName: 'Dr. Rajeshwari Krishnan',
    facultyId: 'user_faculty_1',
    scheduleTime: 'Mon, Wed 09:30 - 11:00 AM',
    room: 'Aryabhatta Block - Lecture Hall 302',
    syllabusProgress: 68,
    totalClasses: 36,
    enrolledStudentsCount: 64,
    materialsCount: 14
  },
  {
    id: 'course_2',
    code: 'CS502',
    name: 'Database Management Systems',
    department: 'Computer Science & Engineering',
    semester: 5,
    credits: 4,
    facultyName: 'Prof. Arvind Nambiar',
    facultyId: 'user_faculty_2',
    scheduleTime: 'Tue, Thu 11:15 AM - 12:45 PM',
    room: 'Ramanujan Lab 4, 2nd Floor',
    syllabusProgress: 75,
    totalClasses: 34,
    enrolledStudentsCount: 64,
    materialsCount: 18
  },
  {
    id: 'course_3',
    code: 'CS503',
    name: 'Computer Networks & Cyber Security',
    department: 'Computer Science & Engineering',
    semester: 5,
    credits: 3,
    facultyName: 'Dr. Shalini Deshmukh',
    facultyId: 'user_faculty_3',
    scheduleTime: 'Mon, Fri 02:00 - 03:30 PM',
    room: 'Visvesvaraya Auditorium B',
    syllabusProgress: 60,
    totalClasses: 32,
    enrolledStudentsCount: 64,
    materialsCount: 12
  },
  {
    id: 'course_4',
    code: 'AI504',
    name: 'Machine Learning & Statistical Modeling',
    department: 'Artificial Intelligence & Data Science',
    semester: 5,
    credits: 4,
    facultyName: 'Prof. Arvind Nambiar',
    facultyId: 'user_faculty_2',
    scheduleTime: 'Wed, Fri 11:15 AM - 12:45 PM',
    room: 'Turing AI Research Suite',
    syllabusProgress: 82,
    totalClasses: 38,
    enrolledStudentsCount: 58,
    materialsCount: 22
  }
];

export const SAMPLE_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg_1',
    courseId: 'course_1',
    courseCode: 'CS501',
    courseName: 'Design & Analysis of Algorithms',
    title: 'Dynamic Programming & Graph Traversal Benchmark',
    description: 'Implement Floyd-Warshall and Bellman-Ford algorithms in C++/Python. Benchmark execution latency with dense graph inputs and submit analytical report with complexity graphs.',
    dueDate: '2026-10-06T23:59:00Z',
    maxScore: 100,
    submissionsCount: 48,
    totalStudents: 64,
    status: 'ongoing',
    userSubmission: {
      submittedAt: '2026-09-27T18:40:00Z',
      fileUrl: 'CS501_AdityaVardhan_Assignment3.pdf',
      status: 'submitted',
      score: undefined
    }
  },
  {
    id: 'asg_2',
    courseId: 'course_2',
    courseCode: 'CS502',
    courseName: 'Database Management Systems',
    title: 'Relational Schema Normalization & B+ Tree Indexing',
    description: 'Decompose enterprise transaction schema into BCNF and construct simulation of index node splits under high concurrent write workload.',
    dueDate: '2026-10-12T23:59:00Z',
    maxScore: 50,
    submissionsCount: 21,
    totalStudents: 64,
    status: 'upcoming'
  },
  {
    id: 'asg_3',
    courseId: 'course_4',
    courseCode: 'AI504',
    courseName: 'Machine Learning & Statistical Modeling',
    title: 'Model Evaluation with SHAP Explainability on Tabular Data',
    description: 'Train Random Forest and Gradient Boosted trees on academic retention dataset. Generate feature importance waterfall plots and SHAP summary charts.',
    dueDate: '2026-09-24T23:59:00Z',
    maxScore: 100,
    submissionsCount: 62,
    totalStudents: 64,
    status: 'graded',
    userSubmission: {
      submittedAt: '2026-09-23T21:10:00Z',
      fileUrl: 'Aditya_AI504_SHAP_Analysis.ipynb',
      status: 'graded',
      score: 94,
      feedback: 'Outstanding explanation of partial dependence plots and feature interactions.'
    }
  }
];

export const SAMPLE_EXAMS: Exam[] = [
  {
    id: 'exam_1',
    courseCode: 'CS501',
    courseName: 'Design & Analysis of Algorithms',
    examType: 'Mid-Term',
    date: '2026-10-16',
    time: '09:30 AM - 12:30 PM',
    venue: 'Main Examination Hall - Block A',
    duration: '3 Hours',
    maxMarks: 100,
    syllabusCovered: 'Modules 1 to 3: Asymptotic notations, Divide & Conquer, Greedy Paradigms, Dynamic Programming'
  },
  {
    id: 'exam_2',
    courseCode: 'CS502',
    courseName: 'Database Management Systems',
    examType: 'Mid-Term',
    date: '2026-10-19',
    time: '09:30 AM - 12:30 PM',
    venue: 'Main Examination Hall - Block A',
    duration: '3 Hours',
    maxMarks: 100,
    syllabusCovered: 'Modules 1 to 3: Relational Algebra, SQL DDL/DML, Normalization up to 4NF, Concurrency Control'
  },
  {
    id: 'exam_3',
    courseCode: 'CS503',
    courseName: 'Computer Networks & Cyber Security',
    examType: 'Lab Practical',
    date: '2026-10-23',
    time: '02:00 PM - 05:00 PM',
    venue: 'Advanced Networking Lab 2',
    duration: '3 Hours',
    maxMarks: 50,
    syllabusCovered: 'Socket Programming in Python, Wireshark Packet Inspection, VLAN Configuration'
  }
];

export const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Support Action Assigned',
    message: 'Counselor Smt. Kavitha Rao has scheduled a compassionate mentoring follow-up for student Aditya Vardhan Rao.',
    category: 'support_alert',
    timestamp: '15 mins ago',
    read: false,
    severity: 'warning',
    linkTab: 'earlywarning'
  },
  {
    id: 'notif_2',
    title: 'Upcoming Mid-Term Examination Schedule',
    message: 'The official timetable for Autumn 2026 Mid-Semester examinations has been published by the Controller of Examinations.',
    category: 'exam',
    timestamp: '2 hours ago',
    read: false,
    severity: 'info',
    linkTab: 'exams'
  },
  {
    id: 'notif_3',
    title: 'Campus Transport Schedule Advisory',
    message: 'Route 14 (Electronic City to Presidency Campus) will operate 10 minutes earlier on Friday due to ring road maintenance.',
    category: 'transport',
    timestamp: '5 hours ago',
    read: true,
    severity: 'info',
    linkTab: 'transport'
  },
  {
    id: 'notif_4',
    title: 'Assignment Deadline Reminder',
    message: 'CS501 Dynamic Programming Benchmark assignment is due in 8 days. 48 of 64 students have submitted.',
    category: 'assignment',
    timestamp: '1 day ago',
    read: true,
    severity: 'info',
    linkTab: 'assignments'
  }
];

export const SAMPLE_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'ev_1',
    title: 'CS501: Algorithms Lecture (Graph Algorithms)',
    type: 'class',
    start: '2026-09-29T09:30:00',
    end: '2026-09-29T11:00:00',
    location: 'Aryabhatta Block - LH 302',
    description: 'Discussion on Minimum Spanning Trees (Prim & Kruskal)',
    color: '#2563EB'
  },
  {
    id: 'ev_2',
    title: 'CS502: Database Systems Lab Session',
    type: 'class',
    start: '2026-09-29T11:15:00',
    end: '2026-09-29T12:45:00',
    location: 'Ramanujan Lab 4',
    description: 'PostgreSQL Index optimization and EXPLAIN query plan analysis',
    color: '#0284C7'
  },
  {
    id: 'ev_3',
    title: 'Mentor 1-on-1 Check-in with Lead Counselor',
    type: 'meeting',
    start: '2026-09-30T14:30:00',
    end: '2026-09-30T15:15:00',
    location: 'Counseling Center - Room 104',
    description: 'Review academic schedule pacing and supportive study strategies',
    color: '#D97706'
  },
  {
    id: 'ev_4',
    title: 'Presidency Hackathon 2026 Inaugural Keynote',
    type: 'event',
    start: '2026-10-02T10:00:00',
    end: '2026-10-02T12:00:00',
    location: 'Sir M. Visvesvaraya Auditorium',
    description: 'Annual inter-departmental innovation hackathon opening ceremony',
    color: '#16A34A'
  },
  {
    id: 'ev_5',
    title: 'CS501 Assignment 3 Submission Deadline',
    type: 'assignment',
    start: '2026-10-06T23:59:00',
    end: '2026-10-06T23:59:00',
    location: 'Digital LMS Portal',
    description: 'Dynamic Programming & Graph Traversal submission closes',
    color: '#DC2626'
  }
];

export const SAMPLE_BUS_ROUTES: BusRoute[] = [
  {
    id: 'bus_1',
    routeNumber: 'Route 04',
    routeName: 'Hebbal - Yelahanka - Presidency Main Gate',
    stops: ['Hebbal Flyover', 'Kodigehalli Gate', 'Sahakara Nagar', 'Jakkur Aerodrome', 'Yelahanka Police Station', 'Presidency Campus'],
    currentStopIndex: 3,
    status: 'in_transit',
    departureTime: '07:35 AM',
    estimatedArrival: '08:45 AM',
    driverName: 'Mr. Ramesh Babu',
    driverPhone: '+91 94480 34120',
    busNumber: 'KA-04-E-8821',
    occupancy: 82
  },
  {
    id: 'bus_2',
    routeNumber: 'Route 11',
    routeName: 'Indiranagar - Kalyan Nagar - Presidency Campus',
    stops: ['Indiranagar Metro', 'Domlur Bridge', 'Kalyan Nagar Ring Road', 'Hennur Cross', 'Nagavara Junction', 'Presidency Campus'],
    currentStopIndex: 4,
    status: 'on_time',
    departureTime: '07:20 AM',
    estimatedArrival: '08:40 AM',
    driverName: 'Mr. Suresh Gowda',
    driverPhone: '+91 94481 55670',
    busNumber: 'KA-04-E-9042',
    occupancy: 76
  },
  {
    id: 'bus_3',
    routeNumber: 'Route 18',
    routeName: 'Malleshwaram - Rajajinagar - Presidency Campus',
    stops: ['Navrang Theatre', 'Malleshwaram 8th Cross', 'Yeshwanthpur TTMC', 'Goraguntepalya', 'Peenya Metro', 'Presidency Campus'],
    currentStopIndex: 2,
    status: 'delayed',
    departureTime: '07:15 AM',
    estimatedArrival: '08:55 AM (15m delay)',
    driverName: 'Mr. Venkatesh Murthy',
    driverPhone: '+91 94482 11984',
    busNumber: 'KA-04-E-7119',
    occupancy: 90
  }
];

export const SAMPLE_CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: 'loc_1',
    name: 'Sir M. Visvesvaraya Administrative & Academic Block',
    category: 'admin',
    building: 'Block A (Main Tower)',
    floor: 'Floors G, 1 & 2',
    coordinates: { x: 32, y: 44 },
    description: 'Principal’s Office, Registrar, Admissions, Controller of Examinations, and Student Welfare Directorate.',
    openHours: '08:30 AM - 05:30 PM',
    facilities: ['Executive Boardrooms', 'Student Service Helpdesk', 'Accounts Counter', 'Atmosphere Lounge']
  },
  {
    id: 'loc_2',
    name: 'Aryabhatta Computing & Engineering Center',
    category: 'academic',
    building: 'Block B',
    floor: 'Floors 1 to 4',
    coordinates: { x: 55, y: 35 },
    description: 'Computer Science, AI & Machine Learning, Electronics and Information Science lecture theatres.',
    openHours: '08:00 AM - 07:00 PM',
    facilities: ['Smart Interactive Classrooms', 'Faculty Chambers', 'Robotics Hub', 'IoT Hardware Sandbox']
  },
  {
    id: 'loc_3',
    name: 'Central University Library & Knowledge Commons',
    category: 'library',
    building: 'Central Learning Block',
    floor: 'Floors 1 & 2',
    coordinates: { x: 42, y: 62 },
    description: 'Air-conditioned digital resource pavilion with 85,000+ volumes, IEEE/ACM digital access, and silent cubicles.',
    openHours: '08:00 AM - 09:00 PM',
    facilities: ['High-speed Wi-Fi', 'Audio-Visual Media Room', 'Discussion Pods', 'E-Book Kiosks']
  },
  {
    id: 'loc_4',
    name: 'Ramanujan Advanced Computing Labs',
    category: 'labs',
    building: 'Block C (Technology Wing)',
    floor: 'Floors 2 & 3',
    coordinates: { x: 68, y: 52 },
    description: 'High performance cluster computing with NVIDIA GPUs, cloud server nodes, and distributed computing suites.',
    openHours: '08:00 AM - 08:00 PM',
    facilities: ['GPU Workstations', 'Cloud Sandbox', 'Dual-Boot OS', 'Cisco Network Testbed']
  },
  {
    id: 'loc_5',
    name: 'Center for Student Wellbeing & Mentorship',
    category: 'amenities',
    building: 'Student Activity Hub',
    floor: 'Ground Floor, Room 104',
    coordinates: { x: 25, y: 70 },
    description: 'Private, confidential counseling suites, peer-mentorship meeting rooms, and career guidance consultation.',
    openHours: '09:00 AM - 06:00 PM',
    facilities: ['Private Counseling Rooms', 'Relaxation Lounge', 'Career Advisory Helpdesk']
  },
  {
    id: 'loc_6',
    name: 'Presidency Sports Pavilion & Gymnasium',
    category: 'sports',
    building: 'Sports Complex',
    floor: 'Ground & 1st Floor',
    coordinates: { x: 78, y: 78 },
    description: 'Indoor badminton courts, synthetic basketball court, table tennis, modern fitness gym, and athletic field.',
    openHours: '06:00 AM - 08:30 PM',
    facilities: ['Badminton Courts', 'Basketball Arena', 'Gymnasium', 'Sports Medical Bay']
  }
];

export const SAMPLE_PROJECT: CollaborativeProject = {
  id: 'proj_1',
  title: 'Smart Campus Edge-AI Attendance & Analytics System',
  course: 'CS501 - Capstone Engineering Practicum',
  deadline: '2026-11-20',
  description: 'Building an offline-first computer vision and explainable anomaly detection edge pipeline deployed across institutional checkpoints.',
  members: [
    { name: 'Aditya Vardhan Rao', role: 'Team Lead & ML Architect', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&h=200&q=80' },
    { name: 'Sneha Patil', role: 'Full-Stack Developer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80' },
    { name: 'Karthik Reddy', role: 'Embedded Systems Specialist', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80' },
    { name: 'Dr. Rajeshwari Krishnan', role: 'Faculty Advisor', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80' }
  ],
  tasks: [
    {
      id: 'task_1',
      title: 'Design high-concurrency REST & WebSocket schemas',
      description: 'Document endpoints for real-time edge streaming and client telemetry synchronization.',
      status: 'done',
      priority: 'high',
      assignee: 'Aditya Vardhan Rao',
      dueDate: '2026-09-22',
      tags: ['API', 'Architecture']
    },
    {
      id: 'task_2',
      title: 'Implement SHAP feature importance calculation in Python',
      description: 'Integrate TreeExplainer for Random Forest and XGBoost outputs to render waterfall charts.',
      status: 'in_progress',
      priority: 'urgent',
      assignee: 'Aditya Vardhan Rao',
      dueDate: '2026-10-02',
      tags: ['ML', 'Explainability']
    },
    {
      id: 'task_3',
      title: 'Build responsive Kanban board with drag-and-drop',
      description: 'Create fluid column transitions with state persistence in IndexedDB / LocalStorage.',
      status: 'in_progress',
      priority: 'medium',
      assignee: 'Sneha Patil',
      dueDate: '2026-10-05',
      tags: ['Frontend', 'React']
    },
    {
      id: 'task_4',
      title: 'Camera edge firmware optimization on Jetson Orin',
      description: 'Optimize tensorRT inference pipeline to sustain 30fps under varying daylight intensities.',
      status: 'todo',
      priority: 'high',
      assignee: 'Karthik Reddy',
      dueDate: '2026-10-14',
      tags: ['Embedded', 'Optimization']
    },
    {
      id: 'task_5',
      title: 'Peer code review and security audit for JWT tokens',
      description: 'Ensure CSRF and XSS protection with strict SameSite cookies and refresh token rotation.',
      status: 'review',
      priority: 'medium',
      assignee: 'Dr. Rajeshwari Krishnan',
      dueDate: '2026-10-08',
      tags: ['Security', 'Audit']
    }
  ]
};
