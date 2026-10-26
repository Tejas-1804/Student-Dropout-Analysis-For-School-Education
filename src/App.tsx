import React, { useState, useEffect } from 'react';
import {
  Student,
  User,
  UserRole,
  Course,
  Assignment,
  Exam,
  NotificationItem,
  CalendarEvent,
  BusRoute,
  CampusLocation,
  CollaborativeProject
} from './types';
import { storageService } from './services/storage';

// Layout & Common Components
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { CommandPalette } from './components/common/CommandPalette';
import { OfflineBanner } from './components/common/OfflineBanner';
import { SettingsView } from './components/common/SettingsView';

// Landing & Auth
import { LandingPage } from './components/landing/LandingPage';
import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';

// Dashboards
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { FacultyDashboard } from './components/dashboard/FacultyDashboard';
import { MentorDashboard } from './components/dashboard/MentorDashboard';
import { DropoutEarlyWarningCenter } from './components/earlywarning/DropoutEarlyWarningCenter';

// Detail & Modals
import { StudentProfileView } from './components/student/StudentProfileView';
import { WhyThisAlertModal } from './components/earlywarning/WhyThisAlertModal';
import { InterventionModal } from './components/earlywarning/InterventionModal';

// Academic Views
import { AttendanceView } from './components/academic/AttendanceView';
import { AssignmentsView } from './components/academic/AssignmentsView';
import { CalendarView } from './components/calendar/CalendarView';
import { CampusMapView } from './components/campus/CampusMapView';
import { TransportView } from './components/campus/TransportView';
import { ProjectsWorkspace } from './components/collaboration/ProjectsWorkspace';
import { NotificationCenter } from './components/notifications/NotificationCenter';
import { EmergencyAlertModal } from './components/notifications/EmergencyAlertModal';
import { AnalyticsReportsView } from './components/analytics/AnalyticsReportsView';

export default function App() {
  // App Navigation & View Modes
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('app');
  const [activeTab, setActiveTab] = useState<string>('earlywarning');

  // Core Data States synchronized from storageService
  const [currentUser, setCurrentUser] = useState<User>(storageService.getCurrentUser());
  const [students, setStudents] = useState<Student[]>(storageService.getStudents());
  const [courses, setCourses] = useState<Course[]>(storageService.getCourses());
  const [assignments, setAssignments] = useState<Assignment[]>(storageService.getAssignments());
  const [exams, setExams] = useState<Exam[]>(storageService.getExams());
  const [notifications, setNotifications] = useState<NotificationItem[]>(storageService.getNotifications());
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(storageService.getCalendarEvents());
  const [busRoutes, setBusRoutes] = useState<BusRoute[]>(storageService.getBusRoutes());
  const [campusLocations, setCampusLocations] = useState<CampusLocation[]>(storageService.getCampusLocations());
  const [project, setProject] = useState<CollaborativeProject>(storageService.getProject());
  const [isOffline, setIsOffline] = useState<boolean>(storageService.isOfflineMode());
  const [lastSyncTime, setLastSyncTime] = useState<string>(storageService.getLastSyncTime());

  // Modals & Panels
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [whyAlertStudent, setWhyAlertStudent] = useState<Student | null>(null);
  const [supportPlanStudent, setSupportPlanStudent] = useState<Student | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setCurrentUser(storageService.getCurrentUser());
      setStudents(storageService.getStudents());
      setCourses(storageService.getCourses());
      setAssignments(storageService.getAssignments());
      setExams(storageService.getExams());
      setNotifications(storageService.getNotifications());
      setCalendarEvents(storageService.getCalendarEvents());
      setBusRoutes(storageService.getBusRoutes());
      setCampusLocations(storageService.getCampusLocations());
      setProject(storageService.getProject());
      setIsOffline(storageService.isOfflineMode());
      setLastSyncTime(storageService.getLastSyncTime());

      // If active student profile is open, update reference
      if (selectedStudentForProfile) {
        const fresh = storageService.getStudentById(selectedStudentForProfile.id);
        if (fresh) setSelectedStudentForProfile(fresh);
      }
      if (whyAlertStudent) {
        const fresh = storageService.getStudentById(whyAlertStudent.id);
        if (fresh) setWhyAlertStudent(fresh);
      }
    });

    return () => unsubscribe();
  }, [selectedStudentForProfile, whyAlertStudent]);

  // Global Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleRoleChange = (role: UserRole) => {
    storageService.switchRole(role);
    if (role === 'student') {
      setActiveTab('dashboard');
    } else if (role === 'faculty') {
      setActiveTab('dashboard');
    } else if (role === 'mentor') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('earlywarning');
    }
  };

  const handleToggleOffline = () => {
    storageService.setOfflineMode(!isOffline);
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleNavigate = (tab: string) => {
    setSelectedStudentForProfile(null);
    setActiveTab(tab);
  };

  const handleEnterPlatformFromLanding = (role?: UserRole) => {
    if (role) {
      storageService.switchRole(role);
    }
    setCurrentView('app');
    setActiveTab(role === 'student' ? 'dashboard' : 'earlywarning');
  };

  const handleViewStudentProfile = (student: Student) => {
    setSelectedStudentForProfile(student);
  };

  // Main Content Renderer based on active role and tab
  const renderMainContent = () => {
    // If a specific student profile is open
    if (selectedStudentForProfile) {
      return (
        <StudentProfileView
          student={selectedStudentForProfile}
          currentUser={currentUser}
          onBack={() => setSelectedStudentForProfile(null)}
          onOpenWhyAlert={(s) => setWhyAlertStudent(s)}
          onCreateSupportPlan={(s) => setSupportPlanStudent(s)}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        if (currentUser.role === 'student') {
          const studentSelf =
            students.find((s) => s.studentId === currentUser.studentId) || students[0];
          return (
            <StudentDashboard
              student={studentSelf}
              assignments={assignments}
              exams={exams}
              courses={courses}
              calendarEvents={calendarEvents}
              onNavigate={handleNavigate}
              onOpenSubmissionModal={(asg) => setActiveTab('assignments')}
            />
          );
        }
        if (currentUser.role === 'faculty') {
          return (
            <FacultyDashboard
              currentUser={currentUser}
              courses={courses}
              students={students}
              assignments={assignments}
              onOpenWhyAlert={(s) => setWhyAlertStudent(s)}
              onCreateSupportPlan={(s) => setSupportPlanStudent(s)}
              onNavigate={handleNavigate}
            />
          );
        }
        if (currentUser.role === 'mentor') {
          return (
            <MentorDashboard
              currentUser={currentUser}
              students={students}
              onOpenWhyAlert={(s) => setWhyAlertStudent(s)}
              onCreateSupportPlan={(s) => setSupportPlanStudent(s)}
              onViewStudentProfile={handleViewStudentProfile}
              onNavigate={handleNavigate}
            />
          );
        }
        // Admin default to Early-Warning Center
        return (
          <DropoutEarlyWarningCenter
            students={students}
            currentUser={currentUser}
            onOpenWhyAlert={(s) => setWhyAlertStudent(s)}
            onCreateSupportPlan={(s) => setSupportPlanStudent(s)}
            onViewStudentProfile={handleViewStudentProfile}
          />
        );

      case 'earlywarning':
        return (
          <DropoutEarlyWarningCenter
            students={students}
            currentUser={currentUser}
            onOpenWhyAlert={(s) => setWhyAlertStudent(s)}
            onCreateSupportPlan={(s) => setSupportPlanStudent(s)}
            onViewStudentProfile={handleViewStudentProfile}
          />
        );

      case 'students':
        if (currentUser.role === 'student') {
          const studentSelf =
            students.find((s) => s.studentId === currentUser.studentId) || students[0];
          return (
            <StudentProfileView
              student={studentSelf}
              currentUser={currentUser}
              onBack={() => handleNavigate('dashboard')}
              onOpenWhyAlert={(s) => setWhyAlertStudent(s)}
              onCreateSupportPlan={(s) => setSupportPlanStudent(s)}
            />
          );
        }
        return (
          <DropoutEarlyWarningCenter
            students={students}
            currentUser={currentUser}
            onOpenWhyAlert={(s) => setWhyAlertStudent(s)}
            onCreateSupportPlan={(s) => setSupportPlanStudent(s)}
            onViewStudentProfile={handleViewStudentProfile}
          />
        );

      case 'attendance':
        return (
          <AttendanceView
            students={students}
            courses={courses}
            currentUser={currentUser}
          />
        );

      case 'assignments':
        return (
          <AssignmentsView
            assignments={assignments}
            courses={courses}
            currentUser={currentUser}
          />
        );

      case 'academic':
        return (
          <AttendanceView
            students={students}
            courses={courses}
            currentUser={currentUser}
          />
        );

      case 'calendar':
        return <CalendarView events={calendarEvents} />;

      case 'campus':
        return <CampusMapView locations={campusLocations} />;

      case 'transport':
        return <TransportView routes={busRoutes} />;

      case 'projects':
        return <ProjectsWorkspace project={project} />;

      case 'notifications':
        return (
          <NotificationCenter
            notifications={notifications}
            currentUser={currentUser}
            onNavigate={handleNavigate}
          />
        );

      case 'analytics':
        return <AnalyticsReportsView students={students} />;

      case 'settings':
        return (
          <SettingsView
            currentUser={currentUser}
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
          />
        );

      default:
        return (
          <DropoutEarlyWarningCenter
            students={students}
            currentUser={currentUser}
            onOpenWhyAlert={(s) => setWhyAlertStudent(s)}
            onCreateSupportPlan={(s) => setSupportPlanStudent(s)}
            onViewStudentProfile={handleViewStudentProfile}
          />
        );
    }
  };

  // Render Landing Page if requested
  if (currentView === 'landing') {
    return (
      <div className={isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}>
        <LandingPage
          onEnterPlatform={handleEnterPlatformFromLanding}
          onOpenLogin={() => setIsLoginOpen(true)}
        />
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={(user) => {
            storageService.setCurrentUser(user);
            setCurrentView('app');
            setActiveTab(user.role === 'student' ? 'dashboard' : 'earlywarning');
          }}
          onOpenRegister={() => setIsRegisterOpen(true)}
        />
        <RegisterModal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onRegisterSuccess={(userData) => {
            storageService.setCurrentUser(userData);
            setCurrentView('app');
            setActiveTab('dashboard');
          }}
          onOpenLogin={() => setIsLoginOpen(true)}
        />
      </div>
    );
  }

  // Render Authenticated Platform
  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'}`}>
      {/* Offline Mode Indicator & Cloud Sync Banner */}
      <OfflineBanner
        isOffline={isOffline}
        onToggleOffline={handleToggleOffline}
        lastSyncTime={lastSyncTime}
      />

      {/* Top Bar Contract Navigation */}
      <Navbar
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => handleNavigate('notifications')}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
        notifications={notifications}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onSignOut={() => setCurrentView('landing')}
      />

      {/* Main Workspace Frame with Sidebar */}
      <div className="flex max-w-7xl mx-auto">
        <Sidebar
          activeTab={activeTab}
          onNavigate={handleNavigate}
          userRole={currentUser.role}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          attentionCount={students.filter((s) => s.riskAssessment.level !== 'LOW').length}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {renderMainContent()}
        </main>
      </div>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        students={students}
        courses={courses}
        assignments={assignments}
        onSelectStudent={handleViewStudentProfile}
        onNavigate={handleNavigate}
      />

      {/* "Why This Alert?" Explainable AI SHAP Modal */}
      <WhyThisAlertModal
        student={whyAlertStudent}
        currentUser={currentUser}
        isOpen={!!whyAlertStudent}
        onClose={() => setWhyAlertStudent(null)}
        onCreateSupportPlan={(s) => setSupportPlanStudent(s)}
      />

      {/* Structure Support Plan Modal */}
      <InterventionModal
        student={supportPlanStudent}
        currentUser={currentUser}
        isOpen={!!supportPlanStudent}
        onClose={() => setSupportPlanStudent(null)}
      />

      {/* Emergency Broadcast Alert Composer Modal */}
      <EmergencyAlertModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      {/* Split-screen Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(user) => {
          storageService.setCurrentUser(user);
          setActiveTab(user.role === 'student' ? 'dashboard' : 'earlywarning');
        }}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      {/* 5-step Registration Modal */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterSuccess={(userData) => {
          storageService.setCurrentUser(userData);
          setActiveTab('dashboard');
        }}
        onOpenLogin={() => setIsLoginOpen(true)}
      />
    </div>
  );
}
