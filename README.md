# Home Hero

Plataforma de intermediação entre contratantes e profissionais liberais. A Home Hero permite que uma pessoa descreva uma necessidade, encontre profissionais compatíveis, receba orçamentos e negocie a contratação.

Este repositório contém a API da plataforma, construída com TypeScript, Express e arquitetura hexagonal.

A validação de dados nas fronteiras da aplicação utiliza [Zod](https://zod.dev/), incluindo ambiente, cadastro, login e confirmação de e-mail.

## Visão do produto

A plataforma conecta dois tipos de atuação:

- **Contratante**: cria solicitações de serviço, procura profissionais, recebe orçamentos, conversa e avalia.
- **Profissional**: mantém seu perfil, cadastra serviços, informa disponibilidade, responde solicitações e avalia contratantes.

Uma mesma conta pode possuir as duas roles simultaneamente:

```json
{
  "roles": ["contratante", "profissional"]
}
```

O contratante paga diretamente ao profissional. A plataforma não processa o pagamento do serviço no MVP; ela terá uma cobrança separada de mensalidade do profissional.

## Estado atual

Atualmente a API possui:

- endpoint de saúde;
- cadastro de usuários;
- roles `contratante` e `profissional`;
- suporte às duas roles na mesma conta;
- hash de senha com `scrypt`;
- envio do token de confirmação de e-mail por uma porta de aplicação;
- confirmação de e-mail com expiração de 24 horas;
- bloqueio do primeiro login até a confirmação do e-mail;
- emissão de token de acesso em memória após o login.

Os adaptadores atuais de usuários, e-mail e sessão são em memória para permitir o desenvolvimento inicial. Os dados são perdidos ao reiniciar a aplicação e ainda devem ser substituídos por banco de dados, fila de e-mails e mecanismo de sessão/token de produção.

## Requisitos

- Node.js 20 ou superior
- npm

## Instalação e execução

```bash
npm install
cp .env.example .env
npm run dev
```

Por padrão, o servidor escuta na porta `3000`. A porta pode ser alterada com `PORT`.

Antes de criar o servidor, a aplicação valida todas as variáveis de ambiente próprias da plataforma. Se uma variável estiver inválida, o processo falha imediatamente com uma mensagem indicando o problema e nenhum listener HTTP é iniciado.

Variáveis suportadas:

| Variável | Obrigatória | Valores | Default |
| --- | --- | --- | --- |
| `PORT` | Não | inteiro entre `1` e `65535` | `3000` |
| `NODE_ENV` | Não | `development`, `test` ou `production` | `development` |

Para executar a versão compilada:

```bash
npm run build
npm start
```

## Comandos de qualidade

```bash
npm test          # executa os testes
npm run lint      # executa o typecheck
npm run build     # gera dist/
```

## API atual

### Health check

```http
GET /health
```

Resposta:

```json
{
  "status": "ok",
  "service": "home-hero-api"
}
```

### Cadastro

```http
POST /auth/register
Content-Type: application/json
```

Exemplo:

```json
{
  "email": "pessoa@example.com",
  "password": "senha-segura",
  "roles": ["contratante", "profissional"]
}
```

Regras atuais:

- `email` é obrigatório e normalizado para letras minúsculas;
- `password` deve possuir no mínimo 8 caracteres;
- `roles` deve conter pelo menos uma role válida;
- as roles permitidas são `contratante` e `profissional`;
- roles repetidas são removidas;
- o e-mail deve ser confirmado antes do primeiro login.

Resposta `201 Created`:

```json
{
  "id": "uuid",
  "email": "pessoa@example.com",
  "roles": ["contratante", "profissional"],
  "emailVerified": false
}
```

### Confirmação de e-mail

```http
POST /auth/verify-email
Content-Type: application/json
```

Payload:

```json
{
  "token": "token-recebido-no-e-mail"
}
```

O token é de uso único e expira após 24 horas. Em produção, ele será enviado por um serviço de e-mail através de uma fila. No adaptador atual, o envio fica disponível no `InMemoryEmailVerificationSender` para testes e desenvolvimento.

### Login

```http
POST /auth/login
Content-Type: application/json
```

Payload:

```json
{
  "email": "pessoa@example.com",
  "password": "senha-segura"
}
```

Antes da confirmação do e-mail, a API responde com `403` e `EMAIL_NOT_VERIFIED`. Depois da confirmação, responde com o token de acesso e os dados básicos do usuário:

```json
{
  "accessToken": "token-de-acesso",
  "user": {
    "id": "uuid",
    "email": "pessoa@example.com",
    "roles": ["contratante", "profissional"]
  }
}
```

## Arquitetura

A aplicação segue arquitetura hexagonal (ports and adapters):

```text
HTTP / Express
     ↓
Adaptadores de entrada
     ↓
Casos de uso da aplicação
     ↓
Domínio + portas
     ↓
Adaptadores de saída
     ↓
Banco, filas, e-mail, cache e provedores externos
```

Estrutura principal:

```text
src/
├── adapters/http/              # Express, rotas e tratamento de erros
├── main/                       # composição da aplicação e servidor
├── modules/auth/
│   ├── domain/                 # entidades e regras de usuário
│   ├── application/            # casos de uso e portas
│   └── adapters/               # adaptadores em memória e HTTP
└── shared/                     # componentes compartilhados
```

Dependências externas devem ser acessadas por portas da aplicação. Isso permite trocar os adaptadores em memória por implementações reais sem acoplar as regras de negócio ao Express, banco ou provedor.

## Domínio planejado

Os próximos módulos previstos são:

- perfis profissionais;
- serviços e categorias;
- disponibilidade e agenda;
- solicitações de serviço;
- orçamentos;
- conversas e mensagens;
- avaliações;
- assinaturas e mensalidade;
- auditoria e eventos de integração.

O fluxo mínimo de orçamento planejado é:

```text
PENDENTE → AGUARDANDO_RESPOSTA → ACEITO → FECHADO
```

Cancelamento, expiração, rejeição, reabertura, no-show e tratamento dos demais orçamentos ainda dependem de decisão de produto.

## Integrações futuras

O planejamento prevê portas e adaptadores para:

- banco relacional;
- serviço de e-mail e fila de processamento;
- cache de orçamentos em aberto;
- armazenamento seguro de fotos;
- mapas e geocodificação;
- gateway de pagamento da mensalidade;
- observabilidade, auditoria e webhooks idempotentes.

Nenhuma dessas integrações está configurada nesta etapa.

## Documentação

- [Planejamento da plataforma](docs/planejamento/planejamento-plataforma.md)
- [Regras de negócio](docs/business-rules.md)

## Licença

Projeto privado em fase de desenvolvimento.
