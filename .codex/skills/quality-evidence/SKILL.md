---
name: quality-evidence
description: Configura e diagnostica evidências de qualidade e Harness Score no CI. Use ao integrar GitLab ou GitHub, revisar quality-evidence.json ou investigar uma pontuação ausente.
---

# Evidência de qualidade

1. Execute `aops harness status` e `aops harness analyze` para distinguir uma falha do scanner de uma falha de ingestão.
2. Mantenha a coleta de CI em modo `inform`; confirme que o pipeline produz o artefato `quality-evidence.json` mesmo quando o scanner falhar.
3. Inspecione o artefato e valide que ele inclui somente resumo, dimensões, checks, `pipelineId`, `commitSha` e erro sanitizado quando existir.
4. Para GitLab ou GitHub, configure URL, token de ingestão e projeto exclusivamente pelos secrets do CI; nunca escreva valores em YAML, artefatos ou logs.
5. Quando a ingestão falhar, use a resposta sanitizada para separar configuração inválida, projeto/token incorreto e payload inválido. Não invente score ou evidência para compensar a falha.
6. Após a correção, confirme o novo pipeline, `commitSha`, `pipelineId` e `evidenceId` quando disponíveis; o trend só muda após uma evidência válida posterior.

## Triagem sanitizada

| Sinal | Próxima ação |
| --- | --- |
| `401` ou `403` | Revise o secret de ingestão e o escopo do projeto, sem exibir o valor. |
| `422` | Valide `schemaVersion`, `projectId`, `pipelineId`, `commitSha` e campos obrigatórios do artefato. |
| Scanner sem saída | Confirme instalação, comando e diretório de execução; publique o erro sanitizado no artefato. |
| Upload aceito, score ausente | Compare `commitSha` e `pipelineId` do artefato com o pipeline e aguarde o processamento da evidência. |

## Guardrails

- Não envie prompts, respostas, credenciais, tokens ou logs brutos.
- Não torne o CI bloqueante sem aprovação explícita do owner/admin.
- Não altere uma configuração de CI sem revisar o diff e registrar a validação real.
