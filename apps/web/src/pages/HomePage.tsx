import { Bot, ChevronRight, ClipboardList, Map as MapIcon, UserPlus } from "lucide-react";
import { siteIdentity } from "../../../../packages/shared/src/site-content";
import type { PageProps } from "../app/types";

export function HomePage({ navigate }: PageProps) {
  const actions = [
    { path: "/registro", title: "Crear cuenta", detail: "Acceso a servicios y avisos", icon: UserPlus },
    { path: "/buzon", title: "Enviar al buzon", detail: "Comentarios y reportes", icon: ClipboardList },
    { path: "/chat", title: "Abrir chat", detail: "Respuesta inmediata", icon: Bot },
    { path: "/mapa-del-sitio", title: "Ver mapa", detail: "Secciones y rutas", icon: MapIcon }
  ];

  return (
    <>
      <section className="dashboard-hero">
        <div className="hero-copy">
          <span className="eyebrow">Servicios estudiantiles</span>
          <h1>{siteIdentity.name}</h1>
          <p>Gestiona tu acceso, solicita apoyo y encuentra informacion clave desde un solo espacio digital.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => navigate("/registro")}>
              <UserPlus size={18} />
              Registro
            </button>
            <button className="secondary-button" onClick={() => navigate("/buzon")}>
              <ClipboardList size={18} />
              Buzon
            </button>
          </div>
        </div>
        <img className="overview-visual" src="/portal-horizonte.svg" alt="Panel de servicios estudiantiles" />
      </section>

      <section className="content-band">
        <div className="section-heading">
          <h2>Accesos principales</h2>
          <span>Atencion rapida para estudiantes</span>
        </div>
        <div className="quick-grid">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button key={action.path} className="quick-card" onClick={() => navigate(action.path)}>
                <Icon size={24} aria-hidden="true" />
                <strong>{action.title}</strong>
                <span>{action.detail}</span>
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}
