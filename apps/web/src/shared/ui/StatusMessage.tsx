export function StatusMessage({ ok, message }: { ok?: boolean; message: string }) {
  if (!message) return null;
  return <div className={ok ? "status status-ok" : "status status-error"}>{message}</div>;
}
