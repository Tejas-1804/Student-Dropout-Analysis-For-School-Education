export type UserRole = 'student' | 'faculty' | 'mentor' | 'admin';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  designation?: string;
  studentId?: string;
  phone?: string;
  semester?: number;
}

export interface ShapContribution {
  feature: string;
  observedValue: string;
  impactScore: number; // percentage or weight, e.g. +34 or -15
  direction: 'increases_risk' | 'decreases_risk' | 'neutral';
  explanation: string;
}

export interface RiskHistoryPoint {
  semester: string;
  riskLevel: RiskLevel;
  score: number;
  date: string;
}

export interface RiskAssessment {
  level: RiskLevel;
  score: number; // 0 - 100
  lastEvaluated: string;
  isHumanReviewed: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
  shapValues: ShapContribution[];
  riskHistory: RiskHistoryPoint[];
  recommendedActions: string[];
}

export interface InterventionActionItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface InterventionNote {
  id: string;
  author: string;
  authorRole: string;
  text: string;
  timestamp: string;
}

export type InterventionStatus =
  | 'new'
  | 'under_review'
  | 'student_contacted'
  | 'support_assigned'
  | 'followup_required'
  | 'resolved';

export interface Intervention {
  id: string;
  studentId: string;
  studentName: string;
  department: string;
  semester: number;
  title: string;
  type:
    | 'academic_mentoring'
    | 'counseling_session'
    | 'attendance_check'
    | 'remedial_classes'
    | 'financial_aid'
    | 'parental_connect';
  status: InterventionStatus;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  assignedTo: string;
  assignedRole: string;
  createdAt: string;
  updatedAt: string;
  nextFollowUpDate: string;
  notes: InterventionNote[];
  actionItems: InterventionActionItem[];
}

export interface SubjectAttendance {
  subjectCode: string;
  subjectName: string;
  attended: number;
  total: number;
  percentage: number;
  facultyName: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  semester: number;
  credits: number;
  facultyName: string;
  facultyId: string;
  scheduleTime: string;
  room: string;
  syllabusProgress: number; // 0 - 100
  totalClasses: number;
  enrolledStudentsCount: number;
  materialsCount: number;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  submissionsCount: number;
  totalStudents: number;
  status: 'upcoming' | 'ongoing' | 'graded';
  userSubmission?: {
    submittedAt: string;
    score?: number;
    fileUrl?: string;
    feedback?: string;
    status: 'submitted' | 'late' | 'pending' | 'graded';
  };
}

export interface Exam {
  id: string;
  courseCode: string;
  courseName: string;
  examType: 'Mid-Term' | 'End-Term' | 'Lab Practical' | 'Continuous Assessment';
  date: string;
  time: string;
  venue: string;
  duration: string;
  maxMarks: number;
  marksObtained?: number;
  syllabusCovered: string;
}

export interface GradeItem {
  courseCode: string;
  courseName: string;
  credits: number;
  internalMarks: number;
  externalMarks: number;
  totalMarks: number;
  grade: string;
  gradePoint: number;
}

export interface SemesterTranscript {
  semester: number;
  academicYear: string;
  gpa: number;
  cgpa: number;
  totalCredits: number;
  courses: GradeItem[];
}

export interface Student {
  id: string;
  studentId: string; // e.g. "PC2024CS101"
  name: string;
  email: string;
  avatar: string;
  phone: string;
  department: string;
  course: string;
  semester: number;
  section: string;
  admissionYear: number;
  mentorName: string;
  guardianName: string;
  guardianPhone: string;
  
  // Academic Metrics
  cgpa: number;
  currentGpa: number;
  attendanceRate: number; // percentage
  subjectAttendance: SubjectAttendance[];
  assignmentsCompleted: number;
  assignmentsTotal: number;
  missedAssignments: number;
  recentExamAverage: number;
  academicTrend: 'improving' | 'stable' | 'declining';
  
  // Dropout Early Warning
  riskAssessment: RiskAssessment;
  
  // Interventions
  interventions: Intervention[];
  
  // Transcripts & Records
  transcripts: SemesterTranscript[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'academic' | 'assignment' | 'exam' | 'support_alert' | 'emergency' | 'transport' | 'event';
  timestamp: string;
  read: boolean;
  severity?: 'info' | 'warning' | 'urgent' | 'critical';
  linkTab?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'class' | 'assignment' | 'exam' | 'event' | 'meeting' | 'study_group';
  start: string;
  end: string;
  location: string;
  description: string;
  color?: string;
}

export interface BusRoute {
  id: string;
  routeNumber: string;
  routeName: string;
  stops: string[];
  currentStopIndex: number;
  status: 'on_time' | 'delayed' | 'in_transit' | 'completed';
  departureTime: string;
  estimatedArrival: string;
  driverName: string;
  driverPhone: string;
  busNumber: string;
  occupancy: number; // e.g. 74%
}

export interface CampusLocation {
  id: string;
  name: string;
  category: 'academic' | 'labs' | 'admin' | 'amenities' | 'library' | 'sports';
  building: string;
  floor: string;
  coordinates: { x: number; y: number }; // percentage inside svg
  description: string;
  openHours: string;
  facilities: string[];
}

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  assignee: string;
  dueDate: string;
  tags: string[];
}

export interface CollaborativeProject {
  id: string;
  title: string;
  course: string;
  deadline: string;
  description: string;
  members: { name: string; role: string; avatar: string }[];
  tasks: KanbanTask[];
}
