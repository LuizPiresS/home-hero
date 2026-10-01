---
name: ci-evidence
description: Registra e revisa evidências de CI e validações AgentOps pela CLI aops. Use ao executar testes, builds ou checks em CI/local, registrar validações, interpretar falhas, concluir uma entrega ou preparar handoff com evidências verificáveis.
---

# Evidência de CI

1. Consulte `.aops/policy.json` e `aops workflow check` para descobrir validações exigidas.
2. Execute `aops validation add --command "..." --execute` quando a validação for local.
3. Para CI, registre somente evidências já comprovadas pelo pipeline.
4. Confirme validações da sessão atual antes de `aops agent complete --sync`.

## Guardrails

- Não use `--status passed` como substituto da execução real.
- Não invente status, testes, pipeline ID, evidence ID ou commit SHA.
- Não envie logs brutos, prompts, respostas, credenciais ou tokens.
