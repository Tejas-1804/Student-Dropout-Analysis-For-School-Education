import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Brain,
  History,
  ShieldAlert,
  UserCheck,
  Send,
  Calendar,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Student, User } from '../../types';
import { storageService } from '../../services/storage';

interface WhyThisAlertModalProps {
  student: Student | null;
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onCreateSupportPlan: (student: Student) => void;
}

export const WhyThisAlertModal: React.FC<WhyThisAlertModalProps> = ({
  student,
  currentUser,
  isOpen,
  onClose,
  onCreateSupportPlan
}) => {
  const [reviewNote, setReviewNote] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isReevaluating, setIsReevaluating] = useState(false);

  if (!isOpen || !student) return null;

  const { riskAssessment } = student;

  const handleMarkReviewed = () => {
    setIsSubmittingReview(true);
    setTimeout(() => {
      storageService.markHumanReview(
        student.id,
        currentUser.name,
        currentUser.role === 'admin' ? 'Institutional Dean' : currentUser.role === 'faculty' ? 'Faculty Mentor' : 'Lead Counselor',
        reviewNote || 'Student circumstances reviewed during advisory check-in.'
      );
      setIsSubmittingReview(false);
      setReviewNote('');
    }, 400);
  };

  const handleReevaluate = () => {
    setIsReevaluating(true);
    setTimeout(() => {
      storageService.evaluateStudentWithML(student.id);
      setIsReevaluating(false);
    }, 600);
  };

  const getRiskBadge = (level: string) => {
    if (level === 'HIGH') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          <span>ELEVATED DROPOUT-RISK INDICATOR</span>
        </span>
      );
    }
    if (level === 'MODERATE') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>MODERATE SUPPORT INDICATOR</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>HEALTHY ACADEMIC PROGRESSION</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl h-full bg-white shadow-2xl border-l border-slate-200 overflow-y-auto flex flex-col justify-between">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                <img
                  src={student.avatar}
                  alt={student.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{student.name}</h3>
                  <span className="text-xs text-slate-500 font-mono">({student.studentId})</span>
                </div>
                <div className="text-xs text-slate-500">
                  {student.course} · Sem {student.semester} · {student.department}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2">
            <div>{getRiskBadge(riskAssessment.level)}</div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReevaluate}
                disabled={isReevaluating}
                className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
                title="Re-run explainable ML prediction engine"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isReevaluating ? 'animate-spin' : ''}`} />
                <span>Re-score Model</span>
              </button>
              <div className="text-xs font-bold text-slate-800">
                Risk Score: <span className="text-base text-blue-900 tabular-nums">{riskAssessment.score}</span> / 100
              </div>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* Important Institutional Policy Disclaimer */}
          <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/80 text-xs text-blue-950">
            <div className="flex items-center gap-2 font-bold mb-1 text-blue-900">
              <Brain className="w-4 h-4 text-blue-700" />
              <span>Institutional Explainability & Safety Charter</span>
            </div>
            <p className="leading-relaxed text-blue-900/90">
              The early-warning system provides statistical indicators to assist institutional staff in early intervention.
              <strong> The system never states that a student will drop out.</strong> All risk assessments require human review and pastoral discretion.
            </p>
          </div>

          {/* Observed Primary Metrics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Observed Academic Data
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-slate-500 mb-1">Class Attendance</div>
                <div
                  className={`text-lg font-bold tabular-nums ${
                    student.attendanceRate < 75 ? 'text-red-700' : 'text-emerald-700'
                  }`}
                >
                  {student.attendanceRate}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Threshold: 75%</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-slate-500 mb-1">Cumulative CGPA</div>
                <div className="text-lg font-bold text-slate-900 tabular-nums">
                  {student.cgpa.toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Scale: 10.0</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-slate-500 mb-1">Missed Submissions</div>
                <div
                  className={`text-lg font-bold tabular-nums ${
                    student.missedAssignments > 0 ? 'text-amber-700' : 'text-slate-900'
                  }`}
                >
                  {student.missedAssignments}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">of 12 deliverables</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-slate-500 mb-1">Academic Trend</div>
                <div className="flex items-center gap-1 text-sm font-bold capitalize mt-1">
                  {student.academicTrend === 'declining' ? (
                    <>
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      <span className="text-red-700">Declining</span>
                    </>
                  ) : student.academicTrend === 'improving' ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Improving</span>
                    </>
                  ) : (
                    <span className="text-slate-700">Stable</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Explainable SHAP Feature Contributions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                SHAP Feature Attribution (Why this student was flagged)
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">Ensemble Model v2.4</span>
            </div>

            <div className="space-y-3">
              {riskAssessment.shapValues.map((shap, idx) => {
                const isIncrease = shap.direction === 'increases_risk';
                const impactPercentage = Math.min(100, Math.abs(shap.impactScore) * 2.2);

                return (
                  <div key={idx} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <span>{shap.feature}</span>
                        <span className="text-[11px] text-slate-500 font-mono font-normal">
                          [{shap.observedValue}]
                        </span>
                      </div>
                      <div
                        className={`font-mono font-bold ${
                          isIncrease ? 'text-red-700' : 'text-emerald-700'
                        }`}
                      >
                        {shap.impactScore > 0 ? `+${shap.impactScore}` : shap.impactScore} pts
                      </div>
                    </div>

                    {/* Impact Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isIncrease ? 'bg-red-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${impactPercentage}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {shap.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Longitudinal Risk History Timeline */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              <History className="w-4 h-4 text-slate-400" />
              <span>Multi-Semester Risk Trajectory</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {riskAssessment.riskHistory.map((hist, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border text-center ${
                    idx === riskAssessment.riskHistory.length - 1
                      ? 'bg-blue-50/80 border-blue-300 font-semibold'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="text-[10px] text-slate-500">{hist.semester}</div>
                  <div
                    className={`text-xs font-bold mt-1 ${
                      hist.riskLevel === 'HIGH'
                        ? 'text-red-700'
                        : hist.riskLevel === 'MODERATE'
                        ? 'text-amber-700'
                        : 'text-emerald-700'
                    }`}
                  >
                    {hist.riskLevel}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 tabular-nums">
                    Score: {hist.score}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Institutional Interventions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Recommended Pastoral Actions
            </h4>
            <div className="space-y-1.5">
              {riskAssessment.recommendedActions.map((action, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-slate-700 p-2 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Human Review Status / Logging */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Human Review Status</span>
              </div>
              {riskAssessment.isHumanReviewed ? (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Verified by Staff
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Requires Human Review
                </span>
              )}
            </div>

            {riskAssessment.isHumanReviewed ? (
              <div className="text-xs text-slate-600 space-y-1">
                <div>
                  <strong>Reviewed By:</strong> {riskAssessment.reviewedBy}
                </div>
                <div>
                  <strong>Timestamp:</strong> {riskAssessment.reviewedAt}
                </div>
                {riskAssessment.notes && (
                  <div className="mt-2 p-2 bg-white rounded border border-slate-200 italic text-[11px]">
                    "{riskAssessment.notes}"
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2 mt-2">
                <textarea
                  rows={2}
                  placeholder="Record confidential review remarks (e.g. Inquired about attendance dip; student attending to family health commitment)..."
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  onClick={handleMarkReviewed}
                  disabled={isSubmittingReview}
                  className="w-full py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{isSubmittingReview ? 'Recording...' : 'Mark as Human Reviewed'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 sticky bottom-0">
          <button
            onClick={() => {
              alert(`Direct outreach triggered to ${student.name} (${student.email}, ${student.phone}). WhatsApp & SMS alert dispatched.`);
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Contact Student</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onCreateSupportPlan(student);
            }}
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-sm transition-colors flex items-center gap-2"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Create Support Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
