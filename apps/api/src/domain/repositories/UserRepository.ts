import type { PortalUser } from "../entities/PortalUser";

export interface UserRepository {
  save(user: PortalUser): void;
  findByEmail(email: string): PortalUser | undefined;
}
