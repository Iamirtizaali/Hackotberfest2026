// Prompt engineering + validation for the AI project planner.
// The model's output is never trusted: normalizePlan() coerces every field and only
// allows assignees that are real board members.

// Same colours as the manual label menu (src/theme.ts palette)
export const LABELS: Record<string, string> = {
  feature: '#2C8A6E',
  bug: '#C7405A',
  performance: '#2B44C7',
  information: '#C99227',
  warning: '#E3B341'
};

const PRIORITIES = ['high', 'medium', 'low'];

// Card label colour per priority; the PM can ask the AI to change them
export const DEFAULT_PRIORITY_COLORS: Record<string, string> = {
  high: '#C7405A',
  medium: '#E3B341',
  low: '#2C8A6E'
};
const MAX_COLUMNS = 8;
const MAX_TASKS = 40;

export type PlanMember = {
  _id: string;
  fullName: string;
  email: string;
  role?: string;
  skills: string[];
  openTasks: number;
};

export type PlanTask = {
  ref: string;
  title: string;
  description: string;
  column: string;
  label: string;
  priority: string;
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
  priorityColors: Record<string, string>;
};

const EXAMPLE = {
  summary: 'Two-week plan to ship a landing page with a signup API.',
  priorityColors: DEFAULT_PRIORITY_COLORS,
  columns: ['Sprint 1 - Foundations', 'Sprint 2 - Launch'],
  tasks: [
    {
      ref: 'T1',
      title: 'Design landing page wireframes',
      description:
        'Create desktop and mobile wireframes for the hero, features and signup sections.',
      column: 'Sprint 1 - Foundations',
      label: 'feature',
      priority: 'high',
      estimateHours: 6,
      requiredSkills: ['UI/UX', 'Figma'],
      acceptanceCriteria: ['Desktop and mobile frames approved by PM'],
      dependsOn: [],
      assigneeId: '<member id>',
      assignmentReason: 'Only member with UI/UX and Figma skills.'
    }
  ],
  risks: ['Payment provider approval may take several days.'],
  questions: ['Which payment provider should be used?']
};

const str = (value: unknown, max: number, fallback = ''): string => {
  const s = typeof value === 'string' ? value.trim() : value == null ? '' : String(value).trim();

  return (s || fallback).slice(0, max);
};

const strList = (value: unknown, maxItems: number, maxLen: number): string[] =>
  (Array.isArray(value) ? value : [])
    .map((v) => str(v, maxLen))
    .filter(Boolean)
    .slice(0, maxItems);

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function buildSystemPrompt({
  members,
  existingColumns,
  boardName
}: {
  members: PlanMember[];
  existingColumns: string[];
  boardName: string;
}): string {
  const roster = members.map((m) => ({
    id: m._id,
    name: m.fullName,
    role: m.role || '',
    skills: m.skills,
    openTasks: m.openTasks
  }));

  return `You are a senior delivery manager and tech lead. A project manager describes a project; you turn it into an actionable delivery plan for the Trello board "${boardName}" and assign every task to the best-fitting team member.

TEAM (the ONLY people you may assign; use their exact "id"):
${JSON.stringify(roster, null, 2)}

EXISTING BOARD COLUMNS: ${existingColumns.length ? JSON.stringify(existingColumns) : 'none'}

RULES:
1. "columns" are ordered phases or milestones (e.g. "Sprint 1 - Setup"). Use 2 to ${MAX_COLUMNS} columns. Reuse an existing column name exactly when it fits.
2. Create 6 to 25 tasks that together deliver the whole project. Titles are imperative and at most 80 characters. Every task's "column" must be one of "columns".
3. Assign each task by matching its "requiredSkills" to the members' "skills" (and "role"). Prefer the closest skill match, then the member with fewer tasks. Balance the load: no member should get more than about ceil(tasks / members) + 1 tasks, counting their existing "openTasks".
4. "assigneeId" must be one of the team ids above, or null only if nobody fits. Never invent ids or people.
5. "assignmentReason" is one short sentence naming the matching skill.
6. "label" is one of: ${Object.keys(LABELS).join(
    ', '
  )}. "priority" is one of: high, medium, low. "estimateHours" is an integer from 1 to 16.
7. "dependsOn" lists refs of earlier tasks only. Refs are "T1", "T2", ...
8. Give 1 to 4 concrete "acceptanceCriteria" per task.
9. If the brief is vague, still produce a sensible plan and put clarifying questions in "questions". Put delivery risks in "risks".
10. When the conversation contains a previous plan and the PM asks for changes, return the full updated plan, not a diff.
11. Set "priority" deliberately: high = blocking, critical-path, security or launch-critical work; medium = core feature work; low = polish and nice-to-haves. If the PM says which tasks or areas are high/medium/low priority, follow that exactly.
12. Each task becomes a card whose label colour shows its priority. "priorityColors" maps high, medium and low to a "#RRGGBB" hex colour. Default to ${JSON.stringify(
    DEFAULT_PRIORITY_COLORS
  )}. Only change them when the PM asks (e.g. "make high priority purple"); convert colour names to hex, keep the three colours distinct, and keep the PM's colours in later revisions.
13. The PM may attach documents (their text appears between <<<FILE name>>> and <<<END FILE name>>> markers) or images such as wireframes, UI mockups, screenshots, architecture diagrams or whiteboard photos. Treat attachments as the primary source of requirements: read them fully, create tasks that cover every feature, screen, integration and requirement they contain, and mention the source file or screen in each task's description. If an attachment is unrelated to software work, say so in "questions" and plan from whatever is usable.

OUTPUT: respond with a single json object only, no markdown, matching exactly this shape:
${JSON.stringify(EXAMPLE, null, 2)}`;
}

// Picks the member with the best skill overlap, breaking ties by the lowest load
const pickFallbackAssignee = (
  requiredSkills: string[],
  members: PlanMember[],
  load: Record<string, number>
): { member: PlanMember | null; overlap: string[] } => {
  if (!members.length) return { member: null, overlap: [] };

  const wanted = requiredSkills.map((s) => s.toLowerCase());
  let best: PlanMember | null = null;
  let bestOverlap: string[] = [];

  for (const m of members) {
    const overlap = (m.skills || []).filter((skill) => {
      const s = skill.toLowerCase();

      return wanted.some((w) => s.includes(w) || w.includes(s));
    });
    const better =
      !best ||
      overlap.length > bestOverlap.length ||
      (overlap.length === bestOverlap.length && (load[m._id] || 0) < (load[best._id] || 0));

    if (better) {
      best = m;
      bestOverlap = overlap;
    }
  }

  return { member: best, overlap: bestOverlap };
};

const HEX_COLOR = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

const normalizeColor = (value: unknown, fallback: string): string => {
  const s = str(value, 7);

  if (!HEX_COLOR.test(s)) return fallback;

  return s.length === 4
    ? `#${s[1]}${s[1]}${s[2]}${s[2]}${s[3]}${s[3]}`.toUpperCase()
    : s.toUpperCase();
};

export const normalizePriorityColors = (value: any): Record<string, string> => {
  const colors: Record<string, string> = {};

  PRIORITIES.forEach((p) => (colors[p] = normalizeColor(value?.[p], DEFAULT_PRIORITY_COLORS[p])));

  return colors;
};

export function normalizePlan(raw: any, members: PlanMember[]): Plan {
  const memberIds = new Set(members.map((m) => m._id));
  const load: Record<string, number> = {};

  members.forEach((m) => (load[m._id] = m.openTasks || 0));

  let columns = strList(raw?.columns, MAX_COLUMNS, 60);

  // Dedupe column names case-insensitively
  columns = columns.filter(
    (c, i) => columns.findIndex((x) => x.toLowerCase() === c.toLowerCase()) === i
  );

  if (!columns.length) columns = ['To Do'];

  const rawTasks = (Array.isArray(raw?.tasks) ? raw.tasks : []).slice(0, MAX_TASKS);
  const tasks: PlanTask[] = [];

  rawTasks.forEach((t, index) => {
    const title = str(t?.title, 80);

    if (!title) return;

    const columnInput = str(t?.column, 60).toLowerCase();
    const column = columns.find((c) => c.toLowerCase() === columnInput) || columns[0];
    const requiredSkills = strList(t?.requiredSkills, 8, 40);
    const label = LABELS[str(t?.label, 20).toLowerCase()]
      ? str(t.label, 20).toLowerCase()
      : 'feature';
    const priority = PRIORITIES.includes(str(t?.priority, 10).toLowerCase())
      ? str(t.priority, 10).toLowerCase()
      : 'medium';
    const estimate = Math.round(Number(t?.estimateHours));

    let assigneeId =
      typeof t?.assigneeId === 'string' && memberIds.has(t.assigneeId) ? t.assigneeId : null;
    let assignmentReason = str(t?.assignmentReason, 200);

    if (!assigneeId && members.length) {
      const { member, overlap } = pickFallbackAssignee(requiredSkills, members, load);

      assigneeId = member ? member._id : null;
      assignmentReason = overlap.length
        ? `Auto-matched on ${overlap.join(', ')}.`
        : 'Auto-assigned to the least busy member (no exact skill match).';
    }

    if (assigneeId) load[assigneeId] = (load[assigneeId] || 0) + 1;

    tasks.push({
      ref: str(t?.ref, 10, `T${index + 1}`),
      title,
      description: str(t?.description, 2000),
      column,
      label,
      priority,
      estimateHours: Number.isFinite(estimate) ? Math.min(16, Math.max(1, estimate)) : 4,
      requiredSkills,
      acceptanceCriteria: strList(t?.acceptanceCriteria, 6, 200),
      dependsOn: strList(t?.dependsOn, 10, 10),
      assigneeId,
      assignmentReason
    });
  });

  return {
    summary: str(raw?.summary, 1000, 'Project plan'),
    columns,
    tasks,
    risks: strList(raw?.risks, 8, 300),
    questions: strList(raw?.questions, 6, 300),
    priorityColors: normalizePriorityColors(raw?.priorityColors)
  };
}

// HTML for the card description (rendered by react-quill)
export function planToCardDescription(task: PlanTask, member?: PlanMember | null): string {
  const parts: string[] = [];

  if (task.description) parts.push(`<p>${escapeHtml(task.description)}</p>`);

  if (task.acceptanceCriteria.length) {
    parts.push('<p><strong>Acceptance criteria</strong></p>');
    parts.push(
      `<ul>${task.acceptanceCriteria.map((c) => `<li>${escapeHtml(c)}</li>`).join('')}</ul>`
    );
  }

  const meta = [
    `<strong>Priority:</strong> ${escapeHtml(task.priority)}`,
    `<strong>Type:</strong> ${escapeHtml(task.label)}`,
    `<strong>Estimate:</strong> ${task.estimateHours}h`,
    task.requiredSkills.length &&
      `<strong>Skills:</strong> ${escapeHtml(task.requiredSkills.join(', '))}`,
    task.dependsOn.length && `<strong>Depends on:</strong> ${escapeHtml(task.dependsOn.join(', '))}`
  ].filter(Boolean);

  parts.push(`<p>${meta.join(' &nbsp;·&nbsp; ')}</p>`);

  if (member) {
    parts.push(
      `<p><em>Assigned by AI to ${escapeHtml(member.fullName)}: ${escapeHtml(
        task.assignmentReason
      )}</em></p>`
    );
  }

  parts.push(`<p><em>Ref ${escapeHtml(task.ref)}</em></p>`);

  return parts.join('');
}
