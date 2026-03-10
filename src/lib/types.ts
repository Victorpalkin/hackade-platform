export interface UserProfile {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  role: 'hacker' | 'organizer' | 'mentor';
}

export interface Quest {
  id: string;
  title: string;
  sponsor: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  prize?: string;
  icon?: string;
}

export interface ProjectCard {
  id: string;
  title: string;
  description: string;
  lookingFor: string[];
  tags: string[];
  founder: {
    name: string;
    avatar: string;
    uid?: string;
  };
  questId: string;
  createdBy: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  skills: string[];
  claimed?: boolean;
  uid?: string;
}

export interface Team {
  id: string;
  questId: string;
  projectId: string;
  projectTitle: string;
  members: TeamMember[];
  memberUids: string[];
  provisioningStatus: Record<string, 'pending' | 'in-progress' | 'complete'>;
  phase: 'forming' | 'provisioning' | 'building' | 'submitted';
  createdAt: number;
}

export interface SwipeRecord {
  id: string;
  swiperId: string;
  projectId: string;
  direction: 'left' | 'right';
  timestamp: number;
}

export interface ProvisioningItem {
  id: string;
  label: string;
  icon: string;
  status: 'pending' | 'in-progress' | 'complete';
}

export interface Submission {
  id?: string;
  teamId?: string;
  projectName: string;
  url: string;
  videoUrl: string;
  tracks: string[];
  description: string;
  teamMembers: string[];
  submittedAt?: number;
  submittedBy?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'match' | 'team_joined' | 'mentor_request';
  message: string;
  link: string;
  read: boolean;
  createdAt: number;
}

export interface HelpRequest {
  id: string;
  teamId: string;
  teamName: string;
  description: string;
  status: 'pending' | 'claimed' | 'resolved';
  mentorId?: string;
  createdAt: number;
}

export interface Judgment {
  id: string;
  submissionId: string;
  judgerId: string;
  score: number;
  notes: string;
  createdAt: number;
}

export type SceneId = 1 | 2 | 3 | 4 | 5;

export interface DemoState {
  currentScene: SceneId;
  scenePhase: number;
}
