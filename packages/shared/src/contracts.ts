export type FieldError = {
  field: string;
  message: string;
};

export type ApiResponse<T> = {
  ok: boolean;
  message: string;
  data?: T;
  errors?: FieldError[];
};

export type CaptchaDto = {
  captchaId: string;
  imageUrl: string;
  expiresAt: string;
};

export type CaptchaPayload = {
  captchaId: string;
  captchaAnswer: string;
};

export type RegisterPayload = CaptchaPayload & {
  fullName: string;
  email: string;
  password: string;
  career: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RecoverPasswordPayload = CaptchaPayload & {
  email: string;
};

export type ContactPayload = CaptchaPayload & {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export type MailboxPayload = CaptchaPayload & {
  fullName: string;
  email: string;
  category: string;
  message: string;
};

export type ChatPayload = {
  message: string;
};

export type SearchResult = {
  path: string;
  title: string;
  description: string;
  score: number;
};

export type TicketResult = {
  id: string;
  status: "recibido" | "en_revision";
  createdAt: string;
};

export type AuthResult = {
  userId: string;
  fullName: string;
  email: string;
};

export type ChatResult = {
  reply: string;
  createdAt: string;
};
