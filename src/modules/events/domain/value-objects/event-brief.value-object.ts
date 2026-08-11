export interface EventBriefProps {
  summary?: string | null;
  objectives?: string | null;
  audience?: string | null;
  creativeDirection?: string | null;
  visualReferences?: string | null;
  specialMoments?: string | null;
  restrictions?: string | null;
  technicalRequirements?: string | null;
  accessibilityRequirements?: string | null;
  privacyRequirements?: string | null;
  additionalNotes?: string | null;
}

export class EventBrief {
  readonly summary: string | null;
  readonly objectives: string | null;
  readonly audience: string | null;
  readonly creativeDirection: string | null;
  readonly visualReferences: string | null;
  readonly specialMoments: string | null;
  readonly restrictions: string | null;
  readonly technicalRequirements: string | null;
  readonly accessibilityRequirements: string | null;
  readonly privacyRequirements: string | null;
  readonly additionalNotes: string | null;

  constructor(props: EventBriefProps = {}) {
    this.summary = props.summary?.trim() ?? null;
    this.objectives = props.objectives?.trim() ?? null;
    this.audience = props.audience?.trim() ?? null;
    this.creativeDirection = props.creativeDirection?.trim() ?? null;
    this.visualReferences = props.visualReferences?.trim() ?? null;
    this.specialMoments = props.specialMoments?.trim() ?? null;
    this.restrictions = props.restrictions?.trim() ?? null;
    this.technicalRequirements = props.technicalRequirements?.trim() ?? null;
    this.accessibilityRequirements = props.accessibilityRequirements?.trim() ?? null;
    this.privacyRequirements = props.privacyRequirements?.trim() ?? null;
    this.additionalNotes = props.additionalNotes?.trim() ?? null;
  }
}
