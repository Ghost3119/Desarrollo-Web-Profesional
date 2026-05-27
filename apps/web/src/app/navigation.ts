import {
  ClipboardList,
  HelpCircle,
  Home,
  LogIn,
  Mail,
  Map as MapIcon,
  MessageCircle,
  UserPlus
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  path: string;
  label: string;
  icon: LucideIcon;
};

export const mainNavigation: NavItem[] = [
  { path: "/", label: "Inicio", icon: Home },
  { path: "/registro", label: "Registro", icon: UserPlus },
  { path: "/login", label: "Sesion", icon: LogIn },
  { path: "/buzon", label: "Buzon", icon: ClipboardList },
  { path: "/ayuda", label: "Ayuda", icon: HelpCircle },
  { path: "/contacto", label: "Contacto", icon: Mail },
  { path: "/mapa-del-sitio", label: "Mapa", icon: MapIcon },
  { path: "/chat", label: "Chat", icon: MessageCircle }
];
