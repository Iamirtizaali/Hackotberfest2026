# AI Project Board

AI Automated Project Planning and Task Management Platform

*Product Requirements Document: Complete Functional Confirmation & Technical Implementation Plan*

Prepared from: the project owner's AI board concept, the supplied AI Project Board PRD, and the MARKETFOOT Complete PRD v1 documentation reference.

Document version 2.0 · 18 October 2026 · Revised for project owner confirmation

Confirmed model requirement: DeepSeek V4.1 Flash. Current database setup: MongoDB Atlas, as shown in the supplied project-creation screenshot. Remaining implementation choices retain the status stated below.

# Table of Contents

- [How to read this document](#how-to-read-this-document)
- [Part A: Technical Requirements & Implementation Plan](#part-a-technical-requirements--implementation-plan)
  - [A.1 Confirmed technology stack and proposed components](#a1-confirmed-technology-stack-and-proposed-components)
  - [A.2 Core product model and logical entities](#a2-core-product-model-and-logical-entities)
  - [A.3 Authentication and account creation](#a3-authentication-and-account-creation)
  - [A.4 Project context and source data management](#a4-project-context-and-source-data-management)
  - [A.5 Project requirements and initial planning baseline](#a5-project-requirements-and-initial-planning-baseline)
  - [A.6 Task composition and team management](#a6-task-composition-and-team-management)
  - [A.7 Project lifecycle phases and timeline](#a7-project-lifecycle-phases-and-timeline)
  - [A.8 Assignment eligibility capacity and conditions](#a8-assignment-eligibility-capacity-and-conditions)
  - [A.9 Detailed scheduling mechanics](#a9-detailed-scheduling-mechanics)
  - [A.10 AI planning and model configuration](#a10-ai-planning-and-model-configuration)
  - [A.11 Validation quality and performance thresholds](#a11-validation-quality-and-performance-thresholds)
  - [A.12 Change requests and controlled automation](#a12-change-requests-and-controlled-automation)
  - [A.13 Interrupted jobs and partial external operations](#a13-interrupted-jobs-and-partial-external-operations)
  - [A.14 Locks history reporting and recovery](#a14-locks-history-reporting-and-recovery)
  - [A.15 Administration panel requirements](#a15-administration-panel-requirements)
  - [A.16 Proposed screens and information architecture](#a16-proposed-screens-and-information-architecture)
  - [A.17 Planning engine service contracts and historical data](#a17-planning-engine-service-contracts-and-historical-data)
  - [A.18 Responsive application security and reliability requirements](#a18-responsive-application-security-and-reliability-requirements)
  - [A.19 Required delivery validation and quotation items](#a19-required-delivery-validation-and-quotation-items)
  - [A.20 Constants and parameters summary](#a20-constants-and-parameters-summary)
- [Part B: Functional Requirements (Non-Technical)](#part-b-functional-requirements-non-technical)
  - [B.1 What AI Project Board is](#b1-what-ai-project-board-is)
  - [B.2 First-time user journey](#b2-first-time-user-journey)
  - [B.3 Main navigation and project workspace](#b3-main-navigation-and-project-workspace)
  - [B.4 Project board and task management](#b4-project-board-and-task-management)
  - [B.5 Automatic assignments and scheduling experience](#b5-automatic-assignments-and-scheduling-experience)
  - [B.6 Project phases and manual locks](#b6-project-phases-and-manual-locks)
  - [B.7 Planning results warnings and notifications](#b7-planning-results-warnings-and-notifications)
  - [B.8 Change requests and ongoing automation](#b8-change-requests-and-ongoing-automation)
  - [B.9 Activity reporting and history](#b9-activity-reporting-and-history)
  - [B.10 Projects tasks and member profiles](#b10-projects-tasks-and-member-profiles)
  - [B.11 Administrator operating workflow](#b11-administrator-operating-workflow)
  - [B.12 Functional completion criteria](#b12-functional-completion-criteria)
- [Client Clarifications Required](#client-clarifications-required)
  - [Master confirmation checklist](#master-confirmation-checklist)
- [Project Delivery: Two Milestones](#project-delivery-two-milestones)
  - [Milestone 1 - Core Platform, Project Intake & Validated Board Generation](#milestone-1---core-platform-project-intake--validated-board-generation)
  - [Milestone 2 - Controlled Automation, Historical Recovery, Validation & Production](#milestone-2---controlled-automation-historical-recovery-validation--production)

# How to read this document

This document follows the supplied reference's organization: a technical implementation plan, a plain-language functional description, one consolidated clarification checklist, and two delivery milestones. Section topics are adapted to AI project management; the reference's football rules and project-specific technologies are not requirements for this product.

- **Part A: Technical Requirements & Implementation Plan.** For engineering, QA, and technical reviewers. It defines the proposed architecture, data model, planning rules, permissions, controls, acceptance conditions, and delivery requirements.
- **Part B: Functional Requirements (Non-Technical).** For the project owner and reviewers. It explains what project managers, contributors, and administrators see and do.
- **Client Clarifications Required.** Records decisions not confirmed in the supplied project material. A proposed rule is not an approved business rule. The affected feature must not be finalized before its blocking decisions are resolved.
- **Project Delivery: Two Milestones.** Separates the core planning platform from ongoing automation and production readiness, with explicit acceptance criteria.

**Source hierarchy.** The project owner's request establishes the purpose: enter project information, automatically create a board, assign tasks, and reduce dependence on a separately assembled Trello/Jira and MCP workflow, using DeepSeek V4.1 Flash. The supplied AI Project Board PRD supplies the proposed requirements, research, limits, metrics, and architecture. The subsequently supplied MongoDB Atlas screenshot establishes the current database setup direction, replacing the earlier PostgreSQL proposal for this revision. The MARKETFOOT document supplies the documentation pattern, not AI board business rules. External sources retained in A.2.5 support the factual research statements; they do not approve our design choices.

**Status convention.** “Confirmed” means explicitly requested by the project owner. “Proposed” means inherited from the earlier PRD or added as an implementation recommendation in this revision. “TBD” means not defined by the supplied project material. P0 identifies a proposed MVP requirement; P1 denotes later scope. All P0 requirements are mandatory once that scope is approved. Proposed targets are acceptance targets, not measured achievements. No customer interviews, pilot results, grading rubric, formal certification, or approved wireframes have been supplied.

**Traceability.** FR01–FR24 and NFR01–NFR06 retain the existing requirement identifiers. A.19.1 maps every functional requirement to its technical section and delivery milestone. References to C01–C24 point to the single master clarification checklist.

# Part A: Technical Requirements & Implementation Plan

*This part defines the engineering behavior for the AI Project Board. It preserves the supplied PRD's core requirements while exposing unconfirmed design choices, dependencies, and implementation decisions. It does not describe proposed features as already implemented or tested.*

## A.1 Confirmed technology stack and proposed components

The AI model family is explicitly confirmed. The latest project setup shows MongoDB Atlas, which is used as the current database direction in this revision; deployment tier, region, and detailed schema remain unconfirmed. The earlier PRD proposed PostgreSQL. The reference document's Next.js, Supabase, Google OAuth, and SMTP choices belong to MARKETFOOT and are not automatically adopted here.

| Layer | Choice and status | Requirement |
| --- | --- | --- |
| AI planning model | **Confirmed:** DeepSeek V4.1 Flash | Use the required model for project interpretation and task generation. |
| Model API configuration | **Proposed:** `deepseek-flash` at `https://api.deepseek.com` | Preserve configurable model settings and validate access in a technical spike; see A.10 and [S14]. |
| Web application | **Proposed:** responsive web application; framework TBD | Support the PM, contributor, viewer, and administrator workflows. No frontend framework has been confirmed. |
| Application backend | **Proposed:** authenticated service API; runtime TBD | Own access control, validation, execution, version checks, and audit history. |
| Database | **Current setup:** MongoDB Atlas; deployment tier and region TBD | Store workspace, project, plan, task, capacity, policy, and audit documents with tenant-scoped queries and approved indexes. |
| Source file storage | **Proposed:** tenant-scoped object storage; provider TBD | Store authorized uploads and source versions with controlled retrieval. |
| Background processing | **Proposed:** durable queue and workers; service TBD | Run extraction, generation, validation, and scheduled automation without losing job state. |
| Authentication | **TBD:** provider and sign-in methods | Supply verified identities, membership enforcement, revocation, and session management. |
| External work platforms | **Proposed:** native board first; optional Trello export later | Run supported projects without a separate Trello/Jira account or customer-configured MCP client. Jira and bidirectional synchronization are later scope. |
| Hosting and monitoring | **TBD:** deployment region and services | Meet approved operational, privacy, performance, and recovery requirements. |

**CONFIRM WITH CLIENT — C01–C03:** approve the native board strategy, application stack, and authentication methods before those implementations are finalized. Retain DeepSeek V4.1 Flash as the required model.

## A.2 Core product model and logical entities

### A.2.1 Product purpose and scope

The AI Project Board converts a PM's project brief, source documents, team information, and delivery constraints into a reviewable and actionable Kanban board. It generates tasks, acceptance criteria, dependencies, estimates, and suitable ownership, then maintains the plan through authorized updates.

The proposed first release is a standalone board and task database. Its replacement proposition is a complete planning workflow that reduces the need for the PM to assemble an AI client, an MCP connection, and an external work tracker. MCP means Model Context Protocol; it standardizes communication with external capabilities [S13]. The product is not a replacement for the protocol itself.

The proposed initial segment is software and digital delivery teams of 5–20 contributors with projects lasting 2–12 weeks. Each project belongs to one workspace and one team capacity pool. Capacity can be reserved across that workspace's projects, but global portfolio optimization is excluded. These boundaries are assumptions awaiting C04.

The MVP excludes executing contributors' delivery work, purchasing services, hiring, employee performance scoring, autonomous permanent deletion, new stakeholder commitments without review, full Trello/Jira parity, scanned-document OCR, audio ingestion, and native mobile apps. Trello export, Jira support, calendars, multilingual input, and bidirectional synchronization are later scope unless C01 or C20 changes the release boundary.

### A.2.2 Goals and research foundation

| Goal | Intended outcome | Measurement location |
| --- | --- | --- |
| G1 | Reduce active PM effort from brief to accepted usable board. | A.19.3 |
| G2 | Make requirements, ownership, dependencies, and completion criteria explicit. | A.11 and A.19.3 |
| G3 | Reduce routine maintenance through approved automation. | A.12 and A.19.3 |
| G4 | Preserve explainable decisions, manual control, and recoverable history. | A.14 and A.18 |

The desk research below was reviewed for the earlier PRD on 18 October 2026. It supports feasibility and product positioning. It does not establish demand, willingness to pay, typical setup time, or a proven productivity improvement for this product.

| Finding | Evidence and qualification | Product implication |
| --- | --- | --- |
| GenAI is relevant to project work. | PMI surveyed 500 project professionals already using GenAI. High adopters reported stronger productivity and effectiveness than low adopters. These are self-reported associations within existing users, not causal findings or a market-wide adoption estimate. [S1] | Test time savings on actual PM work rather than claiming a proven benefit. |
| AI task generation already exists. | Jira Rovo can propose, refine, review, and create work items from natural language; availability depends on rollout and configuration. [S2] | Basic prompt-to-task generation alone is insufficient differentiation. |
| Hosted connectivity already exists. | Official Trello MCP and Atlassian Rovo MCP connect external AI clients to work systems. [S3, S4] | Differentiate through the complete workflow and persistent planning controls. |
| Trello already offers related assistance. | Inbox can summarize messages into cards; Planner can suggest focus time; configured automation performs rule-based actions. [S10–S12] | Evaluate project-wide planning and capacity-aware ownership against existing alternatives. |
| Structured generation and integration are feasible. | DeepSeek documents JSON output and tool calls; Trello documents board/card APIs and webhooks. Valid JSON does not establish correct scope, permissions, or scheduling. [S5–S9] | Keep deterministic validation and execution in the application. |

### A.2.3 Idea derivation and validation limits

Board creation, task tracking, and AI connectivity are established building blocks. The proposed opportunity is the work between an unstructured project brief and a maintainable team plan: clarify gaps, decompose scope, allocate eligible people, identify infeasibility, and apply changes without losing manual decisions. This is an inference from the reviewed capabilities, not evidence that competitors cannot deliver comparable workflows.

The core hypotheses are that PMs will provide sufficient context, teams will maintain useful skills/capacity data, users will accept a native board, allocation suggestions will reduce effort, and the required model will meet quality and latency targets. Provider data processing must also be permitted by each workspace. A.19.2 defines the discovery work needed to validate these hypotheses.

### A.2.4 Logical entities

| Entity | Meaning and minimum data |
| --- | --- |
| Workspace | Tenant boundary for members, projects, policies, and authorized data. |
| Member | Verified identity, workspace/project role, active state, confirmed skill tags, working schedule, and declared capacity. |
| Project | Objective, deliverables, exclusions, membership, timezone, target date, and automation policy. |
| Source version | Uploaded or entered evidence with source ID, version, content hash, extraction status, and section/span locators. |
| Requirement | An interpreted in-scope need linked to a source span or explicit PM addition. |
| Assumption or question | Unconfirmed interpretation with impact, confirmation state, and whether it blocks activation. |
| Plan version | Immutable saved planning snapshot with source versions, base revision, model metadata, validation report, and approval state. |
| Board and workflow list | Persistent view of the project's tasks, organized by approved workflow states. |
| Task | Work unit with ID, requirement links, description, criteria, effort range, skill needs, owner, state, dates, and field locks. |
| Dependency | Directed predecessor/successor relationship; the graph must be acyclic. |
| Capacity reservation | Approved task effort booked against a member's available working interval. |
| Change proposal | Versioned additions, edits, or archives with impact, approval, and expected base revision. |
| Policy and operation | Allowed action rules and a specific idempotent execution with actor, revision, status, and audit reference. |
| Notification and audit event | User-facing update and durable record of the triggering event and before/after values. |
| Connector mapping | Later-scope association between local IDs, provider connection, external IDs, and export state. |

### A.2.5 Research reference register

Sources S1–S17 are retained from the supplied PRD with a review date of 18 October 2026. S18 supports the database transaction requirement for the subsequently supplied MongoDB Atlas setup. They support the cited capabilities and research claims; they do not certify this document or its proposed implementation. Recheck changing provider capabilities and prices before implementation or budgeting.

| ID | Source | Supported evidence |
| --- | --- | --- |
| S1 | [GenAI adoption research](https://www.pmi.org/about/press-media/2024/genai-adoption-research) | Project Management Institute. Survey basis and self reported differences among existing GenAI users; published 9 July 2024. |
| S2 | [Create work items with Rovo](https://support.atlassian.com/jira-software-cloud/docs/create-work-items-with-rovo/) | Atlassian Support. Natural language work item generation, refinement, review, and creation. |
| S3 | [Trello MCP Server](https://github.com/atlassian/trello-mcp-server) | Atlassian official repository. Official hosted connection, supported board operations, and roadmap distinctions. |
| S4 | [Atlassian Rovo MCP overview](https://developer.atlassian.com/cloud/rovo-mcp/) | Atlassian Developer. Hosted MCP access to Atlassian applications and permission based operations. |
| S5 | [JSON Output](https://api-docs.deepseek.com/guides/json_mode/) | DeepSeek API Docs. JSON configuration, prompt instructions, and empty output caveat. |
| S6 | [Tool Calls](https://api-docs.deepseek.com/guides/tool_calls/) | DeepSeek API Docs. Function calling and beta strict schema behavior. |
| S7 | [Trello API introduction](https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/) | Atlassian Developer. Board, list, card, and webhook concepts. |
| S8 | [Trello Cards REST API](https://developer.atlassian.com/cloud/trello/rest/api-group-cards/) | Atlassian Developer. Card creation, membership, labels, checklists, and update endpoints. |
| S9 | [Trello webhooks](https://developer.atlassian.com/cloud/trello/guides/rest-api/webhooks/) | Atlassian Developer. Event callbacks and webhook verification guidance. |
| S10 | [Trello Inbox](https://support.atlassian.com/trello/docs/trello-inbox/) | Atlassian Support. Capture and AI summarization of messages into cards. |
| S11 | [Trello Planner](https://support.atlassian.com/trello/docs/trello-planner/) | Atlassian Support. Suggested focus time, review, and calendar based scheduling. |
| S12 | [Automation overview](https://support.atlassian.com/trello/docs/automation-overview/) | Atlassian Support. Configured rule and action based board automation. |
| S13 | [Architecture overview](https://modelcontextprotocol.io/docs/learn/architecture) | Model Context Protocol. Protocol architecture and communication between AI applications and servers. |
| S14 | [Your First API Call](https://api-docs.deepseek.com/quick_start/agent_integrations/) | DeepSeek API Docs. API endpoint, deepseek-flash alias, and serving model identity at review. |
| S15 | [Authorizing with the Trello REST API](https://developer.atlassian.com/cloud/trello/guides/rest-api/authorization/) | Atlassian Developer. Authorization methods, scopes, token secrecy, and revocation. |
| S16 | [Trello rate limits](https://developer.atlassian.com/cloud/trello/guides/rest-api/rate-limits/) | Atlassian Developer. Per key and per token request limits and 429 behavior. |
| S17 | [Models and Pricing](https://api-docs.deepseek.com/quick_start/pricing/) | DeepSeek API Docs. Flash pricing schedule and current serving details; recheck before budgeting. |
| S18 | [MongoDB Transactions](https://www.mongodb.com/docs/manual/core/transactions/) | MongoDB documentation. Atomic single-document operations and multi-document transactions; verify deployment and driver support for approved atomic writes. |

## A.3 Authentication and account creation

The application requires a verified identity before a user can access private workspace content. The proposed journey is Welcome → Sign in or Register → Account information → Workspace access → Create or join an authorized project. These labels are proposed information architecture, not supplied wireframe requirements.

- Authentication provider, email/password or code flow, social sign-in, invitation expiry, required profile fields, and session lifetime remain TBD under C03.
- Store a stable application member ID associated with the authentication identity. A displayed name is not an authorization identifier.
- Users can belong to projects only through authorized workspace membership. The UI must provide an actionable access-denied state.
- Workspace membership revocation must prevent later reads and writes, including queued jobs. Project permissions are rechecked on execution.
- Authentication configuration must include safe account recovery and sign-out behavior. Exact recovery flow follows the provider decision.

### Roles and permissions

| Role | Proposed permitted actions | Boundary |
| --- | --- | --- |
| Workspace administrator | Manage membership, workspace settings, approved policies, and administrative operations. | Administrative scope and project-content access must be confirmed in C12. No automatic membership bypass is implied. |
| Project manager | Manage authorized projects, inputs, roster, drafts, activation, commitments, policies, and changes. | Cannot grant workspace administration or access another tenant. |
| Team lead | Review feasibility, skills, estimates, and ownership. | Not a separate permission role in MVP unless C12 approves one; otherwise use explicitly granted PM or contributor rights. |
| Contributor | View authorized project work, update permitted tasks, report blockers, and challenge estimates/ownership. | Exact edit permissions require C12; cannot approve new project commitments by default. |
| Viewer | Read authorized project information. | Cannot edit tasks, activate plans, or change policies. |

The authoritative server-side requirement is FR10 in A.15. Security verification is NFR01 in A.18.

**CONFIRM WITH CLIENT — C03 and C12:** select sign-in methods, account fields, membership workflow, and the final role/action matrix.

## A.4 Project context and source data management

The PM supplies objective, deliverables, exclusions, team context, target date, timezone, and supporting material. The proposed input set is English narrative text, TXT, text-based PDF, and DOCX. Source capture is manual in MVP; no email, calendar, audio, or third-party document feed is required.

### FR01 Project context P0

The application shall store objective, deliverables, exclusions, target date, timezone, and source versions. Acceptance: required fields are validated, source text is previewable, and changing a source creates a new version rather than silently replacing the evidence used for an existing plan.

### FR02 Document ingestion P0

The application shall extract text from supported inputs, preserve document and section locators, and flag incomplete extraction. Acceptance: password protected, scanned only, corrupted, and oversized files produce actionable errors; no blank extraction is treated as a complete brief. A user can remove a file before generation.

### Input validation and provenance

The extraction service shall retain source ID, version, hash, extraction status, and document/section locators. It must distinguish an empty file from failed extraction and a scanned-only PDF from supported text content. Password-protected, corrupted, unsupported, and oversized files must produce an actionable error before a planning call is made.

The proposed operating envelope is 10 source files of at most 10 MB each and 50,000 extracted words per generation. The PM must be able to preview extracted content, remove a source before generation, and see warnings about missing text. Exceeding a limit must not silently truncate the project requirements. File access must remain tenant- and project-scoped.

Source replacement creates a new source version. Existing plan versions continue to identify the evidence they used. An activated project receives a change proposal when source revisions affect its plan; source edits do not directly mutate the active board.

**CONFIRM WITH CLIENT — C05 and C18:** approve file formats, size/word limits, supported language, processing terms, and source retention before finalizing ingestion.

## A.5 Project requirements and initial planning baseline

The initial planning baseline contains interpreted requirements, exclusions, assumptions, unresolved questions, source references, and the proposed task plan. Draft generation is automatic; the proposed activation boundary is PM review of a specific validated revision.

### FR03 Requirement interpretation P0

The planner shall produce uniquely identified requirements, exclusions, ambiguities, and assumptions. Acceptance: each requirement links to a source span or an explicit PM addition. Material contradictions block activation until the PM resolves them. Suggested scope beyond supplied requirements is labeled and excluded by default.

### FR06 Clarification and regeneration P0

The PM shall be able to answer questions, edit assumptions, and regenerate only the affected draft scope. Acceptance: unrelated edits and locked fields persist; a new version records its inputs and displays additions, removals, and changed fields. Cancellation leaves the previously saved draft intact.

### Clarification and activation rules

- Each requirement must link to a permitted source span or explicit PM addition.
- A requirement is accounted for by generated work, an explicit deferral, or a visible unresolved gap. Coverage is not established by generating a high task count.
- Contradictory scope or committed dates must identify the conflicting sources and the decision needed.
- Optional missing information may remain visibly uncertain. Material gaps affecting scope, eligibility, or committed schedule feasibility must be resolved before activation of the affected commitment.
- Newly suggested scope must be labeled and excluded unless the PM accepts it.
- Regeneration must display a difference and preserve unrelated edits and locked fields. Cancelling generation keeps the saved baseline intact.

The PM can create a draft without a complete roster. Such a draft contains unassigned or unscheduled work where eligibility, effort, or capacity is unknown. Those gaps must not be hidden behind invented names, precise dates, or unsupported estimates. The final policy for activating an operational board with such gaps is C08; the product must never represent unresolved work as fully allocated or committed.

**CONFIRM WITH CLIENT — C07–C09:** approve the required intake fields, the definition of a material blocker, treatment of incomplete plans, and the proposed PM activation step.

## A.6 Task composition and team management

A generated task must be understandable as work someone can perform and verify. The proposed task model includes title, description, requirement IDs, acceptance criteria, required skills, effort range, priority, owner, dependency IDs, forecast dates, committed dates where approved, and manual locks. Owner and dates may be unset when supporting information is incomplete.

### FR04 Task decomposition P0

The planner shall create actionable task titles, descriptions, acceptance criteria, required skills, effort ranges, priority, and requirement links. Acceptance: each in scope requirement maps to one or more tasks, an explicit deferral, or a visible unresolved gap. A card with no verifiable completion condition cannot enter Ready.

### FR05 Dependencies and completeness P0

The application shall validate references and reject dependency cycles, missing predecessors, duplicate task IDs, and self dependencies. Acceptance: validation identifies offending tasks and prevents activation of an invalid graph. Suggested duplicate tasks require merge or an explicit explanation for keeping both.

### FR07 Estimation honesty P0

Generated effort shall be a range in hours with an evidence label of PM supplied, template based, or model estimated. Acceptance: estimates remain distinguishable from commitments; insufficient evidence permits unknown effort. Unknown effort prevents automatic capacity scheduling until reviewed, but does not prevent a draft task from existing.

### Roster and task rules

- Use only verified active members authorized for the project. Resolve names to stable member IDs.
- The PM confirms skills, role, weekly available hours, working days, planned absence, and existing project commitments.
- A task cannot be Ready without verifiable completion criteria. In Progress requires an authorized owner. Done requires user confirmation and satisfied or explicitly waived completion criteria.
- A dependency cannot point to an absent task, itself, or form a cycle. Suspected duplicate work must be merged or retained with a recorded reason.
- Estimates are ranges in hours with the basis labeled PM supplied, template based, or model estimated. Unknown estimates are permitted in a draft and cannot be scheduled automatically.
- The proposed release limit is 20 active contributors and 100 generated tasks per project. Handling growth beyond those limits requires a product decision rather than silent task omission.

**CONFIRM WITH CLIENT — C04, C06, C08, and C13:** approve the team/project limits, skill vocabulary, estimate review rules, and completion/override authority.

## A.7 Project lifecycle phases and timeline

The proposed project lifecycle separates planning state from task workflow state. A project being in Review is not the same as a task being in the Review list.

| Sequence | Project stage | Required behavior |
| --- | --- | --- |
| 1 | Intake | Capture project context, roster, sources, and constraints. |
| 2 | Parsing | Extract and validate supported source text with progress and errors. |
| 3 | Draft generation | Interpret requirements, generate tasks, and preserve a saved draft. |
| 4 | Validation and scheduling | Check structure, access, coverage, dependencies, capacity, and dates. |
| 5 | PM review | Display assumptions, unresolved gaps, ownership, feasibility, and the version to approve. |
| 6 | Activation | Atomically publish the approved native board and apply its approved initial assignments. |
| 7 | Active operation | Permit authorized task updates and policy-bounded automation. |
| 8 | Change review | Compare a proposed revision against the active base; approve, reject, or revise. |
| 9 | Pause or archive | Pause automation immediately; project archiving and restoration behavior depend on C13. |

Default board lists are proposed as Backlog, Ready, In Progress, Review, and Done. Blocked is a visible condition rather than an additional default list. Custom states and additional lists are outside the defined MVP unless C13 approves them.

### FR08 Native board creation P0

Activation shall create exactly one board from the approved plan version, including lists, tasks, checklists, labels, dependencies, and eligible assignments. Acceptance: a repeated activation request with the same idempotency key returns the original result. A database transaction makes the native activation complete or leaves the board unpublished.

### FR09 Task editing and workflow P0

Authorized users shall create, edit, move, archive, and restore tasks. Acceptance: changing a card updates its persisted state and activity history. A blocked card cannot move to Ready until its prerequisite is complete or a PM records an override. In Progress requires an owner; Done requires completion confirmation and satisfied or explicitly waived criteria.

### FR12 Review and activation P0

The PM shall review a coverage summary, unresolved gaps, assignments, schedule conflicts, and assumptions before activating a version. Acceptance: activation is blocked for invalid schemas, unauthorized owners, cyclic dependencies, unresolved material scope conflicts, or impossible approved deadlines. Nonblocking uncertainties remain visible and explicitly acknowledged.

### Transition safeguards

The same activation key and revision must not create duplicate boards. Native activation uses a database transaction and publishes only after validation succeeds. Routine automation may move a task from Backlog to Ready when its prerequisites are complete, readiness conditions are met, and no lock prevents the move. It cannot infer completion from elapsed time or silence. Authorized overrides must record the actor, reason, and affected constraint; access control cannot be overridden through this mechanism.

**CONFIRM WITH CLIENT — C09, C10, and C13:** approve lifecycle states, workflow transitions, activation authority, override rights, and pause/archive behavior.

## A.8 Assignment eligibility capacity and conditions

### FR15 Eligible owner selection P0

Automatic assignment shall only use active project members with the required role, verified skill tags, and available capacity. A hard eligibility filter runs before ranking. The PM may set a preferred owner, but preference cannot bypass workspace access rules. If no eligible person exists, leave the task unassigned and show the missing skill or capacity constraint.

### FR16 Capacity accounting P0

Available project hours equal declared work hours minus declared leave and existing project commitments within the planning interval. Reserve the upper bound of each approved effort range. Acceptance: allocations never exceed known available hours; the ledger includes all active projects in the same workspace when capacity is shared. External workload remains explicitly unknown unless declared by the PM.

### Proposed ranking policy

Hard eligibility is evaluated before ranking: active authorized project membership, required role, required verified skills, and enough known available capacity for the intended interval. Preference cannot bypass those constraints. If nobody is eligible, leave the task unassigned and show the constraint.

> **ASSIGNMENT SCORE = 0.50 × SKILL_FIT + 0.30 × REMAINING_CAPACITY_RATIO + 0.20 × CONTINUITY**

| Component | Proposed meaning | Status |
| --- | --- | --- |
| SKILL_FIT | Normalized match against approved task skill needs after mandatory requirements pass. | Exact normalization and optional-skill handling require C06. |
| REMAINING_CAPACITY_RATIO | Normalized remaining available hours in the approved planning interval. | Denominator, interval, and reservations policy require C06. A zero-capacity interval is ineligible rather than a division by zero. |
| CONTINUITY | Normalized preference for related approved work already assigned to the member. | Relationship definition and cold-start behavior require C06. |
| Tie breaker | Lower projected utilization, then stable member ID. | Proposed deterministic fallback; confirm in C06. |

> **AVAILABLE HOURS = DECLARED WORK HOURS − DECLARED LEAVE − EXISTING RESERVED PROJECT HOURS**

Use common time units and nonoverlapping working intervals. Reserve the upper bound of each approved task effort range. Shared workspace commitments must not be counted twice. External workload is explicitly unknown unless declared. Reserve or release capacity atomically with assignment changes so concurrent projects cannot consume the same available hours.

Each automatic allocation records eligibility checks, score components, capacity snapshot, and policy version. The UI shows a concise reason. Initial assignments apply on activation; active-task reassignment requires PM approval. Do not infer competence from demographic attributes or chat activity.

**CONFIRM WITH CLIENT — C06:** the weights and component definitions are recommendations, not a previously approved allocation algorithm. Approve them and capacity data ownership before finalizing automatic ranking.

## A.9 Detailed scheduling mechanics

### FR17 Scheduling P0

Construct a topological task order and place work into each owner’s available working hours. Respect predecessor completion, the project timezone, nonworking days, locked dates, and milestones. Acceptance: one person is not scheduled for overlapping work beyond their available hours, successors do not start early, and computed finish dates remain distinguishable from committed deadlines.

### FR18 Feasibility and uncertainty P0

If the target date cannot be achieved with known capacity, show the earliest feasible finish and the constraints causing the gap. Offer reduction of scope, additional capacity, or deadline review. Do not compress estimates to make the result appear feasible. Missing capacity or effort yields an unscheduled task and an incomplete forecast. Activation of committed schedules requires those gaps to be resolved or tasks explicitly deferred.

### Scheduling procedure and safeguards

1. Validate the dependency graph and identify tasks with approved effort, eligible owners, and scheduling inputs.
2. Read the current capacity ledger, work calendars, leave, project timezone, milestones, locked dates, and approved commitments.
3. Process ready work in a deterministic topological order. The priority ordering among equally ready tasks and whether tasks may be split across intervals require C07.
4. Allocate approved effort within available working intervals without overbooking the owner or starting a successor before its predecessor's required completion.
5. Recheck concurrent reservations before commit. If the capacity snapshot changed, recalculate or report a conflict rather than overbook.
6. Compare computed finish dates with approved deadlines. Show the earliest feasible finish under the approved scheduling policy and identify blocking constraints; do not claim a globally optimal schedule.

Forecast dates are computed predictions; committed dates are PM-approved obligations. Preserve both concepts separately. Date-only deadlines need a defined local cutoff before conversion to UTC. C07 must settle this before dates can be treated as precise scheduling constraints.

Missing effort or capacity creates an unscheduled task and an incomplete forecast. An infeasible target must lead to scope reduction, added capacity, deadline review, or explicit deferral. The scheduler must not shorten estimates or create fictional contributors to make a plan fit.

**CONFIRM WITH CLIENT — C07 and C08:** approve task splitting, workday/holiday handling, ordering rules, deadline cutoffs, and incomplete-plan treatment.

## A.10 AI planning and model configuration

The required planning model is DeepSeek V4.1 Flash. The supplied research identifies the API alias `deepseek-flash`, serving version `DeepSeek-V4.1-Flash-1017`, and endpoint `https://api.deepseek.com` at the 18 October 2026 review [S14]. Treat those as dated provider details and verify them in the implementation spike. Do not silently substitute another model.

Keep endpoint, model alias, reasoning settings, timeout, context budget, and output budget configurable. Record available serving metadata plus prompt, schema, validator, and policy versions per run. Exact runtime budgets require C16. A moving alias requires regression evaluation after a serving change.

### Proposed planning pipeline

1. Normalize authorized source text and preserve versioned evidence locators.
2. Extract requirements, exclusions, contradictions, assumptions, and questions.
3. Generate task proposals using the approved schema and team vocabulary.
4. Validate proposed IDs, source references, fields, coverage, duplicates, dependencies, and authorization in code.
5. Return specific errors for bounded model repair; after exhaustion, preserve the draft and offer correction.
6. Calculate ownership and schedules through the approved deterministic services, then show the reviewable plan and its exceptions.

### FR23 Structured generation P0

Use JSON output with an explicit JSON instruction and example. Treat the response as untrusted input. DeepSeek notes that empty content can occur and output can be truncated; parse and schema checks must reject incomplete output. [S5] Allow at most two model repair attempts, each with specific validation errors. Thereafter preserve the draft and offer manual correction or retry.

### FR24 Model execution boundary P0

The model shall propose data, never execute database mutations or hold connector credentials. Function calling is available, but the MVP does not depend on unrestricted model tool access. Strict schema support for tool calls is documented as beta; application validation remains mandatory. [S6] Store concise user facing rationales and evidence, without requiring hidden chain of thought.

### Data minimization and model limits

The model gateway sends only the context needed for the planning step. It never sends connector credentials or unrelated tenant data. Documents and task text are untrusted data, including embedded instructions claiming authority. Valid JSON is not sufficient evidence of a valid plan. Empty, truncated, malformed, or semantically invalid output cannot activate a board. Store concise decision explanations and supporting evidence; no hidden chain-of-thought disclosure is required.

Tool calling is a documented provider capability [S6], but the MVP does not require unrestricted model tools. The backend remains responsible for every write and permission decision. Provider outage or budget exhaustion leaves existing board operations available.

**CONFIRM WITH CLIENT — C16 and C18:** verify model access, settings, runtime/spend ceilings, provider data processing terms, and any permitted fallback policy.

## A.11 Validation quality and performance thresholds

### A.11.1 Plan validity and validation ownership

| Check | Responsible component | Required result |
| --- | --- | --- |
| JSON/schema | Plan service | Reject missing fields, invalid types, ranges, enums, and unknown fields according to the approved schema. |
| Identity and access | Authorization layer | Reject unauthorized projects, source versions, owners, and cross-tenant IDs. |
| Requirement coverage | Validator and PM review | Link in-scope requirements to tasks, explicit deferrals, or visible gaps; do not invent evidence. |
| Dependency and duplication | Graph validator | Reject cycles, self-references, and missing predecessors; review suspected duplicates. |
| Capacity and dates | Scheduler | No known overbooking, invalid dependency timing, or unsupported committed dates. |
| Policy and concurrency | Execution service | Require current authority, allowed action, expected revision, and idempotent command. |

Return a machine-readable error code, affected IDs, and an actionable explanation. A model rationale cannot override access, validity, or feasibility checks.

### A.11.2 Evaluation corpus and release gates

The proposed corpus is 60 permissioned or explicitly fictional briefs: 40 development cases and 20 held-out cases. Include sparse and contradictory briefs, exclusions, duplicate tasks, missing members, low capacity, timezone boundaries, malicious instructions, truncated output, and concurrent edits. Do not tune prompts against the held-out set. Two reviewers, including an experienced PM, assess plan usefulness against a written rubric and resolve disagreements.

| Gate | Proposed threshold | Verification |
| --- | --- | --- |
| Hard validity | 100% of activated plans pass schema, membership, graph, and policy checks. | Automated positive and negative cases; invalid plans fail closed. |
| Requirement coverage | At least 90% aggregate reference coverage, with no critical requirement silently omitted. | Held-out requirement comparison; explicit gaps are visible but do not count as correctly implemented coverage. |
| Task quality | At least 80% of proposed tasks accepted without substantive correction. | PM review against the brief, exclusions, and completion criteria. |
| Owner suitability | At least 80% of eligible owner suggestions accepted without substantive change. | Review eligibility and suitability; report unassigned work separately. |
| Scope integrity | Zero critical fabricated commitments or silently included excluded scope. | Contradiction and adversarial cases. |
| Operational integrity | No duplicate board/task on retry and no silent loss of manual edits. | Fault injection, stale revision, concurrent edit, and recovery tests. |
| Security | Zero unresolved critical or high-severity access/credential defects. | Tenant isolation, revocation, prompt injection, and secret-logging tests. |

Coverage equals correctly represented reference requirements divided by all in-scope reference requirements. Ownership acceptance concerns the proposed allocation, not employee performance. Report sample size and results by case type, not only an overall average.

### A.11.3 Performance and regression rules

For 10,000 extracted words, 10 members, and 40 generated tasks, target a valid draft at p95 within 120 seconds excluding upload, with progress shown within 2 seconds. Native task reads/writes target p95 below 800 ms under 50 concurrent active users. These are proposed, unmeasured targets. The performance test must include retries/repair in user-visible elapsed time and identify deployment region and provider configuration.

Store evaluation results with the tested versions. Repeat evaluation after material model, prompt, schema, scheduler, or policy changes. Activation remains unavailable for invalid plans; Managed Automation remains disabled when its release gates fail. Manual board operation can remain available independently.

**CONFIRM WITH CLIENT — C17:** approve the workload, test conditions, severity rubric, review rubric, and quality/performance gates before release sign-off.

### A.11.4 Illustrative end-to-end validation case

This is a fictional test case, not an observed customer outcome. A PM requests a support portal with sign-in, ticket creation/status, and an admin queue in four weeks. The roster contains a designer, frontend engineer, backend engineer, and QA contributor with declared weekly hours. The PM confirms the existing identity provider and excludes payments and live chat.

| Proposed work | Required owner fit | Example dependency or completion criterion |
| --- | --- | --- |
| Define portal journeys and states | Designer | Reviewed screens include empty, loading, error, and permission-denied states. |
| Integrate identity provider | Backend engineer | Use the confirmed provider; unauthorized requests fail; secrets stay server-side. |
| Create ticket and status APIs | Backend engineer | Depends on authentication; users access only authorized tickets. |
| Build ticket screens | Frontend engineer | Depends on reviewed design and agreed API contract; validation errors are visible. |
| Build admin queue | Frontend engineer | Role checks restrict access and workflow transitions follow approved rules. |
| Verify release criteria | QA contributor | Depends on integration; access-control and end-to-end ticket tests pass. |

If backend work needs 28 hours in a week with only 20 available, allocate work to later eligible intervals or report infeasibility. Do not overbook or invent another engineer. After activation, completion of a prerequisite may make a dependent task Ready under the approved automation policy. A subsequent request for email notifications must produce a reviewed scope/schedule change and preserve completed work. Passing this test demonstrates planning controls; it does not guarantee delivery within four weeks.

## A.12 Change requests and controlled automation

### FR19 Automation policy P0

A PM shall choose Review Only or Managed Automation for each active project. Review Only produces proposals. Managed Automation permits the bounded actions below. Acceptance: the policy is recorded with actor and effective time, can be paused immediately, and is checked again when an operation executes. Changing the policy does not authorize already rejected proposals.

| **Action**                       | **Managed Automation behavior**                                                                       |
|----------------------------------|-------------------------------------------------------------------------------------------------------|
| Draft initial work and ownership | Generate automatically; apply the reviewed version at activation.                                     |
| Predecessor completes            | Move an eligible Backlog task to Ready when its criteria are complete and no manual lock prevents it. |
| Deadline risk or stale task      | Create an in app alert or digest entry with evidence; do not invent progress.                         |
| New brief or scope revision      | Generate a versioned change proposal and impact analysis; obtain PM approval before applying.         |
| New owner or committed due date  | Propose change and explain impact; require PM approval.                                               |
| Completion or destructive change | Require explicit user confirmation; never infer Done from elapsed time or silence.                    |

### FR20 Impact analysis P0

A change proposal shall show additions, edits, archives, affected owners, predecessor changes, and schedule implications. Acceptance: completed tasks remain intact; active and manually edited fields are preserved unless explicitly included in approval. No proposal can apply to a newer plan version without revalidation and a refreshed difference.

### Proposed action-permission matrix

“Automatic” below means permitted only after an authorized user selects the project policy and all validation, lock, membership, and version checks pass.

| Action | Review Only | Managed Automation |
| --- | --- | --- |
| Generate a draft and proposed ownership | Generate automatically; no active-state write. | Same. |
| Activate the first validated board | PM approves a specific revision. | Same; policy selection does not bypass activation review. |
| Move Backlog to Ready after prerequisite completion | Propose the change. | Apply automatically when readiness criteria and locks permit. |
| Identify deadline risk or stale work | Show evidence-based proposal or alert. | Create an in-app alert/digest without altering commitments. |
| Add scope or revise an activated source plan | PM reviews the displayed impact and revision. | Same. |
| Reassign active work or change committed dates | PM approval required. | Same. |
| Mark work Done or waive completion criteria | Explicit authorized user confirmation. | Same; never infer completion from silence. |
| Permanently delete a project or source history | No autonomous deletion. | No autonomous deletion. |

Proposals must show task additions, edits, archives, affected people, dependency changes, and schedule consequences. Preserve completed work and manual decisions. Approval applies only to the displayed revision; a newer base requires revalidation and a refreshed difference. Rejecting a proposal must not be reversed by a later retry.

**CONFIRM WITH CLIENT — C09, C10, and C13:** approve activation authority, the automation matrix, archive/waiver permissions, and the default policy for new projects.

## A.13 Interrupted jobs and partial external operations

### FR22 Events and retries P0

The event processor shall deduplicate events and use idempotent commands. Acceptance: duplicate delivery produces one logical action, out of order events trigger a current state check, and exhausted retries enter a visible failure queue. A failed automation leaves the board usable and manual editing available.

### Native failure and recovery behavior

- Persist job stage, input/source versions, operation ID, and typed failure. Reconnecting retrieves the current job rather than restarting blindly.
- Distinguish parsing, model, validation, scheduling, permission, and execution failures in the UI.
- Native activation is transactional. Failure must leave the approved unpublished draft or the original published board, never a partially activated native plan.
- Two model repair attempts are the proposed maximum. Transport retries require a separate bounded policy and may not bypass the project spend ceiling; C16 defines that policy.
- Deduplicate delivered events, check current state for out-of-order events, and expose exhausted retries through an administrator-visible failure queue.
- Cancellation leaves the saved draft and existing board usable. Late results from cancelled or superseded jobs cannot apply automatically.

### Optional Trello export and later synchronization

Trello export is later scope, separate from the two native MVP milestones unless C20 approves it. Trello documents APIs for boards/cards and related operations [S7, S8]. Map project to board, status to list, task to card, criteria to checklist, verified owner to card member, and priority/date to label/due field. Preserve dependency and provenance links without claiming native Trello dependency enforcement.

Use a user-selected authorized workspace and verified member mappings; do not match owners by display name alone. Default to private board visibility where permitted. Store credentials server-side and apply a board allowlist. Confirm the registered app's supported authorization flow and endpoint coverage; the retained documentation describes token access, OAuth 1.0, and OAuth 2.0 guidance [S15].

External export is not a single transaction. Persist each created object's mapping, reconcile uncertain timeout outcomes before retrying, show partial completion, and resume from known state. Cleanup can archive only objects created by that export after user review. The retained rate limits are 300 requests per 10 seconds per API key and 100 per 10 seconds per token, with additional member endpoint limits; honor current responses, throttle, and back off on 429 [S16].

If later synchronization is approved, use verified webhooks and handle delayed/duplicate events [S9]. Define field ownership, conflicts, loop suppression, revocation, and deletion semantics first. Jira support and bidirectional sync remain excluded from the native MVP.

**CONFIRM WITH CLIENT — C16 and C20:** approve bounded retry budgets and any external adapter scope before implementation.

## A.14 Locks history reporting and recovery

### FR11 Manual decisions and field locks P0

A PM shall lock task scope, owner, estimate, or date individually. Acceptance: automatic planning never changes locked values. When a locked field makes a plan infeasible, the product reports the conflict and proposes options. Unlocking is a visible user action recorded in history.

### FR21 Audit and recovery P0

Every write shall record tenant, project, task, actor type, triggering event, previous and new values, rationale, approval reference, and timestamps. Acceptance: authorized PMs can inspect change history and undo eligible field changes through a new compensating operation. Undo cannot erase the history or overwrite later edits without conflict review.

### A.14.1 Field locks and manual authority

The PM can lock scope, owner, estimate, or dates independently. Automation preserves locked fields even when a new generated result disagrees. Show infeasibility and options instead of silently unlocking. Unlocking is an explicit recorded action. Contributors can report conflicts; their ability to unlock or override follows the final C12/C13 permission matrix.

### A.14.2 Activity and project reporting

The MVP supplies task filters, assignment views, evidence-based blocker/deadline alerts, in-app notifications, and a project activity history. It does not rank worker productivity or predict progress from silence. Summaries must distinguish recorded state, forecast dates, committed dates, and uncertainty. Exact report fields, stale thresholds, and digest cadence are C14.

### A.14.3 Historical snapshots and correction

Plan/source versions, approved assumptions, ownership decisions, effort reservations, policy versions, and approved changes must remain traceable. Correcting current information creates a new operation; it does not erase historical approvals. Replanning against revised capacity or a corrected source is a proposal where the proposed change affects active commitments. Historic records show the information known at the time.

### A.14.4 Undo and retention boundaries

Undo uses a compensating operation and fresh authorization/version checks. It cannot silently overwrite later edits. Audit visibility and retained history must follow the approved data policy: traceability does not imply indefinite retention of deleted sensitive content. C18 defines deletion, anonymization, backup expiry, and any required audit metadata retention. Exported copies in an external platform require a separate policy under C20.

**CONFIRM WITH CLIENT — C13, C14, and C18:** approve reversal rights, report definitions, and the relationship between version history and content deletion.

## A.15 Administration panel requirements

### FR10 Team membership and roles P0

Workspace administrators manage members; PMs manage their projects; contributors update permitted tasks; viewers read authorized project information. Acceptance: all authorization checks run on the server. Cross workspace IDs are rejected even when valid identifiers are supplied. Project membership does not grant workspace administration privileges.

| Area | Required proposed administrator capabilities | Safeguard |
| --- | --- | --- |
| Membership | View active members, manage authorized roles, revoke access, and review project access. | Record actor and scope; no cross-tenant privileges. |
| Project operations | Review job status, validation failures, stuck jobs, and approved recovery actions. | No direct bypass of activation or project locks. |
| AI configuration | Manage approved model/prompt/schema versions and runtime budgets. | Evaluate changes before rollout; secrets remain outside model context and ordinary logs. |
| Automation | View effective policies, pause automation, inspect operations, and handle failed queues. | Recheck policy and user authority at execution time. |
| Capacity and skills | Maintain or review authorized roster data and correction history. | Data ownership and editable fields follow C06/C12. |
| Audit and data controls | Review permitted history, implement approved retention/deletion, and verify redacted logs. | Respect content access and retention policy. |
| External connections later | Revoke credentials, inspect mappings, and resume reviewed export failures. | Available only when the connector is in scope. |

An administrator must be able to investigate and recover supported operations through the application without editing database rows manually. Recovery must record the original failure and any new operation. Sensitive content access is not automatically granted by an operations role; C12 must define it.

**CONFIRM WITH CLIENT — C12 and C18:** approve administrative visibility, correction authority, and data governance responsibilities.

## A.16 Proposed screens and information architecture

No AI Project Board wireframe was supplied. The following screen inventory is a proposed counterpart to the reference's wireframe-derived inventory. Labels, fields, and interactions require C15; they are not falsely attributed to an existing design.

| Area | Proposed screens and required information |
| --- | --- |
| Onboarding | Welcome; Sign in/Register; Account information; Workspace selection/access. |
| Primary navigation | Projects; My Tasks; Notifications; Workspace Settings; Administration where authorized. |
| Project creation | Objective, deliverables, exclusions, target date, timezone, source files/text, and roster. |
| Source review | Source version, extraction preview, provenance locators, warnings, removal, and replacement. |
| Team setup | Verified member selection, skills, role, available hours, working days, absence, and commitments. |
| Planning progress | Parsing, planning, validation, scheduling, completion, typed error, cancellation, and retry. |
| Draft review | Requirement coverage, task preview, assumptions, questions, owners, feasibility, and activation summary. |
| Native board | Backlog, Ready, In Progress, Review, Done; filters and visible blockers. |
| Task details | Description, criteria/checklist, source links, dependencies, effort basis, owner rationale, dates, locks, and history. |
| My Tasks | Authorized assigned work with status, due/forecast dates, priority, and blocker filters. |
| Change review | Added/changed/archived work, affected owners, schedule impact, base revision, approve/reject/revise actions. |
| Activity and notifications | Manual/AI actor, before/after values, evidence links, policy, pending decisions, and digest controls. |
| Project settings | Membership, schedule inputs, policy, pause control, permitted locks, and export. |
| Administration | Member management, failed jobs, recovery, approved AI settings, audit, and data controls. |
| Connector later | Connection selection, member mapping, export preview, progress, partial failures, and resume. |

### FR13 Personal work and notifications P0

Contributors shall filter by owner, priority, status, due date, and blocker state. The product shall provide in app assignment and change notifications with links to affected tasks. Acceptance: repeated events do not create duplicate notifications; preferences support a digest and muted routine events without hiding review requests.

### FR14 Portable export P0

PMs shall export an authorized project as JSON and CSV. Acceptance: JSON retains task IDs, dependencies, sources, assignments, and policy version; CSV uses stable identifiers and documented columns. Exports contain no credentials or content outside the selected project. JSON export is the canonical portable representation; CSV is a flattened view.

### Screen states and exports

Every primary screen must define empty, loading, success, invalid input, insufficient permission, stale version, and recoverable failure states where applicable. Keyboard and mobile interactions must have an equivalent to drag-and-drop board movement. Notification events are deduplicated; routine preferences cannot hide pending PM review requests.

JSON is the canonical portable plan export and retains IDs, dependencies, provenance, assignments, and policy version. CSV is a flattened representation with stable IDs and documented columns, not a claim of lossless reimport. Both export only authorized project content and exclude credentials. Exact CSV fields, date display, and profile fields require C15.

**CONFIRM WITH CLIENT — C14 and C15:** approve screen inventory, user-facing labels, table/export columns, notification behavior, and responsive layouts.

## A.17 Planning engine service contracts and historical data

### Engine responsibilities

A dedicated planning workflow coordinates extraction, requirement interpretation, decomposition, validation, eligible-owner ranking, capacity scheduling, change analysis, activation, and policy-authorized updates. The model proposes; application services authorize and execute. Each stage records its inputs, outputs, status, and relevant version identifiers.

The proposed architecture is web application → authenticated backend → durable planning jobs. MongoDB Atlas holds application state; tenant-scoped object storage holds source files. A model gateway calls DeepSeek, validators inspect the result, a scheduler assigns available intervals, and an execution service writes approved changes. A transactional outbox dispatches notifications and future connector work. No additional external integration is required for the native flow.

### Plan payload invariants

`PlanDraft` contains `schema_version`, `project_id`, `source_versions`, `requirements`, `assumptions`, `tasks`, and `unresolved_questions`. Task IDs are stable internal identifiers; `owner_id` and dates can be unset. Resolve all source/member references against authorized data. Validate field types, bounds, enums, and allowed keys in application code, using `additionalProperties: false` where the schema path supports it.

### Proposed service API

| Method and path | Purpose | Required control |
| --- | --- | --- |
| `POST /projects` | Create a project. | Verified actor, workspace permission, idempotency key; no prior project revision exists. |
| `POST /projects/{id}/sources` | Register a source version. | Project permission, source validation, idempotency, expected revision. |
| `POST /projects/{id}/plan-jobs` | Queue generation; return `202` and job ID. | Authorized source snapshot, limits, budget, idempotency, expected revision. |
| `GET /plan-jobs/{id}` | Read durable progress or typed failure. | Current permission for the owning project. |
| `GET /projects/{id}/plans/{revision}` | Retrieve an authorized draft/snapshot. | Project and source-visibility checks. |
| `POST /projects/{id}/activate` | Publish the reviewed valid revision. | PM authority, validation, expected revision, idempotency, transaction. |
| `POST /projects/{id}/changes/{changeId}/apply` | Apply the reviewed change. | Approval, current policy/access, expected revision, locks, idempotency. |
| `PATCH /tasks/{id}` | Edit an authorized task. | Field/action permission, constraints, expected revision, audit, idempotency. |

These paths define a proposed contract, not an implemented public API. Exact request/error schemas require C16. All existing-resource writes require `Idempotency-Key` and an expected applicable revision. Creation uses idempotency without requiring a nonexistent resource revision. A repeated key and identical payload returns the saved result; reuse with a different payload returns a conflict. A stale revision returns `409` with no applied mutation.

Store native mutations, capacity reservation changes, audit events, and outbox records atomically where they describe one operation. With MongoDB, use a bounded document model for single-document atomic updates or supported multi-document transactions where one operation spans records [S18]. Pre-create the required collections/indexes and test transaction rollback, write conflicts, idempotency, and reservation contention in the actual Atlas deployment. A connection string alone does not establish these guarantees. Recheck current authorization before a queued write. Historical views retain the source/plan/model/policy context needed to explain the decision, subject to A.14 retention rules.

**CONFIRM WITH CLIENT — C02, C16, and C18:** approve infrastructure, API/schema budgets, and retained metadata before final engineering sign-off.

## A.18 Responsive application security and reliability requirements

The proposed native product is a responsive web application for desktop and mobile. A native mobile application is excluded. A mobile user must be able to create/review a project, inspect and update permitted work, view issues, and approve authorized changes without relying on hover or drag-only controls. Exact supported browsers, devices, and minimum viewport sizes require C19.

### NFR01 Authorization and tenant isolation

Enforce tenant and project membership for every read, write, source retrieval, and queued job. A job captures its actor and rechecks access before execution. Acceptance: isolation tests cover direct object requests, exports, search, job results, and signed file access. Revoking access prevents subsequent automated writes.

### NFR02 Model data and prompt injection

Send only project information needed for the current step. Treat documents and retrieved task text as data, even when they contain instructions to bypass policy, reveal secrets, or access another project. Keep prompts, policy checks, and executable commands separate. The model has no direct network or database access. Maintain adversarial tests for embedded instructions and fabricated member IDs.

### NFR03 Credentials and retention

Store secrets in managed secret storage and encrypt transport and stored project data. Exclude raw source text, tokens, and credentials from operational logs. Proposed defaults: delete temporary extraction artifacts within 24 hours, remove deleted project content from active storage within 30 days, and expire backup copies within 90 days. Retention periods and provider data processing terms require security review before pilot onboarding; these are product policies, not claims of regulatory compliance.

### NFR04 Availability and recovery

Proposed post pilot availability objective is 99.5% per calendar month for authenticated native board operations. Set an initial recovery point objective of 24 hours and recovery time objective of 8 hours, verified by a restore exercise before general availability. Model outages must leave existing boards readable and editable. Preserve jobs and inputs for resumption without duplicating activation.

### NFR05 Performance and cost controls

For the reference workload of 10,000 extracted words, 10 members, and 40 tasks, target first valid draft p95 within 120 seconds excluding upload time; show progress within 2 seconds. Native task reads and writes target p95 below 800 ms under 50 concurrent active users. Test in the intended deployment region. Use bounded concurrency, input limits, token budgets, timeouts, and a per project spend ceiling. These are unmeasured engineering targets.

### NFR06 Accessibility and observability

Support keyboard board navigation, clear focus states, labeled form fields, and status indicators that do not rely on color alone; target WCAG 2.2 AA and verify during design QA. Track extraction, inference, validation, scheduling, and execution separately. Alerts cover elevated validation failures, stuck jobs, retry exhaustion, queue age, and unexpected token spend. Logs use correlation IDs and redacted structured metadata.

### Additional operational acceptance

Verify keyboard navigation, focus order, labeled inputs, contrast, and screen-reader treatment of board state; selecting an accessibility target is not proof of conformance. Test restore procedures against the approved recovery objectives. Existing boards must remain readable/editable during model failure, and unavailable AI stages must show a clear state. Operational alerts cover elevated validation errors, queue age, stuck jobs, retry exhaustion, and unexpected spend.

The proposed retention defaults remain 24 hours for temporary extraction artifacts, 30 days for deletion from active content storage, and 90 days for backup expiry. Plan/audit deletion or anonymization must be defined together under C18. These are proposed policies, not legal conclusions or certification claims.

**CONFIRM WITH CLIENT — C17–C19:** approve service levels, workload, recovery objectives, retention/provider terms, hosting region, and supported device/browser matrix.

## A.19 Required delivery validation and quotation items

### A.19.1 Delivery areas and requirement traceability

Deliver the responsive web application, administrative interface, database/schema migrations, authentication and role checks, source ingestion, native board, AI planning pipeline, capacity/scheduling services, change controls, audit/recovery, exports, test evidence, deployment configuration, and operational documentation. Provide separate estimates for optional maintenance/support and any later connector.

| Requirement | Technical location | Delivery milestone |
| --- | --- | --- |
| FR01 Project context | A.4 | 1 |
| FR02 Document ingestion | A.4 | 1 |
| FR03 Requirement interpretation | A.5 | 1 |
| FR04 Task decomposition | A.6 | 1 |
| FR05 Dependencies and completeness | A.6 | 1 |
| FR06 Clarification and regeneration | A.5 | 1 |
| FR07 Estimation honesty | A.6 | 1 |
| FR08 Native board creation | A.7 | 1 |
| FR09 Task editing and workflow | A.7 | 1 |
| FR10 Team membership and roles | A.15 | 1 |
| FR11 Manual decisions and field locks | A.14 | 1 |
| FR12 Review and activation | A.7 | 1 |
| FR13 Personal work and notifications | A.16 | 1 for filters and initial assignment notifications; 2 for policy-driven updates/digests |
| FR14 Portable export | A.16 | 1 |
| FR15 Eligible owner selection | A.8 | 1 |
| FR16 Capacity accounting | A.8 | 1 |
| FR17 Scheduling | A.9 | 1 |
| FR18 Feasibility and uncertainty | A.9 | 1 |
| FR19 Automation policy | A.12 | 2; Milestone 1 uses Review Only |
| FR20 Impact analysis | A.12 | 2 for active-project changes; Milestone 1 includes draft differences |
| FR21 Audit and recovery | A.14 | 1 for audit/concurrency foundation; 2 for reviewed undo and operational recovery |
| FR22 Events and retries | A.13 | 1 for generation/activation integrity; 2 for automation event handling |
| FR23 Structured generation | A.10 | 1 |
| FR24 Model execution boundary | A.10 | 1 |
| NFR01–NFR03 | A.18 | 1 for secure pilot access; 2 for final operational verification |
| NFR04–NFR06 | A.18 | 1 for usable responsive/manual operation; 2 for production service levels and final verification |

### A.19.2 Discovery and evidence required

Conduct 8–12 discovery interviews and observe at least six board-setup sessions. Ask PMs to show a recent brief, describe decomposition and ownership disputes, demonstrate any existing AI/MCP workflow, and identify decisions they would refuse to delegate. Record actual task counts, active versus elapsed effort, corrections, missing inputs, and approval constraints with permission. Do not present assumed savings as a fact.

Test a prototype on a participant-selected brief and compare with the participant's current workflow. Maintain an anonymized finding log separating observation, interpretation, and product decision. Validate native-board adoption, team capacity maintenance, assignment usefulness, model performance, provider acceptability, and willingness to pay. The supplied desk research is not a substitute for these activities.

### A.19.3 Pilot metrics and decision targets

The proposed pilot includes 8–12 PMs across 4–6 teams and at least 24 matched planning sessions. Alternate comparison order and match brief complexity where feasible. This is directional product discovery, not a statistically powered causal study. Measure active PM effort including review/correction; event timestamps alone do not distinguish active work from waiting.

| Metric | Definition | Proposed decision target |
| --- | --- | --- |
| PM effort | Active minutes from receipt of brief to accepted usable board; waiting measured separately. | At least 50% median reduction against the matched existing workflow. |
| Activation | Eligible started projects reaching approved activation within seven days. | At least 70%. |
| Correction burden | Distinct generated tasks needing substantive edit/removal/ownership correction divided by generated tasks. | At most 20%; count a task once for this ratio and report total edit actions separately. |
| Assignment acceptance | Eligible owner suggestions retained at activation divided by eligible suggestions. | At least 80%; show unassigned task count separately. |
| Repeat value | PMs using another project or approved revision within four weeks divided by PMs with that opportunity. | At least 60%. |
| Trust guardrail | Unauthorized writes, silent manual-edit loss, or unsupported committed deadlines. | Zero critical incidents. |
| Inference economics | Total provider spend, including failed runs, retries, and revisions, divided by activated boards. | Measure distribution; provisional reference-workload p95 ceiling USD 0.50 per activated board. |

If a metric has no eligible denominator, report not applicable rather than zero success or an invented percentage. Do not exclude failed generations from spend or correction analysis. Fast generation with heavy rework fails the value objective.

Instrument `project_created`, `source_parsed`, `generation_started`, `draft_ready`, `validation_failed`, `clarification_answered`, `draft_edited`, `assignment_changed`, `board_activated`, `change_approved`, `automation_applied`, and `automation_reverted`. Capture timestamps, correlation/run IDs, workload sizes, versions, billed usage, and error category without raw brief content. Combine these signals with timing diaries and reviewer judgments.

### A.19.4 Quotation timeline and inference economics

Request separate development estimates for application/UI, administration, database, authentication, ingestion, planning/validation, scheduling, automation/history, QA/security, deployment, and optional support. Provide assumptions, team allocation, hosting/infrastructure estimates, and third-party operating costs. Final development cost, hosting price, and commercial subscription price are not supplied and remain TBD under C21.

The inherited schedule is an illustrative 12-week sequence for a product lead, designer, two backend/full-stack engineers, frontend engineer, and shared QA/security. It is not a delivery commitment. The two milestones below organize this sequence: discovery/spikes in weeks 1–2; platform in weeks 3–5; planning/activation in weeks 6–8; ongoing automation/recovery in weeks 9–10; supervised pilot in weeks 11–12. Four-week repeat-use measurement may extend beyond week 12.

> **MODEL COST = (CACHE_HIT_INPUT_TOKENS × HIT_RATE + CACHE_MISS_INPUT_TOKENS × MISS_RATE + OUTPUT_TOKENS × OUTPUT_RATE) / 1,000,000**

The retained pricing research lists Flash peak rates of USD 0.006 per million cache-hit input tokens, USD 0.30 per million cache-miss input tokens, and USD 1.20 per million output tokens; off-peak rates are half [S17]. Recheck the provider schedule before budgeting. These prices are not a quote for hosting or the complete product.

Illustration: 40,000 uncached input tokens and 12,000 total billed output tokens cost `(40,000 × 0.30 + 12,000 × 1.20) / 1,000,000 = USD 0.0264` at those peak rates. A 2× allowance gives USD 0.0528. This is an assumed workload, not measured cost; output must include any billed reasoning tokens. Actual economics include revisions, failed runs, extraction, storage, hosting, monitoring, and support. The p95 cost target is a pilot acceptance hypothesis, not a hard runtime spend cap; C16 must set the actual ceiling and exhaustion behavior.

A workspace subscription with an included planning allowance is a commercial hypothesis only. Estimate customer benefit using customer-supplied PM hours/cost and measured review effort. Do not select a final price or claim savings before validating willingness to pay.

### A.19.5 Risk ownership and release decision

| Risk | Proposed mitigation | Accountable role |
| --- | --- | --- |
| Incomplete or invented plan | Provenance, coverage, exclusions, visible gaps, and PM review. | Product and AI engineering |
| Incorrect ownership or workload | Verified membership, hard capacity checks, explainable ranking, and review. | Engineering and team lead |
| Damage to active work | Version checks, locks, bounded policy, audit, and compensating operations. | Backend lead |
| Competitive overlap or weak native-board adoption | Compare against existing workflows before expanding board or connector scope. | Product and design |
| Provider change or outage | Configurable access, regression evaluation, bounded jobs/spend, and independent manual board operation. | AI engineering |
| Sensitive content exposure | Tenant isolation, minimal context, redaction, provider review, and revocation tests. | Security lead |

Product validates segment/native strategy; engineering validates model quality, capacity ledger, concurrency, and recovery; security approves processing/retention; product/design approve allocation and automation controls; the sponsor approves staffing and estimates. Broader release requires P0 acceptance, no critical trust incident, acceptable quality, and measured PM value. If users reject the native board or cannot maintain capacity data, reassess the product before adding integrations.

**CONFIRM WITH CLIENT — C17 and C21–C24:** approve acceptance criteria, delivery estimate, evidence ownership, pilot participants, and go/no-go authority.

## A.20 Constants and parameters summary

Unless explicitly marked confirmed, these values are inherited or refined proposals requiring the listed confirmation. They are not pilot results, measured SLAs, or fixed provider guarantees.

| Constant or rule | Value or behavior | Status and confirmation |
| --- | --- | --- |
| Required model family | DeepSeek V4.1 Flash | Confirmed project requirement. |
| API alias and serving version | `deepseek-flash`; `DeepSeek-V4.1-Flash-1017` at research review | Dated provider detail [S14]; verify in C16. |
| Project segment | 5–20 contributors; 2–12 week projects | Proposed; C04. |
| Active contributors per project | Maximum 20 | Proposed application limit; C04. |
| Generated tasks per project | Maximum 100 | Proposed application limit; C04. |
| Source inputs | English text, TXT, text-based PDF, DOCX | Proposed; C05. |
| File count and size | Up to 10 files; up to 10 MB per file | Proposed; C05. |
| Extracted input words | Maximum 50,000 per generation | Proposed; C05. |
| Default board states | Backlog, Ready, In Progress, Review, Done | Proposed; C13. |
| Effort unit and reservation | Hour range; reserve approved upper bound | Proposed; C06/C07. |
| Assignment weights | Skill 0.50; capacity 0.30; continuity 0.20 | Proposed; definitions/weights require C06. |
| Model repair attempts | At most 2 after the original response | Proposed; separate transport policy TBD under C16. |
| Initial activation | PM approval of a validated specific revision | Proposed; C09. |
| Automation modes | Review Only; Managed Automation | Proposed; C10. |
| First milestone policy | Review Only | Proposed staging rule; C10/C22. |
| Temporary extraction expiry | Within 24 hours | Proposed; C18. |
| Active-content deletion | Within 30 days | Proposed; C18. |
| Backup expiry | Within 90 days | Proposed; C18. |
| Native board availability | 99.5% per calendar month after pilot | Proposed; C17. |
| Recovery objectives | RPO 24 hours; RTO 8 hours | Proposed; C17. |
| Reference workload | 10,000 extracted words; 10 members; 40 tasks | Proposed test workload; C17. |
| Draft generation latency | p95 within 120 seconds, excluding upload | Proposed; C17. |
| Progress feedback | Within 2 seconds | Proposed; C17. |
| Native task read/write latency | p95 below 800 ms under 50 active concurrent users | Proposed; C17. |
| Accessibility target | WCAG 2.2 AA | Proposed target; verification required; C19. |
| Offline corpus | 60 briefs: 40 development, 20 held-out | Proposed; C17. |
| Evaluation thresholds | 100% hard validity; at least 90% coverage; at least 80% task/owner acceptance | Proposed; C17; critical-integrity gates also apply. |
| Discovery sample | 8–12 interviews; at least 6 observed setup sessions | Proposed; C23. |
| Pilot sample | 8–12 PMs; 4–6 teams; at least 24 matched sessions | Proposed; C23. |
| Pilot value thresholds | At least 50% effort reduction; at least 70% activation; at most 20% correction; at least 80% assignment acceptance; at least 60% repeat value | Proposed; C17/C23; definitions in A.19.3. |
| Pilot cost target | Provisional p95 USD 0.50 per activated reference board | Proposed metric; not a runtime cap; C16/C17. |
| Provider peak rates per million tokens | Hit input USD 0.006; miss input USD 0.30; output USD 1.20 | Dated research [S17]; recheck before budgeting. |
| Trello request limits later | 300/10 seconds per key; 100/10 seconds per token; additional member limits | Dated research [S16]; not a native-board limit. |
| Initial delivery sequence | Illustrative 12 weeks; repeat-use observation can extend | Proposed; C21/C22. |

# Part B: Functional Requirements (Non-Technical)

*This part explains the proposed product from the PM, contributor, and administrator perspectives. It uses the same scope and control boundaries as Part A; it does not create additional permissions or promise unconfirmed capabilities.*

## B.1 What AI Project Board is

AI Project Board helps a PM turn project information into a working team board. The PM supplies what the project must achieve, supporting documents, people, and delivery constraints. DeepSeek V4.1 Flash helps interpret that information and draft the work; the application checks whether the plan follows the rules before applying it.

The proposed product can run its supported projects on its own board without a separately configured Trello/Jira and MCP workflow. It creates and organizes work, proposes and applies approved initial assignments, identifies conflicts, and maintains the board within an approved policy. The PM remains responsible for scope, people, and delivery commitments.

## B.2 First-time user journey

The proposed journey is Welcome → Sign in/Register → Account information → Workspace access → Create Project → Add project context and team → Review draft → Activate Board. Sign-in methods and profile fields are still subject to C03.

The PM enters the objective, deliverables, exclusions, desired date, and timezone, then adds supported files or text. The product previews what it extracted and asks about important gaps. A roster can be added before or after draft generation, but missing people or capacity information cannot produce fictional assignments or guaranteed dates.

The PM reviews the version to activate, including tasks, ownership, assumptions, and conflicts. One approval publishes the valid native board with the approved assignments. A failed or incomplete generation preserves the entered material and offers an actionable next step.

## B.3 Main navigation and project workspace

The proposed primary navigation is Projects, My Tasks, Notifications, Workspace Settings, and authorized Administration. Within a project, the PM can access Sources, Team, Draft Review, Board, Change Review, Activity, and Project Settings.

- **Sources:** see what evidence was supplied, what text was extracted, and which version supports a plan.
- **Team:** review eligible people, declared skills, available hours, and missing capacity information.
- **Draft Review:** inspect scope coverage, clarify assumptions, edit tasks, and compare regeneration changes.
- **Board:** see work in Backlog, Ready, In Progress, Review, and Done; filter the authorized project view.
- **Change Review:** approve or reject proposed changes to active work after seeing their impact.
- **Activity and Settings:** understand prior actions, manage permitted locks/policies, and pause automation.

These are proposed labels rather than approved wireframes. C15 must confirm the final information architecture.

## B.4 Project board and task management

The board shows what needs doing, who owns it, what comes first, how completion will be checked, and which assumptions remain. Contributors see their assigned work and can update it within their permissions, report blockers, and challenge an estimate or assignment.

The PM can revise a draft directly or ask for a targeted change such as splitting a large task. The product shows the changes and preserves unrelated edits. Work without clear completion criteria stays out of Ready. In Progress needs an owner. Done requires an authorized person's confirmation and completed or explicitly waived criteria.

Manual locks protect scope, owners, estimates, and dates. If a lock makes the plan infeasible, the system explains the conflict instead of changing it silently. Task archiving, restoration, and override permissions follow the confirmed role and lifecycle rules.

## B.5 Automatic assignments and scheduling experience

The product selects owners from verified project members using the approved skills and capacity policy. It explains its suggestion, applies the reviewed initial assignments when the PM activates the board, and leaves work unassigned when nobody is eligible. It does not invent people or decide someone's ability from personal characteristics or chat activity.

The schedule uses known available working hours, absence, estimates, dependencies, and approved constraints. A forecast is shown as a forecast. If the desired deadline cannot be met, the PM sees the constraints and options to reduce scope, add capacity, change the date, or defer work. Unknown effort or capacity remains visible; it does not become a precise unsupported commitment.

Once work is active, changing its owner or committed due date requires PM review under the proposed policy.

## B.6 Project phases and manual locks

A project moves through intake, parsing, draft generation, validation/scheduling, review, activation, and active operation. Later scope changes go through change review. These stages are separate from a task's board list.

The PM can pause automation immediately. Review Only produces suggestions. Managed Automation can apply only the routine actions allowed by the approved policy, such as moving eligible work to Ready after prerequisites are complete. It cannot bypass a lock, access rule, review requirement, or unresolved material conflict. Final stage, archive, and override rules require C09/C10/C13.

## B.7 Planning results warnings and notifications

The PM sees a generated board together with requirement coverage, task completion criteria, ownership reasons, estimates, dependencies, and schedule warnings. Important uncertainty remains visible rather than being hidden behind confident wording.

In-app notifications cover assignments, approved changes, and pending review. Routine alerts can be collected into a digest or muted according to the approved preferences, while required review requests remain visible. Deadline-risk and stale-work alerts identify the evidence used; they do not claim work has progressed when nobody recorded it.

Notification cadence and stale-work thresholds are unconfirmed in C14. The first milestone provides basic assignment notifications; policy-driven updates and digests are completed in the second.

## B.8 Change requests and ongoing automation

When project requirements change, the product compares the new request with the current approved plan. It shows added, changed, or archived tasks, affected owners, dependencies, and likely schedule effects. Completed work and locked manual decisions remain protected.

The PM can approve, reject, or request another version. Approval applies to the exact displayed revision. If somebody has changed the board in the meantime, the product shows a fresh comparison before applying anything. New scope, reassignment of active work, and changes to committed dates are never treated as routine automatic updates.

The activity history explains what the application changed and why. Undo, when permitted, adds a recorded reversal and checks for later edits rather than erasing the earlier action.

## B.9 Activity reporting and history

The activity view shows who or what acted, the affected task, the prior and new values, the reason, the policy, and any approval. Saved plan versions connect the board to the sources, assumptions, and capacity information used at the time.

The PM can inspect authorized task and assignment views, blockers, due dates, forecasts, and pending changes. The MVP does not add worker rankings, employee performance scoring, or advanced portfolio forecasts. Exact reporting fields and filters follow C14/C15.

Sensitive historical content follows the approved retention policy. Keeping an explanation of a decision does not imply keeping deleted documents forever.

## B.10 Projects tasks and member profiles

### B.10.1 Project overview

The project overview shows objective, deliverables, exclusions, timezone, target date, source versions, current plan revision, policy, and unresolved issues. It distinguishes an approved commitment from an incomplete forecast.

### B.10.2 Task details

Task details show scope, completion criteria/checklist, supporting requirement/source links, required skills, effort range and basis, owner and reason, dependencies, workflow status, blocker condition, dates, locks, and permitted history. The user can act only on fields allowed by their role.

### B.10.3 Member and capacity profile

A member profile provides the project-relevant confirmed skills, role, available hours, working days, absence, and visible commitments needed for planning. Exact field visibility follows the confirmed access policy. Missing external workload is labeled unknown.

### B.10.4 Sources change review and export

The source view displays extracted evidence and its version. Change Review displays the difference and required decision. JSON/CSV exports provide portable authorized project information; JSON preserves the richer plan, while CSV is a flat view. Trello export and Jira integration are later features unless separately approved.

## B.11 Administrator operating workflow

The proposed administrator workflow is: configure the approved workspace and identity settings → manage authorized members/roles → verify approved AI and processing settings → monitor jobs and validation failures → investigate permitted activity → pause affected automation when needed → perform reviewed recovery/correction → verify outcome and history → apply approved retention and operational controls.

The administrator must be able to investigate failed or stuck operations without directly editing production database rows. A correction does not allow bypassing another tenant's access rules or silently overwriting project commitments. Project-content visibility and recovery authority require the final C12 policy.

During a model outage, users retain manual access to existing boards. AI generation shows its failure stage and can be resumed or retried within the approved budget.

## B.12 Functional completion criteria

The proposed native product is functionally complete when both delivery milestones and applicable confirmation items allow these end-to-end behaviors:

- A user can authenticate, enter an authorized workspace/project, and use the appropriate PM, contributor, administrator, or viewer permissions.
- A PM can enter context and supported files, preview extraction, correct errors, and keep evidence versioned.
- The product interprets scope, identifies material gaps, generates useful tasks, and makes excluded or suggested work distinguishable.
- A PM can clarify and regenerate a draft while preserving unrelated edits and locked values.
- The board includes valid task criteria and dependencies, eligible owners, honest estimates, and feasible schedules or visible unresolved constraints.
- A PM can activate a validated version without duplicate boards or partially published native state.
- Contributors can find assigned work, update permitted fields, report blockers, and confirm completion under the approved rules.
- The PM can choose or pause the automation policy, review scope/owner/deadline changes, and inspect their impact before applying them.
- The product preserves completed work, handles concurrent edits, records operations, and offers authorized recovery without erasing history.
- In-app notifications, task filters, source/task/member views, activity, and JSON/CSV exports operate within project permissions.
- Administrators can manage authorized users/settings, monitor failures, recover supported operations, and apply the approved data policy.
- The responsive desktop/mobile experience, accessibility target, quality gates, security tests, and recovery exercises meet the approved acceptance plan.
- Measured pilot evidence supports the release decision; hypothetical benefits are not reported as achieved results.

Optional Trello export, Jira support, and bidirectional synchronization are not conditions for native MVP completion unless the project owner changes scope through C20/C22.

# Client Clarifications Required

*This is the single master decision checklist. These items identify unconfirmed proposals, missing definitions, or implementation dependencies in the AI board material. The MARKETFOOT template does not answer them. The affected implementation must not be finalized until the responsible owner records a decision. Structural completion of this PRD does not imply business approval of every proposed rule.*

**CONFIRM WITH CLIENT:** record the decision, owner, date, and approved document revision against each relevant item. All items below are open at document preparation; no approval is implied by this revision.

## Master confirmation checklist

| ID | Open item and required decision | Affects | Decision owner and timing |
| --- | --- | --- | --- |
| C01 | Approve the native board as MVP source of truth and confirm that replacing customer-assembled Trello/Jira/MCP planning is the intended positioning. | A.1–A.2, B.1 | Product owner; before architecture commitment. |
| C02 | Select frontend/backend frameworks, MongoDB Atlas tier/region, collection/index design, storage, queue, monitoring, and deployment approach. No MARKETFOOT technology is automatically confirmed here. | A.1, A.17 | Engineering lead and sponsor; before implementation setup. |
| C03 | Choose authentication provider/methods, required account fields, invitation/join workflow, recovery, and session rules. | A.3, B.2 | Product and security; before authentication completion. |
| C04 | Confirm target segment, project duration, 20-member/100-task limits, and single-workspace capacity scope. | A.2, A.6, A.20 | Product owner; before pilot scope approval. |
| C05 | Confirm English-only MVP, TXT/text-PDF/DOCX formats, 10 files, 10 MB per file, 50,000 words, and unsupported-input handling. | A.4, A.20 | Product and engineering; before ingestion acceptance. |
| C06 | Define mandatory/optional skills, ranking normalization, 0.50/0.30/0.20 weights, continuity/cold-start behavior, tie-breakers, capacity ownership, and shared reservations. | A.6, A.8 | Product, team lead, engineering; before auto-allocation is finalized. |
| C07 | Confirm required schedule fields, working calendars/holidays, timezone/date-only cutoff, ready-task ordering, task splitting, and approved estimate use. | A.5, A.9 | PM and engineering; before scheduling commitments. |
| C08 | Define material blockers, estimate approval, and whether unassigned/unscheduled work can coexist with an activated operational board; specify explicit deferral behavior. | A.5–A.7, A.9 | Product and PM; before activation rules. |
| C09 | Approve first-board review/activation authority and whether any future auto-activation option exists. Current proposal requires PM approval. | A.5, A.7, A.12 | Product owner; before activation implementation. |
| C10 | Approve Review Only/Managed Automation, project default, pause behavior, routine action matrix, and active-owner/date review boundaries. | A.7, A.12, B.6 | Product and PM; before Managed Automation. |
| C11 | Define priority vocabulary, duplicate-task review criteria, and effort guidance/templates. Preserve unknown estimates rather than invent certainty. | A.6, A.11 | Product and team lead; before planning rubric finalization. |
| C12 | Finalize role/field permissions, team-lead role treatment, member data visibility, administrative content access, and correction authority. | A.3, A.15, A.18 | Product and security; before permission acceptance. |
| C13 | Confirm task transition/Done/waiver rules, custom-state scope, lock/unlock/override authority, project/task archiving/restoration, and undo permissions. | A.6–A.7, A.12, A.14 | Product and PM; before workflow completion. |
| C14 | Define report fields, stale-work/risk thresholds, notification/digest cadence, preferences, and required review visibility. | A.14, A.16, B.7–B.9 | Product and design; before reporting/notification completion. |
| C15 | Approve proposed screens, labels, profile fields, table columns, export schemas, date presentation, and interaction layouts; no AI board wireframe was supplied. | A.16, B.3, B.10 | Product and design; before UI sign-off. |
| C16 | Verify required model access/alias, reasoning/token/context/time budgets, runtime spend cap, transport retry rules, API/error schemas, and explicit no-silent-substitution policy. | A.10, A.13, A.17, A.19 | AI/backend lead and sponsor; during technical spike. |
| C17 | Approve evaluation corpus/rubric, release severity gates, performance workload, 99.5% availability, RPO/RTO, and pilot metric thresholds. | A.11, A.18–A.20 | Product, engineering, QA; before pilot/release acceptance. |
| C18 | Approve provider processing terms, deployment region, sensitive-data policy, retention/deletion/backup periods, and audit metadata anonymization/retention. | A.4, A.10, A.14–A.18 | Security lead and sponsor; before real customer data. |
| C19 | Confirm supported devices/browsers/viewports, mobile interaction parity, accessibility target, and verification method. | A.18, B.12 | Product, design, QA; before responsive acceptance. |
| C20 | Confirm later Trello/Jira scope, authorization eligibility, owner mapping, source-of-truth boundary, sync conflicts, deletion, and external-data cleanup responsibilities. | A.1, A.13, B.10 | Product and integrations lead; before any adapter work. |
| C21 | Approve team allocation, detailed estimates, infrastructure budget, maintenance/support, and commercial pricing research. The 12-week schedule and cost illustrations are not a quote. | A.19–A.20, delivery milestones | Sponsor and engineering; before delivery commitment. |
| C22 | Approve the two milestone boundaries, exclusions, client acceptance process, and any scope change that adds connectors or modifies P0. | A.19.1, delivery milestones | Product owner and sponsor; before build baseline. |
| C23 | Approve permissioned discovery/pilot participants, sample design, evidence handling, and four-week repeat-use observation window. | A.19.2–A.19.3 | Product lead and research owner; before recruitment. |
| C24 | Name the PM, technical, QA, security, and sponsor sign-off owners and go/no-go authority; no named approvers were supplied. | A.19.5, B.12, delivery milestones | Sponsor; before acceptance sign-off. |

# Project Delivery: Two Milestones

The proposed delivery is divided by dependency. Milestone 1 delivers a usable native board and validated initial AI planning. Milestone 2 completes ongoing change automation, operational recovery, final verification, and the pilot-to-production decision. Both belong to the same proposed native MVP. This staging does not remove any P0 requirement; A.19.1 identifies split requirements.

Relevant blocking checklist items must be resolved before affected milestone work is finalized. The illustrative 12-week sequence in A.19.4 must be reestimated after discovery and the model/architecture spike. No external connector is implied by these milestones.

## Milestone 1 - Core Platform, Project Intake & Validated Board Generation

**Objective:** deliver a responsive native application where authorized users can enter project/team context, generate and review a plan, and activate a usable board with valid initial assignments and schedules.

- Confirm the initial segment, native-board strategy, required model access, stack, authentication, data policy, and Milestone 1 planning rules through the relevant checklist items.
- Implement application, MongoDB collections/validators/indexes and versioned data migrations, tenant-scoped file storage, authenticated APIs, durable jobs, and audit/concurrency foundations.
- Deliver onboarding, authorized workspace/project access, role checks, membership revocation, and the basic administrative operations view.
- Capture context and supported files; validate limits; preview extraction; preserve source versions and provenance.
- Capture verified roster, skills, calendars, capacity, leave, and existing workspace project commitments.
- Integrate DeepSeek V4.1 Flash for requirement interpretation, ambiguity detection, task generation, and bounded structured-output repair.
- Validate task fields, coverage, exclusions, duplicate candidates, dependencies, owner eligibility, estimates, and schedule constraints.
- Implement approved deterministic ranking, capacity reservations, scheduling, and visible infeasibility/unknown states.
- Deliver draft editing, clarification, regeneration differences, manual field locks, PM review, and transactional idempotent activation.
- Deliver the native Kanban board, permitted task edits, task details, My Tasks filters, basic assignment notifications, and authorized JSON/CSV exports.
- Keep project automation in Review Only; preserve manual operation and inputs when AI work fails. Draft-level differences are included; ongoing active-plan change automation is completed in Milestone 2.
- Verify FR01–FR18, FR23–FR24 and the Milestone 1 portions of FR21/FR22, plus the secure and usable baseline of NFR01–NFR06, as mapped in A.19.1.

**Milestone 1 acceptance:** a new authorized PM can supply a permissioned brief and team, resolve material gaps, review a valid draft, activate exactly one consistent native board with approved ownership/scheduling, and collaborate on tasks through desktop/mobile web interfaces. Invalid scope/graph/owner/commitment inputs are rejected or explicitly unresolved; repeated activation does not duplicate work, tenant access is enforced, manual locks survive regeneration, and AI failure leaves the saved project usable. Milestone 1 acceptance does not authorize Managed Automation or general availability.

**Evidence required:** approved decision records for relevant blockers; schema/permission/graph/capacity tests; generation/activation retry and concurrency results; offline planning-quality evaluation; accessible responsive workflow review; and an end-to-end demonstration on a permissioned or explicitly fictional brief.

## Milestone 2 - Controlled Automation, Historical Recovery, Validation & Production

**Objective:** complete the active-project planning cycle so a PM can manage scope revisions and authorized routine changes with traceable history, dependable recovery, and evidence supporting the release decision.

- Complete Review Only and Managed Automation policy controls, execution-time authority checks, immediate pause, and the approved action matrix.
- Complete active-project impact analysis, versioned change review, approval/rejection, stale-base conflicts, and preservation of completed/locked/manual work.
- Implement eligible prerequisite-based movement, evidence-based alerts, policy-driven notifications/digests, event deduplication, and out-of-order event checks.
- Complete approved compensating undo, failure queues, administrator recovery, and historical source/plan/model/policy traceability under the retention policy.
- Verify retention/deletion behavior, revocation, minimal model context, redacted logs, prompt-injection defenses, credential handling, and cross-tenant isolation.
- Complete performance, accessibility, supported-browser/device, availability-monitoring, backup/restore, and recovery-objective verification.
- Complete the 60-case evaluation, held-out review, critical-integrity gates, full native P0 regression, and configured-model change controls.
- Conduct the supervised pilot, collect matched active-effort/correction/cost data, and allow enough follow-up for the four-week repeat-use measure.
- Deliver deployment configuration, production setup, monitoring/alerts, operator recovery guidance, data handling instructions, known limitations, and final test evidence.
- Obtain the named PM/product, engineering, QA, security, and sponsor acceptance decisions under C24.
- Complete FR19–FR20 and remaining FR13/FR21/FR22 work, and final NFR01–NFR06 verification. Regress the Milestone 1 P0 workflow before release.

**Milestone 2 acceptance:** authorized users can run a native project from brief through activation, task execution updates, approved scope revision, bounded routine automation, audit, and reviewed recovery without developers inventing missing planning rules or editing production data manually. All approved P0 acceptance conditions and critical security/integrity gates pass. Existing boards remain usable during model failure. Pilot evidence and named approvers support the release decision; failed quality/trust gates prevent the affected release or automation capability.

**Production decision:** broader release requires the approved value/quality thresholds and operational sign-offs. Unmet evidence or unresolved blocking clarifications lead to a documented hold or reduced approved scope, not a claim of successful acceptance. Trello export, Jira integration, bidirectional synchronization, portfolio optimization, and native mobile applications remain separately estimated later work.
