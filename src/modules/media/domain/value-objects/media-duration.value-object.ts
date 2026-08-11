export interface MediaDurationProps {
  seconds: number;
}

export class MediaDuration {
  readonly seconds: number;
  readonly formatted: string;

  constructor(props: MediaDurationProps) {
    if (props.seconds < 0) {
      throw new Error('Duration seconds cannot be negative.');
    }
    this.seconds = props.seconds;
    this.formatted = this.formatDuration(props.seconds);
  }

  private formatDuration(totalSeconds: number): string {
    const totalSecs = Math.floor(totalSeconds);
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}
