import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

const ADMIN_EMAIL = 'nasrullah.altaf0123@gmail.com';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email !== ADMIN_EMAIL) {
      setError(t('শুধুমাত্র অ্যাডমিন লগইন করতে পারবে', 'Only admin can login'));
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + '/admin' }
        });
        if (signUpError) throw signUpError;
        setError(t('ইমেইলে ভেরিফিকেশন লিংক পাঠানো হয়েছে', 'Verification link sent to email'));
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="glass-card p-8 border-gold/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'hsl(var(--gold) / 0.15)' }}>
              <Lock className="w-7 h-7" style={{ color: 'hsl(var(--gold))' }} />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              {t('অ্যাডমিন প্যানেল', 'Admin Panel')}
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-1">
              {t('কন্টেন্ট ম্যানেজ করতে লগইন করুন', 'Login to manage content')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-accent text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">
                {t('ইমেইল', 'Email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary font-body text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-accent text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">
                {t('পাসওয়ার্ড', 'Password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary font-body text-sm"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm font-body text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-body font-semibold text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, hsl(43, 72%, 55%), hsl(43, 72%, 45%))',
                color: 'hsl(30, 10%, 10%)',
                boxShadow: '0 4px 16px hsl(43, 72%, 55% / 0.3)',
              }}
            >
              {loading ? (t('অপেক্ষা করুন...', 'Please wait...')) : (isSignUp ? t('সাইন আপ', 'Sign Up') : t('লগইন', 'Login'))}
            </button>

            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="w-full text-center text-xs font-body text-muted-foreground hover:text-foreground transition-colors"
            >
              {isSignUp
                ? t('ইতোমধ্যে অ্যাকাউন্ট আছে? লগইন করুন', 'Already have an account? Login')
                : t('প্রথমবার? সাইন আপ করুন', 'First time? Sign Up')
              }
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="w-full mt-4 text-center text-xs font-body text-muted-foreground hover:text-foreground transition-colors"
          >
            ← {t('হোমে ফিরুন', 'Back to Home')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
