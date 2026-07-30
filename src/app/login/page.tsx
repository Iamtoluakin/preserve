'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';

function getSiteUrl() {
  if (typeof window !== 'undefined') return window.location.origin;
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

async function ensureUserProfile(fullName?: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const user = userData.user;

  if (userError || !user) return;

  const { error } = await supabase
    .from('users')
    .upsert(
      {
        id: user.id,
        email: user.email,
        full_name: fullName || user.user_metadata?.full_name || null,
      },
      { onConflict: 'id' }
    );

  if (error) {
    console.warn('Could not sync Supabase user profile:', error.message);
  }
}

async function saveAppSession(accessToken: string) {
  const sessionResponse = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    cache: 'no-store',
    body: JSON.stringify({ accessToken }),
  });

  if (!sessionResponse.ok) throw new Error('Could not save your login session. Please try again.');
}

function moveToNextPath(nextPath: string) {
  window.location.replace(nextPath);
}

function GoogleMark() {
  return (
    <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-sm font-black text-blue-600 shadow-sm ring-1 ring-slate-200">
      G
    </span>
  );
}

export default function LoginPage() {
  const redirectingRef = useRef(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState('');
  const [signupDone, setSignupDone] = useState(false);

  const getNextPath = () => {
    if (typeof window === 'undefined') return '/dashboard';
    return new URLSearchParams(window.location.search).get('next') || '/dashboard';
  };

  useEffect(() => {
    let active = true;

    const completeSession = async (accessToken?: string | null) => {
      if (!active || !accessToken || redirectingRef.current) return;

      try {
        redirectingRef.current = true;
        await ensureUserProfile();
        await saveAppSession(accessToken);

        moveToNextPath(getNextPath());
      } catch (err: any) {
        redirectingRef.current = false;
        setError(err.message || 'Could not complete sign in. Please try again.');
        setOauthLoading(false);
      }
    };

    const completeExistingSession = async () => {
      const params = new URLSearchParams(window.location.search);
      const oauthCode = params.get('code');

      if (oauthCode) {
        setOauthLoading(true);
        const { data, error } = await supabase.auth.exchangeCodeForSession(oauthCode);
        if (error) {
          setOauthLoading(false);
          setError(error.message || 'Could not finish Google sign in. Please try again.');
          return;
        }

        await completeSession(data.session?.access_token);
        return;
      }

      const { data } = await supabase.auth.getSession();
      await completeSession(data.session?.access_token);
    };

    completeExistingSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event !== 'SIGNED_IN') return;
      await completeSession(session?.access_token);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await ensureUserProfile();

        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData.session?.access_token;
        if (!accessToken) throw new Error('Could not create a login session. Please try again.');

        await saveAppSession(accessToken);

        moveToNextPath(getNextPath());
      } else {
        if (!name.trim()) { setError('Please enter your name.'); setLoading(false); return; }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${getSiteUrl()}/login`,
          },
        });
        if (error) throw error;

        if (data.session) {
          await ensureUserProfile(name);
          const accessToken = data.session.access_token;
          await saveAppSession(accessToken);

          moveToNextPath('/dashboard');
        } else {
          setSignupDone(true);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setOauthLoading(true);
    const next = getNextPath();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${getSiteUrl()}/login?next=${encodeURIComponent(next)}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      setOauthLoading(false);
      setError(error.message || 'Could not start Google sign in.');
    }
  };

  if (signupDone) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email!</h2>
          <p className="text-slate-600 mb-6">
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then sign in.
          </p>
          <button
            onClick={() => { setSignupDone(false); setMode('login'); }}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">P</span>
            </div>
            <span className="text-3xl font-bold text-slate-900">Preserve</span>
          </Link>
          <p className="text-slate-500 mt-2 text-sm">Property care made simple</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex rounded-xl bg-slate-100 p-1 mb-7">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${mode === 'login' ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-700'}`}
            >Sign In</button>
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${mode === 'signup' ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-700'}`}
            >Create Account</button>
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-1">
            Sign in to open Preserve
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Create a secure workspace before viewing properties, pricing tools, and service requests.
          </p>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || oauthLoading}
            className="group mb-4 flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200/80 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {oauthLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GoogleMark />}
            Continue with Google
          </button>

          {!showEmailForm ? (
            <button
              type="button"
              onClick={() => setShowEmailForm(true)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              or sign in via email
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 border-t border-slate-100 pt-5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Jane Smith" required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'} required minLength={6}
                    className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === 'login' ? 'Sign In' : 'Create Free Account'}
              </button>
            </form>
          )}
          {showEmailForm && mode === 'signup' && (
            <p className="text-xs text-slate-400 text-center mt-4">By signing up you agree to our Terms of Service and Privacy Policy.</p>
          )}
        </div>
        <p className="text-center text-slate-500 text-sm mt-6">
          <Link href="/" className="hover:text-blue-600 transition">← Back to homepage</Link>
        </p>
      </div>
    </div>
  );
}
