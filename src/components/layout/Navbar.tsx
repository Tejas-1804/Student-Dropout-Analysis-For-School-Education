import React, { useState } from 'react';
import {
  Search,
  Bell,
  AlertOctagon,
  ChevronDown,
  Shield,
  GraduationCap,
  Users,
  Compass,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { User, UserRole, NotificationItem } from '../../types';

interface NavbarProps {
  currentUser: User;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenEmergencyModal: () => void;
  notifications: NotificationItem[];
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onRoleChange,
  activeTab,
  onNavigate,
  onOpenSearch,
  onOpenNotifications,
  onOpenEmergencyModal,
  notifications,
  isDarkMode,
  onToggleDarkMode,
  onSignOut
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleLabels: Record<UserRole, { title: string; icon: React.ReactNode }> = {
    admin: { title: 'Institutional Administrator', icon: <Shield className="w-3.5 h-3.5 text-blue-600" /> },
    faculty: { title: 'Faculty & Course Instructor', icon: <GraduationCap className="w-3.5 h-3.5 text-indigo-600" /> },
    mentor: { title: 'Student Counselor & Mentor', icon: <Users className="w-3.5 h-3.5 text-amber-600" /> },
    student: { title: 'Undergraduate Student', icon: <Compass className="w-3.5 h-3.5 text-emerald-600" /> }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-blue-800 transition-colors">
              P
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-slate-900 leading-none group-hover:text-blue-900 transition-colors">
                Presidency College
              </div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium mt-0.5">
                Early-Warning & Retention Platform
              </div>
            </div>
          </button>

          {/* Institutional Breadcrumb context */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 border-l border-slate-200 pl-4">
            <span>Presidency Portal</span>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-slate-800 capitalize">
              {activeTab === 'earlywarning'
                ? 'Dropout Early-Warning Center'
                : activeTab === 'dashboard'
                ? `${currentUser.role} Workspace`
                : activeTab}
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Text with subtle hover, single-line) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`hover:text-blue-900 transition-colors ${
              activeTab === 'dashboard' ? 'text-blue-900 font-bold border-b-2 border-blue-900 pb-0.5' : ''
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('earlywarning')}
            className={`hover:text-blue-900 transition-colors flex items-center gap-1.5 ${
              activeTab === 'earlywarning' ? 'text-blue-900 font-bold border-b-2 border-blue-900 pb-0.5' : ''
            }`}
          >
            <span>Early Warning</span>
            <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-100 text-red-700">
              45
            </span>
          </button>
          <button
            onClick={() => onNavigate('students')}
            className={`hover:text-blue-900 transition-colors ${
              activeTab === 'students' ? 'text-blue-900 font-bold border-b-2 border-blue-900 pb-0.5' : ''
            }`}
          >
            Students
          </button>
          <button
            onClick={() => onNavigate('academic')}
            className={`hover:text-blue-900 transition-colors ${
              activeTab === 'academic' || activeTab === 'attendance' || activeTab === 'courses' || activeTab === 'assignments'
                ? 'text-blue-900 font-bold border-b-2 border-blue-900 pb-0.5'
                : ''
            }`}
          >
            Academics
          </button>
          <button
            onClick={() => onNavigate('analytics')}
            className={`hover:text-blue-900 transition-colors ${
              activeTab === 'analytics' ? 'text-blue-900 font-bold border-b-2 border-blue-900 pb-0.5' : ''
            }`}
          >
            Reports
          </button>
        </nav>

        {/* Zone 3: Actions (Search, Emergency trigger, Role Switcher, Notifications, Profile) */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-slate-500 hover:text-slate-800 text-xs transition-colors"
            title="Search anything (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-white border border-slate-300 rounded shadow-xs">
              ⌘K
            </kbd>
          </button>

          {/* Emergency Alert (Admin only) */}
          {currentUser.role === 'admin' && (
            <button
              onClick={onOpenEmergencyModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200 transition-colors"
              title="Broadcast critical campus alert"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
              <span>Broadcast Alert</span>
            </button>
          )}

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors"
            >
              {roleLabels[currentUser.role].icon}
              <span className="capitalize font-semibold">{currentUser.role}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Switch Persona / Role
                </div>
                {(['admin', 'faculty', 'mentor', 'student'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onRoleChange(r);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 transition-colors ${
                      currentUser.role === r ? 'bg-blue-50/70 font-semibold text-blue-900' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {roleLabels[r].icon}
                      <div>
                        <div className="capitalize">{r}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{roleLabels[r].title}</div>
                      </div>
                    </div>
                    {currentUser.role === r && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-slate-200 transition-all"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="font-bold text-slate-900">{currentUser.name}</div>
                  <div className="text-slate-500 text-[11px] truncate">{currentUser.email}</div>
                  <div className="text-[10px] text-blue-800 font-semibold mt-0.5">{currentUser.department}</div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span>Profile & Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      onToggleDarkMode();
                      setUserMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span>Theme: {isDarkMode ? 'Dark' : 'Light'}</span>
                    {isDarkMode ? <Moon className="w-3.5 h-3.5 text-slate-400" /> : <Sun className="w-3.5 h-3.5 text-slate-400" />}
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onSignOut();
                    }}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
