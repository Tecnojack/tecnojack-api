export const SEQUENCE_GENERATOR = Symbol('SEQUENCE_GENERATOR');

export interface SequenceGeneratorPort {
  nextCode(prefix: string, padLength?: number): Promise<string>;
}
