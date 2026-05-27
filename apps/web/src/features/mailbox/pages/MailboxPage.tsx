import { ClipboardList, Send } from "lucide-react";
import { type FormEvent, useState } from "react";
import type { FieldError, MailboxPayload } from "../../../../../../packages/shared/src/contracts";
import { mailboxCategories, validateMailbox } from "../../../../../../packages/shared/src/validators";
import type { SubmitState } from "../../../app/types";
import { api } from "../../../shared/api/client";
import { handleResult } from "../../../shared/forms/handleResult";
import { useCaptcha } from "../../../shared/hooks/useCaptcha";
import { CaptchaBox, FieldMessage, FormPage } from "../../../shared/ui";

export function MailboxPage() {
  const { captcha, captchaAnswer, setCaptchaAnswer, refreshCaptcha } = useCaptcha();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    category: mailboxCategories[0] ?? "",
    message: ""
  });
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [status, setStatus] = useState<SubmitState>({ message: "" });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const payload: MailboxPayload = { ...form, captchaId: captcha?.captchaId ?? "", captchaAnswer };
    const localErrors = validateMailbox(payload);
    if (localErrors.length > 0) {
      setErrors(localErrors);
      setStatus({ ok: false, message: "Revisa los campos marcados." });
      return;
    }

    const result = await api.mailbox(payload);
    handleResult(result, setStatus, setErrors);
    await refreshCaptcha();
  };

  return (
    <FormPage icon={ClipboardList} title="Buzon" description="Canal para dudas, reportes y sugerencias." status={status}>
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
        <label className="field wide">
          <span>Categoria</span>
          <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
            {mailboxCategories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          <FieldMessage errors={errors} field="category" />
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
          Enviar al buzon
        </button>
      </form>
    </FormPage>
  );
}
