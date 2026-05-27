import type {
  ApiResponse,
  AuthResult,
  CaptchaDto,
  ChatPayload,
  ChatResult,
  ContactPayload,
  LoginPayload,
  MailboxPayload,
  RecoverPasswordPayload,
  RegisterPayload,
  SearchResult,
  TicketResult
} from "../../../../../packages/shared/src/contracts";

export const API_BASE = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:4000";

async function request<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {})
      }
    });

    return (await response.json()) as ApiResponse<T>;
  } catch {
    return {
      ok: false,
      message: "No se pudo conectar con el servidor."
    };
  }
}

export const api = {
  captcha: () => request<CaptchaDto>("/api/captcha"),
  register: (payload: RegisterPayload) =>
    request<AuthResult>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  login: (payload: LoginPayload) =>
    request<AuthResult>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  recoverPassword: (payload: RecoverPasswordPayload) =>
    request<{ maskedEmail: string }>("/api/auth/recover-password", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  contact: (payload: ContactPayload) =>
    request<TicketResult>("/api/contact", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  mailbox: (payload: MailboxPayload) =>
    request<TicketResult>("/api/mailbox", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  search: (query: string) => request<SearchResult[]>(`/api/search?q=${encodeURIComponent(query)}`),
  chat: (payload: ChatPayload) =>
    request<ChatResult>("/api/chat", {
      method: "POST",
      body: JSON.stringify(payload)
    })
};
