import { RefreshCw } from "lucide-react";
import type { CaptchaDto, FieldError } from "../../../../../packages/shared/src/contracts";
import { API_BASE } from "../api/client";
import { FieldMessage, getFieldError } from "./FieldMessage";

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
