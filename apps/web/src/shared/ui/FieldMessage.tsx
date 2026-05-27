import type { FieldError } from "../../../../../packages/shared/src/contracts";

export function getFieldError(errors: FieldError[], field: string): string | undefined {
  return errors.find((error) => error.field === field)?.message;
}

export function FieldMessage({ errors, field }: { errors: FieldError[]; field: string }) {
  const message = getFieldError(errors, field);
  return message ? <span className="field-error">{message}</span> : null;
}
