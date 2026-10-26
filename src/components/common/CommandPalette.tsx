import React, { useState, useEffect } from 'react';
import { Search, User, BookOpen, FileText, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { Student, Course, Assignment } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  courses: Course[];
  assignments: Assignment[];
  onSelectStudent: (student: Student) => void;
  onNavigate: (tab: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  students,
  courses,
  assignments,
  onSelectStudent,
  onNavigate
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredStudents = query.trim()
    ? students
        .filter(
          (s) =>
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.studentId.toLowerCase().includes(query.toLowerCase()) ||
            s.department.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const filteredCourses = query.trim()
    ? courses
        .filter(
          (c) =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.code.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 4)
    : [];

  const filteredAssignments = query.trim()
    ? assignments
        .filter((a) => a.title.toLowerCase().includes(query.toLowerCase()) || a.courseCode.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search students, courses, assignments, or commands (Ctrl + K)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="p-4 text-xs text-slate-500">
              <div className="font-semibold text-slate-700 uppercase tracking-wider mb-2">Quick Navigation</div>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => { onNavigate('earlywarning'); onClose(); }}
                  className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 text-slate-700 text-left text-xs"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Dropout Early-Warning Center</span>
                </button>
                <button
                  onClick={() => { onNavigate('students'); onClose(); }}
                  className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 text-slate-700 text-left text-xs"
                >
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Student Directory</span>
                </button>
                <button
                  onClick={() => { onNavigate('attendance'); onClose(); }}
                  className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 text-slate-700 text-left text-xs"
                >
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Attendance Records</span>
                </button>
                <button
                  onClick={() => { onNavigate('analytics'); onClose(); }}
                  className="flex items-center gap-2 p-2 rounded hover:bg-slate-50 text-slate-700 text-left text-xs"
                >
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span>Institutional Reports</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStudents.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Students ({filteredStudents.length})
                  </div>
                  {filteredStudents.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        onSelectStudent(s);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-blue-50/70 text-left group transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
                          {s.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">
                            {s.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {s.studentId} · {s.department} · Sem {s.semester}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span
                          className={`font-semibold ${
                            s.riskAssessment.level === 'HIGH'
                              ? 'text-red-700'
                              : s.riskAssessment.level === 'MODERATE'
                              ? 'text-amber-700'
                              : 'text-emerald-700'
                          }`}
                        >
                          {s.riskAssessment.level} RISK
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {filteredCourses.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Courses ({filteredCourses.length})
                  </div>
                  {filteredCourses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onNavigate('courses');
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 text-left"
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-900">{c.code}: {c.name}</div>
                        <div className="text-xs text-slate-500">{c.department} · {c.facultyName}</div>
                      </div>
                      <span className="text-xs text-slate-400">{c.credits} Credits</span>
                    </button>
                  ))}
                </div>
              )}

              {filteredAssignments.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Assignments ({filteredAssignments.length})
                  </div>
                  {filteredAssignments.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => {
                        onNavigate('assignments');
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 text-left"
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-900">{a.title}</div>
                        <div className="text-xs text-slate-500">{a.courseCode} · Due {new Date(a.dueDate).toLocaleDateString()}</div>
                      </div>
                      <span className="text-xs text-blue-600 font-medium">View</span>
                    </button>
                  ))}
                </div>
              )}

              {filteredStudents.length === 0 && filteredCourses.length === 0 && filteredAssignments.length === 0 && (
                <div className="p-8 text-center text-sm text-slate-500">
                  No matching records found for "{query}".
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
          <span>Navigate with mouse or keyboard</span>
          <span>Esc to exit</span>
        </div>
      </div>
    </div>
  );
};
