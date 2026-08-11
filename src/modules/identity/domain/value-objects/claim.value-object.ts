export interface ClaimProps {
  name: string;
  value: string;
}

export class Claim {
  readonly name: string;
  readonly value: string;

  constructor(props: ClaimProps) {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Claim name cannot be empty.');
    }
    this.name = props.name.trim();
    this.value = props.value;
  }
}
