import type { ApiResponse, FieldError } from "../../../../../packages/shared/src/contracts";
import type { SubmitState } from "../../app/types";

export function handleResult<T>(
  result: ApiResponse<T>,
  setStatus: (status: SubmitState) => void,
  setErrors: (errors: FieldError[]) => void
) {
  setStatus({ ok: result.ok, message: result.message });
  setErrors(result.errors ?? []);
}
