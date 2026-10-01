# Home Hero

Base da API da plataforma Home Hero, construída em TypeScript com Express e arquitetura hexagonal.

## Desenvolvimento

```bash
npm install
npm run dev
```

Verificações locais:

```bash
npm test
npm run lint
npm run build
```

## Organização

- `src/shared`: contratos e casos de uso sem dependência de Express ou infraestrutura.
- `src/adapters/http`: adaptadores de entrada HTTP e rotas.
- `src/main`: composição da aplicação e processo do servidor.
- `docs/planejamento`: visão de produto, regras e decisões de arquitetura.

As integrações futuras — banco, cache, filas, e-mail, mapas e gateway de pagamento — devem entrar por portas da aplicação e adaptadores próprios. A fundação não escolhe provedores nem persiste dados antes das decisões pendentes do planejamento.
