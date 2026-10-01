---
name: agentops-session
description: Orquestra com segurança o ciclo de sessão AgentOps pela CLI aops. Use ao iniciar, continuar, acompanhar, concluir ou transferir trabalho do agente atual, especialmente com contexto remoto, pendências de sincronização, validações ou risco de sessões concorrentes.
---

# Sessão AgentOps

Use esta skill para decidir a sequência correta da sessão. A CLI continua sendo a fonte de verdade: execute somente comandos `aops` explícitos e respeite seus exit codes e avisos.

## Fluxo

1. Execute `aops context` antes de selecionar trabalho e resolva os avisos.
2. Se houver eventos pendentes, execute `aops sync --write` antes de trabalhar.
3. Se houver sessão ativa de outro desenvolvedor, pare e peça confirmação.
4. Execute `aops workflow check` e resolva bloqueios antes de alterar arquivos.
5. Abra a sessão com `aops session begin --agent codex` quando necessário.
6. Registre progresso com `aops session heartbeat --status "..."`.
7. Valide, conclua com `aops agent complete ... --sync` e encerre/sincronize a sessão.

## Guardrails

- Não invente configuração remota, IDs ou credenciais.
- Use `--token-usage` apenas para uso oficial do provedor; estimativas usam o fluxo próprio.
- Não registre prompts, respostas, credenciais ou logs brutos.
- Não execute deploy ou comandos destrutivos.
