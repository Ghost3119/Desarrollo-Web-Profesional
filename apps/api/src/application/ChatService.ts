import type { ApiResponse, ChatPayload, ChatResult } from "../../../../packages/shared/src/contracts";
import { sanitizeText } from "../../../../packages/shared/src/validators";

export class ChatService {
  reply(payload: ChatPayload): ApiResponse<ChatResult> {
    const message = sanitizeText(payload.message);
    if (message.length < 3) {
      return {
        ok: false,
        message: "Escribe una pregunta mas especifica.",
        errors: [{ field: "message", message: "El mensaje debe tener al menos 3 caracteres." }]
      };
    }

    const normalized = message.toLowerCase();
    let reply = "Puedo ayudarte con registro, inicio de sesion, recuperacion de password, buzon, contacto y mapa del sitio.";

    if (normalized.includes("registro")) {
      reply = "Para registrarte abre la seccion Registro, completa tus datos y resuelve el CAPTCHA de operacion matematica.";
    } else if (normalized.includes("password") || normalized.includes("contrasena")) {
      reply = "En Recuperacion de password puedes solicitar instrucciones con tu correo institucional.";
    } else if (normalized.includes("buzon")) {
      reply = "El Buzon recibe dudas, sugerencias y reportes tecnicos. Cada solicitud genera un folio.";
    } else if (normalized.includes("mapa")) {
      reply = "El Mapa del sitio muestra servicios, accesos de cuenta y canales de soporte disponibles.";
    }

    return {
      ok: true,
      message: "Respuesta generada.",
      data: { reply, createdAt: new Date().toISOString() }
    };
  }
}
