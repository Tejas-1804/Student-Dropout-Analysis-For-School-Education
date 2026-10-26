import React, { useState } from 'react';
import {
  User as UserIcon,
  Shield,
  Bell,
  Moon,
  Sun,
  RotateCcw,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  Database
} from 'lucide-react';
import { User } from '../../types';
import { storageService } from '../../services/storage';

interface SettingsViewProps {
  currentUser: User;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [resetSuccess, setResetSuccess] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleResetData = () => {
    if (window.confirm('Reset all demo records (students, attendance, interventions) back to initial dataset?')) {
      storageService.resetToDefault();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2500);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <h1 className="text-2xl font-bold text-slate-900">Account Profile & Security</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal credentials, session security, privacy preferences, and system storage.
        </p>
      </div>

      {/* User Information */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
        <h2 className="text-base font-bold text-slate-900">Personal Information</h2>

        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
          />
          <div>
            <div className="font-bold text-slate-900 text-base">{currentUser.name}</div>
            <div className="text-xs text-slate-500">{currentUser.department}</div>
            <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
              Role: {currentUser.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                defaultValue={currentUser.name}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Institutional Email</label>
              <input
                type="email"
                readOnly
                defaultValue={currentUser.email}
                className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                defaultValue={currentUser.phone || '+91 98450 12345'}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Department</label>
              <input
                type="text"
                readOnly
                defaultValue={currentUser.department}
                className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Profile Saved</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Theme & Display Mode */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">Appearance & Theme</h2>
        <div className="flex items-center justify-between text-xs">
          <div>
            <div className="font-semibold text-slate-800">Interface Color Scheme</div>
            <div className="text-slate-500 mt-0.5">Toggle between daytime light theme and deep dark mode.</div>
          </div>
          <button
            onClick={onToggleDarkMode}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold flex items-center gap-2"
          >
            {isDarkMode ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>{isDarkMode ? 'Dark Mode (Active)' : 'Light Mode (Active)'}</span>
          </button>
        </div>
      </div>

      {/* Local Storage & Reset Demo Environment */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-600" />
              <span>Reset Simulated Dataset</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Reset all simulated student records, SHAP assessments, and interventions back to standard Presidency College factory state.
            </p>
          </div>

          <button
            onClick={handleResetData}
            className="px-4 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{resetSuccess ? 'Reset Complete!' : 'Reset Demo Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
