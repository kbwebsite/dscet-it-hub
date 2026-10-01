// projects.ts — project showcase structure. Verified student project records
// are not yet published; showcase renders pending state. Categories ready.
export interface Project {
  id: string; title: string; students: string; mentor: string;
  tech: string[]; desc: string; year: string; category: string; verified: boolean;
}
export const PROJECTS: Project[] = [];
export const PROJECT_CATEGORIES = ['All', 'AI', 'ML', 'Web', 'Mobile', 'Cloud', 'Cybersecurity', 'IoT', 'Blockchain', 'Data Science'];
export const PROJECTS_STATUS = 'Verified student projects will be showcased here. Records will be updated.';
export const INDUSTRY_PROJECT_NOTE = 'Student projects undertaken in association with Vcodez, fldsmith and other leading private industries (official).';
