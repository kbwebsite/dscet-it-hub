// events.ts — event system structure. No official event records published yet;
// pages render honest "upcoming will be announced" empty states.
export interface DeptEvent {
  id: string; title: string; date: string; time: string; venue: string;
  organizer: string; category: string; desc: string; speaker: string;
  status: 'Upcoming' | 'Past'; verified: boolean;
}
export const EVENTS: DeptEvent[] = [];
export const EVENT_CATEGORIES = ['All', 'Workshop', 'Seminar', 'Conference', 'FDP', 'Hackathon', 'Guest Lecture', 'Technical', 'Cultural', 'Industrial Visit'];
export const EVENTS_STATUS = 'Upcoming events will be announced. Past event records will be updated.';
