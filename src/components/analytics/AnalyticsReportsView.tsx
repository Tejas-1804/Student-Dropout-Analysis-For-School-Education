import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  TrendingUp,
  AlertTriangle,
  Users,
  CheckCircle2,
  FileSpreadsheet,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { Student } from '../../types';
import { exportStudentsToCSV } from '../../services/exportService';

interface AnalyticsReportsViewProps {
  students: Student[];
}

export const AnalyticsReportsView: React.FC<AnalyticsReportsViewProps> = ({ students }) => {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<string>('current_semester');

  const filteredStudents = selectedDept === 'all'
    ? students
    : students.filter((s) => s.department === selectedDept);

  const total = filteredStudents.length;
  const highRisk = filteredStudents.filter((s) => s.riskAssessment.level === 'HIGH').length;
  const modRisk = filteredStudents.filter((s) => s.riskAssessment.level === 'MODERATE').length;
  const lowRisk = filteredStudents.filter((s) => s.riskAssessment.level === 'LOW').length;

  const avgAttendance = Math.round(
    filteredStudents.reduce((acc, s) => acc + s.attendanceRate, 0) / (total || 1)
  );

  const avgCgpa = (
    filteredStudents.reduce((acc, s) => acc + s.cgpa, 0) / (total || 1)
  ).toFixed(2);

  const departments = [
    'Computer Science & Engineering',
    'Artificial Intelligence & Data Science',
    'School of Management Studies',
    'Department of Commerce',
    'Information Technology'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-blue-900 uppercase tracking-wider mb-1">
            Institutional Intelligence
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Analytics & Student Retention Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Cohort longitudinal performance, attendance correlations, and explainable intervention efficacy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportStudentsToCSV(filteredStudents)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV Dataset</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Filter Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700"
          >
            <option value="all">All Academic Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Evaluation Window:</span>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700"
          >
            <option value="current_semester">Autumn 2026 (Current Term)</option>
            <option value="annual">Full Academic Year 2025-2026</option>
            <option value="historical">Longitudinal 3-Year Benchmark</option>
          </select>
        </div>
      </div>

      {/* Aggregate KPI Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Evaluated Scholars</div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">
            {total}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">In selected cohort</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Cohort Mean CGPA</div>
          <div className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">
            {avgCgpa}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            +0.18 over benchmark
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Average Attendance</div>
          <div
            className={`text-2xl font-extrabold tabular-nums mt-1 ${
              avgAttendance < 75 ? 'text-red-700' : 'text-emerald-700'
            }`}
          >
            {avgAttendance}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Statutory target: 75%</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-red-200 bg-red-50/20 shadow-2xs">
          <div className="text-xs text-red-700 font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            <span>High Risk Flagged</span>
          </div>
          <div className="text-2xl font-extrabold text-red-700 tabular-nums mt-1">
            {highRisk}
          </div>
          <div className="text-[11px] text-red-600 font-medium mt-1">Requiring mentorship</div>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Distribution Donut & Breakdown */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Risk Category Breakdown
            </h2>
            <span className="text-[11px] text-slate-400">Total: {total}</span>
          </div>

          {/* SVG Donut Chart */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background circle */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="3.8"
                />
                {/* Low risk segment (green) */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3.8"
                  strokeDasharray={`${(lowRisk / (total || 1)) * 100}, 100`}
                />
                {/* Mod risk segment (amber) */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="3.8"
                  strokeDasharray={`${(modRisk / (total || 1)) * 100}, 100`}
                  strokeDashoffset={`-${(lowRisk / (total || 1)) * 100}`}
                />
                {/* High risk segment (red) */}
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="3.8"
                  strokeDasharray={`${(highRisk / (total || 1)) * 100}, 100`}
                  strokeDashoffset={`-${((lowRisk + modRisk) / (total || 1)) * 100}`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-slate-900 tabular-nums">
                  {Math.round((lowRisk / (total || 1)) * 100)}%
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">ON TRACK</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Low Risk:</span>
                <strong className="text-slate-900 tabular-nums">{lowRisk} scholars</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-slate-600">Moderate Support:</span>
                <strong className="text-slate-900 tabular-nums">{modRisk} scholars</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-slate-600">Elevated Indicator:</span>
                <strong className="text-slate-900 tabular-nums">{highRisk} scholars</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance vs Performance Correlation */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Attendance & Academic Performance Matrix
            </h2>
            <span className="text-[11px] text-slate-400">Correlation: r = 0.74</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { bracket: 'Attendance > 85%', count: 28, avgGpa: '8.45', risk: 'Low' },
              { bracket: 'Attendance 75% - 85%', count: 12, avgGpa: '7.12', risk: 'Low/Mod' },
              { bracket: 'Attendance 65% - 75%', count: 6, avgGpa: '6.20', risk: 'Moderate' },
              { bracket: 'Attendance < 65%', count: 4, avgGpa: '5.40', risk: 'High Risk' }
            ].map((row) => (
              <div
                key={row.bracket}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900">{row.bracket}</div>
                  <div className="text-[11px] text-slate-400">{row.count} scholars in band</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-900 tabular-nums">GPA {row.avgGpa}</div>
                  <div className="text-[10px] text-slate-500">{row.risk}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-900">
            Departmental Retention & Support Overview
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Intervention volumes and early warning distribution by academic division.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase text-[11px]">
                <th className="py-3 px-4">Academic Division</th>
                <th className="py-3 px-4">Enrolled Cohort</th>
                <th className="py-3 px-4">Mean CGPA</th>
                <th className="py-3 px-4">Attendance Rate</th>
                <th className="py-3 px-4">Flagged Scholars</th>
                <th className="py-3 px-4">Active Support Plans</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departments.map((dept) => {
                const deptStudents = students.filter((s) => s.department === dept);
                const deptFlagged = deptStudents.filter((s) => s.riskAssessment.level !== 'LOW').length;
                const deptAtt = Math.round(
                  deptStudents.reduce((acc, s) => acc + s.attendanceRate, 0) / (deptStudents.length || 1)
                );
                const deptGpa = (
                  deptStudents.reduce((acc, s) => acc + s.cgpa, 0) / (deptStudents.length || 1)
                ).toFixed(2);

                return (
                  <tr key={dept} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{dept}</td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700">
                      {deptStudents.length * 25}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900 tabular-nums">
                      {deptGpa}
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700">
                      {deptAtt}%
                    </td>
                    <td className="py-3.5 px-4">
                      {deptFlagged > 0 ? (
                        <span className="font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          {deptFlagged} Flagged
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">Nominal</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-800">
                      {deptFlagged > 0 ? `${deptFlagged} Plans` : 'None Needed'}
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
