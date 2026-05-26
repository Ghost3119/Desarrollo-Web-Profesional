import type { PortalMessage } from "../entities/PortalMessage";

export interface MessageRepository {
  save(message: PortalMessage): void;
  list(): PortalMessage[];
}
