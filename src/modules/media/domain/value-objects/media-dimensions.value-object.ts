export interface MediaDimensionsProps {
  width: number;
  height: number;
  aspectRatio?: string;
}

export class MediaDimensions {
  readonly width: number;
  readonly height: number;
  readonly aspectRatio: string;

  constructor(props: MediaDimensionsProps) {
    if (props.width <= 0 || props.height <= 0) {
      throw new Error('Dimensions width and height must be positive integers.');
    }
    this.width = Math.round(props.width);
    this.height = Math.round(props.height);
    this.aspectRatio = props.aspectRatio ?? this.calculateAspectRatio(this.width, this.height);
  }

  private calculateAspectRatio(width: number, height: number): string {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(width, height);
    return `${width / divisor}:${height / divisor}`;
  }
}
