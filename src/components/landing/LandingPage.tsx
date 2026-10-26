import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Brain,
  Users,
  CheckCircle2,
  BookOpen,
  Award,
  ChevronRight,
  Clock,
  Sparkles,
  FileText,
  MapPin,
  Bus,
  Lock,
  Compass
} from 'lucide-react';
import { UserRole } from '../../types';

interface LandingPageProps {
  onEnterPlatform: (role?: UserRole) => void;
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterPlatform,
  onOpenLogin
}) => {
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState(2);

  const workflowSteps = [
    {
      num: '01',
      title: 'Academic Data Ingestion',
      desc: 'Aggregates attendance records, assignment submissions, lab practicals, and mid-term assessments from LMS and SIS databases.'
    },
    {
      num: '02',
      title: 'Data Validation & Sanitization',
      desc: 'Ensures data integrity while strictly filtering out sensitive non-academic demographics to prevent algorithmic bias.'
    },
    {
      num: '03',
      title: 'AI Risk Assessment Model',
      desc: 'Ensemble gradient boosted algorithms evaluate multidimensional trend deviations against longitudinal baselines.'
    },
    {
      num: '04',
      title: 'Explainable SHAP Indicators',
      desc: 'Generates transparent feature attribution scores showing why a student was flagged, without black-box opacity.'
    },
    {
      num: '05',
      title: 'Human Review & Mentorship',
      desc: 'Authorized counselors review flagged indicators and contextualize individual circumstances before action.'
    },
    {
      num: '06',
      title: 'Support Plan Structuring',
      desc: 'Designs compassionate academic assistance, remedial tutoring, peer study circles, or counseling sessions.'
    },
    {
      num: '07',
      title: 'Intervention Tracking',
      desc: 'Logs student touchpoints, milestones, action items, and communications in an auditable support record.'
    },
    {
      num: '08',
      title: 'Continuous Monitoring',
      desc: 'Monitors real-time recovery metrics to ensure interventions are successful and student confidence is restored.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              P
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 leading-tight">Presidency College</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                Autonomous University Platform
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-blue-900 transition-colors">How It Works</a>
            <a href="#early-warning" className="hover:text-blue-900 transition-colors">Early-Warning Center</a>
            <a href="#roles" className="hover:text-blue-900 transition-colors">Role Experiences</a>
            <a href="#security" className="hover:text-blue-900 transition-colors">Security & Ethics</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="text-xs font-semibold text-slate-700 hover:text-blue-900 px-3 py-2 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onEnterPlatform('admin')}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-900 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Explainable Academic Early-Warning System</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.1] text-balance">
                Smarter Student Support.{' '}
                <span className="text-blue-900">Better Academic Outcomes.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                An intelligent student management and early-warning platform helping Presidency College educators identify students who may need support and take meaningful action at the right time.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onEnterPlatform('admin')}
                  className="px-6 py-3 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
                >
                  <span>Explore Platform as Dean / Admin</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={onOpenLogin}
                  className="px-5 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-xs transition-colors"
                >
                  Sign In with Credentials
                </button>
              </div>

              <div className="pt-4 flex items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Explainable SHAP Attribution</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Human-in-the-Loop Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ethical Safeguards</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Showcase & Generated Campus Artwork */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 group">
                <img
                  src="/src/assets/images/presidency_campus_hero_1790600107181.jpg"
                  alt="Presidency College Academic Campus"
                  className="w-full h-80 sm:h-96 object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Overlay Floating Data Cards */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-slate-200/80 animate-bounce duration-1000">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold text-slate-800">Attendance: 86%</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Statutory compliance verified</div>
                </div>

                <div className="absolute top-16 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800">Academic Trend: ↑ Improving</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">+0.4 GPA growth this semester</div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-900">Explainable Model Assessment</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Support Recommended
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-normal">
                    Observed low lab attendance (-14%) combined with 2 missed assignments. Flagged for proactive counselor outreach, not punitive action.
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                    <span className="text-slate-500">Human Reviewer: Smt. Kavitha Rao</span>
                    <button
                      onClick={() => onEnterPlatform('mentor')}
                      className="text-blue-900 font-semibold hover:underline"
                    >
                      View Support Plan →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Institution Section */}
      <section className="py-8 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-6 text-slate-500 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-900" />
              <span>NAAC A++ ACCREDITED INSTITUTION</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-900" />
              <span>AICTE & UGC AUTONOMOUS RECOGNITION</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-900" />
              <span>NBA ACCREDITED ENGINEERING PROGRAMS</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-900" />
              <span>12,000+ SCHOLARS ACROSS 5 FACULTIES</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works: 8-Step Animated / Interactive Workflow */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
              Explainable Architecture
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              The 8-Stage Student Support Lifecycle
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Presidency College clearly separates raw academic observations from predictive assessment, human review, and pastoral intervention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {workflowSteps.map((step, idx) => {
              const isSelected = selectedWorkflowStep === idx;
              return (
                <div
                  key={step.num}
                  onClick={() => setSelectedWorkflowStep(idx)}
                  className={`cursor-pointer p-5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-white border-blue-600 shadow-md ring-1 ring-blue-600'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                      {step.num}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">STAGE {idx + 1}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Role Experiences: Switchable Perspectives */}
      <section id="roles" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
              Role-Specific Workspaces
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              One Unified Platform. Four Specialized Views.
            </h2>
            <p className="text-sm text-slate-600 mt-3">
              Each user persona has tailored tools and privacy-preserving permissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Student Card */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-4">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Student Experience</h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Self-service portal to monitor GPA trends, attendance compliance, exam timetables, assignment deliverables, and connect with mentors.
                </p>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">✓ Attendance status tracker</div>
                  <div className="flex items-center gap-2">✓ Assignment uploads</div>
                  <div className="flex items-center gap-2">✓ Transcript previews</div>
                </div>
              </div>
              <button
                onClick={() => onEnterPlatform('student')}
                className="mt-6 w-full py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Launch Student View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Faculty Card */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold mb-4">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Faculty & Teachers</h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Log daily class attendance with one click, publish coursework, enter internal marks, and view which students in your batch need academic encouragement.
                </p>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">✓ 1-click attendance logger</div>
                  <div className="flex items-center gap-2">✓ Coursework manager</div>
                  <div className="flex items-center gap-2">✓ Class performance alerts</div>
                </div>
              </div>
              <button
                onClick={() => onEnterPlatform('faculty')}
                className="mt-6 w-full py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Launch Faculty View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mentor / Counselor Card */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Counselor & Mentors</h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Dedicated pastoral care center. Review elevated-risk indicators, schedule 1-on-1 counseling, record intervention notes, and track student recovery.
                </p>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">✓ Students requiring attention</div>
                  <div className="flex items-center gap-2">✓ Pastoral intervention logs</div>
                  <div className="flex items-center gap-2">✓ Counseling follow-ups</div>
                </div>
              </div>
              <button
                onClick={() => onEnterPlatform('mentor')}
                className="mt-6 w-full py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Launch Counselor View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Admin Card */}
            <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 flex flex-col justify-between shadow-lg">
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">Dean & Administration</h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Macro institutional intelligence. Cohort-wide retention metrics, departmental risk distributions, CSV reports, and campus-wide emergency broadcasts.
                </p>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">✓ Institutional retention analytics</div>
                  <div className="flex items-center gap-2">✓ SHAP-based early warnings</div>
                  <div className="flex items-center gap-2">✓ Campus emergency broadcast</div>
                </div>
              </div>
              <button
                onClick={() => onEnterPlatform('admin')}
                className="mt-6 w-full py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Launch Admin Command</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Security, Ethical AI & Governance */}
      <section id="security" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-900 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Ethical Algorithmic Governance</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Zero demographic bias. Sensitive attributes like caste, religion, or gender are never included in predictive feature sets.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Explainable AI (SHAP)</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Every risk indicator breaks down into transparent mathematical contributions, enabling empathetic human discussion.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-purple-50 text-purple-900 shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Strict FERPA & Data Privacy</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Role-based access control enforces least-privilege standards. Student personal records are isolated and encrypted at rest.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-950 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Empower Students with Early Care?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Experience the live Presidency College early-warning environment with full simulated academic cohort data, interactive interventions, and SHAP explainability.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onEnterPlatform('admin')}
              className="px-6 py-3 text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-lg transition-colors flex items-center gap-2"
            >
              <span>Explore Platform as Administrator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenLogin}
              className="px-6 py-3 text-sm font-semibold text-white bg-blue-800 hover:bg-blue-700 rounded-xl border border-blue-700 transition-colors"
            >
              Sign In with Institutional ID
            </button>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-3">
              <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-xs">P</div>
              <span>Presidency College</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Kempapura, Hebbal, Bengaluru, Karnataka 560024. Autonomous institution affiliated with Bengaluru City University.
            </p>
          </div>
          <div>
            <div className="text-white font-semibold mb-3">Academic Programs</div>
            <ul className="space-y-1.5">
              <li>Computer Science & Engineering</li>
              <li>Artificial Intelligence & Data Science</li>
              <li>School of Management Studies</li>
              <li>Department of Commerce</li>
            </ul>
          </div>
          <div>
            <div className="text-white font-semibold mb-3">Governance & Support</div>
            <ul className="space-y-1.5">
              <li>Student Retention Directorate</li>
              <li>Center for Student Wellbeing</li>
              <li>Controller of Examinations</li>
              <li>Anti-Ragging & Grievance Cell</li>
            </ul>
          </div>
          <div>
            <div className="text-white font-semibold mb-3">Contact Helpline</div>
            <p className="text-slate-400 leading-relaxed">
              Toll Free: 1800 123 4567<br />
              Email: retention@presidencycollege.ac.in<br />
              Academic Dean: +91 98450 12345
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <div>© 2026 Presidency College Bengaluru. All rights reserved.</div>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Ethical AI Charter</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
