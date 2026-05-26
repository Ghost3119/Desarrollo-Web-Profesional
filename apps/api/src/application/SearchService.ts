import type { ApiResponse, SearchResult } from "../../../../packages/shared/src/contracts";
import { searchIndex } from "../../../../packages/shared/src/site-content";
import { sanitizeText } from "../../../../packages/shared/src/validators";

export class SearchService {
  search(query: string): ApiResponse<SearchResult[]> {
    const normalizedQuery = sanitizeText(query).toLowerCase();
    if (normalizedQuery.length < 2) {
      return { ok: true, message: "Ingresa al menos 2 caracteres.", data: [] };
    }

    const terms = normalizedQuery.split(/\s+/).filter(Boolean);
    const results = searchIndex
      .map((entry) => {
        const haystack = entry.content.toLowerCase();
        const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
        return { path: entry.path, title: entry.title, description: entry.description, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

    return {
      ok: true,
      message: results.length > 0 ? "Resultados encontrados." : "No se encontraron coincidencias.",
      data: results
    };
  }
}
