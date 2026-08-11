export const CLOCK_PROVIDER = Symbol('CLOCK_PROVIDER');

export interface ClockProviderPort {
  now(): Date;
}
