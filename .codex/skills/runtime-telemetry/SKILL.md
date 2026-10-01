---
name: runtime-telemetry
description: Orienta telemetria segura de runtimes de agentes pela CLI aops. Use ao executar aops runtime wrap, registrar uso oficial do provedor, registrar estimativas observáveis, configurar Headroom ou concluir sessão com dados de telemetria.
---

# Telemetria de runtime

1. Para observação local, execute `aops runtime wrap -- <comando> [args...]`.
2. Envie `--token-usage` somente com snapshot cumulativo oficial do provedor.
3. Para observações, use `--estimate-token-usage` separado e com `source: "estimated"`.
4. Sincronize explicitamente com `aops sync --write` quando necessário.

## Guardrails

- Nunca estime nem invente `--token-usage`.
- Nunca envie prompts, respostas, credenciais, schemas de ferramentas ou logs brutos.
- O wrapper não é dado de faturamento de assinaturas.
