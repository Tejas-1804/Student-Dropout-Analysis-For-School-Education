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
  Intervention,
  InterventionStatus,
  UserRole
} from '../types';
import {
  INITIAL_USERS,
  SAMPLE_STUDENTS,
  SAMPLE_COURSES,
  SAMPLE_ASSIGNMENTS,
  SAMPLE_EXAMS,
  SAMPLE_NOTIFICATIONS,
  SAMPLE_CALENDAR_EVENTS,
  SAMPLE_BUS_ROUTES,
  SAMPLE_CAMPUS_LOCATIONS,
  SAMPLE_PROJECT
} from '../data/sampleData';
import { computeExplainableRisk } from './riskEngine';

const STORAGE_KEYS = {
  USERS: 'pc_platform_users_v1',
  CURRENT_USER: 'pc_platform_current_user_v1',
  STUDENTS: 'pc_platform_students_v1',
  COURSES: 'pc_platform_courses_v1',
  ASSIGNMENTS: 'pc_platform_assignments_v1',
  EXAMS: 'pc_platform_exams_v1',
  NOTIFICATIONS: 'pc_platform_notifications_v1',
  CALENDAR: 'pc_platform_calendar_v1',
  BUS_ROUTES: 'pc_platform_bus_routes_v1',
  CAMPUS_LOCATIONS: 'pc_platform_campus_locations_v1',
  PROJECT: 'pc_platform_project_v1',
  OFFLINE_MODE: 'pc_platform_offline_mode_v1',
  LAST_SYNC: 'pc_platform_last_sync_v1',
  THEME_MODE: 'pc_platform_theme_mode_v1'
};

class StorageService {
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      // Default to Dean Dr. Anand Ramanathan (Admin) so user gets the full institutional early-warning view first
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(SAMPLE_STUDENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(SAMPLE_COURSES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS)) {
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(SAMPLE_ASSIGNMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.EXAMS)) {
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(SAMPLE_EXAMS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SAMPLE_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CALENDAR)) {
      localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(SAMPLE_CALENDAR_EVENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BUS_ROUTES)) {
      localStorage.setItem(STORAGE_KEYS.BUS_ROUTES, JSON.stringify(SAMPLE_BUS_ROUTES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CAMPUS_LOCATIONS)) {
      localStorage.setItem(STORAGE_KEYS.CAMPUS_LOCATIONS, JSON.stringify(SAMPLE_CAMPUS_LOCATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROJECT)) {
      localStorage.setItem(STORAGE_KEYS.PROJECT, JSON.stringify(SAMPLE_PROJECT));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LAST_SYNC)) {
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    }
    if (!localStorage.getItem(STORAGE_KEYS.OFFLINE_MODE)) {
      localStorage.setItem(STORAGE_KEYS.OFFLINE_MODE, 'false');
    }
  }

  public subscribe(cb: () => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }

  // --- Auth & Users ---
  public getUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : INITIAL_USERS;
  }

  public getCurrentUser(): User {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : INITIAL_USERS[0];
  }

  public setCurrentUser(user: User) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    this.notify();
  }

  public switchRole(role: UserRole) {
    const users = this.getUsers();
    const match = users.find((u) => u.role === role);
    if (match) {
      this.setCurrentUser(match);
    } else {
      const fallback: User = {
        id: `user_${role}_temp`,
        name: role === 'student' ? 'Aditya Vardhan Rao' : role === 'faculty' ? 'Dr. Rajeshwari Krishnan' : role === 'mentor' ? 'Smt. Kavitha Rao' : 'Dr. Anand Ramanathan',
        email: `${role}@presidencycollege.ac.in`,
        role,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
        department: 'Presidency Academic Division'
      };
      this.setCurrentUser(fallback);
    }
  }

  // --- Students ---
  public getStudents(): Student[] {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return raw ? JSON.parse(raw) : SAMPLE_STUDENTS;
  }

  public getStudentById(id: string): Student | undefined {
    return this.getStudents().find((s) => s.id === id || s.studentId === id);
  }

  public updateStudent(updatedStudent: Student) {
    const students = this.getStudents();
    const index = students.findIndex((s) => s.id === updatedStudent.id);
    if (index >= 0) {
      students[index] = updatedStudent;
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      this.notify();
    }
  }

  // --- Support Interventions & Human Review ---
  public markHumanReview(studentId: string, reviewerName: string, reviewerRole: string, noteText?: string) {
    const students = this.getStudents();
    const student = students.find((s) => s.id === studentId || s.studentId === studentId);
    if (!student) return;

    student.riskAssessment.isHumanReviewed = true;
    student.riskAssessment.reviewedBy = `${reviewerName} (${reviewerRole})`;
    student.riskAssessment.reviewedAt = new Date().toLocaleString();
    if (noteText) {
      student.riskAssessment.notes = noteText;
    }

    this.updateStudent(student);
  }

  public createIntervention(
    studentId: string,
    interventionData: {
      title: string;
      type: Intervention['type'];
      priority: Intervention['priority'];
      assignedTo: string;
      assignedRole: string;
      nextFollowUpDate: string;
      initialNote?: string;
    }
  ) {
    const students = this.getStudents();
    const student = students.find((s) => s.id === studentId || s.studentId === studentId);
    if (!student) return;

    const newIntervention: Intervention = {
      id: `int_${Date.now()}`,
      studentId: student.studentId,
      studentName: student.name,
      department: student.department,
      semester: student.semester,
      title: interventionData.title,
      type: interventionData.type,
      status: 'support_assigned',
      priority: interventionData.priority,
      assignedTo: interventionData.assignedTo,
      assignedRole: interventionData.assignedRole,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      nextFollowUpDate: interventionData.nextFollowUpDate,
      notes: interventionData.initialNote
        ? [
            {
              id: `note_${Date.now()}`,
              author: interventionData.assignedTo,
              authorRole: interventionData.assignedRole,
              text: interventionData.initialNote,
              timestamp: new Date().toLocaleString()
            }
          ]
        : [],
      actionItems: [
        { id: `act_${Date.now()}_1`, text: 'Conduct initial 1-on-1 support check-in', completed: false },
        { id: `act_${Date.now()}_2`, text: 'Review academic schedule & resources', completed: false }
      ]
    };

    student.interventions.unshift(newIntervention);
    student.riskAssessment.isHumanReviewed = true;
    student.riskAssessment.reviewedBy = `${interventionData.assignedTo} (${interventionData.assignedRole})`;
    student.riskAssessment.reviewedAt = new Date().toLocaleString();

    this.updateStudent(student);

    // Add notification
    this.addNotification({
      title: 'New Support Intervention Registered',
      message: `Support plan "${interventionData.title}" activated for student ${student.name} (${student.studentId}).`,
      category: 'support_alert',
      severity: interventionData.priority === 'urgent' ? 'urgent' : 'warning',
      linkTab: 'earlywarning'
    });
  }

  public updateInterventionStatus(
    studentId: string,
    interventionId: string,
    status: InterventionStatus,
    noteText?: string,
    authorName?: string,
    authorRole?: string
  ) {
    const students = this.getStudents();
    const student = students.find((s) => s.id === studentId || s.studentId === studentId);
    if (!student) return;

    const intervention = student.interventions.find((i) => i.id === interventionId);
    if (!intervention) return;

    intervention.status = status;
    intervention.updatedAt = new Date().toISOString().split('T')[0];

    if (noteText && authorName) {
      intervention.notes.push({
        id: `note_${Date.now()}`,
        author: authorName,
        authorRole: authorRole || 'Staff',
        text: noteText,
        timestamp: new Date().toLocaleString()
      });
    }

    this.updateStudent(student);
  }

  public addInterventionNote(
    studentId: string,
    interventionId: string,
    text: string,
    author: string,
    authorRole: string
  ) {
    const students = this.getStudents();
    const student = students.find((s) => s.id === studentId || s.studentId === studentId);
    if (!student) return;

    const intervention = student.interventions.find((i) => i.id === interventionId);
    if (!intervention) return;

    intervention.notes.push({
      id: `note_${Date.now()}`,
      author,
      authorRole,
      text,
      timestamp: new Date().toLocaleString()
    });
    intervention.updatedAt = new Date().toISOString().split('T')[0];

    this.updateStudent(student);
  }

  public toggleInterventionActionItem(studentId: string, interventionId: string, actionId: string) {
    const students = this.getStudents();
    const student = students.find((s) => s.id === studentId || s.studentId === studentId);
    if (!student) return;

    const intervention = student.interventions.find((i) => i.id === interventionId);
    if (!intervention) return;

    const item = intervention.actionItems.find((a) => a.id === actionId);
    if (item) {
      item.completed = !item.completed;
      intervention.updatedAt = new Date().toISOString().split('T')[0];
      this.updateStudent(student);
    }
  }

  // --- Recalculate Risk Assessment with ML Engine ---
  public evaluateStudentWithML(studentId: string) {
    const students = this.getStudents();
    const student = students.find((s) => s.id === studentId || s.studentId === studentId);
    if (!student) return;

    const assessment = computeExplainableRisk({
      attendanceRate: student.attendanceRate,
      cgpa: student.cgpa,
      missedAssignments: student.missedAssignments,
      recentExamAverage: student.recentExamAverage,
      academicTrend: student.academicTrend,
      daysSinceLastLMSLogin: student.riskAssessment.level === 'HIGH' ? 8 : 1
    });

    student.riskAssessment = assessment;
    this.updateStudent(student);
  }

  // --- Courses ---
  public getCourses(): Course[] {
    const raw = localStorage.getItem(STORAGE_KEYS.COURSES);
    return raw ? JSON.parse(raw) : SAMPLE_COURSES;
  }

  // --- Attendance Recording ---
  public recordClassAttendance(courseCode: string, studentAttendanceMap: Record<string, boolean>) {
    const students = this.getStudents();
    let updatedCount = 0;

    students.forEach((student) => {
      const subject = student.subjectAttendance.find((s) => s.subjectCode === courseCode);
      if (subject && studentAttendanceMap[student.id] !== undefined) {
        subject.total += 1;
        if (studentAttendanceMap[student.id]) {
          subject.attended += 1;
        }
        subject.percentage = Math.round((subject.attended / subject.total) * 100);

        // Update overall attendance
        const avg = Math.round(
          student.subjectAttendance.reduce((acc, curr) => acc + curr.percentage, 0) /
            student.subjectAttendance.length
        );
        student.attendanceRate = avg;

        // Automatically trigger explainable ML re-evaluation
        student.riskAssessment = computeExplainableRisk({
          attendanceRate: student.attendanceRate,
          cgpa: student.cgpa,
          missedAssignments: student.missedAssignments,
          recentExamAverage: student.recentExamAverage,
          academicTrend: student.academicTrend
        });

        updatedCount++;
      }
    });

    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    this.notify();

    this.addNotification({
      title: `Attendance Recorded for ${courseCode}`,
      message: `Successfully logged attendance session for ${updatedCount} students. Model risk assessments refreshed.`,
      category: 'academic',
      severity: 'info'
    });
  }

  // --- Assignments ---
  public getAssignments(): Assignment[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    return raw ? JSON.parse(raw) : SAMPLE_ASSIGNMENTS;
  }

  public createAssignment(newAsg: Omit<Assignment, 'id' | 'submissionsCount' | 'status'>) {
    const assignments = this.getAssignments();
    const created: Assignment = {
      ...newAsg,
      id: `asg_${Date.now()}`,
      submissionsCount: 0,
      status: 'upcoming'
    };
    assignments.unshift(created);
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
    this.notify();

    this.addNotification({
      title: `New Assignment Published: ${created.title}`,
      message: `${created.courseCode} assignment due on ${new Date(created.dueDate).toLocaleDateString()}.`,
      category: 'assignment',
      severity: 'info',
      linkTab: 'assignments'
    });
  }

  public submitAssignment(assignmentId: string, fileName: string) {
    const assignments = this.getAssignments();
    const asg = assignments.find((a) => a.id === assignmentId);
    if (asg) {
      asg.submissionsCount += 1;
      asg.userSubmission = {
        submittedAt: new Date().toISOString(),
        fileUrl: fileName,
        status: 'submitted'
      };
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
      this.notify();

      this.addNotification({
        title: 'Assignment Submitted Successfully',
        message: `Your deliverable for "${asg.title}" has been archived and time-stamped.`,
        category: 'assignment',
        severity: 'info'
      });
    }
  }

  // --- Exams ---
  public getExams(): Exam[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EXAMS);
    return raw ? JSON.parse(raw) : SAMPLE_EXAMS;
  }

  // --- Notifications ---
  public getNotifications(): NotificationItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return raw ? JSON.parse(raw) : SAMPLE_NOTIFICATIONS;
  }

  public addNotification(item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) {
    const notifs = this.getNotifications();
    const newNotif: NotificationItem = {
      ...item,
      id: `notif_${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };
    notifs.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    this.notify();
  }

  public markAllNotificationsRead() {
    const notifs = this.getNotifications().map((n) => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    this.notify();
  }

  // --- Emergency Alert Broadcast ---
  public broadcastEmergencyAlert(alert: {
    title: string;
    message: string;
    severity: 'urgent' | 'critical';
    audience: string;
  }) {
    this.addNotification({
      title: `EMERGENCY ALERT: ${alert.title}`,
      message: `[Broadcast to ${alert.audience}]: ${alert.message}`,
      category: 'emergency',
      severity: alert.severity,
      linkTab: 'notifications'
    });
  }

  // --- Calendar ---
  public getCalendarEvents(): CalendarEvent[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CALENDAR);
    return raw ? JSON.parse(raw) : SAMPLE_CALENDAR_EVENTS;
  }

  public addCalendarEvent(ev: Omit<CalendarEvent, 'id'>) {
    const events = this.getCalendarEvents();
    const created: CalendarEvent = { ...ev, id: `ev_${Date.now()}` };
    events.push(created);
    localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(events));
    this.notify();
  }

  // --- Bus & Transport ---
  public getBusRoutes(): BusRoute[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BUS_ROUTES);
    return raw ? JSON.parse(raw) : SAMPLE_BUS_ROUTES;
  }

  // --- Campus Map Locations ---
  public getCampusLocations(): CampusLocation[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CAMPUS_LOCATIONS);
    return raw ? JSON.parse(raw) : SAMPLE_CAMPUS_LOCATIONS;
  }

  // --- Collaborative Projects (Kanban) ---
  public getProject(): CollaborativeProject {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECT);
    return raw ? JSON.parse(raw) : SAMPLE_PROJECT;
  }

  public updateProjectTasks(tasks: CollaborativeProject['tasks']) {
    const project = this.getProject();
    project.tasks = tasks;
    localStorage.setItem(STORAGE_KEYS.PROJECT, JSON.stringify(project));
    this.notify();
  }

  public addProjectTask(task: Omit<CollaborativeProject['tasks'][0], 'id'>) {
    const project = this.getProject();
    project.tasks.push({
      ...task,
      id: `task_${Date.now()}`
    });
    localStorage.setItem(STORAGE_KEYS.PROJECT, JSON.stringify(project));
    this.notify();
  }

  // --- Offline Mode & Sync ---
  public isOfflineMode(): boolean {
    return localStorage.getItem(STORAGE_KEYS.OFFLINE_MODE) === 'true';
  }

  public setOfflineMode(offline: boolean) {
    localStorage.setItem(STORAGE_KEYS.OFFLINE_MODE, offline ? 'true' : 'false');
    if (!offline) {
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    }
    this.notify();
  }

  public getLastSyncTime(): string {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || new Date().toISOString();
  }

  public syncCloudData(): Promise<{ success: boolean; syncedItems: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
        this.notify();
        resolve({ success: true, syncedItems: 50 });
      }, 750);
    });
  }

  // --- Reset demo data ---
  public resetToDefault() {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.COURSES);
    localStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS);
    localStorage.removeItem(STORAGE_KEYS.EXAMS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.CALENDAR);
    localStorage.removeItem(STORAGE_KEYS.PROJECT);
    this.init();
    this.notify();
  }
}

export const storageService = new StorageService();
