import { LoginPage } from "../features/auth/pages/LoginPage";
import { RecoverPasswordPage } from "../features/auth/pages/RecoverPasswordPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { ChatPage } from "../features/chat/pages/ChatPage";
import { ContactPage } from "../features/contact/pages/ContactPage";
import { MailboxPage } from "../features/mailbox/pages/MailboxPage";
import { HelpPage } from "../pages/HelpPage";
import { HomePage } from "../pages/HomePage";
import { PublicHomePage } from "../pages/PublicHomePage";
import { SearchPage } from "../pages/SearchPage";
import { SiteMapPage } from "../pages/SiteMapPage";
import type { PageProps } from "./types";

export const publicRouteByPath = new Map<string, (props: PageProps) => JSX.Element>([
  ["/", PublicHomePage],
  ["/login", LoginPage],
  ["/registro", RegisterPage],
  ["/recuperar-password", RecoverPasswordPage]
]);

export const privateRouteByPath = new Map<string, (props: PageProps) => JSX.Element>([
  ["/", HomePage],
  ["/buzon", MailboxPage],
  ["/ayuda", HelpPage],
  ["/contacto", ContactPage],
  ["/mapa-del-sitio", SiteMapPage],
  ["/chat", ChatPage],
  ["/buscar", SearchPage]
]);

export const publicAuthPaths = new Set(["/login", "/registro", "/recuperar-password"]);
