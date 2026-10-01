---
name: sync-recovery
description: Recupera eventos AgentOps pendentes, rejeitados ou conflitantes com segurança. Use quando aops sync falhar, status indicar rejeições ou antes de tentar retry.
---

# Recuperação de sincronização

1. Execute `aops sync inspect` para ver eventos pendentes e rejeitados sem escrever. Use o motivo já sanitizado; não procure nem reproduza segredos.
2. Verifique `aops status` e corrija a configuração remota somente quando o diagnóstico indicar URL, projeto ou autenticação incorretos.
3. Execute `aops sync --dry-run --json` para prever o envio e confirmar a ordem da fila.
4. Para eventos rejeitados recuperáveis, execute `aops sync retry --write` somente após revisar o motivo e confirmar intenção de escrita.
5. Execute `aops sync --write` quando o dry-run estiver correto e confirme a recuperação com novo `aops sync inspect`.
6. Se houver conflito ou falha repetida, pare novas tentativas, mantenha a fila local intacta e encaminhe o diagnóstico sanitizado ao responsável.

## Decisão rápida

| Estado observado | Ação permitida |
| --- | --- |
| Somente pendentes | Inspecione, execute dry-run e use `aops sync --write`. |
| Rejeitado recuperável | Revise o motivo, corrija a causa e use `aops sync retry --write`. |
| Conflito ou falha repetida | Pare retries e escale com diagnóstico sanitizado. |

## Guardrails

- Nunca edite, delete ou recrie manualmente o banco/outbox local para limpar eventos.
- Não use `--write` ou retry em lote sem antes executar inspeção e dry-run.
- Não descarte eventos, IDs, payloads ou erros sanitizados que possam ser necessários para auditoria.
