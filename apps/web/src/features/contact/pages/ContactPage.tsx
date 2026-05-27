import { Mail, Send } from "lucide-react";
import { type FormEvent, useState } from "react";
import type { ContactPayload, FieldError } from "../../../../../../packages/shared/src/contracts";
import { validateContact } from "../../../../../../packages/shared/src/validators";
import type { SubmitState } from "../../../app/types";
import { api } from "../../../shared/api/client";
import { handleResult } from "../../../shared/forms/handleResult";
import { useCaptcha } from "../../../shared/hooks/useCaptcha";
import { CaptchaBox, FieldMessage, FormPage } from "../../../shared/ui";

export function ContactPage() {
  const { captcha, captchaAnswer, setCaptchaAnswer, refreshCaptcha } = useCaptcha();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [status, setStatus] = useState<SubmitState>({ message: "" });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const payload: ContactPayload = { ...form, captchaId: captcha?.captchaId ?? "", captchaAnswer };
    const localErrors = validateContact(payload);
    if (localErrors.length > 0) {
      setErrors(localErrors);
      setStatus({ ok: false, message: "Revisa los campos marcados." });
      return;
    }

    const result = await api.contact(payload);
    handleResult(result, setStatus, setErrors);
    await refreshCaptcha();
  };

  return (
    <FormPage icon={Mail} title="Contactanos" description="Formulario de contacto para atencion escolar." status={status}>
      <form className="form-grid" onSubmit={submit}>
        <label className="field">
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
          <span>Telefono</span>
          <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          <FieldMessage errors={errors} field="phone" />
        </label>
        <label className="field">
          <span>Asunto</span>
          <input value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} />
          <FieldMessage errors={errors} field="subject" />
        </label>
        <label className="field wide">
          <span>Mensaje</span>
          <textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
          <FieldMessage errors={errors} field="message" />
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
          Enviar contacto
        </button>
      </form>
    </FormPage>
  );
}
