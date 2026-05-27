import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { PageHeader } from "./PageHeader";
import { StatusMessage } from "./StatusMessage";

type FormStatus = {
  ok?: boolean;
  message: string;
};

export function FormPage({
  icon,
  title,
  description,
  status,
  children
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  status: FormStatus;
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
