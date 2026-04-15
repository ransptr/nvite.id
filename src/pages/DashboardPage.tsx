import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Crown, Globe, LogOut, Pencil, Plus, Trash2, UserRound, Users} from 'lucide-react';
import {signOut, useAuth} from '@/src/hooks/useAuth';
import {useInvitations} from '@/src/hooks/useInvitations';
import type {InvitationRow} from '@/src/hooks/useInvitations';

const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  basic: 'Basic',
  pro: 'Pro',
};

export function DashboardPage() {
  const navigate = useNavigate();
  const {user} = useAuth();
  const {invitations, profile, loading, atLimit, planLimit, deleteInvitation} = useInvitations();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (inv: InvitationRow) => {
    if (!window.confirm(`Delete "${inv.slug}"? This cannot be undone.`)) return;
    setDeletingId(inv.id);
    await deleteInvitation(inv.id);
    setDeletingId(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#fdfaf6]">
      {/* Header */}
      <header className="border-b border-[#e8ddd4] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-[11px] uppercase tracking-[0.35em] text-[#c9974a]">
            nvite.id
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="hidden items-center gap-2 rounded-full border border-[#eadfce] bg-white px-2 py-1.5 shadow-[0_10px_30px_rgba(120,80,30,0.08)] sm:flex">
              {profile && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f8f1e7] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#b8863b]">
                  <Crown className="h-3 w-3" />
                  {PLAN_LABELS[profile.plan] ?? profile.plan}
                </span>
              )}

              <Link
                to="/dashboard/profile"
                className="inline-flex items-center gap-1.5 rounded-full border border-transparent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6f604f] transition hover:border-[#eadfce] hover:bg-[#fdfaf6] hover:text-[#1a1612]"
              >
                <UserRound className="h-3.5 w-3.5" />
                Profile
              </Link>

              {user?.email && (
                <span className="max-w-[190px] truncate rounded-full bg-[#f6f1ea] px-3 py-1 text-[10px] text-[#7a6b5b]">
                  {user.email}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#eadfce] bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7a6b5b] transition hover:border-[#d9c4a4] hover:text-[#1a1612]"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>

            <Link
              to="/dashboard/profile"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#eadfce] bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7a6b5b] transition hover:border-[#d9c4a4] hover:text-[#1a1612] sm:hidden"
            >
              <UserRound className="h-3.5 w-3.5" />
              Profile
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Page title + create button */}
        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="font-display text-4xl italic text-[#1a1612]">Your Invitations</h1>
            <p className="mt-1 text-sm text-[#8a7a6e]">
              {profile && planLimit !== Infinity
                ? `${invitations.length} / ${planLimit} used`
                : 'Manage your invitation projects and publish links.'}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e8ddd4] bg-white px-4 py-3 shadow-[0_12px_30px_rgba(120,80,30,0.06)]">
            {atLimit ? (
              <div className="flex items-center gap-3 text-sm text-[#6b5e52]">
                <span className="rounded-full bg-[#f6f1ea] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#b8863b]">
                  Limit reached
                </span>
                <Link to="/dashboard/plans" className="text-[#c9974a] hover:underline">
                  Upgrade plan
                </Link>
              </div>
            ) : (
              <Link
                to="/dashboard/new"
                className="inline-flex items-center gap-2 rounded-xl bg-[#c9974a] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#b8863b]"
              >
                <Plus className="h-4 w-4" />
                New invitation
              </Link>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c9974a] border-t-transparent" />
          </div>
        )}

        {/* Empty state */}
        {!loading && invitations.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e8ddd4] py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f4ede3]">
              <Plus className="h-6 w-6 text-[#c9974a]" />
            </div>
            <h2 className="mb-2 font-display text-2xl italic text-[#1a1612]">No invitations yet</h2>
            <p className="mb-6 max-w-xs text-sm text-[#8a7a6e]">
              Create your first beautiful digital invitation and share it with your guests.
            </p>
            <Link
              to="/dashboard/new"
              className="inline-flex items-center gap-2 rounded-xl bg-[#c9974a] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#b8863b]"
            >
              <Plus className="h-4 w-4" />
              Create invitation
            </Link>
          </div>
        )}

        {/* Invitation cards */}
        {!loading && invitations.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {invitations.map((inv) => (
              <InvitationCard
                key={inv.id}
                inv={inv}
                deleting={deletingId === inv.id}
                onDelete={() => void handleDelete(inv)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function InvitationCard({
  inv,
  deleting,
  onDelete,
}: {
  inv: InvitationRow;
  deleting: boolean;
  onDelete: () => void;
}) {
  const coupleName = inv.content?.couple?.joinedName ?? inv.slug;
  const dateLabel = inv.content?.couple?.dateLabel ?? '';

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#e8ddd4] bg-white transition hover:shadow-md">
      {/* Cover image strip */}
      <div className="h-28 overflow-hidden bg-[#f4ede3]">
        {inv.content?.media?.coverImage ? (
          <img
            src={inv.content.media.coverImage}
            alt={coupleName}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-display text-3xl italic text-[#c9974a]/40">
              {inv.slug.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-display text-lg italic text-[#1a1612]">{coupleName}</p>
            {dateLabel && (
              <p className="mt-0.5 truncate text-xs text-[#8a7a6e]">{dateLabel}</p>
            )}
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] uppercase tracking-[0.28em] ${
              inv.is_published
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-[#f4ede3] text-[#c9974a]'
            }`}
          >
            {inv.is_published ? 'Live' : 'Draft'}
          </span>
        </div>

        <p className="text-[11px] uppercase tracking-[0.22em] text-[#c4b9af]">
          nvite.id/{inv.slug}
        </p>

        <div className="mt-auto flex items-center gap-2 border-t border-[#f0ebe4] pt-3">
          <Link
            to={`/dashboard/${inv.id}`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#e8ddd4] py-2 text-[10px] uppercase tracking-[0.24em] text-[#6b5e52] transition hover:border-[#c9974a] hover:text-[#c9974a]"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </Link>
          <Link
            to={`/dashboard/${inv.id}/rsvps`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#e8ddd4] py-2 text-[10px] uppercase tracking-[0.24em] text-[#6b5e52] transition hover:border-[#c9974a] hover:text-[#c9974a]"
          >
            <Users className="h-3 w-3" />
            RSVPs
          </Link>
          {inv.is_published && (
            <a
              href={`/${inv.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-[#e8ddd4] p-2 text-[#6b5e52] transition hover:border-[#c9974a] hover:text-[#c9974a]"
              title="View live invitation"
            >
              <Globe className="h-3.5 w-3.5" />
            </a>
          )}
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="inline-flex items-center justify-center rounded-lg border border-[#e8ddd4] p-2 text-[#6b5e52] transition hover:border-red-300 hover:text-red-500 disabled:opacity-40"
            title="Delete invitation"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
