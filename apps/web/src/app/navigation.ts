import {
  ClipboardList,
  HelpCircle,
  Home,
  Mail,
  Map as MapIcon,
  MessageCircle
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  path: string;
  label: string;
  icon: LucideIcon;
};

export const mainNavigation: NavItem[] = [
  { path: "/", label: "Inicio", icon: Home },
  { path: "/buzon", label: "Buzon", icon: ClipboardList },
  { path: "/ayuda", label: "Ayuda", icon: HelpCircle },
  { path: "/contacto", label: "Contacto", icon: Mail },
  { path: "/mapa-del-sitio", label: "Mapa", icon: MapIcon },
  { path: "/chat", label: "Chat", icon: MessageCircle }
];
