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
  priorityColors?: Record<PlanPriority, string>;
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

// A file attached in the AI Planner, base64-encoded for the JSON request
export type UploadAttachment = { name: string; type: string; data: string; isImage: boolean };

export type PlanResponse = { plan: Plan; members: Member[]; attachmentContext?: string };

export type ApplyResponse = { columnsCreated: number; cardsCreated: number; planId: string };

export const labelColors: Record<PlanLabel, string> = {
  performance: '#2B44C7',
  bug: '#C7405A',
  feature: '#2C8A6E',
  information: '#C99227',
  warning: '#E3B341'
};

// Mirrors DEFAULT_PRIORITY_COLORS in util/ai-plan.ts
export const defaultPriorityColors: Record<PlanPriority, string> = {
  high: '#C7405A',
  medium: '#E3B341',
  low: '#2C8A6E'
};
