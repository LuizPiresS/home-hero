---
name: diagnosing-bugs
description: Diagnostica bugs e regressões com uma reprodução observável antes de propor ou aplicar uma correção. Use para falhas difíceis, intermitentes ou regressões de desempenho; não use para implementar features novas.
---

# Diagnóstico de bugs

> Adaptada de `mattpocock/skills` no commit `6654f6b60cd9d5be8b54c6fafe44346dabeb3b76`.
> Diferenças: mantém o ciclo de diagnóstico, mas não cria arquivos, commits,
> tarefas, instrumentação produtiva ou subagentes sem a autorização exigida
> pelo projeto.

1. Antes de alterar código, siga o ciclo AgentOps vigente: `aops context`,
   `aops workflow check` e a sessão ativa. Consulte o `AGENTS.md` e testes
   próximos antes de formar uma teoria.
2. Crie um loop de reprodução observável para o sintoma exato: um teste,
   comando ou cenário que possa falhar para este bug. Torne-o específico,
   determinístico, rápido e executável sem intervenção humana quando possível.
3. Rode o loop, confirme o sintoma e minimize o cenário sem trocar o problema
   relatado por uma falha apenas parecida.
4. Só então formule de três a cinco hipóteses falsificáveis, ordenadas por
   evidência. Para cada uma, declare a previsão que uma sonda pode confirmar
   ou refutar.
5. Instrumente apenas a fronteira que diferencia uma hipótese, uma variável
   por vez. Prefira debugger ou métricas locais a logs amplos. Marque toda
   instrumentação temporária e remova-a antes da conclusão.
6. Antes da correção, transforme a reprodução minimizada em teste de regressão
   no seam que exercita o padrão real. Aplique a menor correção, execute o
   teste e rode novamente o cenário original.

## Sem reprodução observável

Não avance para hipótese ou correção por intuição. Informe o que foi tentado e
peça um artefato sanitizado, acesso ao ambiente reprodutível ou autorização
específica para instrumentação temporária. Instrumentação em produção, acesso
a credenciais e deploy requerem aprovação explícita.

## Conclusão

Registre somente validações reais com `aops validation add`. A entrega com
arquivos alterados continua sujeita a `aops agent complete --sync`, handoff e
sincronização conforme as skills AgentOps aplicáveis. Nunca registre prompts,
respostas brutas, credenciais, tokens ou logs brutos em arquivos ou eventos.
