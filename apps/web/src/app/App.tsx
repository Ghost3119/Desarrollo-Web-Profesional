import { useAuthSession } from "../features/auth/session";
import { NotFoundPage } from "../pages/NotFoundPage";
import { PublicHomePage } from "../pages/PublicHomePage";
import { useBrowserRouter } from "../router";
import { MainLayout } from "./layout/MainLayout";
import { privateRouteByPath, publicAuthPaths, publicRouteByPath } from "./routes";

export function App() {
  const [location, navigate] = useBrowserRouter();
  const { user } = useAuthSession();
  const isAuthenticated = Boolean(user);

  const Page = isAuthenticated
    ? publicAuthPaths.has(location.pathname)
      ? privateRouteByPath.get("/")!
      : privateRouteByPath.get(location.pathname) ?? NotFoundPage
    : publicRouteByPath.get(location.pathname) ?? PublicHomePage;

  return (
    <MainLayout location={location} navigate={navigate}>
      <Page location={location} navigate={navigate} />
    </MainLayout>
  );
}
