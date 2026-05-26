import type { ApiResponse, ContactPayload, MailboxPayload, TicketResult } from "../../../../packages/shared/src/contracts";
import { sanitizeText, validateContact, validateMailbox } from "../../../../packages/shared/src/validators";
import { PortalMessage } from "../domain/entities/PortalMessage";
import type { MessageRepository } from "../domain/repositories/MessageRepository";
import type { CaptchaService } from "./CaptchaService";

export class MessageService {
  constructor(
    private readonly messages: MessageRepository,
    private readonly captcha: CaptchaService
  ) {}

  submitContact(payload: ContactPayload): ApiResponse<TicketResult> {
    const errors = validateContact(payload);
    if (errors.length > 0) {
      return { ok: false, message: "Revisa los campos marcados.", errors };
    }

    const captchaError = this.verifyCaptcha(payload.captchaId, payload.captchaAnswer);
    if (captchaError) return captchaError;

    return this.saveMessage("contact", payload.fullName, payload.email, payload.message, payload.subject);
  }

  submitMailbox(payload: MailboxPayload): ApiResponse<TicketResult> {
    const errors = validateMailbox(payload);
    if (errors.length > 0) {
      return { ok: false, message: "Revisa los campos marcados.", errors };
    }

    const captchaError = this.verifyCaptcha(payload.captchaId, payload.captchaAnswer);
    if (captchaError) return captchaError;

    return this.saveMessage("mailbox", payload.fullName, payload.email, payload.message, payload.category);
  }

  private verifyCaptcha(captchaId: string, captchaAnswer: string): ApiResponse<TicketResult> | null {
    if (this.captcha.verify(captchaId, captchaAnswer)) {
      return null;
    }

    return {
      ok: false,
      message: "El CAPTCHA no coincide o ya expiro.",
      errors: [{ field: "captchaAnswer", message: "Resuelve de nuevo la validacion humana." }]
    };
  }

  private saveMessage(
    type: "contact" | "mailbox",
    fullName: string,
    email: string,
    message: string,
    subject: string
  ): ApiResponse<TicketResult> {
    const entry = new PortalMessage(
      crypto.randomUUID(),
      type,
      sanitizeText(fullName),
      sanitizeText(email).toLowerCase(),
      sanitizeText(message),
      sanitizeText(subject)
    );
    this.messages.save(entry);

    return {
      ok: true,
      message: "Solicitud recibida correctamente.",
      data: {
        id: entry.id,
        status: type === "contact" ? "recibido" : "en_revision",
        createdAt: entry.createdAt.toISOString()
      }
    };
  }
}
