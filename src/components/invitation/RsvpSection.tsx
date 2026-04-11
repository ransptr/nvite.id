import {AnimatePresence, motion} from 'framer-motion';
import {Check, ChevronLeft, ChevronRight, Copy, LoaderCircle} from 'lucide-react';
import {useEffect, useMemo, useState} from 'react';
import type {FormEvent, ReactNode} from 'react';

import {
  usePointerParallax,
  useSectionParallax,
} from '@/src/components/shared/CinematicParallax';
import {RevealOnScroll} from '@/src/components/shared/RevealOnScroll';
import {createQrValue, getQrPreviewUrl} from '@/src/lib/guest';
import {cn} from '@/src/lib/utils';
import type {InvitationConfig} from '@/src/types/invitation';
import type {AttendanceStatus, RsvpPayload, RsvpRecord} from '@/src/types/rsvp';

type RsvpSectionProps = {
  invitation: InvitationConfig;
  initialGuestName: string;
  maxGuestsOverride?: number | null;
};

const COMMENTS_PER_PAGE = 5;

export function RsvpSection({
  invitation,
  initialGuestName,
  maxGuestsOverride,
}: RsvpSectionProps) {
  const sectionParallax = useSectionParallax<HTMLElement>({y: [-36, 42]});
  const imagePointer = usePointerParallax({strength: 16, rotate: 4});
  const [guestName, setGuestName] = useState(initialGuestName);
  const [attendance, setAttendance] = useState<AttendanceStatus>('attending');
  const [guestCount, setGuestCount] = useState(1);
  const [wishes, setWishes] = useState('');
  const [records, setRecords] = useState<RsvpRecord[]>([]);
  const [page, setPage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const maxGuests = maxGuestsOverride ?? invitation.rsvp.maxGuestsDefault;
  const qrValue = createQrValue(invitation.slug, guestName);
  const qrPreview = getQrPreviewUrl(qrValue);
  const introY = sectionParallax.y;
  const lightInputClass =
    'w-full rounded-[1rem] border border-black/12 bg-white/78 px-4 py-3 text-sm text-[#17130f] outline-none transition placeholder:text-black/35 focus:border-[#b38a61] focus:bg-white';

  const visibleRecords = useMemo(() => {
    const start = page * COMMENTS_PER_PAGE;
    return records.slice(start, start + COMMENTS_PER_PAGE);
  }, [page, records]);

  const totalPages = Math.max(1, Math.ceil(records.length / COMMENTS_PER_PAGE));

  useEffect(() => {
    setGuestName(initialGuestName);
  }, [initialGuestName]);

  useEffect(() => {
    let active = true;

    fetch(`/api/rsvps?slug=${encodeURIComponent(invitation.slug)}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Unable to load existing wishes.');
        }

        return response.json() as Promise<{items?: RsvpRecord[]}>;
      })
      .then((payload: {items: RsvpRecord[]}) => {
        if (active) {
          setRecords(Array.isArray(payload.items) ? payload.items : []);
          setLoadError(null);
        }
      })
      .catch(() => {
        if (active) {
          setRecords([]);
          setLoadError('Unable to load wishes right now. You can still send your RSVP.');
        }
      });

    return () => {
      active = false;
    };
  }, [invitation.slug]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages - 1));
  }, [totalPages]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    const payload: RsvpPayload = {
      invitationSlug: invitation.slug,
      guestName: guestName.trim(),
      attendance,
      guestCount: attendance === 'attending' ? guestCount : 0,
      wishes: wishes.trim(),
    };

    try {
      const response = await fetch('/api/rsvps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Unable to save RSVP.');
      }

      const next = (await response.json()) as {record: RsvpRecord};
      setRecords((current) => [next.record, ...current]);
      setPage(0);
      setSubmitMessage('Your RSVP has been recorded. Thank you for celebrating with us.');
      setWishes('');
      setAttendance('attending');
      setGuestCount(1);
    } catch {
      setSubmitMessage('We could not submit your RSVP. Please try again in a moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionParallax.ref} id="rsvp" className="border-t border-black/8 bg-[#e8e0d6] px-5 py-24 text-[#17130f] md:px-10">
      <div className="mx-auto max-w-[1440px] space-y-12">
        <RevealOnScroll>
          <div className="grid gap-8 border-b border-black/12 pb-10 lg:grid-cols-[0.64fr_1.36fr] lg:items-end">
            <div className="space-y-5">
              <p className="text-[10px] uppercase tracking-[0.36em] text-black/45">RSVP</p>
              <h2 className="font-display text-5xl italic leading-[0.9] text-[#17130f] md:text-7xl">Reserve Your Seat.</h2>
              <motion.p style={{y: introY}} className="max-w-xl text-base leading-relaxed text-black/68 md:text-xl">
                {invitation.rsvp.intro}
              </motion.p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-black/10 bg-[#f4eee6] p-4">
                <p className="text-[10px] uppercase tracking-[0.32em] text-black/40">Invitation</p>
                <p className="mt-3 font-copy text-lg text-black/80">{invitation.couple.joinedName}</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-[#f4eee6] p-4">
                <p className="text-[10px] uppercase tracking-[0.32em] text-black/40">Date</p>
                <p className="mt-3 font-copy text-lg text-black/80">{invitation.couple.dateLabel}</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-[#f4eee6] p-4">
                <p className="text-[10px] uppercase tracking-[0.32em] text-black/40">Wishes</p>
                <p className="mt-3 font-copy text-lg text-black/80">{records.length} Messages</p>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        <div className="grid gap-8 lg:grid-cols-[0.55fr_1.45fr] lg:items-start lg:gap-10">
          <RevealOnScroll className="mx-auto w-full max-w-[430px] overflow-hidden rounded-[1.75rem] border border-black/12 bg-[#111] lg:mx-0 lg:max-w-none">
            <motion.img
              {...imagePointer.bind}
              style={{...sectionParallax.style, ...imagePointer.style}}
              src={invitation.media.rsvpImage}
              alt={`${invitation.couple.joinedName} portrait`}
              className="h-[320px] w-full scale-[1.06] object-cover md:h-[380px] lg:h-[420px]"
              referrerPolicy="no-referrer"
            />
          </RevealOnScroll>

          <RevealOnScroll className="rounded-[2rem] border border-black/12 bg-[#f5eee6] p-6 shadow-[0_18px_44px_rgba(35,24,12,0.08)] md:p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Field label="Name" tone="dark">
                <input
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                  className={lightInputClass}
                  placeholder="Guest Name"
                  required
                />
              </Field>

              <div className="rounded-[1.5rem] border border-black/10 bg-[#111] p-5 text-[#f6f0ea]">
                <p className="text-[10px] uppercase tracking-[0.32em] text-white/55">
                  {invitation.couple.coverLabel}
                </p>
                <h3 className="mt-3 font-display text-3xl italic md:text-4xl">
                  {invitation.couple.joinedName}
                </h3>
                <div className="mt-5 flex flex-col items-center gap-4 text-center">
                  <img src={qrPreview} alt="QR preview" className="h-36 w-36 rounded-xl border border-white/14 bg-white p-2" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.32em] text-white/58">Dear</p>
                    <p className="mt-2 font-display text-3xl italic">{guestName || 'Guest Name'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(qrValue);
                        setCopiedId(qrValue);
                        window.setTimeout(() => setCopiedId(null), 2000);
                      } catch {
                        setSubmitMessage('Copy is unavailable on this device/browser.');
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/16 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-white/72 transition hover:border-white/30 hover:text-white"
                  >
                    {copiedId === qrValue ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    Copy check-in code
                  </button>
                </div>
              </div>

              <Field label="Attendance" tone="dark">
                <div role="radiogroup" aria-label="Attendance" className="grid gap-3 sm:grid-cols-2">
                  {[
                    {label: 'Excited to Attend', value: 'attending' as const},
                    {label: 'Unable to Attend', value: 'unable' as const},
                  ].map((option) => {
                    const active = attendance === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        aria-pressed={active}
                        onClick={() => setAttendance(option.value)}
                        className={cn(
                          'rounded-[1rem] border px-4 py-3 text-left text-sm transition',
                          active
                            ? 'border-[#17130f] bg-[#17130f] text-[#f7f1ea]'
                            : 'border-black/12 bg-white/60 text-black/70 hover:border-black/22 hover:bg-white hover:text-black',
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <AnimatePresence initial={false}>
                {attendance === 'attending' && (
                  <motion.div
                    initial={{opacity: 0, height: 0}}
                    animate={{opacity: 1, height: 'auto'}}
                    exit={{opacity: 0, height: 0}}
                    className="overflow-hidden"
                  >
                    <Field label={`No of Guest (Max ${maxGuests})`} tone="dark">
                      <input
                        type="number"
                        min={1}
                        max={maxGuests}
                        value={guestCount}
                        onChange={(event) =>
                          setGuestCount(
                            Math.max(1, Math.min(maxGuests, Number(event.target.value))),
                          )
                        }
                        className={lightInputClass}
                      />
                    </Field>
                  </motion.div>
                )}
              </AnimatePresence>

              <Field label="Wishes" tone="dark">
                <textarea
                  value={wishes}
                  onChange={(event) => setWishes(event.target.value)}
                  className={`${lightInputClass} min-h-32 resize-y`}
                  placeholder="Share a note for the couple"
                  rows={4}
                />
              </Field>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-3 rounded-full bg-[#17130f] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.34em] text-[#f7f1ea] transition hover:bg-[#2b2118] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                Submit RSVP
              </button>

              {submitMessage ? (
                <p className="text-sm leading-relaxed text-black/62">{submitMessage}</p>
              ) : null}
            </form>
          </RevealOnScroll>
        </div>

        <RevealOnScroll
          delay={0.1}
          className="rounded-[2rem] border border-black/12 bg-[#f1e8de] p-6 shadow-[0_18px_44px_rgba(35,24,12,0.08)] md:p-8"
        >
              <div className="flex items-end justify-between gap-6 border-b border-black/12 pb-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-black/45">Wishes</p>
                  <h3 className="mt-3 font-display text-4xl italic text-[#17130f] md:text-5xl">Messages for the Couple</h3>
                </div>
                <div className="hidden text-[10px] uppercase tracking-[0.32em] text-black/45 sm:block">
                  Page {page + 1} of {totalPages}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {loadError ? (
                  <p className="rounded-[1rem] border border-black/12 bg-white/55 px-4 py-3 text-sm text-black/60">
                    {loadError}
                  </p>
                ) : null}

                {!loadError && visibleRecords.length === 0 ? (
                  <p className="rounded-[1rem] border border-black/12 bg-white/55 px-4 py-3 text-sm text-black/60">
                    No wishes yet. Be the first guest to leave a message.
                  </p>
                ) : null}

                {visibleRecords.map((record) => (
                  <article
                    key={record.id}
                    className="space-y-3 rounded-[1rem] border border-black/10 bg-white/55 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <strong className="font-copy text-base font-medium text-[#17130f]">{record.guestName}</strong>
                      <small className="shrink-0 text-[10px] uppercase tracking-[0.24em] text-black/40">
                        {new Date(record.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </small>
                    </div>
                    <p className="text-sm leading-relaxed text-black/70">
                      {record.wishes || 'Will celebrate with joy and gratitude.'}
                    </p>
                  </article>
                ))}
              </div>

          <div className="mt-8 flex items-center justify-between gap-4 border-t border-black/12 pt-5">
            <span className="text-[10px] uppercase tracking-[0.32em] text-black/45 sm:hidden">
              Page {page + 1} / {totalPages}
            </span>
            <div className="ml-auto flex gap-3">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((current) => Math.max(0, current - 1))}
                className="rounded-full border border-black/12 p-3 text-black/55 transition hover:border-black/24 hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Previous comments page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
                className="rounded-full border border-black/12 p-3 text-black/55 transition hover:border-black/24 hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Next comments page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
  tone = 'light',
}: {
  label: string;
  children: ReactNode;
  tone?: 'light' | 'dark';
}) {
  return (
    <label className="block space-y-2">
      <span
        className={cn(
          'text-[10px] uppercase tracking-[0.32em]',
          tone === 'dark' ? 'text-black/45' : 'text-white/45',
        )}
      >
        {label}
      </span>
      {children}
    </label>
  );
}
