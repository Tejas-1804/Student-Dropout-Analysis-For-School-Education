import React, { useState } from 'react';
import {
  HeartHandshake,
  Users,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  MessageSquare,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { User, Student } from '../../types';

interface MentorDashboardProps {
  currentUser: User;
  students: Student[];
  onOpenWhyAlert: (student: Student) => void;
  onCreateSupportPlan: (student: Student) => void;
  onViewStudentProfile: (student: Student) => void;
  onNavigate: (tab: string) => void;
}

export const MentorDashboard: React.FC<MentorDashboardProps> = ({
  currentUser,
  students,
  onOpenWhyAlert,
  onCreateSupportPlan,
  onViewStudentProfile,
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'high' | 'moderate'>('all');

  const highRiskStudents = students.filter((s) => s.riskAssessment.level === 'HIGH');
  const modRiskStudents = students.filter((s) => s.riskAssessment.level === 'MODERATE');

  const activeInterventions = students.flatMap((s) => s.interventions);

  const displayedStudents =
    selectedCategory === 'high'
      ? highRiskStudents
      : selectedCategory === 'moderate'
      ? modRiskStudents
      : [...highRiskStudents, ...modRiskStudents];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-amber-900 uppercase tracking-wider mb-1">
            Student Wellbeing & Mentorship Center
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Pastoral Workspace · {currentUser.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Lead Student Counselor & Academic Mentor · Office of Student Retention & Welfare
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('earlywarning')}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <span>Early-Warning Center</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Core Pastoral Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-red-200 bg-red-50/20 shadow-2xs">
          <div className="text-xs text-red-700 font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            <span>High Risk (Immediate Care)</span>
          </div>
          <div className="text-2xl font-extrabold text-red-700 tabular-nums mt-1">
            {highRiskStudents.length}
          </div>
          <div className="text-[11px] text-red-600/80 font-medium mt-1">1-on-1 counseling required</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-2xs">
          <div className="text-xs text-amber-700 font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Moderate Support</span>
          </div>
          <div className="text-2xl font-extrabold text-amber-700 tabular-nums mt-1">
            {modRiskStudents.length}
          </div>
          <div className="text-[11px] text-amber-700/80 font-medium mt-1">Advisory touchpoints</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-blue-900 font-medium flex items-center gap-1.5">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Active Support Plans</span>
          </div>
          <div className="text-2xl font-extrabold text-blue-900 tabular-nums mt-1">
            {activeInterventions.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Registered interventions</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Human Reviews Done</span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 tabular-nums mt-1">
            {students.filter((s) => s.riskAssessment.isHumanReviewed).length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Dossiers human-verified</div>
        </div>
      </div>

      {/* Main Support Center: Students Requiring Active Follow-up */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Students Requiring Mentoring Consultation
            </h2>
            <p className="text-xs text-slate-500">
              Personalized guidance for scholars facing academic, attendance, or personal obstacles.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                selectedCategory === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              All Support ({highRiskStudents.length + modRiskStudents.length})
            </button>
            <button
              onClick={() => setSelectedCategory('high')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                selectedCategory === 'high' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              High Risk ({highRiskStudents.length})
            </button>
            <button
              onClick={() => setSelectedCategory('moderate')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                selectedCategory === 'moderate' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Moderate ({modRiskStudents.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedStudents.map((s) => {
            const isHigh = s.riskAssessment.level === 'HIGH';
            return (
              <div
                key={s.id}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between hover:bg-slate-50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isHigh ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {s.riskAssessment.level} RISK (Score: {s.riskAssessment.score})
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Sem {s.semester}</span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={s.avatar}
                      alt={s.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <button
                        onClick={() => onViewStudentProfile(s)}
                        className="font-bold text-slate-900 text-sm hover:underline text-left block"
                      >
                        {s.name}
                      </button>
                      <div className="text-[11px] text-slate-400 font-mono">{s.studentId}</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 mb-4 bg-white p-3 rounded-lg border border-slate-200">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Attendance:</span>
                      <strong className={s.attendanceRate < 75 ? 'text-red-700' : 'text-slate-800'}>
                        {s.attendanceRate}%
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cumulative CGPA:</span>
                      <strong className="text-slate-800">{s.cgpa.toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Missed Deliverables:</span>
                      <strong className="text-amber-700">{s.missedAssignments}</strong>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenWhyAlert(s)}
                      className="flex-1 py-1.5 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors text-center"
                    >
                      Why This Alert?
                    </button>
                    <button
                      onClick={() => onCreateSupportPlan(s)}
                      className="flex-1 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors text-center"
                    >
                      Support Plan
                    </button>
                  </div>
                  <button
                    onClick={() => onViewStudentProfile(s)}
                    className="w-full py-1 text-[11px] text-slate-500 hover:text-slate-800 text-center"
                  >
                    View Full Support Dossier →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
