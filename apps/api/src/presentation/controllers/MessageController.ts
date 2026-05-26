import type { Router } from "express";
import type { ContactPayload, MailboxPayload } from "../../../../../packages/shared/src/contracts";
import type { MessageService } from "../../application/MessageService";
import { sendResponse } from "../http/sendResponse";

export class MessageController {
  constructor(private readonly messages: MessageService) {}

  register(router: Router): void {
    router.post("/contact", (request, response) => {
      sendResponse(response, this.messages.submitContact(request.body as ContactPayload));
    });

    router.post("/mailbox", (request, response) => {
      sendResponse(response, this.messages.submitMailbox(request.body as MailboxPayload));
    });
  }
}
