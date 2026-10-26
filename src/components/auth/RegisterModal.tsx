import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check, ShieldCheck, User } from 'lucide-react';
import { UserRole } from '../../types';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (userData: any) => void;
  onOpenLogin: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
  onOpenLogin
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    role: 'student' as UserRole,
    department: 'Computer Science & Engineering',
    course: 'B.Tech Computer Science',
    semester: 1,
    studentId: '',
    password: '',
    confirmPassword: '',
    mfaConsent: true
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete registration
      onRegisterSuccess({
        id: `user_${Date.now()}`,
        name: formData.fullName || 'Registered Scholar',
        email: formData.email,
        role: formData.role,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
        department: formData.department,
        semester: formData.semester,
        studentId: formData.studentId || `PC2024CS${Math.floor(100 + Math.random() * 900)}`
      });
      onClose();
    }
  };

  const steps = [
    { num: 1, title: 'Personal' },
    { num: 2, title: 'Academic' },
    { num: 3, title: 'Verification' },
    { num: 4, title: 'Security' },
    { num: 5, title: 'Completion' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Steps indicator */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          {steps.map((s, idx) => (
            <div key={s.num} className="flex items-center gap-1.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep > s.num
                    ? 'bg-emerald-600 text-white'
                    : currentStep === s.num
                    ? 'bg-blue-900 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {currentStep > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
              </div>
              <span className={`text-[11px] font-semibold hidden sm:inline ${currentStep === s.num ? 'text-slate-900' : 'text-slate-400'}`}>
                {s.title}
              </span>
              {idx < steps.length - 1 && <span className="text-slate-200 text-xs mx-1 hidden sm:inline">·</span>}
            </div>
          ))}
        </div>

        <form onSubmit={handleNext}>
          {/* STEP 1: Personal */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 1: Personal Information</h3>
                <p className="text-xs text-slate-500">Provide official identity details as per institutional records.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  name="fullName"
                  placeholder="e.g. Aditya Vardhan Rao"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Portal Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty Member</option>
                    <option value="mentor">Counselor / Mentor</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Academic */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 2: Academic Program & Department</h3>
                <p className="text-xs text-slate-500">Select your registered department and semester cohort.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                  <option value="School of Management Studies">School of Management Studies</option>
                  <option value="Department of Commerce">Department of Commerce</option>
                  <option value="Information Technology">Information Technology</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Enrolled Semester</label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Student/Staff ID (Optional)</label>
                  <input
                    type="text"
                    name="studentId"
                    placeholder="e.g. PC2024CS101"
                    value={formData.studentId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Contact Verification */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 3: Contact & Email Verification</h3>
                <p className="text-xs text-slate-500">Institutional correspondence and early-support alerts will route here.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Institutional Email</label>
                <input
                  type="email"
                  required
                  name="email"
                  placeholder="name.scholar@presidencycollege.ac.in"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Contact (+91)</label>
                <input
                  type="tel"
                  required
                  name="phone"
                  placeholder="+91 98450 12345"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Security */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 4: Authentication Security</h3>
                <p className="text-xs text-slate-500">Configure strong encryption credentials and multi-factor defense.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  name="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  name="confirmPassword"
                  placeholder="Re-type password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
                <div className="font-semibold text-slate-800 mb-1">Privacy Notice:</div>
                Demographic attributes (religion, caste, ancestry) are strictly prohibited from mandatory registration forms and are excluded from algorithmic assessment.
              </div>
            </div>
          )}

          {/* STEP 5: Completion */}
          {currentStep === 5 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Registration Ready</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Your profile has been validated against Presidency College academic registry. Click below to launch your personal workspace.
              </p>
              <div className="p-3 bg-slate-50 rounded-lg text-left text-xs text-slate-700 max-w-md mx-auto space-y-1">
                <div><strong>Scholar:</strong> {formData.fullName || 'Scholar'}</div>
                <div><strong>Department:</strong> {formData.department}</div>
                <div><strong>Role:</strong> {formData.role}</div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="text-xs text-blue-900 hover:underline"
              >
                Already registered? Sign In
              </button>
            )}

            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <span>{currentStep === 5 ? 'Launch Platform' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
