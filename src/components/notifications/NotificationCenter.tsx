import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Calendar,
  Bus,
  AlertOctagon,
  Settings,
  Clock,
  Sparkles
} from 'lucide-react';
import { NotificationItem, User } from '../../types';
import { storageService } from '../../services/storage';

interface NotificationCenterProps {
  notifications: NotificationItem[];
  currentUser: User;
  onNavigate: (tab: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  currentUser,
  onNavigate
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [preferences, setPreferences] = useState({
    assignments: true,
    exams: true,
    supportAlerts: true,
    transport: true,
    events: true,
    quietMode: false
  });
  const [showPreferences, setShowPreferences] = useState(false);

  const filteredNotifications = notifications.filter((n) => {
    if (selectedFilter === 'all') return true;
    return n.category === selectedFilter;
  });

  const handleMarkAllRead = () => {
    storageService.markAllNotificationsRead();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emergency':
        return <AlertOctagon className="w-4 h-4 text-red-600" />;
      case 'support_alert':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'assignment':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'exam':
        return <Calendar className="w-4 h-4 text-indigo-600" />;
      case 'transport':
        return <Bus className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-blue-900 uppercase tracking-wider mb-1">
            Communication Hub
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>Institutional Notifications & Advisories</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official announcements, academic deadlines, early-support updates, and campus advisories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>Preferences</span>
          </button>

          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs transition-colors"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Notification Preferences Drawer / Sheet */}
      {showPreferences && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs text-xs space-y-3 animate-in fade-in">
          <div className="font-bold text-slate-900 text-sm">
            Push Notification Subscriptions
          </div>
          <p className="text-slate-500 text-xs">
            Manage channel deliveries for your account. High-severity emergency notifications remain strictly enabled.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {[
              { key: 'assignments', label: 'Assignment Deadlines' },
              { key: 'exams', label: 'Exam Timetables & Marks' },
              { key: 'supportAlerts', label: 'Pastoral & Support Alerts' },
              { key: 'transport', label: 'Bus Transport Advisories' },
              { key: 'events', label: 'Campus Club & Hackathon Events' },
              { key: 'quietMode', label: 'Quiet Mode (After 8 PM)' }
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={(preferences as any)[item.key]}
                  onChange={() =>
                    setPreferences((prev) => ({
                      ...prev,
                      [item.key]: !(prev as any)[item.key]
                    }))
                  }
                  className="rounded text-blue-900 focus:ring-blue-600"
                />
                <span className="font-medium text-slate-700">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: `All (${notifications.length})` },
          { id: 'support_alert', label: 'Support & Early Warning' },
          { id: 'assignment', label: 'Assignments' },
          { id: 'exam', label: 'Examinations' },
          { id: 'transport', label: 'Transport Shuttles' },
          { id: 'emergency', label: 'Emergency Alerts' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              selectedFilter === tab.id
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications Inbox List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {filteredNotifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 sm:p-5 flex items-start gap-4 transition-colors hover:bg-slate-50/70 ${
              !notif.read ? 'bg-blue-50/20' : ''
            }`}
          >
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 shrink-0 mt-0.5">
              {getCategoryIcon(notif.category)}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">{notif.title}</h4>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-mono shrink-0">
                  {notif.timestamp}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                {notif.message}
              </p>

              {notif.linkTab && (
                <div className="pt-1">
                  <button
                    onClick={() => onNavigate(notif.linkTab!)}
                    className="text-xs font-semibold text-blue-900 hover:underline"
                  >
                    Open Related Module →
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="p-12 text-center text-slate-400 text-xs">
            No notifications in this category.
          </div>
        )}
      </div>
    </div>
  );
};
