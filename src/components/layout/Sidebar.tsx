import React from 'react';
import {
  LayoutDashboard,
  AlertTriangle,
  Users,
  BookOpen,
  Calendar,
  MapPin,
  Bus,
  FolderGit2,
  BarChart3,
  Bell,
  Settings,
  X
} from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  userRole: UserRole;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  attentionCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onNavigate,
  userRole,
  mobileOpen,
  onCloseMobile,
  attentionCount = 45
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
      roles: ['admin', 'faculty', 'mentor', 'student']
    },
    {
      id: 'earlywarning',
      label: 'Early-Warning Center',
      icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
      badge: attentionCount,
      roles: ['admin', 'faculty', 'mentor']
    },
    {
      id: 'students',
      label: userRole === 'student' ? 'My Academic Dossier' : 'Student Directory',
      icon: <Users className="w-4 h-4" />,
      roles: ['admin', 'faculty', 'mentor', 'student']
    },
    {
      id: 'attendance',
      label: 'Class Attendance',
      icon: <BookOpen className="w-4 h-4" />,
      roles: ['admin', 'faculty', 'mentor', 'student']
    },
    {
      id: 'assignments',
      label: 'Assignments & Lab Tasks',
      icon: <BookOpen className="w-4 h-4" />,
      roles: ['admin', 'faculty', 'student']
    },
    {
      id: 'calendar',
      label: 'Academic Calendar',
      icon: <Calendar className="w-4 h-4" />,
      roles: ['admin', 'faculty', 'mentor', 'student']
    },
    {
      id: 'projects',
      label: 'Collaborative Projects',
      icon: <FolderGit2 className="w-4 h-4" />,
      roles: ['admin', 'faculty', 'student']
    },
    {
      id: 'campus',
      label: 'Campus Navigation Map',
      icon: <MapPin className="w-4 h-4" />,
      roles: ['admin', 'faculty', 'mentor', 'student']
    },
    {
      id: 'transport',
      label: 'Campus Bus Transport',
      icon: <Bus className="w-4 h-4" />,
      roles: ['admin', 'faculty', 'mentor', 'student']
    },
    {
      id: 'analytics',
      label: 'Analytics & Reports',
      icon: <BarChart3 className="w-4 h-4" />,
      roles: ['admin', 'faculty', 'mentor']
    },
    {
      id: 'notifications',
      label: 'Notification Center',
      icon: <Bell className="w-4 h-4" />,
      roles: ['admin', 'faculty', 'mentor', 'student']
    },
    {
      id: 'settings',
      label: 'Settings & Security',
      icon: <Settings className="w-4 h-4" />,
      roles: ['admin', 'faculty', 'mentor', 'student']
    }
  ];

  const visibleItems = navItems.filter((item) => item.roles.includes(userRole));

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Institutional Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-slate-400 font-bold">Presidency College</div>
          <div className="text-sm font-semibold text-white tracking-tight">Management Portal</div>
        </div>
        {mobileOpen && (
          <button onClick={onCloseMobile} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Core Workspaces
        </div>
        {visibleItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                if (mobileOpen) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold tabular-nums ${
                    isActive ? 'bg-white text-blue-900' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Support Principles Box */}
      <div className="p-4 border-t border-slate-800 m-3 rounded-lg bg-slate-950/60 text-xs">
        <div className="flex items-center gap-2 text-slate-200 font-semibold mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Support Framework</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Early intervention is designed for human guidance and pastoral support, never exclusion.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed left) */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-800 h-[calc(100vh-4rem)] sticky top-16">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative w-72 max-w-full h-full shadow-2xl z-10">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
