export interface InvitationSectionProps {
  id?: string;
  type: string;
  title: string;
  content?: Record<string, unknown>;
  orderIndex?: number;
  isEnabled?: boolean;
}

export class InvitationSection {
  readonly id: string;
  readonly type: string;
  private _title: string;
  private _content: Record<string, unknown>;
  private _orderIndex: number;
  private _isEnabled: boolean;

  constructor(props: InvitationSectionProps) {
    if (!props.type || props.type.trim().length === 0) {
      throw new Error('Section type cannot be empty.');
    }
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('Section title cannot be empty.');
    }

    this.id = props.id ?? crypto.randomUUID();
    this.type = props.type.toUpperCase().trim();
    this._title = props.title.trim();
    this._content = props.content ? { ...props.content } : {};
    this._orderIndex = props.orderIndex ?? 0;
    this._isEnabled = props.isEnabled ?? true;
  }

  get title(): string { return this._title; }
  get content(): Record<string, unknown> { return this._content; }
  get orderIndex(): number { return this._orderIndex; }
  get isEnabled(): boolean { return this._isEnabled; }

  update(title: string, content: Record<string, unknown>, isEnabled: boolean, orderIndex: number): void {
    this._title = title.trim();
    this._content = { ...content };
    this._isEnabled = isEnabled;
    this._orderIndex = orderIndex;
  }
}
