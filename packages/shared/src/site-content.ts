export type SiteRoute = {
  path: string;
  title: string;
  description: string;
  keywords: string[];
};

export type SiteMapNode = {
  label: string;
  path: string;
  children?: SiteMapNode[];
};

export const siteIdentity = {
  id: "PSE-HORIZONTE",
  name: "Portal de Servicios Estudiantiles Horizonte",
  shortName: "Portal Horizonte",
  owner: "Camacho Ibarra Jorge Jair",
  unit: "Unidad 1",
  repositoryName: "camachoibarrajorgejairUnidad1"
};

export const siteRoutes: SiteRoute[] = [
  {
    path: "/",
    title: "Inicio",
    description: "Tablero principal con accesos a servicios estudiantiles.",
    keywords: ["inicio", "portal", "servicios", "estudiantes", "tablero"]
  },
  {
    path: "/registro",
    title: "Registro",
    description: "Alta de estudiantes con validacion de datos y CAPTCHA.",
    keywords: ["registro", "cuenta", "alta", "estudiante", "captcha"]
  },
  {
    path: "/login",
    title: "Inicio de sesion",
    description: "Acceso de usuarios registrados al portal.",
    keywords: ["login", "sesion", "acceso", "usuario"]
  },
  {
    path: "/recuperar-password",
    title: "Recuperacion de password",
    description: "Solicitud para recuperar el acceso a una cuenta.",
    keywords: ["password", "recuperar", "contrasena", "cuenta"]
  },
  {
    path: "/buzon",
    title: "Buzon",
    description: "Buzon para comentarios, dudas y reportes estudiantiles.",
    keywords: ["buzon", "comentarios", "sugerencias", "reportes"]
  },
  {
    path: "/ayuda",
    title: "Ayuda",
    description: "Preguntas frecuentes y orientacion de uso del portal.",
    keywords: ["ayuda", "faq", "preguntas", "soporte"]
  },
  {
    path: "/contacto",
    title: "Contactanos",
    description: "Formulario de contacto con validaciones y CAPTCHA.",
    keywords: ["contacto", "contactanos", "correo", "telefono"]
  },
  {
    path: "/mapa-del-sitio",
    title: "Mapa del sitio",
    description: "Mapa jerarquico de secciones principales y secundarias.",
    keywords: ["mapa", "sitio", "secciones", "navegacion"]
  },
  {
    path: "/chat",
    title: "Chat",
    description: "Chat de apoyo para dudas frecuentes del portal.",
    keywords: ["chat", "soporte", "asistente", "dudas"]
  },
  {
    path: "/buscar",
    title: "Busqueda",
    description: "Busqueda interna en el contenido del sitio.",
    keywords: ["buscar", "busqueda", "sitio", "contenido"]
  }
];

export const siteMap: SiteMapNode[] = [
  {
    label: "Secciones principales",
    path: "/",
    children: [
      { label: "Inicio", path: "/" },
      { label: "Registro", path: "/registro" },
      { label: "Inicio de sesion", path: "/login" },
      { label: "Buzon", path: "/buzon" },
      { label: "Ayuda", path: "/ayuda" },
      { label: "Contactanos", path: "/contacto" }
    ]
  },
  {
    label: "Secciones secundarias",
    path: "/mapa-del-sitio",
    children: [
      { label: "Mapa del sitio", path: "/mapa-del-sitio" },
      { label: "Recuperacion de password", path: "/recuperar-password" },
      { label: "Chat", path: "/chat" },
      { label: "Busqueda en el sitio", path: "/buscar" }
    ]
  },
  {
    label: "Elementos adicionales",
    path: "/ayuda",
    children: [
      { label: "Pagina de error 404", path: "/ruta-inexistente" },
      { label: "Validacion frontend", path: "/registro" },
      { label: "Validacion backend", path: "/contacto" },
      { label: "Validacion de usuario humano", path: "/buzon" }
    ]
  }
];

export const searchIndex = siteRoutes.map((route) => ({
  ...route,
  content: `${route.title} ${route.description} ${route.keywords.join(" ")}`
}));
