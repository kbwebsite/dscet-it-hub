// publications.ts — VERIFIED journal papers (dscet.ac.in/information-technology, R&D Academic).
export interface Publication {
  id: string; title: string; journal: string; scope: string;
  volume: string; authors: string; year: string; doi: string; verified: boolean;
}

export const PUBLICATIONS: Publication[] = [
  { id: 'pub1', title: 'Analysis of software cost estimation and debt management based on deep learning approaches', journal: 'Computational and Experimental Science and Engineering (Scopus)', scope: 'International Journal', volume: 'Vol. 11 · No. 2 · pp. 3171–3184 · May 2025', authors: 'Dr. Ravikumar K', year: '2025', doi: '', verified: true },
  { id: 'pub2', title: 'Deep learning based heart disease risk prediction using softmax deep scaling gated adverbial neural network', journal: 'Rundschau (Scopus)', scope: 'International Journal', volume: 'Vol. 123(4) · pp. 209–233 · April 2025', authors: 'Dr. Ravikumar K', year: '2025', doi: '', verified: true },
  { id: 'pub3', title: 'Implementation of novel machine learning technique using several meta with naive Bayes models to analyse the performance of wave energy converters', journal: 'Bio Scan (Web of Science)', scope: 'International Journal', volume: 'v-19 · pp. 400–405 · Nov 2024', authors: 'Dr. Ravikumar K', year: '2024', doi: '', verified: true },
  { id: 'pub4', title: 'Dual interactive Wasserstein generative adversarial network optimised with remora optimisation algorithm-based lung disease detection using chest X-ray images', journal: 'Bio-Inspired Computation (SCI Journal)', scope: 'International Journal', volume: 'Vol. 23 · No. 3 · April 8, 2024', authors: 'Dr. Ravikumar K', year: '2024', doi: '', verified: true },
  { id: 'pub5', title: 'Diabetes mellitus prediction using improved chaotic whale optimization and data mining techniques', journal: 'J. Electrical Systems (Scopus)', scope: 'International Journal', volume: '20-5s · 2024', authors: 'Dr. Ravikumar K', year: '2024', doi: '', verified: true },
  { id: 'pub6', title: 'Reinforcement learning based metaheuristic algorithm for optimized load balancing in cloud environment', journal: 'J. Electrical Systems (Scopus)', scope: 'International Journal', volume: '20-5s · 2024', authors: 'Dr. Ravikumar K', year: '2024', doi: '', verified: true },
  { id: 'pub7', title: 'Preemptive min-max optimal cost based scheduling for improving the load balancing in virtualized cloud environment', journal: 'Springer Nature Journal (SN Computer Science) (Scopus)', scope: 'International Journal', volume: '753 · 1–12 · August 2024', authors: 'Dr. Ravikumar K', year: '2024', doi: '', verified: true },
  { id: 'pub8', title: 'Compact inverted E-shaped open-circuited impedance matching stub bandpass filter for wireless applications', journal: 'Analog Integrated Circuits and Signal Processing', scope: 'International Journal', volume: '123:14 · Feb 2025', authors: 'Dr. Sankara Malliga G', year: '2025', doi: '', verified: true },
];
