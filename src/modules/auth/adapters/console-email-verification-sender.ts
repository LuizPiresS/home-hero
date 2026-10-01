import type { EmailVerificationSender } from '../application/ports.js';

type Logger = {
  log(message: string): void;
};

export class ConsoleEmailVerificationSender implements EmailVerificationSender {
  constructor(private readonly logger: Logger = console) {}

  async sendVerificationEmail(input: { email: string; token: string }): Promise<void> {
    // Este adaptador torna o fluxo observável localmente sem depender de SMTP.
    // O token só deve ser exibido em desenvolvimento; produção deve usar um provedor seguro.
    this.logger.log(JSON.stringify({
      type: 'email.verification.sent',
      to: input.email,
      subject: 'Confirme seu e-mail na Home Hero',
      token: input.token,
    }));
  }
}
