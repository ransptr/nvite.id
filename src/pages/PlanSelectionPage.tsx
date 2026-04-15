import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Check, LoaderCircle} from 'lucide-react';
import {useAuth} from '@/src/hooks/useAuth';
import {useInvitations} from '@/src/hooks/useInvitations';
import {supabase} from '@/src/lib/supabase';

type PlanKey = 'free' | 'basic' | 'pro';

const PLANS: Array<{
  key: PlanKey;
  name: string;
  price: string;
  limit: string;
  description: string;
}> = [
  {
    key: 'free',
    name: 'Free',
    price: '$0',
    limit: '1 invitation',
    description: 'Great for testing and trying the builder.',
  },
  {
    key: 'basic',
    name: 'Basic',
    price: '$9',
    limit: '3 invitations',
    description: 'For users who need multiple invitation projects.',
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '$29',
    limit: 'Unlimited invitations',
    description: 'Best for studios and frequent invitation creators.',
  },
];

export function PlanSelectionPage() {
  const navigate = useNavigate();
  const {user} = useAuth();
  const {profile, reload} = useInvitations();
  const [savingPlan, setSavingPlan] = useState<PlanKey | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentPlan = (profile?.plan ?? 'free') as PlanKey;

  const handleSelectPlan = async (plan: PlanKey) => {
    if (!user || plan === currentPlan) return;
    setSavingPlan(plan);
    setError(null);

    const {error: updateError} = await supabase
      .from('profiles')
      .update({plan})
      .eq('id', user.id);

    if (updateError) {
      setError(updateError.message);
      setSavingPlan(null);
      return;
    }

    await reload();
    navigate('/dashboard/profile');
  };

  return (
    <div className="min-h-screen bg-[#fdfaf6]">
      <header className="border-b border-[#e8ddd4] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/dashboard" className="text-[11px] uppercase tracking-[0.35em] text-[#c9974a]">
            nvite.id
          </Link>
          <Link
            to="/dashboard/profile"
            className="text-[11px] uppercase tracking-[0.28em] text-[#8a7a6e] transition hover:text-[#1a1612]"
          >
            Back to profile
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-display text-4xl italic text-[#1a1612]">Select Plan</h1>
        <p className="mt-2 text-sm text-[#6b5e52]">
          Choose a plan for your account. You can change it anytime.
        </p>

        {error ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.key;
            const isSaving = savingPlan === plan.key;
            return (
              <section
                key={plan.key}
                className={`rounded-2xl border bg-white p-6 transition ${
                  isCurrent
                    ? 'border-[#c9974a] shadow-[0_10px_35px_rgba(201,151,74,0.15)]'
                    : 'border-[#e8ddd4]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-3xl italic text-[#1a1612]">{plan.name}</h2>
                  {isCurrent ? (
                    <span className="rounded-full bg-[#f4ede3] px-2.5 py-1 text-[9px] uppercase tracking-[0.24em] text-[#c9974a]">
                      Current
                    </span>
                  ) : null}
                </div>
                <p className="mt-4 text-3xl font-semibold text-[#1a1612]">{plan.price}</p>
                <p className="mt-1 text-sm text-[#6b5e52]">{plan.limit}</p>
                <p className="mt-4 text-sm leading-relaxed text-[#6b5e52]">{plan.description}</p>

                <button
                  type="button"
                  disabled={isCurrent || isSaving || savingPlan !== null}
                  onClick={() => void handleSelectPlan(plan.key)}
                  className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    isCurrent
                      ? 'border border-[#e8ddd4] bg-white text-[#8a7a6e]'
                      : 'bg-[#c9974a] text-white hover:bg-[#b8863b]'
                  }`}
                >
                  {isSaving ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : null}
                  {isCurrent ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Selected
                    </>
                  ) : (
                    'Choose plan'
                  )}
                </button>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
