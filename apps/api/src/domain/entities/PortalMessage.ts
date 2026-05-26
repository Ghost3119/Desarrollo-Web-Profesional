export type PortalMessageType = "contact" | "mailbox";

export class PortalMessage {
  constructor(
    public readonly id: string,
    public readonly type: PortalMessageType,
    public readonly fullName: string,
    public readonly email: string,
    public readonly message: string,
    public readonly subject: string,
    public readonly createdAt = new Date()
  ) {}
}
