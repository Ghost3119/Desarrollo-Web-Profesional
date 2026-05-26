import type { PortalMessage } from "../domain/entities/PortalMessage";
import type { MessageRepository } from "../domain/repositories/MessageRepository";

export class InMemoryMessageRepository implements MessageRepository {
  private readonly messages: PortalMessage[] = [];

  save(message: PortalMessage): void {
    this.messages.push(message);
  }

  list(): PortalMessage[] {
    return [...this.messages];
  }
}
