---
name: research
description: Pesquisa uma questão técnica em fontes primárias e apresenta conclusões citadas, distinguindo fatos, inferências e incertezas. Use para APIs, bibliotecas, padrões e decisões técnicas; não use para criar relatórios no repositório sem aprovação.
---

# Pesquisa técnica

> Adaptada de `mattpocock/skills` no commit `6654f6b60cd9d5be8b54c6fafe44346dabeb3b76`.
> Diferenças: pesquisa é síncrona e somente leitura por padrão; não cria
> arquivos nem delega a subagentes automaticamente.

1. Delimite a pergunta, a decisão que ela suporta e o que está fora do escopo.
2. Consulte primeiro o código, padrões e documentação do projeto. Em seguida,
   use documentação oficial, especificações, source code e APIs de primeira
   parte como fontes primárias.
3. Para cada conclusão, apresente a fonte, URL ou caminho, data de consulta e
   a evidência que sustenta a afirmação. Separe claramente fatos, inferências e
   itens que permanecem incertos.
4. Quando fontes confiáveis divergirem, descreva a divergência sem inventar uma
   resposta. Quando não houver evidência suficiente, diga explicitamente que a
   conclusão é desconhecida.
5. Entregue a síntese na conversa por padrão. Só grave uma nota Markdown após
   aprovação explícita do usuário e no local já adotado pelo repositório.

## Limites

Não envie código, prompts, logs, credenciais, tokens ou conteúdo privado a
fontes externas. Uma decisão que altere arquitetura deve seguir
`project-architecture`; a pesquisa fornece evidência, mas não publica a
arquitetura nem toma a decisão pelo tech lead.
