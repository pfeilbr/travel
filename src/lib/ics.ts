// Minimal iCalendar (RFC 5545) writer for all-day events, for the ski events calendar feed.

export interface CalEvent {
  uid: string;
  start: string;   // ISO date
  end?: string;    // ISO date, inclusive
  summary: string;
  description?: string;
  location?: string;
  url?: string;
}

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/([;,])/g, '\\$1');
const ymd = (iso: string) => iso.replace(/-/g, '');

function nextDay(iso: string): string {
  const d = new Date(iso + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

/** Fold lines longer than 75 octets (continuation lines start with a space). */
export function fold(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let cur = '';
  let len = 0;
  for (const ch of line) {
    const n = new TextEncoder().encode(ch).length;
    if (len + n > (out.length ? 74 : 75)) { out.push(cur); cur = ''; len = 0; }
    cur += ch; len += n;
  }
  out.push(cur);
  return out.join('\r\n ');
}

export function calendar(name: string, events: CalEvent[], stamp: string): string {
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Waypoint//Travel//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    `X-WR-CALNAME:${esc(name)}`,
    ...events.flatMap((e) => [
      'BEGIN:VEVENT',
      `UID:${e.uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${ymd(e.start)}`,
      `DTEND;VALUE=DATE:${ymd(nextDay(e.end ?? e.start))}`,
      `SUMMARY:${esc(e.summary)}`,
      ...(e.description ? [`DESCRIPTION:${esc(e.description)}`] : []),
      ...(e.location ? [`LOCATION:${esc(e.location)}`] : []),
      ...(e.url ? [`URL:${e.url}`] : []),
      'END:VEVENT',
    ]),
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}
