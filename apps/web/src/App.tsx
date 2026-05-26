import {
  AlertTriangle,
  BookOpen,
  Bot,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  HelpCircle,
  Home,
  KeyRound,
  LogIn,
  Mail,
  Map as MapIcon,
  MessageCircle,
  Search,
  Send,
  UserPlus
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import type {
  ApiResponse,
  ContactPayload,
  FieldError,
  MailboxPayload,
  SearchResult,
} from "../../../packages/shared/src/contracts";
import { siteIdentity, siteMap, siteRoutes, type SiteMapNode } from "../../../packages/shared/src/site-content";
import {
  careers,
  mailboxCategories,
  validateContact,
  validateLogin,
  validateMailbox,
  validateRecoverPassword,
  validateRegister
} from "../../../packages/shared/src/validators";
import { api } from "./api";
import { CaptchaBox, FieldMessage, SearchBox, StatusMessage, useCaptcha } from "./components";
import { type LocationState, type Navigate, useBrowserRouter } from "./router";

type PageProps = {
  location: LocationState;
  navigate: Navigate;
};

type SubmitState = {
  ok?: boolean;
  message: string;
};

type NavItem = {
  path: string;
  label: string;
  icon: LucideIcon;
};

const mainNavigation: NavItem[] = [
  { path: "/", label: "Inicio", icon: Home },
  { path: "/registro", label: "Registro", icon: UserPlus },
  { path: "/login", label: "Sesion", icon: LogIn },
  { path: "/buzon", label: "Buzon", icon: ClipboardList },
  { path: "/ayuda", label: "Ayuda", icon: HelpCircle },
  { path: "/contacto", label: "Contacto", icon: Mail },
  { path: "/mapa-del-sitio", label: "Mapa", icon: MapIcon },
  { path: "/chat", label: "Chat", icon: MessageCircle }
];

export function App() {
  const [location, navigate] = useBrowserRouter();
  const route = routeByPath.get(location.pathname);
  const Page = route ?? NotFoundPage;

  return (
    <Layout location={location} navigate={navigate}>
      <Page location={location} navigate={navigate} />
    </Layout>
  );
}

function Layout({ children, location, navigate }: { children: ReactNode; location: LocationState; navigate: Navigate }) {
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

function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <section className="page-header">
      <div className="page-icon">
        <Icon size={26} aria-hidden="true" />
      </div>
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}

function HomePage({ navigate }: PageProps) {
  const actions = [
    { path: "/registro", title: "Crear cuenta", detail: "Alta con validacion completa", icon: UserPlus },
    { path: "/buzon", title: "Enviar al buzon", detail: "Comentarios y reportes", icon: ClipboardList },
    { path: "/chat", title: "Abrir chat", detail: "Orientacion rapida", icon: Bot },
    { path: "/mapa-del-sitio", title: "Ver mapa", detail: "Secciones y rutas", icon: MapIcon }
  ];

  return (
    <>
      <section className="dashboard-hero">
        <div className="hero-copy">
          <span className="eyebrow">{siteIdentity.unit}</span>
          <h1>{siteIdentity.name}</h1>
          <p>
            Un portal academico para centralizar acceso, soporte, contacto y busqueda de servicios estudiantiles.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => navigate("/registro")}>
              <UserPlus size={18} />
              Registro
            </button>
            <button className="secondary-button" onClick={() => navigate("/buzon")}>
              <ClipboardList size={18} />
              Buzon
            </button>
          </div>
        </div>
        <img className="overview-visual" src="/portal-horizonte.svg" alt="Panel de servicios estudiantiles" />
      </section>

      <section className="content-band">
        <div className="section-heading">
          <h2>Accesos principales</h2>
          <span>Repositorio sugerido: {siteIdentity.repositoryName}</span>
        </div>
        <div className="quick-grid">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button key={action.path} className="quick-card" onClick={() => navigate(action.path)}>
                <Icon size={24} aria-hidden="true" />
                <strong>{action.title}</strong>
                <span>{action.detail}</span>
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </section>

      <section className="content-band two-columns">
        <div>
          <h2>Cobertura del sitio</h2>
          <p className="muted">
            La navegacion incluye secciones principales, elementos adicionales, busqueda interna y pagina de error.
          </p>
        </div>
        <div className="requirements-list">
          {["Mapa del sitio", "Pagina 404", "Frontend y backend", "CAPTCHA humano"].map((item) => (
            <span key={item}>
              <CheckCircle2 size={18} />
              {item}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}

function RegisterPage() {
  const { captcha, captchaAnswer, setCaptchaAnswer, refreshCaptcha } = useCaptcha();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    career: careers[0] ?? ""
  });
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [status, setStatus] = useState<SubmitState>({ message: "" });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = { ...form, captchaId: captcha?.captchaId ?? "", captchaAnswer };
    const localErrors = validateRegister(payload);
    if (localErrors.length > 0) {
      setErrors(localErrors);
      setStatus({ ok: false, message: "Revisa los campos marcados." });
      return;
    }

    const result = await api.register(payload);
    handleResult(result, setStatus, setErrors);
    await refreshCaptcha();
  };

  return (
    <FormPage
      icon={UserPlus}
      title="Registro"
      description="Alta de estudiante con validacion en frontend, backend y CAPTCHA."
      status={status}
    >
      <form className="form-grid" onSubmit={submit}>
        <label className="field wide">
          <span>Nombre completo</span>
          <input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
          <FieldMessage errors={errors} field="fullName" />
        </label>
        <label className="field">
          <span>Correo</span>
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <FieldMessage errors={errors} field="email" />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
          <FieldMessage errors={errors} field="password" />
        </label>
        <label className="field wide">
          <span>Carrera</span>
          <select value={form.career} onChange={(event) => setForm({ ...form, career: event.target.value })}>
            {careers.map((career) => (
              <option key={career}>{career}</option>
            ))}
          </select>
          <FieldMessage errors={errors} field="career" />
        </label>
        <div className="wide">
          <CaptchaBox
            captcha={captcha}
            answer={captchaAnswer}
            errors={errors}
            onAnswer={setCaptchaAnswer}
            onRefresh={refreshCaptcha}
          />
        </div>
        <button className="primary-button wide" type="submit">
          <Send size={18} />
          Registrar
        </button>
      </form>
    </FormPage>
  );
}

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [status, setStatus] = useState<SubmitState>({ message: "" });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const localErrors = validateLogin(form);
    if (localErrors.length > 0) {
      setErrors(localErrors);
      setStatus({ ok: false, message: "Revisa los campos marcados." });
      return;
    }

    const result = await api.login(form);
    handleResult(result, setStatus, setErrors);
  };

  return (
    <FormPage icon={LogIn} title="Inicio de sesion" description="Acceso al portal para usuarios registrados." status={status}>
      <form className="form-grid" onSubmit={submit}>
        <label className="field wide">
          <span>Correo</span>
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <FieldMessage errors={errors} field="email" />
        </label>
        <label className="field wide">
          <span>Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
          <FieldMessage errors={errors} field="password" />
        </label>
        <button className="primary-button wide" type="submit">
          <LogIn size={18} />
          Entrar
        </button>
      </form>
    </FormPage>
  );
}

function RecoverPasswordPage() {
  const { captcha, captchaAnswer, setCaptchaAnswer, refreshCaptcha } = useCaptcha();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [status, setStatus] = useState<SubmitState>({ message: "" });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const payload = { email, captchaId: captcha?.captchaId ?? "", captchaAnswer };
    const localErrors = validateRecoverPassword(payload);
    if (localErrors.length > 0) {
      setErrors(localErrors);
      setStatus({ ok: false, message: "Revisa los campos marcados." });
      return;
    }

    const result = await api.recoverPassword(payload);
    handleResult(result, setStatus, setErrors);
    await refreshCaptcha();
  };

  return (
    <FormPage
      icon={KeyRound}
      title="Recuperacion de password"
      description="Solicitud de recuperacion con validacion de usuario humano."
      status={status}
    >
      <form className="form-grid" onSubmit={submit}>
        <label className="field wide">
          <span>Correo</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <FieldMessage errors={errors} field="email" />
        </label>
        <div className="wide">
          <CaptchaBox
            captcha={captcha}
            answer={captchaAnswer}
            errors={errors}
            onAnswer={setCaptchaAnswer}
            onRefresh={refreshCaptcha}
          />
        </div>
        <button className="primary-button wide" type="submit">
          <Send size={18} />
          Enviar solicitud
        </button>
      </form>
    </FormPage>
  );
}

function MailboxPage() {
  const { captcha, captchaAnswer, setCaptchaAnswer, refreshCaptcha } = useCaptcha();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    category: mailboxCategories[0] ?? "",
    message: ""
  });
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [status, setStatus] = useState<SubmitState>({ message: "" });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const payload: MailboxPayload = { ...form, captchaId: captcha?.captchaId ?? "", captchaAnswer };
    const localErrors = validateMailbox(payload);
    if (localErrors.length > 0) {
      setErrors(localErrors);
      setStatus({ ok: false, message: "Revisa los campos marcados." });
      return;
    }

    const result = await api.mailbox(payload);
    handleResult(result, setStatus, setErrors);
    await refreshCaptcha();
  };

  return (
    <FormPage icon={ClipboardList} title="Buzon" description="Canal para dudas, reportes y sugerencias." status={status}>
      <form className="form-grid" onSubmit={submit}>
        <label className="field">
          <span>Nombre completo</span>
          <input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
          <FieldMessage errors={errors} field="fullName" />
        </label>
        <label className="field">
          <span>Correo</span>
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <FieldMessage errors={errors} field="email" />
        </label>
        <label className="field wide">
          <span>Categoria</span>
          <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
            {mailboxCategories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          <FieldMessage errors={errors} field="category" />
        </label>
        <label className="field wide">
          <span>Mensaje</span>
          <textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
          <FieldMessage errors={errors} field="message" />
        </label>
        <div className="wide">
          <CaptchaBox
            captcha={captcha}
            answer={captchaAnswer}
            errors={errors}
            onAnswer={setCaptchaAnswer}
            onRefresh={refreshCaptcha}
          />
        </div>
        <button className="primary-button wide" type="submit">
          <Send size={18} />
          Enviar al buzon
        </button>
      </form>
    </FormPage>
  );
}

function ContactPage() {
  const { captcha, captchaAnswer, setCaptchaAnswer, refreshCaptcha } = useCaptcha();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [status, setStatus] = useState<SubmitState>({ message: "" });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const payload: ContactPayload = { ...form, captchaId: captcha?.captchaId ?? "", captchaAnswer };
    const localErrors = validateContact(payload);
    if (localErrors.length > 0) {
      setErrors(localErrors);
      setStatus({ ok: false, message: "Revisa los campos marcados." });
      return;
    }

    const result = await api.contact(payload);
    handleResult(result, setStatus, setErrors);
    await refreshCaptcha();
  };

  return (
    <FormPage icon={Mail} title="Contactanos" description="Formulario de contacto para atencion escolar." status={status}>
      <form className="form-grid" onSubmit={submit}>
        <label className="field">
          <span>Nombre completo</span>
          <input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
          <FieldMessage errors={errors} field="fullName" />
        </label>
        <label className="field">
          <span>Correo</span>
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <FieldMessage errors={errors} field="email" />
        </label>
        <label className="field">
          <span>Telefono</span>
          <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          <FieldMessage errors={errors} field="phone" />
        </label>
        <label className="field">
          <span>Asunto</span>
          <input value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} />
          <FieldMessage errors={errors} field="subject" />
        </label>
        <label className="field wide">
          <span>Mensaje</span>
          <textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
          <FieldMessage errors={errors} field="message" />
        </label>
        <div className="wide">
          <CaptchaBox
            captcha={captcha}
            answer={captchaAnswer}
            errors={errors}
            onAnswer={setCaptchaAnswer}
            onRefresh={refreshCaptcha}
          />
        </div>
        <button className="primary-button wide" type="submit">
          <Send size={18} />
          Enviar contacto
        </button>
      </form>
    </FormPage>
  );
}

function HelpPage() {
  const faqs = [
    ["Como crear una cuenta", "Desde Registro se capturan datos basicos y el servidor confirma la validacion."],
    ["Como recuperar acceso", "Recuperacion de password solicita correo y CAPTCHA antes de procesar la peticion."],
    ["Como reportar un problema", "El Buzon genera un folio de seguimiento para reportes y sugerencias."],
    ["Como navegar el sitio", "El Mapa del sitio muestra la jerarquia completa de secciones."]
  ];

  return (
    <section className="content-page">
      <PageHeader icon={HelpCircle} eyebrow="Soporte" title="Ayuda" description="Respuestas rapidas para servicios del portal." />
      <div className="faq-list">
        {faqs.map(([title, detail]) => (
          <article className="info-card" key={title}>
            <BookOpen size={22} />
            <div>
              <h2>{title}</h2>
              <p>{detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SiteMapPage({ navigate }: PageProps) {
  return (
    <section className="content-page">
      <PageHeader
        icon={MapIcon}
        eyebrow="Navegacion"
        title="Mapa del sitio"
        description="Secciones principales, secundarias y elementos adicionales."
      />
      <div className="sitemap">
        {siteMap.map((node) => (
          <SiteMapBranch key={node.label} node={node} navigate={navigate} />
        ))}
      </div>
    </section>
  );
}

function SearchPage({ location, navigate }: PageProps) {
  const query = useMemo(() => new URLSearchParams(location.search).get("q") ?? "", [location.search]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState<SubmitState>({ message: "" });

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setStatus({ message: "Ingresa al menos 2 caracteres." });
      return;
    }

    void api.search(query).then((response) => {
      setResults(response.data ?? []);
      setStatus({ ok: response.ok, message: response.message });
    });
  }, [query]);

  return (
    <section className="content-page">
      <PageHeader icon={Search} eyebrow="Busqueda" title="Busqueda en el sitio" description="Consulta rutas y contenido interno." />
      <SearchBox initialValue={query} onSubmit={(nextQuery) => navigate(`/buscar?q=${encodeURIComponent(nextQuery)}`)} />
      <StatusMessage ok={status.ok} message={status.message} />
      <div className="result-list">
        {results.map((result) => (
          <button key={result.path} className="result-item" onClick={() => navigate(result.path)}>
            <strong>{result.title}</strong>
            <span>{result.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function ChatPage() {
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [conversation, setConversation] = useState([
    { role: "bot", text: "Hola, soy el asistente del Portal Horizonte." }
  ]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const currentMessage = message.trim();
    if (currentMessage.length < 3) {
      setErrors([{ field: "message", message: "El mensaje debe tener al menos 3 caracteres." }]);
      return;
    }

    setErrors([]);
    setConversation((items) => [...items, { role: "user", text: currentMessage }]);
    setMessage("");
    const response = await api.chat({ message: currentMessage });
    setConversation((items) => [
      ...items,
      {
        role: "bot",
        text: response.data?.reply ?? response.message
      }
    ]);
  };

  return (
    <section className="content-page">
      <PageHeader icon={MessageCircle} eyebrow="Atencion" title="Chat" description="Asistente de dudas frecuentes." />
      <div className="chat-window">
        {conversation.map((item, index) => (
          <div key={`${item.role}-${index}`} className={`chat-message ${item.role}`}>
            {item.text}
          </div>
        ))}
      </div>
      <form className="chat-form" onSubmit={submit}>
        <label className="field">
          <span>Mensaje</span>
          <input value={message} onChange={(event) => setMessage(event.target.value)} />
          <FieldMessage errors={errors} field="message" />
        </label>
        <button className="primary-button" type="submit">
          <Send size={18} />
          Enviar
        </button>
      </form>
    </section>
  );
}

function NotFoundPage({ navigate }: PageProps) {
  return (
    <section className="content-page not-found">
      <PageHeader
        icon={AlertTriangle}
        eyebrow="Error"
        title="Pagina no encontrada"
        description="La ruta solicitada no existe dentro del Portal Horizonte."
      />
      <button className="primary-button" onClick={() => navigate("/mapa-del-sitio")}>
        <MapIcon size={18} />
        Ir al mapa del sitio
      </button>
    </section>
  );
}

function FormPage({
  icon,
  title,
  description,
  status,
  children
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  status: SubmitState;
  children: ReactNode;
}) {
  return (
    <section className="content-page form-page">
      <PageHeader icon={icon} eyebrow="Formulario" title={title} description={description} />
      <StatusMessage ok={status.ok} message={status.message} />
      <div className="form-panel">{children}</div>
    </section>
  );
}

function SiteMapBranch({ node, navigate }: { node: SiteMapNode; navigate: Navigate }) {
  return (
    <article className="sitemap-group">
      <button onClick={() => navigate(node.path)}>
        <Building2 size={20} />
        <strong>{node.label}</strong>
      </button>
      {node.children ? (
        <div className="sitemap-children">
          {node.children.map((child) => (
            <button key={`${node.label}-${child.label}`} onClick={() => navigate(child.path)}>
              <ChevronRight size={16} />
              {child.label}
            </button>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function handleResult<T>(
  result: ApiResponse<T>,
  setStatus: (status: SubmitState) => void,
  setErrors: (errors: FieldError[]) => void
) {
  setStatus({ ok: result.ok, message: result.message });
  setErrors(result.errors ?? []);
}

const routeByPath = new Map<string, (props: PageProps) => JSX.Element>([
  ["/", HomePage],
  ["/registro", RegisterPage],
  ["/login", LoginPage],
  ["/recuperar-password", RecoverPasswordPage],
  ["/buzon", MailboxPage],
  ["/ayuda", HelpPage],
  ["/contacto", ContactPage],
  ["/mapa-del-sitio", SiteMapPage],
  ["/chat", ChatPage],
  ["/buscar", SearchPage]
]);
