import { LogIn, LogOut, UserPlus } from "lucide-react";
import type { ReactNode } from "react";
import { siteIdentity } from "../../../../../packages/shared/src/site-content";
import { useAuthSession } from "../../features/auth/session";
import type { LocationState, Navigate } from "../../router";
import { SearchBox } from "../../shared/ui";
import { mainNavigation, type NavItem } from "../navigation";

export function MainLayout({ children, location, navigate }: { children: ReactNode; location: LocationState; navigate: Navigate }) {
  const { user, signOut } = useAuthSession();
  const isAuthenticated = Boolean(user);

  const goToSearch = (query: string) => {
    if (query.length > 0) navigate(`/buscar?q=${encodeURIComponent(query)}`);
  };

  const logout = () => {
    signOut();
    navigate("/");
  };

  return (
    <div className="app-shell">
      <header className={isAuthenticated ? "topbar" : "topbar public-topbar"}>
        <div className="identity" onClick={() => navigate("/")} role="button" tabIndex={0}>
          <span className="identity-mark">H</span>
          <div>
            <strong>{siteIdentity.shortName}</strong>
            <span>{siteIdentity.id}</span>
          </div>
        </div>

        {isAuthenticated ? (
          <>
            <nav className="main-nav" aria-label="Menu de navegacion web">
              {mainNavigation.map((item) => (
                <NavLink key={item.path} item={item} active={location.pathname === item.path} navigate={navigate} />
              ))}
            </nav>

            <div className="session-tools">
              <SearchBox onSubmit={goToSearch} />
              <div className="session-summary">
                <span>{user?.fullName}</span>
                <button type="button" className="icon-button" onClick={logout} aria-label="Cerrar sesion">
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <nav className="public-nav" aria-label="Acceso al portal">
            <button className={location.pathname === "/login" ? "nav-link active" : "nav-link"} onClick={() => navigate("/login")}>
              <LogIn size={16} />
              Sesion
            </button>
            <button className={location.pathname === "/registro" ? "nav-link active" : "nav-link"} onClick={() => navigate("/registro")}>
              <UserPlus size={16} />
              Registro
            </button>
          </nav>
        )}
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
