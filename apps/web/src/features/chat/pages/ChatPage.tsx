import { MessageCircle, Send } from "lucide-react";
import { type FormEvent, useState } from "react";
import type { FieldError } from "../../../../../../packages/shared/src/contracts";
import { api } from "../../../shared/api/client";
import { FieldMessage, PageHeader } from "../../../shared/ui";

export function ChatPage() {
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
