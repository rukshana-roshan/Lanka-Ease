import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { Logo } from '../components/Logo';

export function PasswordResetPage() {
  const location = useLocation();
  const reset = location.pathname === '/reset-password';
  const [token] = useState(() => {
    const value = new URLSearchParams(window.location.hash.slice(1)).get('token') || '';
    return value;
  });
  useEffect(() => {
    if (token) window.history.replaceState(window.history.state, '', window.location.pathname);
  }, [token]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);
  const inputClass = 'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500';

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError(''); setMessage('');
    if (reset && password !== confirmation) { setError('Passwords do not match.'); return; }
    if (reset && new TextEncoder().encode(password).length > 72) { setError('Choose a password that is at most 72 bytes.'); return; }
    setBusy(true);
    try {
      const response = reset ? await api.resetPassword(token, password) : await api.forgotPassword(email.trim());
      setMessage(response.message); setComplete(true); setPassword(''); setConfirmation('');
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Please try again.'); }
    finally { setBusy(false); }
  }

  return <main className="min-h-screen bg-slate-50 px-4 py-16 text-slate-900">
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      <Logo size="lg" showTagline={false} />
      <h1 className="mt-6 text-2xl font-bold">{reset ? 'Choose a new password' : 'Forgot your password?'}</h1>
      <p className="mb-6 mt-2 text-sm text-slate-600">{reset ? 'Enter and confirm your new password below.' : 'Enter your account email and we will send you a password reset link.'}</p>
      {error && <p role="alert" className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
      {message && <p role="status" className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
      {reset && !token && <p role="alert" className="mb-4 text-sm text-rose-800">This link is missing its reset token. Open the link in your email or <Link className="underline" to="/forgot-password">request a new link</Link>.</p>}
      {!complete && (!reset || token) && <form onSubmit={submit} className="space-y-4">
        {reset ? <>
          <label className="block text-sm font-medium">New password<input className={`${inputClass} mt-2`} type="password" autoComplete="new-password" required minLength={8} maxLength={64} value={password} onChange={e => setPassword(e.target.value)} /></label>
          <p className="text-xs text-slate-600">Use 8–64 characters.</p>
          <label className="block text-sm font-medium">Confirm password<input className={`${inputClass} mt-2`} type="password" autoComplete="new-password" required minLength={8} maxLength={64} value={confirmation} onChange={e => setConfirmation(e.target.value)} /></label>
        </> : <label className="block text-sm font-medium">Email address<input className={`${inputClass} mt-2`} type="email" autoComplete="email" required maxLength={150} value={email} onChange={e => setEmail(e.target.value)} /></label>}
        <button disabled={busy} className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white disabled:opacity-60">{busy ? 'Please wait…' : reset ? 'Save new password' : 'Send reset link'}</button>
      </form>}
      <Link to="/login" className="mt-6 block text-sm font-semibold text-emerald-700 hover:underline">Back to sign in</Link>
    </div>
  </main>;
}
