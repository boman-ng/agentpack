export type AdapterId = "codex" | "kimi" | "opencode";
export type InstallMode = "overwrite" | "append";

interface SkillSourceBase {
  id: string;
  repository: string;
  license: string;
}

export interface LocalSkillSource extends SkillSourceBase {
  kind: "local";
  root: string;
}

export interface GitSkillSource extends SkillSourceBase {
  kind: "git";
  ref: string;
}

export type SkillSource = LocalSkillSource | GitSkillSource;

export interface SkillDefinition {
  id: string;
  name: string;
  category: string;
  domain: string;
  sourceId: string;
  path: string;
}

export interface SkillSourceRevision {
  id: string;
  kind: "local" | "git";
  repository: string;
  ref?: string;
  commit?: string;
  packVersion?: string;
}

export interface ResolvedGitSource {
  id: string;
  repository: string;
  ref: string;
  commit: string;
}

export interface McpSource {
  id: string;
  repository: string;
  commit: string;
  license: string;
}

export interface McpDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  domain: string;
  transport: "streamable-http";
  url: string;
  staticHeaders: Record<string, string>;
  bearerTokenEnvVar?: string;
  authenticationOptional: boolean;
  source: McpSource;
  sourcePath: string;
}

export interface ProfileDefinition {
  id: string;
  description: string;
  skills: string[];
  mcp: string[];
  sourcePath: string;
}

export interface LoadedPack {
  root: string;
  name: string;
  version: string;
  description: string;
  instructionPath: string;
  skills: SkillDefinition[];
  skillSources: SkillSource[];
  mcp: McpDefinition[];
  profiles: ProfileDefinition[];
  targets: AdapterId[];
  native: {
    codex: string;
    kimi: string;
  };
}

export interface HomeLayout {
  home: string;
  stateRoot: string;
  stateFile: string;
  backupsRoot: string;
  codexHome: string;
  kimiHome: string;
  opencodeHome: string;
}

export interface ComponentSelection {
  skillIds: string[];
  mcpIds: string[];
}

export interface SelectionOptions {
  profile?: string;
  skills?: string[];
  mcp?: string[];
  allSkills?: boolean;
  allMcp?: boolean;
}

export interface ConfigConflict {
  target: string;
  component: string;
  message: string;
  reconcilable?: boolean;
}

export type OwnershipResolution = "keep" | "replace";

export interface ReconciliationOptions {
  resolutions: Record<string, OwnershipResolution>;
}

export interface ReconciliationSummary {
  adopted: string[];
  replaced: string[];
  kept: string[];
}

export interface RenderedMcpConfig {
  content: string;
  entryHashes: Record<string, string>;
  conflicts: ConfigConflict[];
}

export interface AdapterValidation {
  ok: boolean;
  message: string;
}

export interface AgentAdapter {
  readonly id: AdapterId;
  readonly displayName: string;
  detect(layout: HomeLayout): Promise<boolean>;
  instructionPath(layout: HomeLayout): string;
  skillsPath(layout: HomeLayout): string;
  mcpPath(layout: HomeLayout): string;
  renderMcp(
    existing: string | undefined,
    servers: McpDefinition[],
    mode: InstallMode,
    ownedIds: ReadonlySet<string>,
    target: string,
  ): RenderedMcpConfig;
  removeMcp(existing: string, ids: string[]): string;
  entryHash(content: string, id: string): string | undefined;
  validateMcp(content: string, expectedIds: string[]): AdapterValidation;
}

export type FileOperation =
  | "adopt"
  | "create"
  | "replace"
  | "append"
  | "merge"
  | "clear"
  | "delete";

export interface FilePlanAction {
  kind: "file";
  component: "instructions" | "mcp";
  adapter: AdapterId;
  target: string;
  operation: FileOperation;
  before: string | undefined;
  after: string | null;
  summary: string;
  strategy?: "overwrite" | "managed-block";
  entryHashes?: Record<string, string>;
}

export interface SkillInstallEntry {
  id: string;
  name: string;
  source: string;
  sourceHash: string;
  sourceRevision: SkillSourceRevision;
  target: string;
  operation: "adopt" | "install" | "replace";
  beforeHash: string | null;
}

export interface SkillsPlanAction {
  kind: "skills";
  adapter: AdapterId;
  target: string;
  operation: "replace" | "merge";
  entries: SkillInstallEntry[];
  summary: string;
}

export interface SkillRemoveEntry {
  id: string;
  name: string;
  target: string;
  beforeHash: string | null;
}

export interface SkillsRemovePlanAction {
  kind: "skills-remove";
  adapter: AdapterId | "legacy";
  target: string;
  entries: SkillRemoveEntry[];
  summary: string;
}

export type PlanAction = FilePlanAction | SkillsPlanAction | SkillsRemovePlanAction;

export interface ChangePlan {
  packName: string;
  packVersion: string;
  mode: InstallMode;
  adapters: AdapterId[];
  selection: ComponentSelection;
  actions: PlanAction[];
  conflicts: ConfigConflict[];
  backupTargets: string[];
  expectedStateHash: string | null;
  resolvedSources: ResolvedGitSource[];
  temporaryPaths: string[];
  uninstall: boolean;
  reconcile: boolean;
  reconciliation?: ReconciliationSummary;
}

export interface ManagedInstruction {
  adapter: AdapterId;
  path: string;
  strategy: "overwrite" | "managed-block";
  contentHash: string;
}

export interface ManagedSkill {
  id: string;
  name: string;
  path: string;
  contentHash: string;
  source: SkillSourceRevision;
}

export interface ManagedMcp {
  adapter: AdapterId;
  path: string;
  entries: Record<string, string>;
}

export interface InstallState {
  schemaVersion: 1;
  pack: {
    name: string;
    version: string;
  };
  installedAt: string;
  mode: InstallMode;
  adapters: AdapterId[];
  selection: ComponentSelection;
  managed: {
    instructions: ManagedInstruction[];
    skills: ManagedSkill[];
    mcp: ManagedMcp[];
  };
  lastBackup?: string;
}

export interface BackupItem {
  target: string;
  existed: boolean;
  snapshot?: string;
}

export interface BackupManifest {
  schemaVersion: 1;
  createdAt: string;
  items: BackupItem[];
}

export interface DoctorCheck {
  ok: boolean;
  label: string;
  detail: string;
}
