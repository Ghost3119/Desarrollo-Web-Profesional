import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export function SearchBox({
  initialValue,
  onSubmit
}: {
  initialValue?: string;
  onSubmit: (query: string) => void;
}) {
  const [query, setQuery] = useState(initialValue ?? "");

  useEffect(() => {
    setQuery(initialValue ?? "");
  }, [initialValue]);

  return (
    <form
      className="search-box"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(query.trim());
      }}
    >
      <Search size={18} aria-hidden="true" />
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar en el sitio" />
      <button type="submit">Buscar</button>
    </form>
  );
}
