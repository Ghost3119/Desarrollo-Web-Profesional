import type { CaptchaChallenge } from "../entities/CaptchaChallenge";

export interface CaptchaRepository {
  save(challenge: CaptchaChallenge): void;
  findById(id: string): CaptchaChallenge | undefined;
  delete(id: string): void;
  deleteExpired(now?: Date): void;
}
