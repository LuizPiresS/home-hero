---
name: project-architecture
description: Conduz análise arquitetural profunda de um projeto, aprovação conversacional do tech lead e publicação da arquitetura canônica no backend. Use quando um tech lead pedir análise, criação, revisão ou atualização de ARCHITECTURE.md.
---

# Arquitetura do projeto

Use esta skill para produzir contexto arquitetural confiável sem criar etapas manuais desnecessárias.

## Fluxo

1. Execute `aops context` e consulte o `ARCHITECTURE.md` atual, se existir.
2. Examine o repositório em profundidade: entradas, aplicações, pacotes, fronteiras, dados, integrações, dependências, testes, configuração e riscos. Baseie cada afirmação em evidência verificável.
3. Prepare a prévia do Markdown com visão do sistema, componentes, fluxos, decisões, dependências, riscos, lacunas e fontes consultadas.
4. Apresente um resumo objetivo e pergunte ao tech lead: `Aprova publicar esta arquitetura?`.
5. Sem resposta afirmativa explícita, não escreva nem publique o documento.
6. Após o aceite, salve a prévia aprovada e execute `aops architecture publish --file ARCHITECTURE.md`.
7. Confirme versão, data e hash retornados; o Markdown devolvido pela API é a cópia canônica local.

## Publicação

- Use `aops architecture analyze` somente como apoio determinístico para inventariar fontes; ele não substitui a análise profunda do agente.
- Publique uma única vez após a aprovação; não peça ao tech lead um segundo comando ou aprovação no dashboard.

## Guardrails

