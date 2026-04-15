import {useEffect, useState} from 'react';
import {BrowserRouter, Navigate, Route, Routes, useParams} from 'react-router-dom';
import {InvitationPage} from '@/src/components/invitation/InvitationPage';
import {LandingPage} from '@/src/pages/LandingPage';
import {LoginPage} from '@/src/pages/LoginPage';
import {SignupPage} from '@/src/pages/SignupPage';
import {AuthCallbackPage} from '@/src/pages/AuthCallbackPage';
import {DashboardPage} from '@/src/pages/DashboardPage';
import {InvitationBuilderPage} from '@/src/pages/InvitationBuilderPage';
import {RsvpManagerPage} from '@/src/pages/RsvpManagerPage';
import {ProfilePage} from '@/src/pages/ProfilePage';
import {PlanSelectionPage} from '@/src/pages/PlanSelectionPage';
import {ProtectedRoute} from '@/src/components/shared/ProtectedRoute';
import {supabase} from '@/src/lib/supabase';
import {getTemplateBySlug} from '@/src/lib/templates';
import type {InvitationConfig} from '@/src/types/invitation';

function InvitationRoute() {
  const {slug} = useParams<{slug: string}>();
  const [invitation, setInvitation] = useState<InvitationConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    supabase
      .from('invitations')
      .select('content')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle()
      .then(({data, error}) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setInvitation(data.content as InvitationConfig);
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d8b181] border-t-transparent" />
      </div>
    );
  }

  if (notFound || !invitation) {
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

function TemplateRoute() {
  const {templateSlug} = useParams<{templateSlug: string}>();
  const template = templateSlug ? getTemplateBySlug(templateSlug) : undefined;

  if (!template) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-center text-white">
        <div className="max-w-xl space-y-5 rounded-[2rem] border border-white/10 bg-white/[0.03] px-8 py-10">
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/45">Template not found</p>
          <h1 className="font-display text-5xl italic">This template does not exist.</h1>
          <p className="text-base leading-relaxed text-white/65">
            Please check the template URL or go back to the templates section.
          </p>
        </div>
      </main>
    );
  }

  if (!template.available || !template.content) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 text-center text-white">
        <div className="max-w-xl space-y-5 rounded-[2rem] border border-white/10 bg-white/[0.03] px-8 py-10">
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/45">Coming soon</p>
          <h1 className="font-display text-5xl italic">{template.name} is not available yet.</h1>
          <p className="text-base leading-relaxed text-white/65">
            We are finishing this template now. Please check back soon.
          </p>
        </div>
      </main>
    );
  }

  return <InvitationPage invitation={template.content} isTemplatePreview />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/templates/:templateSlug" element={<TemplateRoute />} />
        <Route path="/claire" element={<Navigate to="/templates/lumiere" replace />} />

        {/* Protected dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/:id"
          element={
            <ProtectedRoute>
              <InvitationBuilderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/:id/rsvps"
          element={
            <ProtectedRoute>
              <RsvpManagerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/plans"
          element={
            <ProtectedRoute>
              <PlanSelectionPage />
            </ProtectedRoute>
          }
        />

        {/* Public invitation — must be last to avoid catching /dashboard/* */}
        <Route path="/:slug" element={<InvitationRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
