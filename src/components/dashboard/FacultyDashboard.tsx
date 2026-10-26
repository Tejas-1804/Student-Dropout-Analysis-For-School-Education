import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { User, Course, Student, Assignment } from '../../types';
import { storageService } from '../../services/storage';

interface FacultyDashboardProps {
  currentUser: User;
  courses: Course[];
  students: Student[];
  assignments: Assignment[];
  onOpenWhyAlert: (student: Student) => void;
  onCreateSupportPlan: (student: Student) => void;
  onNavigate: (tab: string) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({
  currentUser,
  courses,
  students,
  assignments,
  onOpenWhyAlert,
  onCreateSupportPlan,
  onNavigate
}) => {
  const [takingAttendanceCourse, setTakingAttendanceCourse] = useState<Course | null>(null);
  const [attendanceSheet, setAttendanceSheet] = useState<Record<string, boolean>>({});
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Identify students in this department requiring academic attention
  const flaggedStudentsInDept = students.filter(
    (s) => s.riskAssessment.level !== 'LOW'
  );

  const startAttendanceSession = (course: Course) => {
    setTakingAttendanceCourse(course);
    const initialMap: Record<string, boolean> = {};
    students.slice(0, 20).forEach((s) => {
      // Default to present unless student has very low attendance
      initialMap[s.id] = s.attendanceRate >= 65;
    });
    setAttendanceSheet(initialMap);
  };

  const handleSaveAttendance = () => {
    if (!takingAttendanceCourse) return;
    setIsSavingAttendance(true);

    setTimeout(() => {
      storageService.recordClassAttendance(takingAttendanceCourse.code, attendanceSheet);
      setIsSavingAttendance(false);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setTakingAttendanceCourse(null);
      }, 1500);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-indigo-900 uppercase tracking-wider mb-1">
            Faculty & Course Instruction Suite
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {currentUser.designation || 'Associate Professor'} · {currentUser.department}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('assignments')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish New Coursework</span>
          </button>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Assigned Courses</div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">
            {courses.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Autumn 2026 Semester</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Active Scholars Taught</div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">
            186
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across Sections A & B</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-red-200 bg-red-50/20 shadow-2xs">
          <div className="text-xs text-red-700 font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            <span>Students Needing Support</span>
          </div>
          <div className="text-2xl font-extrabold text-red-700 tabular-nums mt-1">
            {flaggedStudentsInDept.length}
          </div>
          <div className="text-[11px] text-red-600 font-medium mt-1">In your departmental cohort</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Submissions Pending Review</div>
          <div className="text-2xl font-extrabold text-blue-900 tabular-nums mt-1">
            48
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Algorithm Lab Practicals</div>
        </div>
      </div>

      {/* Taking Attendance Modal / Sheet */}
      {takingAttendanceCourse && (
        <div className="bg-white rounded-2xl p-6 border-2 border-blue-600 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <div className="text-xs font-bold text-blue-900 uppercase">Live Lecture Attendance Register</div>
              <h2 className="text-lg font-bold text-slate-900">
                {takingAttendanceCourse.code}: {takingAttendanceCourse.name}
              </h2>
              <div className="text-xs text-slate-500">
                Room: {takingAttendanceCourse.room} · Date: {new Date().toLocaleDateString()}
              </div>
            </div>
            <button
              onClick={() => setTakingAttendanceCourse(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-2 pr-2">
            {students.slice(0, 15).map((s) => {
              const isPresent = attendanceSheet[s.id] ?? true;
              return (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={s.avatar}
                      alt={s.name}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{s.studentId} · Sem {s.semester}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 mr-2">
                      Historical: {s.attendanceRate}%
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setAttendanceSheet((prev) => ({ ...prev, [s.id]: !isPresent }))
                      }
                      className={`px-3 py-1 rounded-md font-semibold text-xs transition-colors ${
                        isPresent
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {isPresent ? 'PRESENT' : 'ABSENT'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <span className="text-xs text-slate-500">
              Saving updates attendance counters and instantly triggers the explainable risk engine.
            </span>
            <button
              onClick={handleSaveAttendance}
              disabled={isSavingAttendance}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Attendance Recorded & Scored!</span>
                </>
              ) : (
                <>
                  <ClipboardList className="w-4 h-4" />
                  <span>{isSavingAttendance ? 'Saving & Re-evaluating...' : 'Submit Lecture Attendance'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Today's Lectures & Course Sessions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">Your Courses & Class Timetable</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                    {course.code}
                  </span>
                  <span className="text-xs text-slate-500">{course.credits} Credits</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{course.name}</h3>
                <div className="text-xs text-slate-500 space-y-0.5 mb-3">
                  <div>Time: {course.scheduleTime}</div>
                  <div>Room: {course.room}</div>
                  <div>Enrolled: {course.enrolledStudentsCount} scholars</div>
                </div>

                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Syllabus Progress</span>
                    <span className="font-bold">{course.syllabusProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-900 h-full rounded-full"
                      style={{ width: `${course.syllabusProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                <button
                  onClick={() => startAttendanceSession(course)}
                  className="flex-1 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Take Attendance</span>
                </button>
                <button
                  onClick={() => onNavigate('assignments')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg"
                >
                  Assignments
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flagged Students Requiring Faculty Encouragement */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Students Requiring Academic Attention in Your Department
            </h2>
            <p className="text-xs text-slate-500">
              Proactive check-ins help students catch up before mid-term evaluations.
            </p>
          </div>
          <button
            onClick={() => onNavigate('earlywarning')}
            className="text-xs font-semibold text-blue-900 hover:underline"
          >
            Early-Warning Center →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {flaggedStudentsInDept.slice(0, 6).map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      s.riskAssessment.level === 'HIGH'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {s.riskAssessment.level} RISK
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Sem {s.semester}</span>
                </div>
                <div className="font-bold text-slate-900 text-sm">{s.name}</div>
                <div className="text-xs text-slate-500 mt-1">
                  Attendance: <strong className="text-slate-800">{s.attendanceRate}%</strong> · CGPA: {s.cgpa.toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {s.missedAssignments} missed coursework deliverables
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-2 border-t border-slate-200">
                <button
                  onClick={() => onOpenWhyAlert(s)}
                  className="flex-1 py-1 text-[11px] font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 text-center"
                >
                  Why This Alert?
                </button>
                <button
                  onClick={() => onCreateSupportPlan(s)}
                  className="flex-1 py-1 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded border border-slate-200 text-center"
                >
                  Remedial Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
