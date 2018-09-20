interface Duration {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  weeks?: number;
}

export const pattern: RegExp;
export function parse(durationString: string): Duration;
export function end(duration: Duration, startDate?: Date): Date;
export function toSeconds(duration: Duration, startDate?: Date): number;
