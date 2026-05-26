import type { ApiResponse, AuthResult, LoginPayload, RecoverPasswordPayload, RegisterPayload } from "../../../../packages/shared/src/contracts";
import { sanitizeText, validateLogin, validateRecoverPassword, validateRegister } from "../../../../packages/shared/src/validators";
import { PortalUser } from "../domain/entities/PortalUser";
import type { UserRepository } from "../domain/repositories/UserRepository";
import type { CaptchaService } from "./CaptchaService";

export class AuthService {
  constructor(
    private readonly users: UserRepository,
    private readonly captcha: CaptchaService
  ) {}

  register(payload: RegisterPayload): ApiResponse<AuthResult> {
    const errors = validateRegister(payload);
    if (errors.length > 0) {
      return { ok: false, message: "Revisa los campos marcados.", errors };
    }

    if (!this.captcha.verify(payload.captchaId, payload.captchaAnswer)) {
      return {
        ok: false,
        message: "El CAPTCHA no coincide o ya expiro.",
        errors: [{ field: "captchaAnswer", message: "Resuelve de nuevo la validacion humana." }]
      };
    }

    const email = sanitizeText(payload.email).toLowerCase();
    if (this.users.findByEmail(email)) {
      return {
        ok: false,
        message: "El correo ya esta registrado.",
        errors: [{ field: "email", message: "Utiliza un correo diferente." }]
      };
    }

    const user = new PortalUser(
      crypto.randomUUID(),
      sanitizeText(payload.fullName),
      email,
      sanitizeText(payload.password),
      sanitizeText(payload.career)
    );
    this.users.save(user);

    return {
      ok: true,
      message: "Registro completado correctamente.",
      data: { userId: user.id, fullName: user.fullName, email: user.email }
    };
  }

  login(payload: LoginPayload): ApiResponse<AuthResult> {
    const errors = validateLogin(payload);
    if (errors.length > 0) {
      return { ok: false, message: "Revisa los campos marcados.", errors };
    }

    const user = this.users.findByEmail(sanitizeText(payload.email));
    if (!user || user.password !== sanitizeText(payload.password)) {
      return {
        ok: false,
        message: "Correo o password incorrectos.",
        errors: [{ field: "email", message: "Verifica tus credenciales." }]
      };
    }

    return {
      ok: true,
      message: "Inicio de sesion correcto.",
      data: { userId: user.id, fullName: user.fullName, email: user.email }
    };
  }

  recoverPassword(payload: RecoverPasswordPayload): ApiResponse<{ maskedEmail: string }> {
    const errors = validateRecoverPassword(payload);
    if (errors.length > 0) {
      return { ok: false, message: "Revisa los campos marcados.", errors };
    }

    if (!this.captcha.verify(payload.captchaId, payload.captchaAnswer)) {
      return {
        ok: false,
        message: "El CAPTCHA no coincide o ya expiro.",
        errors: [{ field: "captchaAnswer", message: "Resuelve de nuevo la validacion humana." }]
      };
    }

    const email = sanitizeText(payload.email).toLowerCase();
    return {
      ok: true,
      message: "Si el correo existe, se enviaran instrucciones de recuperacion.",
      data: { maskedEmail: maskEmail(email) }
    };
  }
}

function maskEmail(email: string): string {
  const [user = "", domain = ""] = email.split("@");
  return `${user.slice(0, 2)}***@${domain}`;
}
