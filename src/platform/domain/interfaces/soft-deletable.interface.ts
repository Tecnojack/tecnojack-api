export interface ISoftDeletable {
  softDelete(actorId?: string): void;
  restore(actorId?: string): void;
  isDeleted(): boolean;
}
