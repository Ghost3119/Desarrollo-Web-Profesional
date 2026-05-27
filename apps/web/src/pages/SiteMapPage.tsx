import { Building2, ChevronRight, Map as MapIcon } from "lucide-react";
import { siteMap, type SiteMapNode } from "../../../../packages/shared/src/site-content";
import type { PageProps } from "../app/types";
import type { Navigate } from "../router";
import { PageHeader } from "../shared/ui";

export function SiteMapPage({ navigate }: PageProps) {
  return (
    <section className="content-page">
      <PageHeader
        icon={MapIcon}
        eyebrow="Navegacion"
        title="Mapa del sitio"
        description="Encuentra rapidamente cada area disponible del portal."
      />
      <div className="sitemap">
        {siteMap.map((node) => (
          <SiteMapBranch key={node.label} node={node} navigate={navigate} />
        ))}
      </div>
    </section>
  );
}

function SiteMapBranch({ node, navigate }: { node: SiteMapNode; navigate: Navigate }) {
  return (
    <article className="sitemap-group">
      <button onClick={() => navigate(node.path)}>
        <Building2 size={20} />
        <strong>{node.label}</strong>
      </button>
      {node.children ? (
        <div className="sitemap-children">
          {node.children.map((child) => (
            <button key={`${node.label}-${child.label}`} onClick={() => navigate(child.path)}>
              <ChevronRight size={16} />
              {child.label}
            </button>
          ))}
        </div>
      ) : null}
    </article>
  );
}
