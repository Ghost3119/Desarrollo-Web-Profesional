import type { Router } from "express";
import type { CaptchaService } from "../../application/CaptchaService";

export class CaptchaController {
  constructor(private readonly captcha: CaptchaService) {}

  register(router: Router): void {
    router.get("/captcha", (_request, response) => {
      response.json({
        ok: true,
        message: "CAPTCHA generado.",
        data: this.captcha.create()
      });
    });

    router.get("/captcha/:id.svg", (request, response) => {
      const svg = this.captcha.renderSvg(request.params.id);
      if (!svg) {
        response.status(404).type("image/svg+xml").send(notFoundSvg());
        return;
      }

      response
        .type("image/svg+xml")
        .setHeader("Cache-Control", "no-store")
        .send(svg);
    });
  }
}

function notFoundSvg(): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="180" height="64" viewBox="0 0 180 64">
      <rect width="180" height="64" rx="8" fill="#fee2e2"/>
      <text x="90" y="39" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#991b1b">
        CAPTCHA vencido
      </text>
    </svg>
  `;
}
