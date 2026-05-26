import type { CaptchaDto } from "../../../../packages/shared/src/contracts";
import { CaptchaChallenge } from "../domain/entities/CaptchaChallenge";
import type { CaptchaRepository } from "../domain/repositories/CaptchaRepository";

export class CaptchaService {
  constructor(private readonly repository: CaptchaRepository) {}

  create(): CaptchaDto {
    this.repository.deleteExpired();

    const left = randomInt(2, 9);
    const right = randomInt(1, 8);
    const useAddition = Math.random() > 0.35;
    const answer = useAddition ? left + right : left * right;
    const question = useAddition ? `${left} + ${right}` : `${left} x ${right}`;
    const id = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    this.repository.save(new CaptchaChallenge(id, question, answer, expiresAt));

    return {
      captchaId: id,
      imageUrl: `/api/captcha/${id}.svg`,
      expiresAt: expiresAt.toISOString()
    };
  }

  renderSvg(id: string): string | undefined {
    const challenge = this.repository.findById(id);
    if (!challenge || challenge.isExpired()) {
      return undefined;
    }

    const noise = Array.from({ length: 8 }, (_, index) => {
      const x1 = 10 + index * 18;
      const y1 = randomInt(8, 58);
      const x2 = x1 + randomInt(8, 30);
      const y2 = randomInt(8, 58);
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#9ca3af" stroke-width="1" opacity="0.45" />`;
    }).join("");

    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="180" height="64" viewBox="0 0 180 64" role="img" aria-label="CAPTCHA">
        <rect width="180" height="64" rx="8" fill="#f8fafc"/>
        <path d="M0 50 C35 35 65 62 102 43 S150 24 180 38" fill="none" stroke="#14b8a6" stroke-width="4" opacity="0.3"/>
        ${noise}
        <text x="90" y="40" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" font-weight="700" fill="#111827" transform="rotate(-3 90 34)">
          ${challenge.question} =
        </text>
      </svg>
    `;
  }

  verify(id: string, answer: string): boolean {
    const challenge = this.repository.findById(id);
    this.repository.delete(id);

    if (!challenge || challenge.isExpired()) {
      return false;
    }

    return Number(answer) === challenge.answer;
  }
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
