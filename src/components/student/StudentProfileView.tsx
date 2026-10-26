import React, { useState } from 'react';
import {
  ArrowLeft,
  Printer,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Brain,
  History,
  ShieldCheck,
  BookOpen,
  UserCheck,
  Send,
  Plus,
  RefreshCw,
  Phone,
  Mail,
  Clock
} from 'lucide-react';
import { Student, User, Intervention } from '../../types';
import { storageService } from '../../services/storage';
import { printAcademicReport } from '../../services/exportService';

interface StudentProfileViewProps {
  student: Student;
  currentUser: User;
  onBack: () => void;
  onOpenWhyAlert: (student: Student) => void;
  onCreateSupportPlan: (student: Student) => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  student,
  currentUser,
  onBack,
  onOpenWhyAlert,
  onCreateSupportPlan
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'attendance' | 'academic' | 'assignments' | 'risk' | 'interventions'
  >('overview');
  const [newNoteText, setNewNoteText] = useState('');
  const [activeInterventionId, setActiveInterventionId] = useState<string | null>(
    student.interventions[0]?.id || null
  );

  const { riskAssessment } = student;
  const isHigh = riskAssessment.level === 'HIGH';
  const isMod = riskAssessment.level === 'MODERATE';

  const handleAddNote = (interventionId: string) => {
    if (!newNoteText.trim()) return;
    storageService.addInterventionNote(
      student.id,
      interventionId,
      newNoteText.trim(),
      currentUser.name,
      currentUser.role === 'admin' ? 'Institutional Dean' : currentUser.role === 'faculty' ? 'Faculty Mentor' : 'Counselor'
    );
    setNewNoteText('');
  };

  const handleToggleAction = (interventionId: string, actionId: string) => {
    storageService.toggleInterventionActionItem(student.id, interventionId, actionId);
  };

  return (
    <div className="space-y-6">
      {/* Back button and profile header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students Directory</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => printAcademicReport(student)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
            title="Print official academic report & support dossier"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Dossier</span>
          </button>

          <button
            onClick={() => onOpenWhyAlert(student)}
            className="px-3 py-1.5 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Brain className="w-3.5 h-3.5 text-blue-700" />
            <span>Explainable AI Analysis</span>
          </button>
        </div>
      </div>

      {/* Main Student Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={student.avatar}
              alt={student.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-xs shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold text-slate-900">{student.name}</h1>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {student.studentId}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isHigh
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : isMod
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {riskAssessment.level} RISK (Score: {riskAssessment.score})
                </span>
              </div>

              <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                <div>{student.course} · Semester {student.semester} ({student.section})</div>
                <div>{student.department} · Faculty Advisor: {student.mentorName}</div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{student.phone}</span>
                </div>
                <div>Guardian: {student.guardianName} ({student.guardianPhone})</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
            <button
              onClick={() => onCreateSupportPlan(student)}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Structure Support Plan</span>
            </button>
            <button
              onClick={() => {
                alert(`Direct advisory message dispatched to ${student.name} and registered guardian.`);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Contact Student & Guardian</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-slate-200 mt-6 pt-3 overflow-x-auto text-xs font-semibold text-slate-600">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'attendance', label: 'Course Attendance' },
            { id: 'academic', label: 'Academic Grades & Transcripts' },
            { id: 'assignments', label: 'Assignments' },
            { id: 'risk', label: 'Explainable Risk Attribution' },
            { id: 'interventions', label: `Support Interventions (${student.interventions.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-xs text-slate-500">Overall Attendance</div>
                <div
                  className={`text-2xl font-bold tabular-nums mt-1 ${
                    student.attendanceRate < 75 ? 'text-red-700' : 'text-emerald-700'
                  }`}
                >
                  {student.attendanceRate}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Statutory 75% required</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-xs text-slate-500">Cumulative CGPA</div>
                <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
                  {student.cgpa.toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Scale: 10.0</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-xs text-slate-500">Missed Coursework</div>
                <div
                  className={`text-2xl font-bold tabular-nums mt-1 ${
                    student.missedAssignments > 0 ? 'text-amber-700' : 'text-slate-900'
                  }`}
                >
                  {student.missedAssignments}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Deliverables pending</div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-xs text-slate-500">Recent Exam Avg</div>
                <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
                  {student.recentExamAverage}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 capitalize">Trend: {student.academicTrend}</div>
              </div>
            </div>

            {/* Attendance Snapshot */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Current Semester Attendance Breakdown</h3>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="text-xs text-blue-900 font-semibold hover:underline"
                >
                  View Details →
                </button>
              </div>

              <div className="space-y-3">
                {student.subjectAttendance.map((sub) => (
                  <div key={sub.subjectCode} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">
                        {sub.subjectCode}: {sub.subjectName}
                      </span>
                      <span
                        className={`font-mono font-bold tabular-nums ${
                          sub.percentage < 75 ? 'text-red-700' : 'text-slate-700'
                        }`}
                      >
                        {sub.percentage}% ({sub.attended}/{sub.total} classes)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          sub.percentage < 75 ? 'bg-red-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${sub.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Active Interventions & Human Review */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">Active Pastoral Support</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-900 font-semibold">
                  {student.interventions.length} Plans
                </span>
              </div>

              {student.interventions.length > 0 ? (
                <div className="space-y-3">
                  {student.interventions.map((inv) => (
                    <div key={inv.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                        <span>{inv.title}</span>
                        <span className="text-[10px] text-blue-900 font-semibold uppercase">
                          {inv.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mb-2">
                        Assigned: {inv.assignedTo}
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Follow-up scheduled: <strong>{inv.nextFollowUpDate}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-500">
                  No active interventions logged. Click "Structure Support Plan" to initiate guidance.
                </div>
              )}
            </div>

            {/* Human Review Status */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs text-xs">
              <div className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Institutional Review Status</span>
              </div>
              {riskAssessment.isHumanReviewed ? (
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 space-y-1">
                  <div className="font-semibold">Human Review Completed</div>
                  <div className="text-[11px]">{riskAssessment.reviewedBy}</div>
                  <div className="text-[10px] text-emerald-700">{riskAssessment.reviewedAt}</div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
                  <div className="font-semibold">Review Pending</div>
                  <div className="text-[11px] mt-0.5">
                    Authorized staff review required before finalizing semester advisory.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COURSE ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Subject-wise Class Attendance</h2>
              <p className="text-xs text-slate-500">
                Statutory minimum requirement: 75% attendance in each registered theory and practical module.
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500">Aggregate Attendance</div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums">
                {student.attendanceRate}%
              </div>
            </div>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                <th className="py-2.5 px-3">Course Code</th>
                <th className="py-2.5 px-3">Subject Name</th>
                <th className="py-2.5 px-3">Faculty</th>
                <th className="py-2.5 px-3">Attended / Total</th>
                <th className="py-2.5 px-3">Percentage</th>
                <th className="py-2.5 px-3">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {student.subjectAttendance.map((sub) => (
                <tr key={sub.subjectCode} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{sub.subjectCode}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{sub.subjectName}</td>
                  <td className="py-3 px-3 text-slate-500">{sub.facultyName}</td>
                  <td className="py-3 px-3 font-mono tabular-nums">{sub.attended} / {sub.total} classes</td>
                  <td className="py-3 px-3 font-mono font-bold tabular-nums">
                    <span className={sub.percentage < 75 ? 'text-red-700' : 'text-emerald-700'}>
                      {sub.percentage}%
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {sub.percentage >= 75 ? (
                      <span className="text-emerald-700 font-semibold">Eligible for Exams</span>
                    ) : (
                      <span className="text-red-700 font-bold">Shortage Warning (&lt;75%)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: ACADEMIC & TRANSCRIPT */}
      {activeTab === 'academic' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 mb-1">Official Semester Transcripts</h2>
            <p className="text-xs text-slate-500 mb-4">
              Authenticated grading transcript archives maintained by the Controller of Examinations.
            </p>

            <div className="space-y-6">
              {student.transcripts.map((sem) => (
                <div key={sem.semester} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Semester {sem.semester} Examination</h3>
                      <div className="text-xs text-slate-500">Academic Year: {sem.academicYear} · Credits Earned: {sem.totalCredits}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Semester GPA</div>
                      <div className="text-xl font-bold text-blue-900 tabular-nums">{sem.gpa.toFixed(2)}</div>
                    </div>
                  </div>

                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-slate-500 uppercase text-[10px]">
                        <th className="pb-2">Course Code</th>
                        <th className="pb-2">Course Title</th>
                        <th className="pb-2">Credits</th>
                        <th className="pb-2">Internal (50)</th>
                        <th className="pb-2">External (50)</th>
                        <th className="pb-2">Total (100)</th>
                        <th className="pb-2">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sem.courses.map((c) => (
                        <tr key={c.courseCode} className="hover:bg-white">
                          <td className="py-2 font-mono font-semibold">{c.courseCode}</td>
                          <td className="py-2">{c.courseName}</td>
                          <td className="py-2 font-mono">{c.credits}</td>
                          <td className="py-2 font-mono">{c.internalMarks}</td>
                          <td className="py-2 font-mono">{c.externalMarks}</td>
                          <td className="py-2 font-mono font-bold">{c.totalMarks}</td>
                          <td className="py-2 font-bold text-blue-900">{c.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
          <h2 className="text-base font-bold text-slate-900 mb-1">Coursework Deliverables & Lab Submissions</h2>
          <p className="text-xs text-slate-500 mb-4">
            Completed: {student.assignmentsCompleted} of {student.assignmentsTotal} ({student.missedAssignments} missed).
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">CS501: Dynamic Programming & Graph Traversal Benchmark</div>
                <div className="text-slate-500 mt-0.5">Submitted on 27 Sep 2026 · Status: Under Evaluation</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                Submitted
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">AI504: Model Evaluation with SHAP Explainability</div>
                <div className="text-slate-500 mt-0.5">Score: 94/100 · Feedback: Excellent feature attribution analysis</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                Graded: 94%
              </span>
            </div>

            {student.missedAssignments > 0 && (
              <div className="p-3 rounded-xl border border-red-200 bg-red-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-red-900">CS502: Relational Schema Normalization (Lab 3)</div>
                  <div className="text-red-700 mt-0.5">Submission deadline expired without deliverable archive.</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-red-200 text-red-900 font-bold">
                  Missed
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: EXPLAINABLE RISK ATTRIBUTION */}
      {activeTab === 'risk' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Explainable Model Attribution (SHAP)</h2>
              <p className="text-xs text-slate-500">
                Detailed mathematical decomposition of factors influencing this student's risk indicator.
              </p>
            </div>
            <button
              onClick={() => onOpenWhyAlert(student)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs"
            >
              Open Interactive View
            </button>
          </div>

          <div className="space-y-3">
            {riskAssessment.shapValues.map((shap, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span>{shap.feature} ({shap.observedValue})</span>
                  <span
                    className={
                      shap.direction === 'increases_risk'
                        ? 'text-red-700 font-bold'
                        : 'text-emerald-700 font-bold'
                    }
                  >
                    {shap.impactScore > 0 ? `+${shap.impactScore}` : shap.impactScore} impact pts
                  </span>
                </div>
                <p className="text-xs text-slate-600">{shap.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SUPPORT INTERVENTIONS */}
      {activeTab === 'interventions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Interventions & Pastoral Records</h2>
            <button
              onClick={() => onCreateSupportPlan(student)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Plan</span>
            </button>
          </div>

          {student.interventions.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 text-xs">
              No interventions on record. Structure an academic support plan above.
            </div>
          ) : (
            student.interventions.map((inv) => (
              <div key={inv.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{inv.title}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Assigned to: {inv.assignedTo} ({inv.assignedRole}) · Registered: {inv.createdAt}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200 uppercase">
                    {inv.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Action items */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Action Items Checklist
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {inv.actionItems.map((item) => (
                      <label key={item.id} className="flex items-center gap-2 cursor-pointer text-slate-700">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => handleToggleAction(inv.id, item.id)}
                          className="rounded text-blue-900 focus:ring-blue-600"
                        />
                        <span className={item.completed ? 'line-through text-slate-400' : ''}>
                          {item.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Consultation Notes Timeline */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Consultation & Progress Notes ({inv.notes.length})
                  </div>
                  <div className="space-y-2">
                    {inv.notes.map((note) => (
                      <div key={note.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span className="font-semibold text-slate-700">{note.author} ({note.authorRole})</span>
                          <span>{note.timestamp}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{note.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add note input */}
                  <div className="flex items-center gap-2 mt-3">
                    <input
                      type="text"
                      placeholder="Add an advisory follow-up note..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                      onClick={() => handleAddNote(inv.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                    >
                      Post Note
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
