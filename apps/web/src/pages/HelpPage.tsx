import { BookOpen, HelpCircle } from "lucide-react";
import { PageHeader } from "../shared/ui";

export function HelpPage() {
  const faqs = [
    ["Como crear una cuenta", "Desde Registro se capturan datos basicos y el servidor confirma la validacion."],
    ["Como recuperar acceso", "Recuperacion de password solicita correo y CAPTCHA antes de procesar la peticion."],
    ["Como reportar un problema", "El Buzon genera un folio de seguimiento para reportes y sugerencias."],
    ["Como navegar el sitio", "El Mapa del sitio muestra la jerarquia completa de secciones."]
  ];

  return (
    <section className="content-page">
      <PageHeader icon={HelpCircle} eyebrow="Soporte" title="Ayuda" description="Respuestas rapidas para servicios del portal." />
      <div className="faq-list">
        {faqs.map(([title, detail]) => (
          <article className="info-card" key={title}>
            <BookOpen size={22} />
            <div>
              <h2>{title}</h2>
              <p>{detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
