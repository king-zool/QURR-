import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, Mail, Eye, EyeOff, ArrowLeft, 
  KeyRound, AlertCircle, Clock 
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

interface CuratorLoginViewProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds

export const CuratorLoginView: React.FC<CuratorLoginViewProps> = ({ 
  onLoginSuccess, 
  onBackToHome 
}) => {
  const { loginCurator } = useLibrary();

  const [email, setEmail] = useState('');
  const [passkey, setPasskey] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    try {
      const stored = sessionStorage.getItem('qurra_login_attempts');
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  // Check lockout on mount and tick countdown
  useEffect(() => {
    const checkLockout = () => {
      try {
        const untilStr = sessionStorage.getItem('qurra_lockout_until');
        if (untilStr) {
          const until = parseInt(untilStr, 10);
          const diff = Math.ceil((until - Date.now()) / 1000);
          if (diff > 0) {
            setLockoutRemaining(diff);
            return;
          } else {
            sessionStorage.removeItem('qurra_lockout_until');
            sessionStorage.removeItem('qurra_login_attempts');
            setFailedAttempts(0);
            setLockoutRemaining(0);
          }
        }
      } catch {
        // Ignore
      }
    };

    checkLockout();
    const timer = setInterval(checkLockout, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (lockoutRemaining > 0) {
      setErrorMessage(`Too many failed attempts. Security cooldown active: please wait ${lockoutRemaining}s.`);
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please enter your institutional curator ID.');
      return;
    }

    if (!passkey.trim()) {
      setErrorMessage('Please enter your curator passkey.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await loginCurator(email, passkey, rememberMe);
      setIsSubmitting(false);

      if (res.success) {
        // Reset security counters
        sessionStorage.removeItem('qurra_login_attempts');
        sessionStorage.removeItem('qurra_lockout_until');
        setPasskey('');
        onLoginSuccess();
      } else {
        // Instantly wipe entered password from memory to prevent memory/DOM scraping
        setPasskey('');
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        sessionStorage.setItem('qurra_login_attempts', newAttempts.toString());

        if (newAttempts >= MAX_FAILED_ATTEMPTS) {
          const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
          sessionStorage.setItem('qurra_lockout_until', lockoutUntil.toString());
          setLockoutRemaining(60);
          setErrorMessage('Too many failed attempts. Console locked for 60 seconds to protect against unauthorized access.');
        } else {
          setErrorMessage(res.error || 'Authentication denied. Invalid credentials.');
        }
      }
    } catch {
      setIsSubmitting(false);
      setPasskey('');
      setErrorMessage('An unexpected authentication error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Back Link */}
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5A6862] hover:text-[#064E3B] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Archive</span>
        </button>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-[#E3DDD1] p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
          
          {/* Subtle Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#064E3B] via-[#0E7054] to-[#C29B38]" />

          {/* Header */}
          <div className="text-center space-y-2 pt-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#064E3B]/10 text-[#064E3B] border border-[#064E3B]/20 shadow-2xs mb-1">
              <ShieldCheck className="w-7 h-7 text-[#064E3B]" />
            </div>
            
            <p className="font-amiri text-lg text-[#C29B38] font-bold tracking-wide">
              بوابة أمناء الأرشيف الوطني
            </p>

            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141A17] tracking-tight">
              Curator Gateway
            </h1>

            <p className="text-xs text-[#5D6B64] leading-relaxed max-w-xs mx-auto">
              Institutional access for verified ethnomusicologists, audio archivists, and tajweed custodians.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            
            {/* Curator Email / ID */}
            <div>
              <label 
                htmlFor="curator-email-input" 
                className="block text-xs font-semibold text-[#29322E] mb-1.5 uppercase tracking-wider"
              >
                Curator ID or Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#828F88] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="curator-email-input"
                  type="text"
                  value={email}
                  disabled={lockoutRemaining > 0 || isSubmitting}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="curator-id@institution.org"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F3] border border-[#DDD7CA] rounded-xl text-xs sm:text-sm text-[#141A17] placeholder:text-[#97A39D] focus:outline-hidden focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B] transition-all disabled:opacity-50"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            {/* Secret Passkey */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label 
                  htmlFor="curator-password-input" 
                  className="text-xs font-semibold text-[#29322E] uppercase tracking-wider"
                >
                  Secret Passkey
                </label>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#828F88] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="curator-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#FAF8F3] border border-[#DDD7CA] rounded-xl text-xs sm:text-sm text-[#141A17] placeholder:text-[#97A39D] focus:outline-hidden focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B] transition-all"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#828F88] hover:text-[#141A17] cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[#5A6862]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#064E3B] focus:ring-[#064E3B] w-4 h-4 border-[#DDD7CA]"
                />
                <span>Remember session on this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              id="curator-login-submit-btn"
              className="w-full py-3 px-4 rounded-xl bg-[#064E3B] text-white text-xs sm:text-sm font-semibold hover:bg-[#054131] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authenticate & Enter Console</span>
                </>
              )}
            </button>

          </form>

          {/* Security Notice */}
          <div className="text-center pt-2">
            <p className="text-[11px] text-[#7E8C85] leading-relaxed">
              🔒 Unlisted URL Gateway. This route is hidden from public site menus and is intended solely for authorized custodians.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
