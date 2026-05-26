import type { CaptchaRepository } from "../domain/repositories/CaptchaRepository";
import type { CaptchaChallenge } from "../domain/entities/CaptchaChallenge";

export class InMemoryCaptchaRepository implements CaptchaRepository {
  private readonly challenges = new Map<string, CaptchaChallenge>();

  save(challenge: CaptchaChallenge): void {
    this.challenges.set(challenge.id, challenge);
  }

  findById(id: string): CaptchaChallenge | undefined {
    return this.challenges.get(id);
  }

  delete(id: string): void {
    this.challenges.delete(id);
  }

  deleteExpired(now = new Date()): void {
    for (const [id, challenge] of this.challenges.entries()) {
      if (challenge.isExpired(now)) {
        this.challenges.delete(id);
      }
    }
  }
}
