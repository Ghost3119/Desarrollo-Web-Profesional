export class CaptchaChallenge {
  constructor(
    public readonly id: string,
    public readonly question: string,
    public readonly answer: number,
    public readonly expiresAt: Date,
    public readonly createdAt = new Date()
  ) {}

  isExpired(now = new Date()): boolean {
    return this.expiresAt.getTime() <= now.getTime();
  }
}
