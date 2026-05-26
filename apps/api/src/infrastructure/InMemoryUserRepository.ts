import { PortalUser } from "../domain/entities/PortalUser";
import type { UserRepository } from "../domain/repositories/UserRepository";

export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, PortalUser>();

  constructor() {
    const demo = new PortalUser(
      crypto.randomUUID(),
      "Usuario Demo",
      "demo@horizonte.edu.mx",
      "Password123",
      "Desarrollo de Software"
    );
    this.save(demo);
  }

  save(user: PortalUser): void {
    this.users.set(user.email.toLowerCase(), user);
  }

  findByEmail(email: string): PortalUser | undefined {
    return this.users.get(email.toLowerCase());
  }
}
