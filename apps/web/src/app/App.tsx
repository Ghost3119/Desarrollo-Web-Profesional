import { MainLayout } from "./layout/MainLayout";
import { routeByPath } from "./routes";
import { useBrowserRouter } from "../router";
import { NotFoundPage } from "../pages/NotFoundPage";

export function App() {
  const [location, navigate] = useBrowserRouter();
  const Page = routeByPath.get(location.pathname) ?? NotFoundPage;

  return (
    <MainLayout location={location} navigate={navigate}>
      <Page location={location} navigate={navigate} />
    </MainLayout>
  );
}
