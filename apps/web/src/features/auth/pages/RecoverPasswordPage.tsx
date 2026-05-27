import { KeyRound, Send } from "lucide-react";
import { type FormEvent, useState } from "react";
import type { FieldError } from "../../../../../../packages/shared/src/contracts";
import { validateRecoverPassword } from "../../../../../../packages/shared/src/validators";
import type { SubmitState } from "../../../app/types";
import { api } from "../../../shared/api/client";
import { handleResult } from "../../../shared/forms/handleResult";
import { useCaptcha } from "../../../shared/hooks/useCaptcha";
import { CaptchaBox, FieldMessage, FormPage } from "../../../shared/ui";

export function RecoverPasswordPage() {
  const { captcha, captchaAnswer, setCaptchaAnswer, refreshCaptcha } = useCaptcha();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [status, setStatus] = useState<SubmitState>({ message: "" });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = { email, captchaId: captcha?.captchaId ?? "", captchaAnswer };
    const localErrors = validateRecoverPassword(payload);
    if (localErrors.length > 0) {
      setErrors(localErrors);
      setStatus({ ok: false, message: "Revisa los campos marcados." });
      return;
    }

    const result = await api.recoverPassword(payload);
    handleResult(result, setStatus, setErrors);
    await refreshCaptcha();
  };

  return (
    <FormPage
      icon={KeyRound}
      title="Recuperacion de password"
      description="Recibe instrucciones para volver a entrar a tu cuenta."
      status={status}
    >
      <form className="form-grid" onSubmit={submit}>
        <label className="field wide">
          <span>Correo</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <FieldMessage errors={errors} field="email" />
        </label>
        <div className="wide">
          <CaptchaBox
            captcha={captcha}
            answer={captchaAnswer}
            errors={errors}
            onAnswer={setCaptchaAnswer}
            onRefresh={refreshCaptcha}
          />
        </div>
        <button className="primary-button wide" type="submit">
          <Send size={18} />
          Enviar solicitud
        </button>
      </form>
    </FormPage>
  );
}
