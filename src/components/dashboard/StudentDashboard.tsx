import React, { useState } from 'react';
import {
  TrendingUp,
  Clock,
  BookOpen,
  Calendar,
  AlertCircle,
  CheckCircle2,
  FileText,
  Upload,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Student, Assignment, Exam, Course, CalendarEvent } from '../../types';
import { storageService } from '../../services/storage';

interface StudentDashboardProps {
  student: Student;
  assignments: Assignment[];
  exams: Exam[];
  courses: Course[];
  calendarEvents: CalendarEvent[];
  onNavigate: (tab: string) => void;
  onOpenSubmissionModal: (asg: Assignment) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  assignments,
  exams,
  courses,
  calendarEvents,
  onNavigate,
  onOpenSubmissionModal
}) => {
  const isAttendanceShortage = student.attendanceRate < 75;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-blue-900 uppercase tracking-wider mb-1">
            Student Academic Portal
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Good morning, {student.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {student.course} · Semester {student.semester} · Student ID: {student.studentId}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('attendance')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          >
            Attendance Log
          </button>
          <button
            onClick={() => onNavigate('academic')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors"
          >
            View Official Transcript
          </button>
        </div>
      </div>

      {/* Primary Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Cumulative CGPA</div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">
            {student.cgpa.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+0.3 from previous term</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Class Attendance</div>
          <div
            className={`text-2xl font-extrabold tabular-nums mt-1 ${
              isAttendanceShortage ? 'text-red-700' : 'text-emerald-700'
            }`}
          >
            {student.attendanceRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {isAttendanceShortage ? 'Below statutory 75%' : 'Statutory compliance OK'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Completed Coursework</div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">
            {student.assignmentsCompleted} / {student.assignmentsTotal}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {student.missedAssignments > 0
              ? `${student.missedAssignments} missed submissions`
              : 'All coursework submitted'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Registered Credits</div>
          <div className="text-2xl font-extrabold text-blue-900 tabular-nums mt-1">
            24 Credits
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Semester 5 Active Cohort</div>
        </div>
      </div>

      {/* Proactive Advisory / Pastoral Support Banner if flagged */}
      {student.riskAssessment.level !== 'LOW' && (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-900 text-sm">
                Academic Support Resources Available
              </div>
              <p className="text-amber-800 text-xs mt-0.5 max-w-xl">
                Your faculty mentor ({student.mentorName}) has scheduled optional remedial hours to assist in core algorithmic concepts and review recent coursework.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('calendar')}
            className="px-3.5 py-1.5 text-xs font-semibold text-amber-900 bg-white hover:bg-amber-100 rounded-lg border border-amber-300 shrink-0"
          >
            View Meeting Times
          </button>
        </div>
      )}

      {/* Main Grid: Upcoming Assignments + Class Timetable */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upcoming Deliverables */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-900" />
                <span>Upcoming Assignments & Practical Tasks</span>
              </h2>
              <button
                onClick={() => onNavigate('assignments')}
                className="text-xs text-blue-900 font-semibold hover:underline"
              >
                View All →
              </button>
            </div>

            <div className="space-y-3">
              {assignments.map((asg) => (
                <div
                  key={asg.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{asg.title}</div>
                    <div className="text-slate-500 text-xs mt-0.5">
                      {asg.courseCode}: {asg.courseName} · Max Marks: {asg.maxScore}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Due {new Date(asg.dueDate).toLocaleDateString()} at 11:59 PM</span>
                    </div>
                  </div>

                  <div>
                    {asg.userSubmission ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-semibold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Submitted</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onOpenSubmissionModal(asg)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Work</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enrolled Courses Progress */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Enrolled Course Progress</h2>
            <div className="space-y-3 text-xs">
              {courses.map((c) => (
                <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-1.5 font-semibold text-slate-800">
                    <span>{c.code}: {c.name}</span>
                    <span className="font-mono text-slate-500">{c.syllabusProgress}% Syllabus</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-900 h-full rounded-full"
                      style={{ width: `${c.syllabusProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                    <span>Faculty: {c.facultyName}</span>
                    <span>Room: {c.room}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Mid-Term Exams & Timetable */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Upcoming Examination Timetable</span>
              </h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Mid-Term</span>
            </div>

            <div className="space-y-3 text-xs">
              {exams.map((ex) => (
                <div key={ex.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{ex.courseCode}</span>
                    <span className="text-[11px] text-blue-900 font-semibold">{ex.date}</span>
                  </div>
                  <div className="text-slate-600 font-medium mt-0.5">{ex.courseName}</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Time: {ex.time} · Venue: {ex.venue}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Today's Class Schedule</h2>
            <div className="space-y-2 text-xs">
              {calendarEvents.slice(0, 3).map((ev) => (
                <div key={ev.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900">{ev.title}</div>
                    <div className="text-[11px] text-slate-500">{ev.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
