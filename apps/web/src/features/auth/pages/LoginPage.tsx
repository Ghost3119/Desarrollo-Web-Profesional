import { LogIn } from "lucide-react";
import { type FormEvent, useState } from "react";
import type { FieldError } from "../../../../../../packages/shared/src/contracts";
import { validateLogin } from "../../../../../../packages/shared/src/validators";
import type { SubmitState } from "../../../app/types";
import { api } from "../../../shared/api/client";
import { handleResult } from "../../../shared/forms/handleResult";
import { FieldMessage, FormPage } from "../../../shared/ui";

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [status, setStatus] = useState<SubmitState>({ message: "" });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const localErrors = validateLogin(form);
    if (localErrors.length > 0) {
      setErrors(localErrors);
      setStatus({ ok: false, message: "Revisa los campos marcados." });
      return;
    }

    const result = await api.login(form);
    handleResult(result, setStatus, setErrors);
  };

  return (
    <FormPage icon={LogIn} title="Inicio de sesion" description="Acceso al portal para usuarios registrados." status={status}>
      <form className="form-grid" onSubmit={submit}>
        <label className="field wide">
          <span>Correo</span>
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <FieldMessage errors={errors} field="email" />
        </label>
        <label className="field wide">
          <span>Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
          <FieldMessage errors={errors} field="password" />
        </label>
        <button className="primary-button wide" type="submit">
          <LogIn size={18} />
          Entrar
        </button>
      </form>
    </FormPage>
  );
}
