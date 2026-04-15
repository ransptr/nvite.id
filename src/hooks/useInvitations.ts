import {useCallback, useEffect, useState} from 'react';
import {supabase} from '@/src/lib/supabase';
import {isReservedSlug} from '@/src/lib/templates';
import type {InvitationConfig} from '@/src/types/invitation';

export type InvitationRow = {
  id: string;
  slug: string;
  is_published: boolean;
  content: InvitationConfig;
  created_at: string;
  updated_at: string;
};

type Profile = {
  plan: 'free' | 'basic' | 'pro';
};

const PLAN_LIMITS: Record<string, number> = {
  free: 1,
  basic: 3,
  pro: Infinity,
};

export function useInvitations() {
  const [invitations, setInvitations] = useState<InvitationRow[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const {data: {user}} = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const [invRes, profRes] = await Promise.all([
      supabase
        .from('invitations')
        .select('id, slug, is_published, content, created_at, updated_at')
        .eq('owner_id', user.id)
        .order('created_at', {ascending: false}),
      supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single(),
    ]);

    if (invRes.error) setError(invRes.error.message);
    else setInvitations(invRes.data as InvitationRow[]);

    if (profRes.data) setProfile(profRes.data as Profile);

    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const atLimit = profile
    ? invitations.length >= (PLAN_LIMITS[profile.plan] ?? 1)
    : false;

  const planLimit = profile ? PLAN_LIMITS[profile.plan] : 1;

  // Check if a slug is already taken (for the builder)
  const isSlugTaken = async (slug: string, excludeId?: string): Promise<boolean> => {
    let query = supabase
      .from('invitations')
      .select('id')
      .eq('slug', slug);
    if (excludeId) query = query.neq('id', excludeId);
    const {data} = await query.maybeSingle();
    return data !== null;
  };

  const createInvitation = async (
    slug: string,
    content: InvitationConfig,
  ): Promise<{id: string} | {error: string}> => {
    if (isReservedSlug(slug)) {
      return {error: 'This slug is reserved for system routes. Please choose a different slug.'};
    }

    const taken = await isSlugTaken(slug);
    if (taken) return {error: 'This slug is already taken. Please choose a different one.'};

    const {data: {user}} = await supabase.auth.getUser();
    if (!user) return {error: 'Not authenticated.'};

    const {data, error: err} = await supabase
      .from('invitations')
      .insert({owner_id: user.id, slug, is_published: false, content})
      .select('id')
      .single();

    if (err) return {error: err.message};
    await load();
    return {id: (data as {id: string}).id};
  };

  const updateInvitation = async (
    id: string,
    updates: Partial<Pick<InvitationRow, 'slug' | 'is_published' | 'content'>>,
  ): Promise<{error: string} | null> => {
    if (updates.slug) {
      if (isReservedSlug(updates.slug)) {
        return {error: 'This slug is reserved for system routes. Please choose a different slug.'};
      }

      const taken = await isSlugTaken(updates.slug, id);
      if (taken) return {error: 'This slug is already taken. Please choose a different one.'};
    }

    const {error: err} = await supabase
      .from('invitations')
      .update(updates)
      .eq('id', id);

    if (err) return {error: err.message};
    await load();
    return null;
  };

  const deleteInvitation = async (id: string): Promise<void> => {
    await supabase.from('invitations').delete().eq('id', id);
    await load();
  };

  return {
    invitations,
    profile,
    loading,
    error,
    atLimit,
    planLimit,
    isSlugTaken,
    createInvitation,
    updateInvitation,
    deleteInvitation,
    reload: load,
  };
}
