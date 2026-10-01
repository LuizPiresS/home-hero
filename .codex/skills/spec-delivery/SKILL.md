---
name: spec-delivery
description: Conecta entregas guiadas por especificação ao ciclo AgentOps pela CLI aops. Use ao especificar, aprovar, importar tarefas TLC, validar mudanças, sincronizar evidências ou concluir uma entrega com .specs/features.
---

# Entrega por especificação

Use `tlc-spec-driven` para especificar, desenhar, dividir tarefas e validar a feature. Esta skill integra os artefatos aprovados ao AgentOps; use `agentops-session` como fonte de verdade para sessão, handoff e sincronização.

1. Execute `aops context` e `aops workflow check`.
2. Após aprovar `tasks.md`, execute `aops spec sync --write`.
3. Quando solicitado pelo tech lead, use `aops tasks import --from .specs/features/<feature>/tasks.md --write`.
4. Registre validações reais com `aops validation add --command "..." --execute`.
5. Após a validação TLC, execute `aops spec sync --write` e conclua com `aops agent complete ... --sync`.

## Guardrails

- Não implemente com bloqueios de workflow abertos.
- Não importe tasks não aprovadas nem duplique tarefas já importadas.
- Não substitua os critérios, testes ou validação independente do `tlc-spec-driven`.
- Não invente evidências, uso de tokens, IDs ou resultados de validação.
