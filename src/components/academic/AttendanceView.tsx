import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Users,
  ClipboardList,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { Student, Course, User } from '../../types';
import { storageService } from '../../services/storage';

interface AttendanceViewProps {
  students: Student[];
  courses: Course[];
  currentUser: User;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  students,
  courses,
  currentUser
}) => {
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>(courses[0]?.code || 'CS501');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'shortage' | 'compliant'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attendanceRecord, setAttendanceRecord] = useState<Record<string, boolean>>({});

  const currentCourse = courses.find((c) => c.code === selectedCourseCode) || courses[0];

  const filteredStudents = students.filter((s) => {
    const sub = s.subjectAttendance.find((item) => item.subjectCode === selectedCourseCode);
    const percentage = sub ? sub.percentage : s.attendanceRate;

    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'shortage' && percentage < 75) ||
      (selectedStatus === 'compliant' && percentage >= 75);

    return matchesSearch && matchesStatus;
  });

  const handleStartSession = () => {
    const map: Record<string, boolean> = {};
    students.forEach((s) => {
      map[s.id] = s.attendanceRate >= 65;
    });
    setAttendanceRecord(map);
    setIsRecording(true);
  };

  const handleSaveAttendance = () => {
    storageService.recordClassAttendance(selectedCourseCode, attendanceRecord);
    setIsRecording(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-blue-900 uppercase tracking-wider mb-1">
            Academic Registry
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Course Attendance Directorate
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Statutory minimum 75% attendance compliance monitor. Real-time updates trigger explainable risk reassessments.
          </p>
        </div>

        {(currentUser.role === 'faculty' || currentUser.role === 'admin') && (
          <button
            onClick={handleStartSession}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Take Lecture Attendance</span>
          </button>
        )}
      </div>

      {/* Course Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {courses.map((course) => (
          <button
            key={course.id}
            onClick={() => setSelectedCourseCode(course.code)}
            className={`px-4 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all border ${
              selectedCourseCode === course.code
                ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <div className="text-left">
              <div className="font-bold">{course.code}</div>
              <div className={`text-[10px] ${selectedCourseCode === course.code ? 'text-blue-200' : 'text-slate-400'}`}>
                {course.name.slice(0, 24)}...
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Active Course Details Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <div className="text-base font-bold text-slate-900">
            {currentCourse.code}: {currentCourse.name}
          </div>
          <div className="text-slate-500">
            Instructor: <strong>{currentCourse.facultyName}</strong> · Room: {currentCourse.room} · Timing: {currentCourse.scheduleTime}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div>
            <div className="text-slate-400 text-[11px]">Total Conducted Classes</div>
            <div className="text-lg font-bold text-slate-900 tabular-nums">{currentCourse.totalClasses} Lectures</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Enrolled Scholars</div>
            <div className="text-lg font-bold text-blue-900 tabular-nums">{currentCourse.enrolledStudentsCount}</div>
          </div>
        </div>
      </div>

      {/* Recording Attendance Modal */}
      {isRecording && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col justify-between">
            <div className="pb-3 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">
                Mark Daily Attendance for {currentCourse.code}
              </h2>
              <p className="text-xs text-slate-500">
                Tap status to toggle Present / Absent for this lecture session.
              </p>
            </div>

            <div className="overflow-y-auto max-h-96 py-3 space-y-2">
              {students.slice(0, 20).map((s) => {
                const isPresent = attendanceRecord[s.id] ?? true;
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{s.studentId}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setAttendanceRecord((prev) => ({ ...prev, [s.id]: !isPresent }))
                      }
                      className={`px-4 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
                        isPresent ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                      }`}
                    >
                      {isPresent ? 'PRESENT' : 'ABSENT'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsRecording(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAttendance}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs"
              >
                Submit & Re-evaluate Risk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Student Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search scholar name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedStatus === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              All ({students.length})
            </button>
            <button
              onClick={() => setSelectedStatus('shortage')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedStatus === 'shortage' ? 'bg-red-600 text-white' : 'bg-white text-red-700 border border-red-200'
              }`}
            >
              Shortage Warning (&lt; 75%)
            </button>
            <button
              onClick={() => setSelectedStatus('compliant')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedStatus === 'compliant' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-700 border border-emerald-200'
              }`}
            >
              Compliant (≥ 75%)
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase text-[11px]">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Program & Sem</th>
                <th className="py-3 px-4">{currentCourse.code} Attended</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">Exam Eligibility</th>
                <th className="py-3 px-4">Overall Cohort Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => {
                const sub = s.subjectAttendance.find((i) => i.subjectCode === selectedCourseCode);
                const attended = sub ? sub.attended : Math.round((s.attendanceRate / 100) * currentCourse.totalClasses);
                const percentage = sub ? sub.percentage : s.attendanceRate;
                const isShortage = percentage < 75;

                return (
                  <tr key={s.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{s.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{s.studentId}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {s.course} · Sem {s.semester}
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-800">
                      {attended} / {currentCourse.totalClasses} classes
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold tabular-nums">
                      <span className={isShortage ? 'text-red-700' : 'text-emerald-700'}>
                        {percentage}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {isShortage ? (
                        <span className="inline-flex items-center gap-1 text-red-700 font-bold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Shortage Alert</span>
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">Eligible</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono tabular-nums">
                      {s.attendanceRate}% aggregate
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
