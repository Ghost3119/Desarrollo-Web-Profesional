import type { Router } from "express";
import type { ChatPayload } from "../../../../../packages/shared/src/contracts";
import type { ChatService } from "../../application/ChatService";
import { sendResponse } from "../http/sendResponse";

export class ChatController {
  constructor(private readonly chat: ChatService) {}

  register(router: Router): void {
    router.post("/chat", (request, response) => {
      sendResponse(response, this.chat.reply(request.body as ChatPayload));
    });
  }
}
