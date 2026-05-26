import { RefreshCw, Search } from "lucide-react";
import { useEffect, useState } from "react";
import type { CaptchaDto, FieldError } from "../../../packages/shared/src/contracts";
import { API_BASE, api } from "./api";

export function getFieldError(errors: FieldError[], field: string): string | undefined {
  return errors.find((error) => error.field === field)?.message;
}

export function FieldMessage({ errors, field }: { errors: FieldError[]; field: string }) {
  const message = getFieldError(errors, field);
  return message ? <span className="field-error">{message}</span> : null;
}

export function StatusMessage({ ok, message }: { ok?: boolean; message: string }) {
  if (!message) return null;
  return <div className={ok ? "status status-ok" : "status status-error"}>{message}</div>;
}

export function CaptchaBox({
  captcha,
  answer,
  errors,
  onAnswer,
  onRefresh
}: {
  captcha?: CaptchaDto;
  answer: string;
  errors: FieldError[];
  onAnswer: (value: string) => void;
  onRefresh: () => void;
}) {
  return (
    <div className="captcha-row">
      <div className="captcha-image-wrap">
        {captcha ? (
          <img src={`${API_BASE}${captcha.imageUrl}`} alt="CAPTCHA" className="captcha-image" />
        ) : (
          <div className="captcha-placeholder">CAPTCHA</div>
        )}
      </div>
      <label className="field captcha-answer">
        <span>Resultado</span>
        <input
          type="number"
          inputMode="numeric"
          value={answer}
          onChange={(event) => onAnswer(event.target.value)}
          aria-invalid={Boolean(getFieldError(errors, "captchaAnswer"))}
        />
        <FieldMessage errors={errors} field="captchaAnswer" />
      </label>
      <button type="button" className="icon-button" onClick={onRefresh} aria-label="Actualizar CAPTCHA">
        <RefreshCw size={18} />
      </button>
    </div>
  );
}

export function useCaptcha() {
  const [captcha, setCaptcha] = useState<CaptchaDto>();
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  const refreshCaptcha = async () => {
    const response = await api.captcha();
    if (response.ok && response.data) {
      setCaptcha(response.data);
      setCaptchaAnswer("");
    }
  };

  useEffect(() => {
    void refreshCaptcha();
  }, []);

  return { captcha, captchaAnswer, setCaptchaAnswer, refreshCaptcha };
}

export function SearchBox({
  initialValue,
  onSubmit
}: {
  initialValue?: string;
  onSubmit: (query: string) => void;
}) {
  const [query, setQuery] = useState(initialValue ?? "");

  useEffect(() => {
    setQuery(initialValue ?? "");
  }, [initialValue]);

  return (
    <form
      className="search-box"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(query.trim());
      }}
    >
      <Search size={18} aria-hidden="true" />
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar en el sitio" />
      <button type="submit">Buscar</button>
    </form>
  );
}
