import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { User, UserRole } from '../../types';
import { INITIAL_USERS } from '../../data/sampleData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  onOpenRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenRegister
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mfaStep, setMfaStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [pendingUser, setPendingUser] = useState<User | null>(null);

  if (!isOpen) return null;

  const handleQuickLogin = (role: UserRole) => {
    const user = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
    onLoginSuccess(user);
    onClose();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user = INITIAL_USERS.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (user) {
        if (user.role === 'admin') {
          // Require simulated MFA OTP for admin accounts for realistic institutional security
          setPendingUser(user);
          setMfaStep(true);
        } else {
          onLoginSuccess(user);
          onClose();
        }
      } else {
        // Fallback demo user
        const newDemoUser: User = {
          id: `user_${Date.now()}`,
          name: email.split('@')[0].replace('.', ' ') || 'Academic Scholar',
          email: email.trim(),
          role: email.includes('student') ? 'student' : email.includes('faculty') ? 'faculty' : 'admin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
          department: 'Presidency College Academic Body'
        };
        onLoginSuccess(newDemoUser);
        onClose();
      }
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length >= 4 && pendingUser) {
      onLoginSuccess(pendingUser);
      onClose();
    } else {
      setErrorMessage('Please enter a valid 6-digit MFA verification code (e.g. 582914)');
    }
  };

  const handleGoogleOAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(INITIAL_USERS[0]); // Log in as Dean Anand Ramanathan
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[540px]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Form */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-sm">
                P
              </div>
              <span className="font-bold text-slate-900 text-sm">Presidency College Portal</span>
            </div>

            {!mfaStep ? (
              <>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
                  Welcome to Presidency
                </h2>
                <p className="text-xs text-slate-500 mb-6">
                  Sign in to access your student management, early-warning, and course analytics.
                </p>

                {errorMessage && (
                  <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                    {errorMessage}
                  </div>
                )}

                {/* Google Sign-in Simulation */}
                <button
                  onClick={handleGoogleOAuth}
                  type="button"
                  className="w-full py-2.5 px-4 mb-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs flex items-center justify-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign in with Google Workspace (@presidencycollege.ac.in)</span>
                </button>

                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 border-t border-slate-200"></div>
                  <span className="text-[11px] font-medium text-slate-400 uppercase">Or email ID</span>
                  <div className="flex-1 border-t border-slate-200"></div>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Institutional Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="e.g. principal@presidencycollege.ac.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => alert('Password recovery link dispatched to registered institutional email.')}
                        className="text-[11px] text-blue-900 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={rememberDevice}
                        onChange={(e) => setRememberDevice(e.target.checked)}
                        className="rounded border-slate-300 text-blue-900 focus:ring-blue-500"
                      />
                      <span>Remember this workstation</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Portal'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Multi-Factor Authentication (MFA)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Administrator account requires high-assurance verification. A 6-digit authentication token has been generated for your device session.
                </p>

                <form onSubmit={handleVerifyOtp} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Enter 6-Digit MFA Token
                    </label>
                    <input
                      type="text"
                      autoFocus
                      maxLength={6}
                      placeholder="e.g. 582914"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full text-center tracking-widest font-mono text-lg py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <div className="text-[11px] text-slate-400 mt-1">Hint: Any 6 digits for testing demo (e.g. 123456)</div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition-colors"
                  >
                    Verify & Access Administrative Command
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Quick Demo Role Logins */}
          <div className="pt-6 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Instant 1-Click Persona Access
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-1.5 text-left rounded bg-slate-50 hover:bg-blue-50 border border-slate-200 text-xs transition-colors"
              >
                <div className="font-bold text-blue-900">Dean / Admin</div>
                <div className="text-[10px] text-slate-500">Dr. Anand</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('faculty')}
                className="p-1.5 text-left rounded bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-xs transition-colors"
              >
                <div className="font-bold text-indigo-900">Faculty</div>
                <div className="text-[10px] text-slate-500">Dr. Rajeshwari</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('mentor')}
                className="p-1.5 text-left rounded bg-slate-50 hover:bg-amber-50 border border-slate-200 text-xs transition-colors"
              >
                <div className="font-bold text-amber-900">Counselor</div>
                <div className="text-[10px] text-slate-500">Smt. Kavitha</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('student')}
                className="p-1.5 text-left rounded bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-xs transition-colors"
              >
                <div className="font-bold text-emerald-900">Student</div>
                <div className="text-[10px] text-slate-500">Aditya V.</div>
              </button>
            </div>

            <div className="mt-4 text-center text-xs text-slate-500">
              New scholar or faculty member?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRegister();
                }}
                className="font-semibold text-blue-900 hover:underline"
              >
                Start Multi-Step Registration
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Editorial Institutional Artwork & Info */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white p-8 flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-slate-200 text-[11px] font-medium backdrop-blur-xs mb-6">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Compassionate Early Warning</span>
            </div>

            <h3 className="text-xl font-bold tracking-tight mb-3">
              "Technology should notice when a student needs support — and help people respond with care."
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              The early-warning engine uses explainable SHAP modeling to surface attendance and assessment drop-offs before critical exam cutoffs, enabling proactive faculty intervention.
            </p>

            <div className="space-y-3 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Non-punitive pastoral care principles</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Strict human-in-the-loop review</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Automated follow-up scheduling</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Presidency College Autonomous</span>
            <span>NAAC A++</span>
          </div>
        </div>
      </div>
    </div>
  );
};
