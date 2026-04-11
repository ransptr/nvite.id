import type {CalendarEvent} from '@/src/types/invitation';

function formatDate(value: string) {
  return value.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function buildCalendarDataUrl(event: CalendarEvent) {
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `UID:${event.title.replace(/\s+/g, '-').toLowerCase()}@envite`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.location}`,
    `DTSTART:${formatDate(new Date(event.start).toISOString())}`,
    `DTEND:${formatDate(new Date(event.end).toISOString())}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return `data:text/calendar;charset=utf8,${encodeURIComponent(body)}`;
}
