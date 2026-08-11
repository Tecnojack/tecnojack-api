export interface MediaChecksumProps {
  algorithm: string;
  hash: string;
}

export class MediaChecksum {
  readonly algorithm: string;
  readonly hash: string;

  constructor(props: MediaChecksumProps) {
    if (!props.hash || props.hash.trim().length === 0) {
      throw new Error('Checksum hash cannot be empty.');
    }
    this.algorithm = (props.algorithm || 'sha256').trim().toLowerCase();
    this.hash = props.hash.trim().toLowerCase();
  }

  equals(other: MediaChecksum): boolean {
    return (
      this.algorithm === other.algorithm &&
      this.hash === other.hash
    );
  }
}
