import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Search,
  Filter,
  Download,
  Users,
  ShieldCheck,
  TrendingDown,
  Eye,
  Calendar,
  Sparkles,
  ChevronRight,
  Send,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { Student, User, RiskLevel, InterventionStatus } from '../../types';
import { exportStudentsToCSV } from '../../services/exportService';

interface DropoutEarlyWarningCenterProps {
  students: Student[];
  currentUser: User;
  onOpenWhyAlert: (student: Student) => void;
  onCreateSupportPlan: (student: Student) => void;
  onViewStudentProfile: (student: Student) => void;
}

export const DropoutEarlyWarningCenter: React.FC<DropoutEarlyWarningCenterProps> = ({
  students,
  currentUser,
  onOpenWhyAlert,
  onCreateSupportPlan,
  onViewStudentProfile
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'ALL' | RiskLevel>('ALL');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // Institutional cohort metrics
  const totalCohortCount = 1250;
  const lowRiskCount = 1080;
  const moderateRiskCount = 125;
  const highRiskCount = 45;
  const openInterventionsCount = 32;

  // Filter dynamic dataset
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRisk =
        selectedRiskFilter === 'ALL' || student.riskAssessment.level === selectedRiskFilter;

      const matchesDept =
        selectedDeptFilter === 'ALL' || student.department === selectedDeptFilter;

      const matchesStatus =
        selectedStatusFilter === 'ALL' ||
        (selectedStatusFilter === 'active_intervention' && student.interventions.length > 0) ||
        (selectedStatusFilter === 'no_intervention' && student.interventions.length === 0) ||
        (selectedStatusFilter === 'reviewed' && student.riskAssessment.isHumanReviewed) ||
        (selectedStatusFilter === 'pending_review' && !student.riskAssessment.isHumanReviewed);

      return matchesSearch && matchesRisk && matchesDept && matchesStatus;
    });
  }, [students, searchQuery, selectedRiskFilter, selectedDeptFilter, selectedStatusFilter]);

  const departments = useMemo(() => {
    const set = new Set(students.map((s) => s.department));
    return Array.from(set);
  }, [students]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-red-50 text-red-700">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Dropout Early-Warning Center
            </h1>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Explainable student retention intelligence. Identifies multidimensional risk indicators for timely human mentorship and proactive institutional care.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportStudentsToCSV(filteredStudents)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors flex items-center gap-2"
            title="Export filtered records to CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top 5 Metrics Cards with Animated Presence */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Total Students</div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">
            {totalCohortCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Active Undergraduate Cohort</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Low Risk</span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 tabular-nums mt-1">
            {lowRiskCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">86.4% on track</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-amber-700 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Moderate Risk</span>
          </div>
          <div className="text-2xl font-extrabold text-amber-700 tabular-nums mt-1">
            {moderateRiskCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Advisory recommended</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-red-200 bg-red-50/30 shadow-2xs">
          <div className="text-xs text-red-700 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span>High Risk Flagged</span>
          </div>
          <div className="text-2xl font-extrabold text-red-700 tabular-nums mt-1">
            {highRiskCount}
          </div>
          <div className="text-[11px] text-red-600/80 font-medium mt-1">Immediate support needed</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-blue-900 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>Open Interventions</span>
          </div>
          <div className="text-2xl font-extrabold text-blue-900 tabular-nums mt-1">
            {openInterventionsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Active pastoral plans</div>
        </div>
      </div>

      {/* Risk Distribution Visual Overview */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Cohort Risk Composition & Distribution
          </div>
          <div className="text-xs text-slate-500">
            Targeting 98%+ Academic Completion Rate
          </div>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden">
          <div style={{ width: '86.4%' }} className="bg-emerald-500 h-full" title="Low Risk: 86.4%" />
          <div style={{ width: '10.0%' }} className="bg-amber-400 h-full" title="Moderate Risk: 10.0%" />
          <div style={{ width: '3.6%' }} className="bg-red-500 h-full" title="High Risk: 3.6%" />
        </div>

        <div className="flex items-center gap-6 mt-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-emerald-500" />
            <span>Low Risk: 1,080 scholars (86.4%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-amber-400" />
            <span>Moderate Risk: 125 scholars (10.0%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-red-500" />
            <span>Elevated Risk: 45 scholars (3.6%)</span>
          </div>
        </div>
      </div>

      {/* Main Section: Students Requiring Attention */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Table Filters & Search Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Students Requiring Attention</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-semibold">
                45 Flagged
              </span>
            </h2>
            <div className="text-xs text-slate-500 mt-0.5">
              Showing {filteredStudents.length} of {students.length} detailed simulated records
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search name, ID, department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
              />
            </div>

            {/* Risk Filter Segmented Tabs */}
            <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 text-xs">
              {(['ALL', 'HIGH', 'MODERATE', 'LOW'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedRiskFilter(level)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    selectedRiskFilter === level
                      ? level === 'HIGH'
                        ? 'bg-red-600 text-white shadow-xs'
                        : level === 'MODERATE'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : level === 'LOW'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            {/* Department Filter */}
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700"
            >
              <option value="ALL">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700"
            >
              <option value="ALL">All Intervention Statuses</option>
              <option value="active_intervention">Has Active Support Plan</option>
              <option value="no_intervention">No Support Plan Yet</option>
              <option value="reviewed">Human Reviewed</option>
              <option value="pending_review">Pending Human Review</option>
            </select>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Program & Sem</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Primary Observed Indicators</th>
                <th className="py-3 px-4">Human Review</th>
                <th className="py-3 px-4">Support Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => {
                const isHigh = student.riskAssessment.level === 'HIGH';
                const isMod = student.riskAssessment.level === 'MODERATE';

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Student Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <button
                            onClick={() => onViewStudentProfile(student)}
                            className="font-bold text-slate-900 group-hover:text-blue-900 hover:underline text-left block"
                          >
                            {student.name}
                          </button>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {student.studentId}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Program & Sem */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{student.course}</div>
                      <div className="text-[11px] text-slate-400">
                        Semester {student.semester} · {student.section}
                      </div>
                    </td>

                    {/* Risk Level */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isHigh ? 'bg-red-600' : isMod ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                        />
                        <span
                          className={`font-bold ${
                            isHigh ? 'text-red-700' : isMod ? 'text-amber-700' : 'text-emerald-700'
                          }`}
                        >
                          {student.riskAssessment.level}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 tabular-nums">
                        Index: {student.riskAssessment.score}/100
                      </div>
                    </td>

                    {/* Primary Indicators */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">Attendance:</span>
                          <span
                            className={`font-semibold tabular-nums ${
                              student.attendanceRate < 75 ? 'text-red-700 font-bold' : 'text-slate-800'
                            }`}
                          >
                            {student.attendanceRate}%
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          CGPA: <strong className="text-slate-800">{student.cgpa.toFixed(2)}</strong> · {student.missedAssignments} missed asg
                        </div>
                      </div>
                    </td>

                    {/* Human Review Status */}
                    <td className="py-3.5 px-4">
                      {student.riskAssessment.isHumanReviewed ? (
                        <div className="text-emerald-700 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Reviewed</span>
                        </div>
                      ) : (
                        <span className="text-amber-700 font-medium">Pending Review</span>
                      )}
                    </td>

                    {/* Support Status */}
                    <td className="py-3.5 px-4">
                      {student.interventions.length > 0 ? (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-200">
                          {student.interventions[0].status.replace('_', ' ').toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No Plan</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenWhyAlert(student)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-blue-900 hover:text-blue-950 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                          title="Open explainable SHAP contribution modal"
                        >
                          Why This Alert?
                        </button>

                        <button
                          onClick={() => onCreateSupportPlan(student)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                          title="Create pastoral support plan"
                        >
                          Support Plan
                        </button>

                        <button
                          onClick={() => onViewStudentProfile(student)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded"
                          title="View complete student dossier"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-700">No students match current filter criteria</div>
              <div className="text-xs text-slate-400 mt-1">Try resetting the risk or department filters above.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
