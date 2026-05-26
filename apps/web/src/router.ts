import { useCallback, useEffect, useState } from "react";

export type LocationState = {
  pathname: string;
  search: string;
  href: string;
};

export type Navigate = (to: string) => void;

function readLocation(): LocationState {
  return {
    pathname: window.location.pathname,
    search: window.location.search,
    href: `${window.location.pathname}${window.location.search}`
  };
}

export function useBrowserRouter(): [LocationState, Navigate] {
  const [location, setLocation] = useState(readLocation);

  useEffect(() => {
    const onPopState = () => setLocation(readLocation());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback((to: string) => {
    window.history.pushState(null, "", to);
    setLocation(readLocation());
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return [location, navigate];
}
