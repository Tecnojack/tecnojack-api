

export interface NotificationTemplateProps {
  id?: string;
  code: string;
  name: string;
  category: string;
  language: string;
  version?: number;
  subjectLayout?: string | null;
  bodyLayout: string;
  variables?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class NotificationTemplate {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly category: string;
  readonly language: string;
  readonly version: number;
  readonly subjectLayout: string | null;
  readonly bodyLayout: string;
  readonly variables: string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;

  constructor(props: NotificationTemplateProps) {
    if (!props.code || props.code.trim().length === 0) {
      throw new Error('NotificationTemplate code cannot be empty.');
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('NotificationTemplate name cannot be empty.');
    }
    if (!props.bodyLayout || props.bodyLayout.trim().length === 0) {
      throw new Error('NotificationTemplate bodyLayout cannot be empty.');
    }

    this.id = props.id ?? crypto.randomUUID();
    this.code = props.code.toUpperCase().trim();
    this.name = props.name.trim();
    this.category = props.category.toUpperCase().trim();
    this.language = props.language.toLowerCase().trim();
    this.version = props.version ?? 1;
    this.subjectLayout = props.subjectLayout?.trim() ?? null;
    this.bodyLayout = props.bodyLayout;
    this.variables = props.variables ? [...props.variables] : [];
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.deletedAt = props.deletedAt ?? null;
  }
}
