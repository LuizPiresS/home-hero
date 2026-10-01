# Política do cache de contexto

O cache reduz pesquisas repetidas, mas não substitui o código, testes, decisões registradas ou documentação oficial.

## Ordem de consulta

1. Leia as instruções da tarefa e os arquivos diretamente afetados.
2. Leia `.specs/STATE.md` e documentos canônicos do projeto.
3. Consulte entradas válidas do cache.
4. Confirme no código-fonte e nos testes relacionados.
5. Consulte a fonte oficial somente se a dúvida persistir.

Uma entrada vencida é uma pista, não uma fonte de verdade.

## Recuperação seletiva

- Consulte primeiro `id`, `scope`, tags, validade e resumo.
- Abra o conteúdo completo somente da entrada pertinente.
- Recupere no máximo três entradas e 2.000 tokens por consulta; justifique exceções no handoff.
- Ao atingir aproximadamente 60% do contexto, resuma o trabalho e descarte material já representado por entrada válida.

Fluxo: `dúvida → índice → entrada válida específica → código afetado → fonte oficial, se necessário`.

## Tipos e validade

| Tipo | Diretório | Uso | Validade padrão |
| --- | --- | --- | --- |
| Canônica | `canonical/` | convenções e decisões estáveis | até a fonte mudar |
| Pesquisa | `research/` | resumo de fonte externa | 7 dias para pagamentos; 30 dias para demais APIs |
| Tarefa | `tasks/` | descoberta temporária | fim da tarefa |

Promova uma entrada de tarefa a canônica somente com teste, código ou aprovação humana.

## Contrato da entrada

Cada arquivo trata um tema e começa com YAML. Exija `source`, `checkedAt`, `expiresAt` e `status`. Opcionalmente, declare `localSources` para que `aops cache check` detecte mudanças locais.

Não registre credenciais, payloads reais, dados pessoais, prompts, respostas brutas ou logs.

## Invalidação

- Invalide a entrada canônica no mesmo pull request/commit quando o código ou contrato local mudar.
- Reconsulte a fonte primária antes de renovar uma pesquisa vencida.
- Marque `status: stale` e explique o conflito quando a entrada divergir de código, teste ou decisão canônica.
- Não estenda TTL sem consultar a fonte indicada.
