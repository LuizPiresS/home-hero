import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/main/app.js';
import { InMemoryEmailVerificationSender } from '../../src/modules/auth/adapters/in-memory.js';

describe('cadastro e autenticação', () => {
  it('cadastra um usuário com as duas roles e envia a validação de e-mail', async () => {
    const sender = new InMemoryEmailVerificationSender();
    const app = createApp({ emailVerificationSender: sender });

    const response = await request(app).post('/auth/register').send({
      email: ' Pessoa@Example.com ',
      password: 'senha-segura',
      roles: ['contratante', 'profissional'],
    });

    expect(response.status).toBe(201);
    expect(response.body.roles).toEqual(['contratante', 'profissional']);
    expect(response.body.emailVerified).toBe(false);
    expect(sender.messages).toHaveLength(1);
    expect(sender.messages[0]?.email).toBe('pessoa@example.com');
  });

  it('impede o primeiro login até a confirmação do e-mail', async () => {
    const sender = new InMemoryEmailVerificationSender();
    const app = createApp({ emailVerificationSender: sender });

    await request(app).post('/auth/register').send({ email: 'user@example.com', password: 'senha-segura', roles: ['contratante'] });
    const response = await request(app).post('/auth/login').send({ email: 'user@example.com', password: 'senha-segura' });

    expect(response.status).toBe(403);
    expect(response.body.error).toBe('EMAIL_NOT_VERIFIED');
  });

  it('confirma o e-mail e permite o login', async () => {
    const sender = new InMemoryEmailVerificationSender();
    const app = createApp({ emailVerificationSender: sender });

    await request(app).post('/auth/register').send({ email: 'user@example.com', password: 'senha-segura', roles: ['profissional'] });
    const verification = await request(app).post('/auth/verify-email').send({ token: sender.messages[0]?.token });
    const login = await request(app).post('/auth/login').send({ email: 'user@example.com', password: 'senha-segura' });

    expect(verification.status).toBe(200);
    expect(verification.body.emailVerified).toBe(true);
    expect(login.status).toBe(200);
    expect(login.body.user.roles).toEqual(['profissional']);
    expect(login.body.accessToken).toEqual(expect.any(String));
  });

  it('rejeita e-mail duplicado e token inválido', async () => {
    const sender = new InMemoryEmailVerificationSender();
    const app = createApp({ emailVerificationSender: sender });
    const payload = { email: 'user@example.com', password: 'senha-segura', roles: ['contratante'] };

    await request(app).post('/auth/register').send(payload);
    const duplicate = await request(app).post('/auth/register').send(payload);
    const invalidToken = await request(app).post('/auth/verify-email').send({ token: 'token-inválido' });

    expect(duplicate.status).toBe(409);
    expect(invalidToken.status).toBe(401);
  });
});
