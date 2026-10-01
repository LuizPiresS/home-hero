---
name: code-review
description: Revisa um diff contra padrões documentados do repositório e contra sua especificação de origem. Use para branches, PRs e mudanças em andamento; não use para implementar ou corrigir automaticamente os achados.
---

# Revisão de código

> Adaptada de `mattpocock/skills` no commit `6654f6b60cd9d5be8b54c6fafe44346dabeb3b76`.
> Diferenças: preserva os dois eixos de revisão, mas não exige subagentes nem
> cria commits, tarefas ou edições a partir dos achados.

1. Peça ou determine um ponto-base explícito. Confirme que a referência existe
   e que `git diff <base>...HEAD` não está vazio antes da análise.
2. Localize a especificação de origem, nesta ordem: referência nos commits,
   caminho informado pelo usuário, `.specs/features/` ou documentação próxima.
   Se não houver spec, declare que o eixo de requisitos não pode ser avaliado.
3. Localize as normas aplicáveis: `AGENTS.md`, `ARCHITECTURE.md`, convenções e
   testes próximos. A documentação do repositório sempre prevalece sobre
   heurísticas genéricas.
4. Revise os eixos abaixo separadamente. Faça a análise de modo somente leitura
   e apresente evidência verificável para cada achado: arquivo/linha ou hunk,
   regra ou requisito relacionado, impacto e recomendação concreta.

## Padrões

Verifique aderência às convenções, fronteiras arquiteturais, testes e erros
observáveis. Trate smells como heurísticas, não como violações automáticas; não
reporte como problema aquilo que já é garantido por tooling.

## Especificação

Verifique requisitos ausentes, implementação parcial, comportamento incorreto e
escopo adicional sem justificativa. Cite o requisito ou critério de aceite que
sustenta cada observação.

## Saída e limites

Separe os achados em `Padrões` e `Especificação`; não os combine nem os
reordene entre eixos. Identifique certeza, risco e sugestão. A revisão não
altera arquivos, não abre tarefas, não faz commits e não executa sync. Qualquer
correção segue a autorização do usuário e o fluxo `tlc-spec-driven`/AgentOps.
