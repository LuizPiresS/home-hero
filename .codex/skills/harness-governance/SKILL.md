---
name: harness-governance
description: Governa melhorias do harness da CLI aops. Use ao analisar maturidade, gerar ou revisar plano de harness, solicitar aprovação, aplicar um plano aprovado ou configurar observação controlada de planos aprovados.
---

# Governança do harness

1. Execute `aops harness status` para identificar o próximo passo sem escrever.
2. Execute `aops harness analyze`.
3. Execute `aops harness plan --dry-run` e revise os itens e o diff.
4. Gere o plano revisado com `aops harness plan create --write`.
5. Apresente o diff, riscos e validações e pergunte ao owner/admin: `Aprova aplicar este plano?`.
6. Após resposta afirmativa explícita, registre a aprovação com `aops harness approve --plan-id <id> --plan-file <path>`; a CLI confere ID, hash, escopo e expiração antes de chamar o backend.
7. Aplique somente o plano aprovado com `aops harness apply --plan-id <id> --plan-file <path>`.

## Guardrails

- Nunca aplique plano draft, não aprovado, expirado ou com guards divergentes.
- Mantenha CI em modo `inform` e não invente plano/arquivo de plano.
- `watch --apply-approved` exige opt-in explícito; prefira `--once` e pare após falhas repetidas.
- Não inclua segredos, checkout, prompts, respostas ou logs brutos em arquivos ou eventos.
