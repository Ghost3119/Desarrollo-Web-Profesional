import type { Router } from "express";
import type { LoginPayload, RecoverPasswordPayload, RegisterPayload } from "../../../../../packages/shared/src/contracts";
import type { AuthService } from "../../application/AuthService";
import { sendResponse } from "../http/sendResponse";

export class AuthController {
  constructor(private readonly auth: AuthService) {}

  register(router: Router): void {
    router.post("/auth/register", (request, response) => {
      sendResponse(response, this.auth.register(request.body as RegisterPayload));
    });

    router.post("/auth/login", (request, response) => {
      sendResponse(response, this.auth.login(request.body as LoginPayload));
    });

    router.post("/auth/recover-password", (request, response) => {
      sendResponse(response, this.auth.recoverPassword(request.body as RecoverPasswordPayload));
    });
  }
}
