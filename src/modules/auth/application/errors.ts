export class AuthError extends Error {
  // Erros de aplicação têm códigos estáveis para o adaptador HTTP traduzir em status/resposta.
  constructor(
    public readonly code:
      | 'INVALID_INPUT'
      | 'EMAIL_ALREADY_REGISTERED'
      | 'INVALID_VERIFICATION_TOKEN'
      | 'EMAIL_NOT_VERIFIED'
      | 'INVALID_CREDENTIALS',
    message: string,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
