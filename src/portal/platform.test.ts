// Platform unit tests — event lifecycle, countdown math, permissions,
// formatters, embed validation, seed integrity, storage roundtrip.
// Run: npm test
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { eventStatus, countdownParts, greeting, can, fmtD, fmtDT, timeAgo } from './store';
import { SEED, DEMO_USERS, saveDB, loadDB, resetDB, uid } from './mockdb';
import { ytEmbed } from './LiveTv';

const NOW = new Date('2026-10-05T10:00:00Z').getTime();
const iso = (ms: number) => new Date(ms).toISOString();

describe('eventStatus — UPCOMING → LIVE → COMPLETED', () => {
  it('is UPCOMING before start', () => {
    expect(eventStatus({ startISO: iso(NOW + 36e5), endISO: iso(NOW + 72e5) }, NOW)).toBe('UPCOMING');
  });
  it('is LIVE during the window, including exact start', () => {
    expect(eventStatus({ startISO: iso(NOW - 36e5), endISO: iso(NOW + 36e5) }, NOW)).toBe('LIVE');
    expect(eventStatus({ startISO: iso(NOW), endISO: iso(NOW + 36e5) }, NOW)).toBe('LIVE');
  });
  it('is COMPLETED after end', () => {
    expect(eventStatus({ startISO: iso(NOW - 72e5), endISO: iso(NOW - 36e5) }, NOW)).toBe('COMPLETED');
  });
  it('admin live override forces LIVE', () => {
    expect(eventStatus({ startISO: iso(NOW + 36e5), endISO: iso(NOW + 72e5), live: true }, NOW)).toBe('LIVE');
  });
  it('invalid dates degrade to UPCOMING, never crash', () => {
    expect(eventStatus({ startISO: 'To be scheduled', endISO: 'To be scheduled' }, NOW)).toBe('UPCOMING');
  });
});

describe('countdownParts', () => {
  it('splits 1d 1h 1m 1s exactly', () => {
    expect(countdownParts(NOW + 90061000, NOW)).toEqual({ days: 1, hours: 1, mins: 1, secs: 1 });
  });
  it('clamps past targets to zero', () => {
    expect(countdownParts(NOW - 5000, NOW)).toEqual({ days: 0, hours: 0, mins: 0, secs: 0 });
  });
  it('handles sub-minute values', () => {
    expect(countdownParts(NOW + 59000, NOW)).toEqual({ days: 0, hours: 0, mins: 0, secs: 59 });
  });
});

describe('role permissions', () => {
  it('students see self data but cannot mark attendance', () => {
    expect(can('student', 'self:read')).toBe(true);
    expect(can('student', 'attendance:mark')).toBe(false);
    expect(can('student', 'analytics:view')).toBe(false);
  });
  it('faculty get teaching powers, not analytics', () => {
    expect(can('faculty', 'marks:enter')).toBe(true);
    expect(can('faculty', 'request:decide')).toBe(true);
    expect(can('faculty', 'analytics:view')).toBe(false);
  });
  it('hod gets analytics, admin gets everything', () => {
    expect(can('hod', 'analytics:view')).toBe(true);
    expect(can('admin', 'anything-at-all')).toBe(true);
    expect(can('student', 'anything-at-all')).toBe(false);
  });
});

describe('formatters', () => {
  it('returns invalid input unchanged instead of crashing', () => {
    expect(fmtD('To be scheduled')).toBe('To be scheduled');
    expect(fmtDT('not-a-date')).toBe('not-a-date');
    expect(timeAgo('bad')).toBe('');
  });
  it('formats relative times', () => {
    expect(timeAgo(new Date().toISOString())).toBe('just now');
    expect(timeAgo(iso(Date.now() - 30 * 6e4))).toBe('30m ago');
    expect(timeAgo(iso(Date.now() - 90 * 6e4))).toBe('2h ago');
    expect(timeAgo(iso(Date.now() - 3 * 864e5))).toBe('3d ago');
  });
  it('greeting is always a friendly string', () => {
    expect(greeting()).toMatch(/^Good (morning|afternoon|evening)/);
  });
  it('uids are unique', () => {
    expect(new Set([uid(), uid(), uid()]).size).toBe(3);
  });
});

describe('ytEmbed — YouTube only, never arbitrary URLs', () => {
  it('accepts watch, short, live and embed forms', () => {
    expect(ytEmbed('https://www.youtube.com/watch?v=abc123')).toBe('https://www.youtube.com/embed/abc123');
    expect(ytEmbed('https://youtu.be/xyz789')).toBe('https://www.youtube.com/embed/xyz789');
    expect(ytEmbed('https://www.youtube.com/live/id123')).toBe('https://www.youtube.com/embed/id123');
    expect(ytEmbed('https://www.youtube.com/embed/e456')).toBe('https://www.youtube.com/embed/e456');
  });
  it('rejects everything else', () => {
    expect(ytEmbed('https://vimeo.com/123')).toBeNull();
    expect(ytEmbed('https://evil.youtube.com.evil.com/x')).toBeNull();
    expect(ytEmbed('https://www.youtube.com/')).toBeNull();
    expect(ytEmbed('not a url')).toBeNull();
    expect(ytEmbed('')).toBeNull();
  });
});

describe('seed integrity', () => {
  it('has four semesters with three internal components each', () => {
    expect(SEED.semesters).toHaveLength(4);
    for (const s of SEED.semesters) {
      expect(s.subjects.length).toBeGreaterThan(0);
      for (const sub of s.subjects) expect(sub.internal).toHaveLength(3);
    }
  });
  it('has unique register numbers and roster ⊆ directory', () => {
    const regs = SEED.directory.map(d => d.regNo);
    expect(new Set(regs).size).toBe(regs.length);
    for (const r of SEED.roster.rows) expect(regs).toContain(r.regNo);
  });
  it('covers a Mon–Fri teaching week and four demo roles', () => {
    expect(SEED.timetable.map(t => t.day)).toEqual(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
    expect(Object.keys(DEMO_USERS).sort()).toEqual(['admin', 'faculty', 'hod', 'student']);
  });
});

describe('storage roundtrip', () => {
  beforeEach(() => {
    const mem = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => mem.get(k) ?? null,
      setItem: (k: string, v: string) => { mem.set(k, v); },
      removeItem: (k: string) => { mem.delete(k); },
    });
  });
  it('persists mutations across loads', () => {
    const db = loadDB();
    saveDB({ ...db, news: [{ id: 't1', title: 'T', category: 'General', desc: 'D', timeISO: iso(NOW), featured: false }] });
    expect(loadDB().news).toHaveLength(1);
  });
  it('reset restores the pristine seed', () => {
    saveDB({ ...loadDB(), news: [{ id: 't1', title: 'T', category: 'General', desc: 'D', timeISO: iso(NOW), featured: false }] });
    expect(resetDB().news).toHaveLength(0);
  });
});
