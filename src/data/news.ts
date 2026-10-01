// news.ts — truthful news system. No fabricated announcements.
export interface NewsItem {
  id: string; title: string; date: string; category: string;
  desc: string; featured: boolean; verified: boolean;
}
export const NEWS: NewsItem[] = [];
export const NEWS_CATEGORIES = ['All', 'Announcement', 'Academic', 'Research', 'Student', 'Faculty', 'Event', 'Achievement', 'Workshop', 'Seminar'];
export const NEWS_STATUS = 'Department news will be published here. No announcements yet.';
