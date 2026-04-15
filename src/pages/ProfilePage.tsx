import {Link} from 'react-router-dom';
import {ChevronRight, UserRound} from 'lucide-react';
import {useAuth} from '@/src/hooks/useAuth';
import {useInvitations} from '@/src/hooks/useInvitations';

const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  basic: 'Basic',
  pro: 'Pro',
};

export function ProfilePage() {
  const {user} = useAuth();
  const {profile, invitations, planLimit, loading} = useInvitations();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdfaf6]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c9974a] border-t-transparent" />
      </div>
    );
  }

  const plan = profile?.plan ?? 'free';

  return (
    <div className="min-h-screen bg-[#fdfaf6]">
      <header className="border-b border-[#e8ddd4] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link to="/dashboard" className="text-[11px] uppercase tracking-[0.35em] text-[#c9974a]">
            nvite.id
          </Link>
          <Link
            to="/dashboard"
            className="text-[11px] uppercase tracking-[0.28em] text-[#8a7a6e] transition hover:text-[#1a1612]"
          >
            Back to dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="font-display text-4xl italic text-[#1a1612]">Profile & Plan</h1>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <section className="rounded-2xl border border-[#e8ddd4] bg-white p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4ede3] text-[#c9974a]">
                <UserRound className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#8a7a6e]">Account</p>
                <p className="text-sm text-[#1a1612]">{user?.email ?? '-'}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#e8ddd4] bg-white p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#8a7a6e]">Current plan</p>
            <p className="mt-2 font-display text-3xl italic text-[#1a1612]">{PLAN_LABELS[plan] ?? plan}</p>
            <p className="mt-2 text-sm text-[#6b5e52]">
              Usage: {invitations.length}
              {planLimit !== Infinity ? ` / ${planLimit}` : ' invitations'}
            </p>
            <Link
              to="/dashboard/plans"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#c9974a] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#b8863b]"
            >
              Upgrade plan
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
