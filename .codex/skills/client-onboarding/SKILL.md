---
name: client-onboarding
description: Conduz o onboarding seguro de um cliente AgentOps a partir do manifesto local, reduzindo configuração manual sem assumir credenciais ou aprovações administrativas.
---

# Onboarding do cliente

Use esta skill após `aops bootstrap`, `aops init`, `aops setup` ou quando o agente precisar descobrir a próxima ação de configuração.

1. Leia `.aops/onboarding.json` quando existir; trate-o apenas como metadado sanitizado.
2. Execute `aops context` e depois `aops next` para obter o estado e a próxima ação segura.
3. Execute automaticamente somente ações locais, reversíveis e já permitidas pela policy do projeto.
4. Use as `validations` declaradas pelo manifesto e `.aops/policy.json`; não invente comandos ou toolchains.
5. Se `clientActions` não estiver vazio, apresente apenas essas ações ao cliente, em uma única mensagem objetiva.

## Limites de aprovação

Peça confirmação explícita antes de autenticação, seleção de projeto remoto, secrets, publicação de arquitetura, aplicação de plano de harness, comandos destrutivos ou deploy.

Nunca grave credenciais, prompts, respostas ou logs brutos no manifesto, em skills ou em eventos.
