import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {InvitationPage} from '@/src/components/invitation/InvitationPage';
import {LandingPage} from '@/src/pages/LandingPage';
import {getInvitationBySlug} from '@/src/data/invitations';

function InvitationRoute() {
  // React Router guarantees :slug exists on this path, so the split/filter
  // approach from the old manual routing still works fine here.
  const slug = window.location.pathname.split('/').filter(Boolean)[0] ?? '';
  const invitation = getInvitationBySlug(slug);

  if (!invitation) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-center text-white">
        <div className="max-w-xl space-y-5 rounded-[2rem] border border-white/10 bg-white/[0.03] px-8 py-10">
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/45">Invitation not found</p>
          <h1 className="font-display text-5xl italic">This invitation link is not valid.</h1>
          <p className="text-base leading-relaxed text-white/65">
            Please check the invitation URL or return to the correct wedding page.
          </p>
        </div>
      </main>
    );
  }

  return <InvitationPage invitation={invitation} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/:slug" element={<InvitationRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
