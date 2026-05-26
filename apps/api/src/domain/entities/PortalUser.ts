export class PortalUser {
  constructor(
    public readonly id: string,
    public readonly fullName: string,
    public readonly email: string,
    public readonly password: string,
    public readonly career: string,
    public readonly createdAt = new Date()
  ) {}
}
