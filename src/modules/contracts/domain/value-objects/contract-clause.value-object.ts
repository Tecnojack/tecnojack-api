export interface ContractClauseProps {
  number: string;
  title: string;
  body: string;
  isMandatory?: boolean;
}

export class ContractClause {
  readonly number: string;
  readonly title: string;
  readonly body: string;
  readonly isMandatory: boolean;

  constructor(props: ContractClauseProps) {
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('ContractClause title cannot be empty.');
    }
    if (!props.body || props.body.trim().length === 0) {
      throw new Error('ContractClause body cannot be empty.');
    }

    this.number = props.number.trim();
    this.title = props.title.trim();
    this.body = props.body.trim();
    this.isMandatory = props.isMandatory ?? true;
  }
}
