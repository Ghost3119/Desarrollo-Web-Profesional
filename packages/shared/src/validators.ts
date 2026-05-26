import type {
  CaptchaPayload,
  ContactPayload,
  FieldError,
  LoginPayload,
  MailboxPayload,
  RecoverPasswordPayload,
  RegisterPayload
} from "./contracts";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\d{10}$/;

export const careers = [
  "Desarrollo de Software",
  "Administracion",
  "Mecatronica",
  "Procesos Industriales",
  "Mercadotecnia"
];

export const mailboxCategories = ["Duda academica", "Sugerencia", "Reporte tecnico", "Atencion escolar"];

export function sanitizeText(value: unknown): string {
  return String(value ?? "").trim();
}

function required(value: unknown, field: string, label: string): FieldError | null {
  return sanitizeText(value).length > 0 ? null : { field, message: `${label} es obligatorio.` };
}

function minLength(value: unknown, field: string, label: string, length: number): FieldError | null {
  return sanitizeText(value).length >= length
    ? null
    : { field, message: `${label} debe tener al menos ${length} caracteres.` };
}

function validEmail(value: unknown, field = "email"): FieldError | null {
  return emailPattern.test(sanitizeText(value))
    ? null
    : { field, message: "Ingresa un correo electronico valido." };
}

function validPhone(value: unknown): FieldError | null {
  const phone = sanitizeText(value).replace(/\D/g, "");
  return phonePattern.test(phone)
    ? null
    : { field: "phone", message: "El telefono debe tener 10 digitos." };
}

function captchaFields(payload: CaptchaPayload): FieldError[] {
  return collectErrors([
    required(payload.captchaId, "captchaId", "El CAPTCHA"),
    required(payload.captchaAnswer, "captchaAnswer", "La respuesta del CAPTCHA")
  ]);
}

function collectErrors(errors: Array<FieldError | null>): FieldError[] {
  return errors.filter((error): error is FieldError => Boolean(error));
}

export function validateRegister(payload: RegisterPayload): FieldError[] {
  return [
    ...collectErrors([
      required(payload.fullName, "fullName", "El nombre completo"),
      minLength(payload.fullName, "fullName", "El nombre completo", 6),
      validEmail(payload.email),
      minLength(payload.password, "password", "La password", 8),
      careers.includes(sanitizeText(payload.career))
        ? null
        : { field: "career", message: "Selecciona una carrera valida." }
    ]),
    ...captchaFields(payload)
  ];
}

export function validateLogin(payload: LoginPayload): FieldError[] {
  return collectErrors([
    validEmail(payload.email),
    minLength(payload.password, "password", "La password", 8)
  ]);
}

export function validateRecoverPassword(payload: RecoverPasswordPayload): FieldError[] {
  return [...collectErrors([validEmail(payload.email)]), ...captchaFields(payload)];
}

export function validateContact(payload: ContactPayload): FieldError[] {
  return [
    ...collectErrors([
      required(payload.fullName, "fullName", "El nombre completo"),
      validEmail(payload.email),
      validPhone(payload.phone),
      required(payload.subject, "subject", "El asunto"),
      minLength(payload.message, "message", "El mensaje", 12)
    ]),
    ...captchaFields(payload)
  ];
}

export function validateMailbox(payload: MailboxPayload): FieldError[] {
  return [
    ...collectErrors([
      required(payload.fullName, "fullName", "El nombre completo"),
      validEmail(payload.email),
      mailboxCategories.includes(sanitizeText(payload.category))
        ? null
        : { field: "category", message: "Selecciona una categoria valida." },
      minLength(payload.message, "message", "El mensaje", 12)
    ]),
    ...captchaFields(payload)
  ];
}
