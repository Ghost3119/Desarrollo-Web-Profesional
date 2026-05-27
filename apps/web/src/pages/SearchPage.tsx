import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { SearchResult } from "../../../../packages/shared/src/contracts";
import type { PageProps, SubmitState } from "../app/types";
import { api } from "../shared/api/client";
import { PageHeader, SearchBox, StatusMessage } from "../shared/ui";

export function SearchPage({ location, navigate }: PageProps) {
  const query = useMemo(() => new URLSearchParams(location.search).get("q") ?? "", [location.search]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState<SubmitState>({ message: "" });

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setStatus({ message: "Ingresa al menos 2 caracteres." });
      return;
    }

    void api.search(query).then((response) => {
      setResults(response.data ?? []);
      setStatus({ ok: response.ok, message: response.message });
    });
  }, [query]);

  return (
    <section className="content-page">
      <PageHeader icon={Search} eyebrow="Busqueda" title="Busqueda en el sitio" description="Consulta rutas y contenido interno." />
      <SearchBox initialValue={query} onSubmit={(nextQuery) => navigate(`/buscar?q=${encodeURIComponent(nextQuery)}`)} />
      <StatusMessage ok={status.ok} message={status.message} />
      <div className="result-list">
        {results.map((result) => (
          <button key={result.path} className="result-item" onClick={() => navigate(result.path)}>
            <strong>{result.title}</strong>
            <span>{result.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
