---
name: context-cache
description: Consulta, cria, atualiza e invalida conhecimento reutilizável no cache local de contexto. Use ao pesquisar `docs/cache/`, executar `aops cache`, registrar descobertas verificadas, revisar uma entrada vencida ou relacionar uma entrada a fontes locais.
---

# Cache de contexto

Use o cache para evitar pesquisas repetidas, nunca para substituir o código, testes, decisões canônicas ou fontes oficiais.

## Consultar

Quando `aops task start` retornar `contextCache.suggestions`, trate-as como o índice já filtrado para a tarefa: confirme o fato no código e use `aops cache search --query "<termos>" --include-content` somente para a entrada necessária.

O índice automático é local e derivado: `aops task start` o atualiza antes de retornar `contextCache.references`; `aops cache build --write` permanece disponível para atualização antecipada. Referências retornadas por `aops cache brief` ou `contextCache.references` apontam a fonte primária; não são fatos canônicos nem conteúdo para sincronização.

1. Leia `references/policy.md` para a política e o contrato de entrada.
2. Consulte primeiro o índice com `aops cache list --scope <escopo>` ou pesquise com `aops cache search --query "<termos>" --scope <escopo>`.
3. Use `--include-content` somente para a entrada que responde à dúvida atual.
4. Confirme o fato no código afetado; se ainda houver dúvida, consulte a fonte primária.

Por padrão, a CLI retorna somente entradas válidas, no máximo três resultados e até 2.000 tokens de conteúdo. Use `--include-stale` apenas para investigação, nunca como fonte de verdade.

## Escrever e revalidar

1. Antes de criar ou atualizar uma entrada, obtenha autorização explícita para escrita.
2. Registre um tema por arquivo com metadados obrigatórios: `source`, `checkedAt`, `expiresAt` e `status`.
3. Execute `aops cache check` antes de reutilizar uma entrada ou após mudar uma `localSources` declarada.
4. Revalide a fonte indicada antes de renovar o TTL; marque conflitos como `status: stale`.

## Guardrails

- Não registre credenciais, payloads reais, dados pessoais, prompts, respostas brutas ou logs.
- Não envie o conteúdo do cache para sincronização ou serviços externos.
- Não estenda `expiresAt` sem consultar a fonte registrada.
