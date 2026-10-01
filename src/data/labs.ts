// labs.ts — VERIFIED laboratory facilities (dscet.ac.in/information-technology).
export interface Lab {
  id: string; name: string; desc: string;
  objectives: string[]; equipment: string[]; courses: string[];
  incharge: string; timetable: string; manual: string; verified: boolean;
}

export const LABS: Lab[] = [
  {
    id: 'system-software',
    name: 'System Software Laboratory',
    desc: 'Familiarizes students with open-source operating systems — Linux and Debian-based distributions such as Fedora and Ubuntu. Supports practical sessions for Data Structures and Algorithm Analysis, C Programming and Java Programming, plus software development projects in C, C++, Java and Python. A high-end projector supports project reviews, training programs, one-credit and value-added courses; MATLAB is available for learning and project work.',
    objectives: ['Hands-on fluency in Linux/Fedora/Ubuntu environments', 'Data structures, C and Java programming practice', 'Project reviews, training and value-added courses'],
    equipment: ['40 high-configuration personal computers', 'Linux / Ubuntu / Fedora operating systems', 'MATLAB software', 'High-end projector for training & reviews', 'Development environments for C, C++, Java, Python'],
    courses: ['Data Structures & Algorithm Analysis', 'C Programming', 'Java Programming', 'Software development projects'],
    incharge: 'Information will be updated.',
    timetable: 'Coming soon.',
    manual: 'Coming soon.',
    verified: true,
  },
  {
    id: 'network-lab',
    name: 'Network Laboratory',
    desc: 'Hands-on training in fundamental and advanced concepts of Computer and Communication Networks with emphasis on experiential learning. Supports experimental research in communication networking, including networking and network security. Students learn data communication, internetworking devices, protocols, and routing implementations.',
    objectives: ['Understand data communication and the Internet in business and daily life', 'Study internetworking devices, functions and protocols', 'Implement routing protocols and solve real-time networking challenges'],
    equipment: ['Latest-configuration PCs with server–client architecture', 'Structured network systems', 'NS2, NS3 network simulators', 'Wireshark network protocol analyzer', 'Routing protocol implementation tools'],
    courses: ['Computer Networks', 'Communication Networks', 'Network Security'],
    incharge: 'Information will be updated.',
    timetable: 'Coming soon.',
    manual: 'Coming soon.',
    verified: true,
  },
  {
    id: 'cyber-security',
    name: 'Cyber Security Laboratory',
    desc: 'Hands-on learning platform for cybersecurity principles and practices. Students analyze, test and secure computer systems in a controlled environment — simulating cyberattacks, performing ethical hacking exercises, and learning to detect and mitigate vulnerabilities.',
    objectives: ['Ethical hacking in a controlled environment', 'Vulnerability assessment and mitigation', 'Network security analysis for real-world cyber threats'],
    equipment: ['Advanced cybersecurity workstations', 'Ethical hacking tools & software', 'Vulnerability assessment platforms', 'Network security analysis tools', 'Controlled environment for security testing'],
    courses: ['Cyber Security', 'Ethical Hacking', 'Network Security', 'Vulnerability Assessment'],
    incharge: 'Information will be updated.',
    timetable: 'Coming soon.',
    manual: 'Coming soon.',
    verified: true,
  },
];
