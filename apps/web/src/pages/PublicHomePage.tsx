import { LogIn, ShieldCheck, UserPlus } from "lucide-react";
import { siteIdentity } from "../../../../packages/shared/src/site-content";
import type { PageProps } from "../app/types";

export function PublicHomePage({ navigate }: PageProps) {
  return (
    <section className="public-landing">
      <div className="public-copy">
        <span className="eyebrow">Portal institucional</span>
        <h1>{siteIdentity.name}</h1>
        <p>
          Accede a tus servicios escolares, envia solicitudes y consulta informacion de soporte desde una cuenta segura.
        </p>
        <div className="hero-actions">
          <button className="primary-button" onClick={() => navigate("/login")}>
            <LogIn size={18} />
            Iniciar sesion
          </button>
          <button className="secondary-button" onClick={() => navigate("/registro")}>
            <UserPlus size={18} />
            Crear cuenta
          </button>
        </div>
      </div>

      <div className="auth-entry-grid">
        <button className="auth-entry-card" onClick={() => navigate("/login")}>
          <LogIn size={26} aria-hidden="true" />
          <strong>Inicio de sesion</strong>
          <span>Entra con tu correo y password para acceder al panel de servicios.</span>
        </button>
        <button className="auth-entry-card" onClick={() => navigate("/registro")}>
          <UserPlus size={26} aria-hidden="true" />
          <strong>Registro</strong>
          <span>Crea una cuenta nueva con verificacion de seguridad.</span>
        </button>
      </div>
    </section>
  );
}
