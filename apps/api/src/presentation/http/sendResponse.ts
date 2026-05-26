import type { Response } from "express";
import type { ApiResponse } from "../../../../../packages/shared/src/contracts";

export function sendResponse<T>(response: Response, result: ApiResponse<T>): void {
  response.status(result.ok ? 200 : 422).json(result);
}
