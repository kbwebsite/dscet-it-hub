// faculty.ts — database-driven directory architecture.
// Official department page states: "Faculty details will be updated shortly."
// Do NOT insert invented profiles. Add real records to FACULTY when published.
export type FacultyRole =
  | 'Professor' | 'Associate Professor' | 'Assistant Professor'
  | 'Research Scholar' | 'Technical Staff' | 'Administrative Staff';

export interface Faculty {
  id: string;
  name: string;
  role: FacultyRole;
  designation: string;
  qualification: string;
  experience: string;
  specialization: string;
  interests: string[];
  publications: number;
  email: string;
  office: string;
  scholar?: string;
  orcid?: string;
  photo?: string;
  verified: boolean;
}

export const FACULTY: Faculty[] = [];
export const FACULTY_STATUS = 'Faculty profiles are being updated.';
export const FACULTY_ROLES: (FacultyRole | 'All')[] = [
  'All', 'Professor', 'Associate Professor', 'Assistant Professor',
  'Research Scholar', 'Technical Staff', 'Administrative Staff',
];
