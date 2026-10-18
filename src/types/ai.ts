export type Member = {
  _id: string;
  fullName: string;
  email: string;
  role?: string;
  skills: string[];
  openTasks: number;
};

export type PlanLabel = 'feature' | 'bug' | 'performance' | 'information' | 'warning';

export type PlanPriority = 'high' | 'medium' | 'low';

export type PlanTask = {
  ref: string;
  title: string;
  description: string;
  column: string;
  label: PlanLabel;
  priority: PlanPriority;
  estimateHours: number;
  requiredSkills: string[];
  acceptanceCriteria: string[];
  dependsOn: string[];
  assigneeId: string | null;
  assignmentReason: string;
};

export type Plan = {
  summary: string;
  columns: string[];
  tasks: PlanTask[];
  risks: string[];
  questions: string[];
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type PlanResponse = { plan: Plan; members: Member[] };

export type ApplyResponse = { columnsCreated: number; cardsCreated: number; planId: string };

export const labelColors: Record<PlanLabel, string> = {
  performance: '#0079bf',
  bug: '#eb5a46',
  feature: '#61bd4f',
  information: '#ff9f1a',
  warning: '#f2d600'
};
