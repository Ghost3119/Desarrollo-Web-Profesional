import { AlertTriangle, Map as MapIcon } from "lucide-react";
import type { PageProps } from "../app/types";
import { PageHeader } from "../shared/ui";

export function NotFoundPage({ navigate }: PageProps) {
  return (
    <section className="content-page not-found">
      <PageHeader
        icon={AlertTriangle}
        eyebrow="Error"
        title="Pagina no encontrada"
        description="La ruta solicitada no existe dentro del Portal Horizonte."
      />
      <button className="primary-button" onClick={() => navigate("/mapa-del-sitio")}>
        <MapIcon size={18} />
        Ir al mapa del sitio
      </button>
    </section>
  );
}
