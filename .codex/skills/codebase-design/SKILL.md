---
name: codebase-design
description: Avalia e desenha módulos profundos, seams limpos e interfaces testáveis. Use ao decidir fronteiras ou reduzir complexidade de um módulo; não use para publicar arquitetura ou refatorar além do escopo aprovado.
---

# Design de código

> Adaptada de `mattpocock/skills` no commit `6654f6b60cd9d5be8b54c6fafe44346dabeb3b76`.
> Diferenças: usa o vocabulário de módulos profundos, mas preserva a
> arquitetura canônica e as aprovações do aops.

Projete módulos profundos: comportamento relevante escondido atrás de uma
interface pequena, em um seam claro e testável por essa interface.

- **Módulo**: unidade com interface e implementação, de uma função a um pacote.
- **Interface**: tudo que quem chama precisa conhecer: tipos, invariantes,
  ordenação, falhas, configuração e características de desempenho.
- **Seam**: local onde o comportamento pode variar sem alterar quem o usa.
- **Adapter**: implementação concreta que satisfaz uma interface em um seam.
- **Profundidade**: alavancagem entregue por uma interface pequena, não volume
  de linhas de implementação.

Ao propor um design, use este roteiro:

1. Consulte `ARCHITECTURE.md`, as convenções e os testes existentes; preserve
   as fronteiras documentadas.
2. Descreva o problema e os chamadores antes de escolher a forma do módulo.
3. Avalie se a interface pode ter menos métodos, parâmetros mais simples ou
   complexidade interna melhor encapsulada.
4. Escolha um seam apenas quando houver variação real. Um único adapter não
   justifica abstração especulativa.
5. Aplique o teste de remoção: se retirar o módulo espalharia complexidade pelos
   chamadores, ele cria localidade; se apenas encaminha chamadas, é superficial.
6. Faça testes atravessarem a interface. Dependências devem ser recebidas e
   resultados observáveis devem ser retornados em vez de depender de efeitos
   colaterais ocultos.

## Limites

Esta skill orienta design, não autoriza refatoração. Para mudança estrutural,
prepare uma prévia fundamentada e siga `project-architecture`; publicação de
`ARCHITECTURE.md`, criação de arquivos e implementação exigem as aprovações e
o fluxo AgentOps aplicáveis.
