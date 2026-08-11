export const UUID_PROVIDER = Symbol('UUID_PROVIDER');

export interface UuidProviderPort {
  generate(): string;
  validate(uuid: string): boolean;
}
