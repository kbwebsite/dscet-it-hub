// alumni.ts — alumni system ready for real profiles. No invented identities.
export interface Alumnus { id: string; name: string; batch: string; role: string; quote: string; path: string; verified: boolean }
export const ALUMNI: Alumnus[] = [];
export const ALUMNI_STATUS = 'Alumni stories and career journeys will be published here. Alumni records will be updated.';

export const GALLERY_CATS = ['All', 'Campus', 'Labs', 'Students', 'Faculty', 'Events', 'Workshops', 'Seminars', 'Hackathons', 'Achievements', 'Industrial Visits'];
export interface GalleryItem { id: string; label: string; cat: string; seed: string }
export const GALLERY: GalleryItem[] = [
  { id: 'g1', label: 'Department laboratories (photos will be updated)', cat: 'Labs', seed: 'dscet-it-lab' },
  { id: 'g2', label: 'Campus, Mamallapuram (photos will be updated)', cat: 'Campus', seed: 'dscet-campus' },
  { id: 'g3', label: 'Student activities (photos will be updated)', cat: 'Students', seed: 'dscet-students' },
];
