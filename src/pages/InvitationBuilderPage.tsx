import {useCallback, useEffect, useRef, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {ArrowLeft, Check, LoaderCircle, Plus, Trash2} from 'lucide-react';
import {useInvitations} from '@/src/hooks/useInvitations';
import {useAuth} from '@/src/hooks/useAuth';
import {PhotoUpload} from '@/src/components/shared/PhotoUpload';
import {InvitationPage} from '@/src/components/invitation/InvitationPage';
import type {InvitationConfig, TimelineEntry, EventDetail, GiftAccount} from '@/src/types/invitation';
import {cn} from '@/src/lib/utils';

// ── Default template (Lumière) ────────────────────────────────────────────────
const DEFAULT_CONTENT: InvitationConfig = {
  slug: '',
  seo: {title: 'Our Wedding', description: 'Join us to celebrate our special day.'},
  theme: {accent: '#d8b181', background: '#050505', surface: '#111111', softSurface: '#e7e1db'},
  guestQueryParam: 'to',
  couple: {
    joinedName: 'Partner A & Partner B',
    coverLabel: 'THE WEDDING OF',
    dateLabel: 'Saturday, 1 January 2027',
    scripture: {
      text: "But at the beginning of creation God 'made them male and female.' 'For this reason a man will leave his father and mother and be united to his wife, and the two will become one flesh.'",
      citation: 'Mark 10:6-7',
    },
    quote: 'Two are better than one, for they have a good return for their labor.',
    bride: {
      title: 'THE BRIDE',
      fullName: '',
      nickname: '',
      parents: ['The Daughter of', '', ''],
      instagram: '',
      image: '',
    },
    groom: {
      title: 'THE GROOM',
      fullName: '',
      nickname: '',
      parents: ['The Son of', '', ''],
      instagram: '',
      image: '',
    },
  },
  media: {
    audio: '',
    coverImage: '',
    heroVideo: '',
    heroPoster: '',
    quoteImages: ['', '', ''],
    storyImages: [],
    giftImage: '',
    rsvpImage: '',
    videoPoster: '',
    videoUrl: '',
    thankYouImage: '',
    gallery: [],
  },
  story: {title: 'Our Love Story', timeline: []},
  countdown: {
    label: 'Almost Time For Our Celebration',
    target: '2027-01-01T09:00:00+07:00',
    calendar: {
      title: 'Our Wedding',
      description: 'Join us for our wedding celebration.',
      location: '',
      start: '2027-01-01T09:00:00+07:00',
      end: '2027-01-01T12:00:00+07:00',
    },
    image: '',
  },
  events: {
    title: 'Wedding / Details',
    dateLabel: 'Saturday\n01.01.2027',
    details: [],
  },
  gift: {
    intro: 'For those of you who want to give a token of love, you can use the account number below:',
    accounts: [],
  },
  rsvp: {
    intro: 'We kindly request your response to confirm your attendance.',
    maxGuestsDefault: 2,
    comments: [],
  },
  footer: {
    closingTitle: ['Thank', 'You'],
    closingText: 'It is a pleasure and honor for us if you are willing to attend and give us your blessing.',
    creditLabel: 'Created by nvite.id',
    creditUrl: 'https://nvite.id',
    links: [],
  },
};

// ── Tab definitions ──────────────────────────────────────────────────────────
type TabId = 'couple' | 'date' | 'story' | 'events' | 'gifts' | 'media' | 'settings';
const TABS: {id: TabId; label: string}[] = [
  {id: 'couple', label: 'Couple'},
  {id: 'date', label: 'Date & Venue'},
  {id: 'story', label: 'Story'},
  {id: 'events', label: 'Events'},
  {id: 'gifts', label: 'Gifts'},
  {id: 'media', label: 'Media'},
  {id: 'settings', label: 'Settings'},
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function deepMerge<T>(base: T, overrides: Partial<T>): T {
  const result = {...base};
  for (const key of Object.keys(overrides) as (keyof T)[]) {
    const v = overrides[key];
    if (v !== undefined && v !== null) {
      if (typeof v === 'object' && !Array.isArray(v) && typeof result[key] === 'object' && !Array.isArray(result[key])) {
        result[key] = deepMerge(result[key] as object, v as object) as T[keyof T];
      } else {
        result[key] = v as T[keyof T];
      }
    }
  }
  return result;
}

// ── Field component ───────────────────────────────────────────────────────────
function Field({label, children, hint}: {label: string; children: React.ReactNode; hint?: string}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] uppercase tracking-[0.28em] text-[#8a7a6e]">{label}</span>
      {children}
      {hint && <p className="text-[11px] text-[#b0a095]">{hint}</p>}
    </label>
  );
}

function TextInput({value, onChange, placeholder, className}: {value: string; onChange: (v: string) => void; placeholder?: string; className?: string}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn('w-full rounded-xl border border-[#e8ddd4] bg-white px-4 py-2.5 text-sm text-[#1a1612] placeholder-[#c4b9af] outline-none transition focus:border-[#c9974a] focus:ring-2 focus:ring-[#c9974a]/20', className)}
    />
  );
}

function TextArea({value, onChange, placeholder, rows = 4}: {value: string; onChange: (v: string) => void; placeholder?: string; rows?: number}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-y rounded-xl border border-[#e8ddd4] bg-white px-4 py-2.5 text-sm text-[#1a1612] placeholder-[#c4b9af] outline-none transition focus:border-[#c9974a] focus:ring-2 focus:ring-[#c9974a]/20"
    />
  );
}

function Section({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <div className="space-y-4">
      <h3 className="border-b border-[#f0ebe4] pb-2 text-[11px] uppercase tracking-[0.3em] text-[#8a7a6e]">
        {title}
      </h3>
      {children}
    </div>
  );
}

// ── Tab panels ────────────────────────────────────────────────────────────────

function CoupleTab({c, userId, invId, onChange}: {
  c: InvitationConfig;
  userId: string;
  invId: string;
  onChange: (updates: Partial<InvitationConfig>) => void;
}) {
  const couple = c.couple;
  const set = (path: string[], value: string | string[]) => {
    const next = JSON.parse(JSON.stringify(couple)) as typeof couple;
    let cur: Record<string, unknown> = next as unknown as Record<string, unknown>;
    for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]] as Record<string, unknown>;
    cur[path[path.length - 1]] = value;
    onChange({couple: next});
  };

  return (
    <div className="space-y-8">
      <Section title="General">
        <Field label="Joined Name (displayed on cover)">
          <TextInput value={couple.joinedName} onChange={(v) => set(['joinedName'], v)} placeholder="e.g. Dexter & Hualin" />
        </Field>
        <Field label="Cover Label">
          <TextInput value={couple.coverLabel} onChange={(v) => set(['coverLabel'], v)} />
        </Field>
        <Field label="Scripture text">
          <TextArea value={couple.scripture.text} onChange={(v) => set(['scripture', 'text'], v)} rows={3} />
        </Field>
        <Field label="Scripture citation">
          <TextInput value={couple.scripture.citation} onChange={(v) => set(['scripture', 'citation'], v)} placeholder="e.g. Mark 10:6-9" />
        </Field>
        <Field label="Quote">
          <TextArea value={couple.quote} onChange={(v) => set(['quote'], v)} rows={2} />
        </Field>
      </Section>

      {(['bride', 'groom'] as const).map((role) => (
        <Section key={role} title={role === 'bride' ? 'Bride' : 'Groom'}>
          <Field label="Full name">
            <TextInput value={couple[role].fullName} onChange={(v) => set([role, 'fullName'], v)} />
          </Field>
          <Field label="Nickname">
            <TextInput value={couple[role].nickname} onChange={(v) => set([role, 'nickname'], v)} />
          </Field>
          <Field label="Parent line 1 (e.g. 'The Daughter of')">
            <TextInput value={couple[role].parents[0] ?? ''} onChange={(v) => {
              const p = [...couple[role].parents];
              p[0] = v;
              set([role, 'parents'], p);
            }} />
          </Field>
          <Field label="Father's name">
            <TextInput value={couple[role].parents[1] ?? ''} onChange={(v) => {
              const p = [...couple[role].parents];
              p[1] = v;
              set([role, 'parents'], p);
            }} />
          </Field>
          <Field label="Mother's name">
            <TextInput value={couple[role].parents[2] ?? ''} onChange={(v) => {
              const p = [...couple[role].parents];
              p[2] = v;
              set([role, 'parents'], p);
            }} />
          </Field>
          <Field label="Instagram URL">
            <TextInput value={couple[role].instagram ?? ''} onChange={(v) => set([role, 'instagram'], v)} placeholder="https://instagram.com/..." />
          </Field>
          <PhotoUpload
            bucket="invitation-media"
            pathPrefix={`${userId}/${invId}/${role}-`}
            currentUrl={couple[role].image}
            onUploaded={(url) => set([role, 'image'], url)}
            label={`${role === 'bride' ? 'Bride' : 'Groom'} portrait photo`}
          />
        </Section>
      ))}
    </div>
  );
}

function DateTab({c, onChange}: {c: InvitationConfig; onChange: (u: Partial<InvitationConfig>) => void}) {
  return (
    <div className="space-y-8">
      <Section title="Display Labels">
        <Field label="Date label (shown on cover)" hint="e.g. Friday, 21 August 2026">
          <TextInput value={c.couple.dateLabel} onChange={(v) => onChange({couple: {...c.couple, dateLabel: v}})} />
        </Field>
        <Field label="Countdown target (ISO 8601)" hint="e.g. 2026-08-21T08:00:00+07:00">
          <TextInput value={c.countdown.target} onChange={(v) => onChange({countdown: {...c.countdown, target: v}})} />
        </Field>
        <Field label="Events date label" hint="Shown in the events section, can include newline \\n">
          <TextInput value={c.events.dateLabel} onChange={(v) => onChange({events: {...c.events, dateLabel: v}})} />
        </Field>
      </Section>

      <Section title="Calendar Event">
        <Field label="Event title">
          <TextInput value={c.countdown.calendar.title} onChange={(v) => onChange({countdown: {...c.countdown, calendar: {...c.countdown.calendar, title: v}}})} />
        </Field>
        <Field label="Description">
          <TextArea value={c.countdown.calendar.description} onChange={(v) => onChange({countdown: {...c.countdown, calendar: {...c.countdown.calendar, description: v}}})} rows={2} />
        </Field>
        <Field label="Location">
          <TextArea value={c.countdown.calendar.location} onChange={(v) => onChange({countdown: {...c.countdown, calendar: {...c.countdown.calendar, location: v}}})} rows={2} />
        </Field>
        <Field label="Start (ISO 8601)">
          <TextInput value={c.countdown.calendar.start} onChange={(v) => onChange({countdown: {...c.countdown, calendar: {...c.countdown.calendar, start: v}}})} />
        </Field>
        <Field label="End (ISO 8601)">
          <TextInput value={c.countdown.calendar.end} onChange={(v) => onChange({countdown: {...c.countdown, calendar: {...c.countdown.calendar, end: v}}})} />
        </Field>
      </Section>
    </div>
  );
}

function StoryTab({c, onChange}: {c: InvitationConfig; onChange: (u: Partial<InvitationConfig>) => void}) {
  const timeline = c.story.timeline;
  const update = (entries: TimelineEntry[]) => onChange({story: {...c.story, timeline: entries}});

  const addEntry = () => update([...timeline, {year: '', title: '', body: ''}]);
  const removeEntry = (i: number) => update(timeline.filter((_, idx) => idx !== i));
  const setEntry = (i: number, field: keyof TimelineEntry, val: string) => {
    const next = timeline.map((e, idx) => idx === i ? {...e, [field]: val} : e);
    update(next);
  };

  return (
    <div className="space-y-6">
      <Section title="Story">
        <Field label="Section title">
          <TextInput value={c.story.title} onChange={(v) => onChange({story: {...c.story, title: v}})} />
        </Field>
      </Section>

      <Section title="Timeline entries">
        <div className="space-y-6">
          {timeline.map((entry, i) => (
            <div key={i} className="relative rounded-xl border border-[#e8ddd4] p-4 space-y-3">
              <button type="button" onClick={() => removeEntry(i)} className="absolute right-3 top-3 rounded-lg p-1 text-[#c4b9af] hover:text-red-500">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <Field label="Year">
                <TextInput value={entry.year} onChange={(v) => setEntry(i, 'year', v)} placeholder="2024" />
              </Field>
              <Field label="Title">
                <TextInput value={entry.title} onChange={(v) => setEntry(i, 'title', v)} />
              </Field>
              <Field label="Body">
                <TextArea value={entry.body} onChange={(v) => setEntry(i, 'body', v)} rows={5} />
              </Field>
            </div>
          ))}
          <button type="button" onClick={addEntry} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#e8ddd4] py-3 text-sm text-[#8a7a6e] hover:border-[#c9974a]/60 hover:text-[#c9974a]">
            <Plus className="h-4 w-4" /> Add timeline entry
          </button>
        </div>
      </Section>
    </div>
  );
}

function EventsTab({c, onChange}: {c: InvitationConfig; onChange: (u: Partial<InvitationConfig>) => void}) {
  const details = c.events.details;
  const update = (d: EventDetail[]) => onChange({events: {...c.events, details: d}});

  const add = () => update([...details, {title: '', time: '', location: '', text: '', link: '', linkLabel: ''}]);
  const remove = (i: number) => update(details.filter((_, idx) => idx !== i));
  const set = (i: number, field: keyof EventDetail, val: string) => {
    update(details.map((e, idx) => idx === i ? {...e, [field]: val} : e));
  };

  return (
    <div className="space-y-6">
      <Section title="Events section">
        <Field label="Section title">
          <TextInput value={c.events.title} onChange={(v) => onChange({events: {...c.events, title: v}})} />
        </Field>
      </Section>

      <Section title="Event cards">
        <div className="space-y-6">
          {details.map((detail, i) => (
            <div key={i} className="relative rounded-xl border border-[#e8ddd4] p-4 space-y-3">
              <button type="button" onClick={() => remove(i)} className="absolute right-3 top-3 rounded-lg p-1 text-[#c4b9af] hover:text-red-500">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <Field label="Title"><TextInput value={detail.title} onChange={(v) => set(i, 'title', v)} /></Field>
              <Field label="Time"><TextInput value={detail.time ?? ''} onChange={(v) => set(i, 'time', v)} placeholder="e.g. 8 AM - 10 AM" /></Field>
              <Field label="Location"><TextArea value={detail.location ?? ''} onChange={(v) => set(i, 'location', v)} rows={2} /></Field>
              <Field label="Extra text"><TextArea value={detail.text ?? ''} onChange={(v) => set(i, 'text', v)} rows={2} /></Field>
              <Field label="Link URL"><TextInput value={detail.link ?? ''} onChange={(v) => set(i, 'link', v)} placeholder="https://maps.app.goo.gl/..." /></Field>
              <Field label="Link label"><TextInput value={detail.linkLabel ?? ''} onChange={(v) => set(i, 'linkLabel', v)} placeholder="View map" /></Field>
            </div>
          ))}
          <button type="button" onClick={add} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#e8ddd4] py-3 text-sm text-[#8a7a6e] hover:border-[#c9974a]/60 hover:text-[#c9974a]">
            <Plus className="h-4 w-4" /> Add event card
          </button>
        </div>
      </Section>
    </div>
  );
}

function GiftsTab({c, onChange}: {c: InvitationConfig; onChange: (u: Partial<InvitationConfig>) => void}) {
  const accounts = c.gift.accounts;
  const update = (a: GiftAccount[]) => onChange({gift: {...c.gift, accounts: a}});
  const add = () => update([...accounts, {id: `acc-${Date.now()}`, bank: '', number: '', holder: ''}]);
  const remove = (i: number) => update(accounts.filter((_, idx) => idx !== i));
  const set = (i: number, field: keyof GiftAccount, val: string) => {
    update(accounts.map((a, idx) => idx === i ? {...a, [field]: val} : a));
  };

  return (
    <div className="space-y-6">
      <Section title="Gift section">
        <Field label="Intro text">
          <TextArea value={c.gift.intro} onChange={(v) => onChange({gift: {...c.gift, intro: v}})} rows={3} />
        </Field>
      </Section>

      <Section title="Bank accounts">
        <div className="space-y-4">
          {accounts.map((acc, i) => (
            <div key={acc.id} className="relative rounded-xl border border-[#e8ddd4] p-4 space-y-3">
              <button type="button" onClick={() => remove(i)} className="absolute right-3 top-3 rounded-lg p-1 text-[#c4b9af] hover:text-red-500">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <Field label="Bank name"><TextInput value={acc.bank} onChange={(v) => set(i, 'bank', v)} placeholder="Bank Mandiri" /></Field>
              <Field label="Account number"><TextInput value={acc.number} onChange={(v) => set(i, 'number', v)} placeholder="00008888123" /></Field>
              <Field label="Account holder"><TextInput value={acc.holder} onChange={(v) => set(i, 'holder', v)} /></Field>
            </div>
          ))}
          <button type="button" onClick={add} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#e8ddd4] py-3 text-sm text-[#8a7a6e] hover:border-[#c9974a]/60 hover:text-[#c9974a]">
            <Plus className="h-4 w-4" /> Add bank account
          </button>
        </div>
      </Section>
    </div>
  );
}

function MediaTab({c, userId, invId, onChange}: {c: InvitationConfig; userId: string; invId: string; onChange: (u: Partial<InvitationConfig>) => void}) {
  const m = c.media;
  const setMedia = (field: keyof typeof m, val: string | string[]) => {
    onChange({media: {...m, [field]: val}});
  };

  const updateGalleryItem = (i: number, url: string) => {
    const next = [...m.gallery];
    next[i] = url;
    setMedia('gallery', next);
  };

  const addGallerySlot = () => setMedia('gallery', [...m.gallery, '']);
  const removeGalleryItem = (i: number) => setMedia('gallery', m.gallery.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-8">
      <Section title="Key photos">
        <PhotoUpload bucket="invitation-media" pathPrefix={`${userId}/${invId}/cover-`} currentUrl={m.coverImage} onUploaded={(url) => setMedia('coverImage', url)} label="Cover image" />
        <PhotoUpload bucket="invitation-media" pathPrefix={`${userId}/${invId}/rsvp-`} currentUrl={m.rsvpImage} onUploaded={(url) => setMedia('rsvpImage', url)} label="RSVP section image" />
        <PhotoUpload bucket="invitation-media" pathPrefix={`${userId}/${invId}/gift-`} currentUrl={m.giftImage} onUploaded={(url) => setMedia('giftImage', url)} label="Gift section image" />
        <PhotoUpload bucket="invitation-media" pathPrefix={`${userId}/${invId}/thankyou-`} currentUrl={m.thankYouImage} onUploaded={(url) => setMedia('thankYouImage', url)} label="Thank-you image" />
        <PhotoUpload bucket="invitation-media" pathPrefix={`${userId}/${invId}/heroposter-`} currentUrl={m.heroPoster} onUploaded={(url) => setMedia('heroPoster', url)} label="Hero video poster" />
        <PhotoUpload bucket="invitation-media" pathPrefix={`${userId}/${invId}/countdown-`} currentUrl={c.countdown.image} onUploaded={(url) => onChange({countdown: {...c.countdown, image: url}})} label="Countdown section image" />
      </Section>

      <Section title="Quote images (3 used in quote section)">
        {[0, 1, 2].map((i) => (
          <PhotoUpload key={i} bucket="invitation-media" pathPrefix={`${userId}/${invId}/quote${i}-`} currentUrl={m.quoteImages[i]} onUploaded={(url) => {
            const next = [...m.quoteImages];
            next[i] = url;
            setMedia('quoteImages', next);
          }} label={`Quote image ${i + 1}`} />
        ))}
      </Section>

      <Section title="Story images (shown behind timeline)">
        {m.storyImages.map((url, i) => (
          <div key={i} className="relative">
            <PhotoUpload bucket="invitation-media" pathPrefix={`${userId}/${invId}/story${i}-`} currentUrl={url} onUploaded={(u) => {
              const next = [...m.storyImages];
              next[i] = u;
              setMedia('storyImages', next);
            }} label={`Story image ${i + 1}`} />
            <button type="button" onClick={() => setMedia('storyImages', m.storyImages.filter((_, idx) => idx !== i))} className="absolute right-0 top-0 rounded-lg p-1 text-[#c4b9af] hover:text-red-500">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => setMedia('storyImages', [...m.storyImages, ''])} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#e8ddd4] py-3 text-sm text-[#8a7a6e] hover:border-[#c9974a]/60 hover:text-[#c9974a]">
          <Plus className="h-4 w-4" /> Add story image
        </button>
      </Section>

      <Section title="Gallery">
        {m.gallery.map((url, i) => (
          <div key={i} className="relative">
            <PhotoUpload bucket="invitation-media" pathPrefix={`${userId}/${invId}/gallery${i}-`} currentUrl={url} onUploaded={(u) => updateGalleryItem(i, u)} label={`Gallery ${i + 1}`} />
            <button type="button" onClick={() => removeGalleryItem(i)} className="absolute right-0 top-0 rounded-lg p-1 text-[#c4b9af] hover:text-red-500">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button type="button" onClick={addGallerySlot} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#e8ddd4] py-3 text-sm text-[#8a7a6e] hover:border-[#c9974a]/60 hover:text-[#c9974a]">
          <Plus className="h-4 w-4" /> Add gallery photo
        </button>
      </Section>

      <Section title="Video & Audio URLs">
        <Field label="Hero video URL (direct mp4)">
          <TextInput value={m.heroVideo} onChange={(v) => setMedia('heroVideo', v)} placeholder="https://..." />
        </Field>
        <Field label="Video poster image URL">
          <TextInput value={m.videoPoster} onChange={(v) => setMedia('videoPoster', v)} />
        </Field>
        <Field label="YouTube embed URL (for video modal)">
          <TextInput value={m.videoUrl} onChange={(v) => setMedia('videoUrl', v)} placeholder="https://www.youtube.com/embed/..." />
        </Field>
        <Field label="Background audio URL (mp3)">
          <TextInput value={m.audio} onChange={(v) => setMedia('audio', v)} placeholder="https://..." />
        </Field>
      </Section>
    </div>
  );
}

function SettingsTab({
  c,
  invId,
  isNew,
  onChange,
  slugError,
  onSlugBlur,
}: {
  c: InvitationConfig;
  invId: string;
  isNew: boolean;
  onChange: (u: Partial<InvitationConfig>) => void;
  slugError: string | null;
  onSlugBlur: () => void;
}) {
  return (
    <div className="space-y-8">
      <Section title="URL slug">
        <Field
          label="Invitation slug"
          hint={`Your invitation will be available at nvite.id/${c.slug || 'your-slug'}`}
        >
          <TextInput
            value={c.slug}
            onChange={(v) => onChange({slug: v.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')})}
            placeholder="e.g. dexter-hualin"
            className={slugError ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}
          />
          {slugError && <p className="mt-1 text-xs text-red-500">{slugError}</p>}
        </Field>
      </Section>

      <Section title="Visibility">
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => onChange({} as Partial<InvitationConfig>)}
            className="relative"
          >
            <input type="hidden" />
          </div>
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#8a7a6e]">
            Publish status is controlled via the Save button below
          </span>
        </label>
        <p className="text-sm text-[#8a7a6e]">
          Use the &ldquo;Save & Publish&rdquo; or &ldquo;Save as Draft&rdquo; buttons at the top to control visibility.
        </p>
      </Section>

      <Section title="SEO">
        <Field label="Page title">
          <TextInput value={c.seo.title} onChange={(v) => onChange({seo: {...c.seo, title: v}})} placeholder="The Wedding of Dexter & Hualin" />
        </Field>
        <Field label="Meta description">
          <TextArea value={c.seo.description} onChange={(v) => onChange({seo: {...c.seo, description: v}})} rows={2} />
        </Field>
      </Section>

      <Section title="RSVP settings">
        <Field label="Max guests per RSVP">
          <input
            type="number"
            min={1}
            max={20}
            value={c.rsvp.maxGuestsDefault}
            onChange={(e) => onChange({rsvp: {...c.rsvp, maxGuestsDefault: Number(e.target.value)}})}
            className="w-32 rounded-xl border border-[#e8ddd4] bg-white px-4 py-2.5 text-sm text-[#1a1612] outline-none transition focus:border-[#c9974a] focus:ring-2 focus:ring-[#c9974a]/20"
          />
        </Field>
        <Field label="RSVP intro text">
          <TextArea value={c.rsvp.intro} onChange={(v) => onChange({rsvp: {...c.rsvp, intro: v}})} rows={3} />
        </Field>
      </Section>

      <Section title="Footer">
        <Field label="Closing text">
          <TextArea value={c.footer.closingText} onChange={(v) => onChange({footer: {...c.footer, closingText: v}})} rows={2} />
        </Field>
        <Field label="Credit label">
          <TextInput value={c.footer.creditLabel} onChange={(v) => onChange({footer: {...c.footer, creditLabel: v}})} />
        </Field>
        <Field label="Credit URL">
          <TextInput value={c.footer.creditUrl} onChange={(v) => onChange({footer: {...c.footer, creditUrl: v}})} />
        </Field>
      </Section>
    </div>
  );
}

// ── Main builder ──────────────────────────────────────────────────────────────

export function InvitationBuilderPage() {
  const {id} = useParams<{id: string}>();
  const isNew = id === 'new' || !id;
  const navigate = useNavigate();
  const {user} = useAuth();
  const {invitations, createInvitation, updateInvitation, loading: invLoading} = useInvitations();

  const [activeTab, setActiveTab] = useState<TabId>('couple');
  const [content, setContent] = useState<InvitationConfig>(DEFAULT_CONTENT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [invitationId, setInvitationId] = useState<string>(id !== 'new' ? (id ?? '') : '');
  const [initialized, setInitialized] = useState(false);

  // Load existing invitation into form
  useEffect(() => {
    if (!isNew && !invLoading && !initialized) {
      const existing = invitations.find((inv) => inv.id === id);
      if (existing) {
        setContent(deepMerge(DEFAULT_CONTENT, existing.content));
        setInitialized(true);
      }
    }
    if (isNew && !initialized) {
      setInitialized(true);
    }
  }, [isNew, invitations, invLoading, id, initialized]);

  const handleChange = useCallback((updates: Partial<InvitationConfig>) => {
    setContent((prev) => deepMerge(prev, updates));
    setSaved(false);
  }, []);

  const handleSave = async (publish: boolean) => {
    if (!content.slug.trim()) {
      setActiveTab('settings');
      setSaveError('Please set a slug before saving.');
      return;
    }
    setSaving(true);
    setSaveError(null);

    const contentToSave = {...content, slug: content.slug};

    if (isNew || !invitationId) {
      const result = await createInvitation(content.slug, contentToSave);
      if ('error' in result) {
        setSaveError(result.error);
        if (result.error.includes('slug')) setSlugError(result.error);
        setSaving(false);
        return;
      }
      const newId = result.id;
      setInvitationId(newId);
      if (publish) {
        const err = await updateInvitation(newId, {is_published: true});
        if (err) setSaveError(err.error);
      }
      navigate(`/dashboard/${newId}`, {replace: true});
    } else {
      const err = await updateInvitation(invitationId, {
        slug: content.slug,
        content: contentToSave,
        ...(publish ? {is_published: true} : {}),
      });
      if (err) {
        setSaveError(err.error);
        if (err.error.includes('slug')) setSlugError(err.error);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const userId = user?.id ?? 'unknown';
  const currentInvId = invitationId || 'new';

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#fdfaf6]">
      {/* Top bar */}
      <header className="flex shrink-0 items-center justify-between border-b border-[#e8ddd4] bg-white/90 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-1.5 text-sm text-[#8a7a6e] hover:text-[#1a1612]">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <span className="text-[#e8ddd4]">/</span>
          <span className="text-sm font-medium text-[#1a1612]">
            {isNew ? 'New invitation' : (content.slug || 'Edit invitation')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {saveError && (
            <p className="hidden max-w-xs truncate text-xs text-red-500 sm:block">{saveError}</p>
          )}
          {saved && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <Check className="h-3.5 w-3.5" /> Saved
            </span>
          )}
          <button
            type="button"
            onClick={() => void handleSave(false)}
            disabled={saving}
            className="rounded-xl border border-[#e8ddd4] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6b5e52] transition hover:border-[#c9974a] hover:text-[#c9974a] disabled:opacity-50"
          >
            {saving ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : 'Save draft'}
          </button>
          <button
            type="button"
            onClick={() => void handleSave(true)}
            disabled={saving}
            className="rounded-xl bg-[#c9974a] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#b8863b] disabled:opacity-50"
          >
            {saving ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : 'Save & publish'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — form */}
        <div className="flex w-full flex-col overflow-hidden lg:w-[55%]">
          {/* Tab bar */}
          <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-[#e8ddd4] bg-white px-4 py-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'shrink-0 rounded-lg px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] transition',
                  activeTab === tab.id
                    ? 'bg-[#f4ede3] text-[#c9974a]'
                    : 'text-[#8a7a6e] hover:text-[#1a1612]',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-5">
            {!initialized || invLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c9974a] border-t-transparent" />
              </div>
            ) : (
              <>
                {activeTab === 'couple' && (
                  <CoupleTab c={content} userId={userId} invId={currentInvId} onChange={handleChange} />
                )}
                {activeTab === 'date' && (
                  <DateTab c={content} onChange={handleChange} />
                )}
                {activeTab === 'story' && (
                  <StoryTab c={content} onChange={handleChange} />
                )}
                {activeTab === 'events' && (
                  <EventsTab c={content} onChange={handleChange} />
                )}
                {activeTab === 'gifts' && (
                  <GiftsTab c={content} onChange={handleChange} />
                )}
                {activeTab === 'media' && (
                  <MediaTab c={content} userId={userId} invId={currentInvId} onChange={handleChange} />
                )}
                {activeTab === 'settings' && (
                  <SettingsTab
                    c={content}
                    invId={currentInvId}
                    isNew={isNew}
                    onChange={handleChange}
                    slugError={slugError}
                    onSlugBlur={() => setSlugError(null)}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Right panel — live preview */}
        <div className="hidden flex-col items-center justify-start overflow-hidden border-l border-[#e8ddd4] bg-[#1a1612] lg:flex lg:w-[45%]">
          <div className="w-full px-4 pt-4 text-center">
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">Live Preview</p>
          </div>
          <div className="relative flex flex-1 items-start justify-center overflow-y-auto py-6">
            {/* Phone frame */}
            <div className="relative h-[780px] w-[390px] shrink-0 overflow-hidden rounded-[3rem] border-4 border-white/10 shadow-2xl">
              {/* Notch */}
              <div className="absolute left-1/2 top-3 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-black/80" />
              {/* Scaled invitation */}
              <div
                className="absolute inset-0 overflow-y-auto"
                style={{
                  fontSize: '0.6rem',
                  transform: 'scale(0.6)',
                  transformOrigin: 'top left',
                  width: '166.67%',
                  height: '166.67%',
                  pointerEvents: 'none',
                }}
              >
                <InvitationPage invitation={{...content, slug: content.slug || 'preview'}} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
