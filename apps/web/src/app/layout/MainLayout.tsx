import type { ReactNode } from "react";
import { siteIdentity } from "../../../../../packages/shared/src/site-content";
import { SearchBox } from "../../shared/ui";
import type { LocationState, Navigate } from "../../router";
import { mainNavigation, type NavItem } from "../navigation";

export function MainLayout({ children, location, navigate }: { children: ReactNode; location: LocationState; navigate: Navigate }) {
  const goToSearch = (query: string) => {
    if (query.length > 0) navigate(`/buscar?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="identity" onClick={() => navigate("/")} role="button" tabIndex={0}>
          <span className="identity-mark">H</span>
          <div>
            <strong>{siteIdentity.shortName}</strong>
            <span>{siteIdentity.id}</span>
          </div>
        </div>

        <nav className="main-nav" aria-label="Menu de navegacion web">
          {mainNavigation.map((item) => (
            <NavLink key={item.path} item={item} active={location.pathname === item.path} navigate={navigate} />
          ))}
        </nav>

        <SearchBox onSubmit={goToSearch} />
      </header>

      <main>{children}</main>
    </div>
  );
}

function NavLink({ item, active, navigate }: { item: NavItem; active: boolean; navigate: Navigate }) {
  const Icon = item.icon;
  return (
    <a
      href={item.path}
      className={active ? "nav-link active" : "nav-link"}
      onClick={(event) => {
        event.preventDefault();
        navigate(item.path);
      }}
    >
      <Icon size={16} aria-hidden="true" />
      <span>{item.label}</span>
    </a>
  );
}
