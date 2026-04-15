import {useState} from 'react';
import {Link, Navigate, useNavigate} from 'react-router-dom';
import {LoaderCircle} from 'lucide-react';
import {signUp, useAuth} from '@/src/hooks/useAuth';

export function SignupPage() {
  const navigate = useNavigate();
  const {session, loading: authLoading} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmSent, setConfirmSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError(null);
    const {data, error: err} = await signUp(email, password);
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    // If session is returned immediately (email confirm disabled), go to dashboard
    if (data.session) {
      navigate('/dashboard');
    } else {
      setConfirmSent(true);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdfaf6]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c9974a] border-t-transparent" />
      </div>
    );
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  if (confirmSent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fdfaf6] px-4">
        <Link to="/" className="mb-10 text-[11px] uppercase tracking-[0.35em] text-[#c9974a]">
          nvite.id
        </Link>
        <div className="w-full max-w-sm rounded-2xl border border-[#e8ddd4] bg-white p-8 text-center">
          <h2 className="mb-3 font-display text-3xl italic text-[#1a1612]">Check your inbox</h2>
          <p className="text-sm leading-relaxed text-[#6b5e52]">
            We sent a confirmation link to{' '}
            <strong className="text-[#1a1612]">{email}</strong>. Click it to activate your account.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block text-sm text-[#c9974a] hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fdfaf6] px-4">
      <Link to="/" className="mb-10 text-[11px] uppercase tracking-[0.35em] text-[#c9974a]">
        nvite.id
      </Link>

      <div className="w-full max-w-sm">
        <h1 className="mb-1 font-display text-4xl italic text-[#1a1612]">Create account</h1>
        <p className="mb-8 text-sm text-[#6b5e52]">Start building your invitation for free</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-[11px] uppercase tracking-[0.28em] text-[#8a7a6e]">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-[#e8ddd4] bg-white px-4 py-3 text-sm text-[#1a1612] placeholder-[#c4b9af] outline-none transition focus:border-[#c9974a] focus:ring-2 focus:ring-[#c9974a]/20"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-[11px] uppercase tracking-[0.28em] text-[#8a7a6e]">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              className="w-full rounded-xl border border-[#e8ddd4] bg-white px-4 py-3 text-sm text-[#1a1612] placeholder-[#c4b9af] outline-none transition focus:border-[#c9974a] focus:ring-2 focus:ring-[#c9974a]/20"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#c9974a] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#b8863b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#8a7a6e]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#c9974a] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
