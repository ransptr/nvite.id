import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {LoaderCircle} from 'lucide-react';
import {signInWithPassword, signInWithMagicLink} from '@/src/hooks/useAuth';

type Tab = 'password' | 'magic';

export function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const {error: err} = await signInWithPassword(email, password);
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      navigate('/dashboard');
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const {error: err} = await signInWithMagicLink(email);
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setMagicSent(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fdfaf6] px-4">
      <Link to="/" className="mb-10 text-[11px] uppercase tracking-[0.35em] text-[#c9974a]">
        nvite.id
      </Link>

      <div className="w-full max-w-sm">
        <h1 className="mb-1 font-display text-4xl italic text-[#1a1612]">Welcome back</h1>
        <p className="mb-8 text-sm text-[#6b5e52]">Sign in to your account</p>

        {/* Tab toggle */}
        <div className="mb-6 flex rounded-xl bg-[#f0ebe4] p-1">
          {(['password', 'magic'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {setTab(t); setError(null); setMagicSent(false);}}
              className={`flex-1 rounded-lg py-2 text-[11px] uppercase tracking-[0.28em] transition ${
                tab === t
                  ? 'bg-white text-[#1a1612] shadow-sm'
                  : 'text-[#8a7a6e] hover:text-[#1a1612]'
              }`}
            >
              {t === 'password' ? 'Password' : 'Magic Link'}
            </button>
          ))}
        </div>

        {tab === 'password' ? (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <AuthInput
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
            />
            <AuthInput
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <AuthButton loading={loading}>Sign in</AuthButton>
          </form>
        ) : magicSent ? (
          <div className="rounded-xl border border-[#e8ddd4] bg-white p-6 text-center">
            <p className="text-sm leading-relaxed text-[#6b5e52]">
              Check your inbox — we sent a sign-in link to <strong className="text-[#1a1612]">{email}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="space-y-4">
            <AuthInput
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <AuthButton loading={loading}>Send magic link</AuthButton>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-[#8a7a6e]">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-[#c9974a] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

function AuthInput({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] uppercase tracking-[0.28em] text-[#8a7a6e]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full rounded-xl border border-[#e8ddd4] bg-white px-4 py-3 text-sm text-[#1a1612] placeholder-[#c4b9af] outline-none transition focus:border-[#c9974a] focus:ring-2 focus:ring-[#c9974a]/20"
      />
    </label>
  );
}

function AuthButton({children, loading}: {children: React.ReactNode; loading: boolean}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#c9974a] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#b8863b] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
