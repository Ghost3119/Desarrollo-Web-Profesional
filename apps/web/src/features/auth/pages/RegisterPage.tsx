import { Send, UserPlus } from "lucide-react";
import { type FormEvent, useState } from "react";
import type { FieldError } from "../../../../../../packages/shared/src/contracts";
import { careers, validateRegister } from "../../../../../../packages/shared/src/validators";
import type { PageProps, SubmitState } from "../../../app/types";
import { api } from "../../../shared/api/client";
import { handleResult } from "../../../shared/forms/handleResult";
import { useCaptcha } from "../../../shared/hooks/useCaptcha";
import { CaptchaBox, FieldMessage, FormPage } from "../../../shared/ui";
import { useAuthSession } from "../session";

export function RegisterPage({ navigate }: PageProps) {
  const { signIn } = useAuthSession();
  const { captcha, captchaAnswer, setCaptchaAnswer, refreshCaptcha } = useCaptcha();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    career: careers[0] ?? ""
  });
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [status, setStatus] = useState<SubmitState>({ message: "" });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = { ...form, captchaId: captcha?.captchaId ?? "", captchaAnswer };
    const localErrors = validateRegister(payload);
    if (localErrors.length > 0) {
      setErrors(localErrors);
      setStatus({ ok: false, message: "Revisa los campos marcados." });
      return;
    }

    const result = await api.register(payload);
    handleResult(result, setStatus, setErrors);
    if (result.ok && result.data) {
      signIn(result.data);
      navigate("/");
      return;
    }
    await refreshCaptcha();
  };

  return (
    <FormPage
      icon={UserPlus}
      title="Registro"
      description="Crea tu cuenta y protege tu acceso con verificacion de seguridad."
      status={status}
    >
      <form className="form-grid" onSubmit={submit}>
        <label className="field wide">
          <span>Nombre completo</span>
          <input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
          <FieldMessage errors={errors} field="fullName" />
        </label>
        <label className="field">
          <span>Correo</span>
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <FieldMessage errors={errors} field="email" />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
          <FieldMessage errors={errors} field="password" />
        </label>
        <label className="field wide">
          <span>Carrera</span>
          <select value={form.career} onChange={(event) => setForm({ ...form, career: event.target.value })}>
            {careers.map((career) => (
              <option key={career}>{career}</option>
            ))}
          </select>
          <FieldMessage errors={errors} field="career" />
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
          Registrar
        </button>
      </form>
    </FormPage>
  );
}
