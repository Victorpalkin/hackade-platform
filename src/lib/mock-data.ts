import { Quest, Project, TeamMember, ProvisioningItem, Submission } from './types';

export const quests: Quest[] = [
  {
    id: 'q1',
    title: 'Google Finance AI Agents Quest',
    sponsor: 'Google Cloud',
    description: 'Build AI agents that help users manage personal finances using Gemini APIs and Google Cloud.',
    difficulty: 'advanced',
    tags: ['AI/ML', 'Gemini', 'FinTech'],
    prize: '$10,000',
    icon: 'Brain',
  },
  {
    id: 'q2',
    title: 'Sustainability Dashboard',
    sponsor: 'Google Earth',
    description: 'Create a dashboard that visualizes carbon footprint data using Google Earth Engine.',
    difficulty: 'intermediate',
    tags: ['Data Viz', 'Sustainability', 'Maps'],
    prize: '$5,000',
    icon: 'Leaf',
  },
  {
    id: 'q3',
    title: 'Accessibility Toolkit',
    sponsor: 'Chrome',
    description: 'Build browser extensions that make the web more accessible for users with disabilities.',
    difficulty: 'beginner',
    tags: ['A11y', 'Chrome Extension', 'Web'],
    prize: '$3,000',
    icon: 'Eye',
  },
];

export const projectCards: Project[] = [
  {
    id: 'p1',
    title: 'Generic Dashboard Builder',
    description: 'Yet another dashboard builder with charts and graphs. Nothing special here.',
    lookingFor: ['Backend Dev', 'Designer'],
    tags: ['React', 'Charts'],
    founder: { name: 'Bob', avatar: 'B', uid: 'seed-user-bob' },
    questId: 'q1',
    createdBy: 'seed-user-bob',
    members: [{ id: 'seed-user-bob', name: 'Bob', role: 'Project Lead', avatar: 'B', skills: [], uid: 'seed-user-bob' }],
    memberUids: ['seed-user-bob'],
    phase: 'forming',
    provisioningStatus: {},
    createdAt: Date.now(),
  },
  {
    id: 'p2',
    title: 'AI-Powered Tamagotchi',
    description: 'A virtual pet powered by Gemini that learns your habits and evolves. Feed it data, watch it grow!',
    lookingFor: ['ML Engineer', 'React Dev'],
    tags: ['AI/ML', 'Gemini', 'Fun'],
    founder: { name: 'Alice', avatar: 'A', uid: 'seed-user-alice' },
    questId: 'q1',
    createdBy: 'seed-user-alice',
    members: [{ id: 'seed-user-alice', name: 'Alice', role: 'Project Lead', avatar: 'A', skills: [], uid: 'seed-user-alice' }],
    memberUids: ['seed-user-alice'],
    phase: 'forming',
    provisioningStatus: {},
    createdAt: Date.now(),
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: 't1',
    name: 'You',
    role: 'API Whisperer',
    avatar: 'Y',
    skills: ['React', 'TypeScript', 'APIs'],
    claimed: false,
  },
  {
    id: 't2',
    name: 'Maya',
    role: 'The Pixel Pusher',
    avatar: 'M',
    skills: ['Figma', 'CSS', 'Animation'],
    claimed: false,
  },
  {
    id: 't3',
    name: 'Jordan',
    role: 'The Demo God',
    avatar: 'J',
    skills: ['Pitching', 'Video', 'Storytelling'],
    claimed: false,
  },
];

export const provisioningItems: ProvisioningItem[] = [
  {
    id: 'prov1',
    label: 'Google Chat Space & Meet Link Generated',
    icon: 'MessageSquare',
    status: 'pending',
  },
  {
    id: 'prov2',
    label: 'Shared Figma File Generated',
    icon: 'Palette',
    status: 'pending',
  },
  {
    id: 'prov3',
    label: 'Google Starter-Kit Cloned to GitHub',
    icon: 'GitBranch',
    status: 'pending',
  },
  {
    id: 'prov4',
    label: 'Sandbox API Keys Provisioned',
    icon: 'Key',
    status: 'pending',
  },
];

export const mockSubmission: Submission = {
  projectName: 'AI-Powered Tamagotchi',
  url: 'https://ai-tamagotchi.hackade.dev',
  videoUrl: 'https://pitch.hackade.dev/rec_abc123',
  tracks: ['Google Finance AI Agents', 'Best Use of Gemini API'],
  description:
    'A virtual pet powered by Gemini that learns your habits and evolves. Built with Next.js, Google Cloud, and Gemini Pro Vision.',
  teamMembers: ['You (API Whisperer)', 'Maya (Pixel Pusher)', 'Jordan (Demo God)'],
};

export const vibeCodingLines = [
  '$ gemini scaffold "add a dark-mode user dashboard"',
  '',
  'Analyzing project structure...',
  'Generating components...',
  '',
  'import { useState } from "react";',
  'import { Moon, Sun } from "lucide-react";',
  '',
  'export function Dashboard() {',
  '  const [dark, setDark] = useState(true);',
  '  ',
  '  return (',
  '    <div className={dark ? "bg-gray-900" : "bg-white"}>',
  '      <header className="flex justify-between p-4">',
  '        <h1>AI Tamagotchi Dashboard</h1>',
  '        <button onClick={() => setDark(!dark)}>',
  '          {dark ? <Sun /> : <Moon />}',
  '        </button>',
  '      </header>',
  '      <StatsGrid />',
  '      <ActivityFeed />',
  '      <PetStatus evolution="stage-3" />',
  '    </div>',
  '  );',
  '}',
  '',
  'Generated 3 components, 2 hooks, 1 layout.',
  'All files written successfully.',
];
