# Planejamento da plataforma Home Hero

## 1. Objetivo e visão

A Home Hero será uma plataforma de intermediação entre contratantes e profissionais liberais. O contratante descreve uma necessidade, anexa fotos quando necessário, encontra profissionais adequados e negocia os detalhes por chat. O profissional apresenta um orçamento, informa quando pode iniciar e executa a cobrança diretamente do contratante.

O produto deve reduzir o tempo entre a solicitação de um serviço e a contratação de um profissional confiável, usando categoria, proximidade e disponibilidade como critérios de descoberta.

## 2. Escopo inicial

### Contratante

- Criar conta e validar e-mail.
- Criar uma solicitação de serviço com categoria, descrição detalhada, localização, prazo desejado e fotos opcionais.
- Buscar profissionais por categoria, nome, proximidade e disponibilidade.
- Enviar a solicitação a um profissional específico ou aos profissionais disponíveis que atendam aos critérios.
- Receber e comparar orçamentos.
- Conversar com o profissional após uma resposta.
- Aceitar um orçamento, acompanhar seus estados e avaliar o profissional.

### Profissional liberal

- Criar conta e validar e-mail.
- Completar perfil profissional, categorias, área de atendimento e localização.
- Cadastrar serviços e valores de referência.
- Configurar agenda e disponibilidade.
- Receber solicitações compatíveis e responder com valor e próxima data possível de início.
- Aceitar ou rejeitar uma solicitação e atualizar o estado do orçamento.
- Conversar com o contratante após responder.
- Avaliar o contratante.
- Pagar mensalidade à plataforma.

### Plataforma

- Expor a API e as interfaces de contratante e profissional.
- Integrar gateway de pagamento, serviço de e-mail e serviço de mapas.
- Processar e-mails por filas.
- Manter orçamentos em aberto em cache para consultas frequentes.
- Aplicar autenticação, autorização, auditoria e proteção dos dados pessoais.

Fora do primeiro escopo: receber o pagamento do serviço em nome do profissional, intermediar disputa financeira, emitir nota fiscal e garantir a execução do serviço. Esses pontos dependem de decisões de negócio e regulatórias.

## 3. Regras de negócio consolidadas

1. Existem dois papéis de conta: `contratante` e `profissional`.
2. A conta só pode usar as funções protegidas após a validação do e-mail.
3. O contratante pode procurar por nome, categoria, proximidade ou agenda disponível.
4. Uma solicitação pode ser direcionada a um profissional escolhido ou distribuída aos profissionais disponíveis que atendam aos critérios.
5. A solicitação deve conter uma descrição suficiente para a elaboração do orçamento e pode conter fotos.
6. Um novo orçamento começa sempre como `pendente`.
7. O profissional pode aceitar ou rejeitar a solicitação e, ao responder, informa valor e próxima data disponível.
8. A resposta do profissional abre um chat entre contratante e profissional para negociação.
9. O contratante paga diretamente ao profissional.
10. O profissional é responsável pela cobrança e pelo recebimento do serviço.
11. Contratante e profissional podem avaliar um ao outro, preferencialmente após o encerramento do serviço.
12. A plataforma cobra mensalidade do profissional e usa um gateway de pagamento para essa cobrança.

### Máquina de estados do orçamento

Fluxo mínimo definido pelas regras:

```text
PENDENTE -> AGUARDANDO_RESPOSTA -> ACEITO -> FECHADO
```

Interpretação proposta:

- `PENDENTE`: solicitação criada e ainda não encaminhada ou processada.
- `AGUARDANDO_RESPOSTA`: solicitação encaminhada ao profissional e aguardando ação.
- `ACEITO`: contratante aceitou o orçamento; o serviço está contratado.
- `FECHADO`: serviço concluído ou encerrado administrativamente.

Rejeição, expiração e cancelamento são necessários para uma operação real, mas ainda não foram definidos nas regras. Devem ser adicionados como estados ou eventos antes do lançamento, sem permitir transições implícitas ou edição silenciosa do histórico.

## 4. Arquitetura proposta

Adotar uma aplicação web/mobile consumindo uma API de negócio. A separação inicial deve ser modular, permitindo evolução sem antecipar microserviços.

### Componentes

- **Clientes**: interface do contratante, interface do profissional e área administrativa futura.
- **API**: autenticação, perfis, catálogo, descoberta, solicitações, orçamentos, chat, avaliações e assinaturas.
- **Banco relacional**: fonte de verdade para contas, serviços, solicitações, orçamentos, mensagens, avaliações e cobranças.
- **Cache**: orçamentos em aberto e dados de busca de curta duração; nunca substituir o banco como fonte de verdade.
- **Fila e workers**: validação de e-mail, notificações, sincronização de cobrança e tarefas de expiração.
- **Armazenamento de objetos**: fotos das solicitações e imagens de perfil, com URLs temporárias e controle de acesso.
- **Provedores externos**: gateway de pagamento, e-mail e mapas/geocodificação.

Todas as integrações externas devem ser encapsuladas por adaptadores. Webhooks precisam ser idempotentes, autenticados e registrados para reprocessamento.

## 5. Modelo de domínio inicial

- `Usuario`: identidade, papel, e-mail, status de validação e preferências.
- `PerfilProfissional`: nome público, descrição, categorias, área de atendimento e localização aproximada.
- `Servico`: serviço oferecido, categoria, descrição e valor de referência.
- `Disponibilidade`: agenda, horários e bloqueios do profissional.
- `SolicitacaoServico`: contratante, categoria, descrição, localização, prazo, fotos e status.
- `Orcamento`: solicitação, profissional, valor, data possível de início, status e timestamps de transição.
- `Conversa` e `Mensagem`: participantes, orçamento associado, conteúdo, anexos e leitura.
- `Avaliacao`: autor, alvo, orçamento/serviço, nota, comentário e estado de publicação.
- `Assinatura`: profissional, plano, ciclo, status e identificadores do gateway.
- `EventoIntegracao`: tipo, provedor, chave de idempotência, payload mínimo, tentativas e resultado.

Regras de consistência importantes: apenas participantes podem ler uma conversa; um orçamento aceito não pode ser aceito novamente; uma avaliação deve estar vinculada ao serviço; nenhuma credencial ou dado completo de cartão deve ser armazenado pela plataforma.

## 6. Fluxos prioritários

### Cadastro e acesso

1. Usuário escolhe o papel e informa dados mínimos.
2. A plataforma envia e-mail de validação por fila.
3. O usuário confirma o token com validade limitada.
4. A API libera as funções do papel e registra o evento de auditoria.

### Solicitação e descoberta

1. Contratante escolhe uma categoria e descreve o serviço.
2. A plataforma valida campos, armazena fotos com segurança e geocodifica a localização.
3. O contratante filtra por nome, categoria, raio e disponibilidade.
4. A solicitação é enviada ao profissional escolhido ou ao conjunto elegível.
5. Os orçamentos abertos são atualizados no cache e persistidos no banco.

### Resposta, negociação e contratação

1. Profissional recebe notificação e consulta a solicitação.
2. Ele responde com valor e próxima data possível, rejeita ou solicita esclarecimentos.
3. Ao responder, a plataforma cria/abre a conversa exclusiva dos participantes.
4. O contratante aceita um orçamento; a API valida concorrência e altera o estado.
5. Os demais orçamentos da mesma solicitação devem ser tratados conforme decisão de produto: encerrados automaticamente ou mantidos até expiração.
6. Ao final, o orçamento passa a `fechado` e as avaliações são habilitadas.

### Mensalidade do profissional

1. Profissional escolhe um plano.
2. Gateway cria a assinatura e comunica eventos por webhook.
3. A plataforma atualiza o status de pagamento de forma idempotente.
4. Falha ou cancelamento de assinatura deve produzir aviso e política de carência definida pelo negócio.

## 7. Fases de entrega

### Fase 0 — decisões e fundação

- Confirmar estados, cancelamento, expiração, múltiplos orçamentos e política de avaliações.
- Definir identidade visual, canais (web, mobile ou ambos), regiões atendidas e categorias iniciais.
- Escolher provedores de pagamento, e-mail, mapas, armazenamento e cache.
- Configurar ambientes, observabilidade, CI, migrações e gestão de segredos.

### Fase 1 — MVP operacional

- Cadastro, login e validação de e-mail.
- Perfis e catálogo de serviços do profissional.
- Agenda/disponibilidade básica.
- Criação de solicitação com fotos.
- Busca por categoria, nome e proximidade.
- Envio direcionado, resposta com valor/data e máquina de estados básica.
- Chat textual associado ao orçamento.
- Mensalidade do profissional e webhooks do gateway.

### Fase 2 — confiança e eficiência

- Avaliações recíprocas após fechamento.
- Distribuição para profissionais disponíveis.
- Notificações configuráveis e centro de notificações.
- Cache de consultas e workers com retry/dead-letter queue.
- Moderação, denúncia, bloqueio e painel administrativo.

### Fase 3 — escala e evolução

- Busca geoespacial e ranking por relevância.
- Métricas de conversão, tempo de resposta e retenção.
- Expansão de categorias e regiões.
- Eventual separação de módulos somente diante de evidência de carga ou autonomia operacional.

## 8. Requisitos não funcionais

- **Segurança**: hash de senhas, tokens com expiração, autorização por papel e recurso, proteção contra abuso, validação de anexos e logs sem dados sensíveis.
- **Privacidade**: consentimento e finalidade para dados pessoais, localização aproximada na descoberta e política de retenção/exclusão compatível com a LGPD.
- **Confiabilidade**: idempotência em comandos e webhooks, transações para mudança de orçamento, retries com backoff e fila de falhas.
- **Observabilidade**: logs estruturados, métricas de API/filas/integrações, rastreamento de erros e auditoria das transições.
- **Performance**: paginação, índices por categoria/localização/status, cache com TTL e processamento assíncrono de e-mails e geocodificação.
- **Acessibilidade**: formulários navegáveis por teclado, mensagens de erro claras, contraste adequado e anexos com descrição quando aplicável.

## 9. Critérios de aceite do MVP

- Um contratante validado consegue criar uma solicitação com descrição e, opcionalmente, foto.
- Um profissional validado consegue manter perfil, serviço, valor de referência e disponibilidade.
- A busca retorna profissionais compatíveis por categoria e proximidade, sem expor localização exata indevidamente.
- O orçamento é criado como `PENDENTE` e só muda por transições autorizadas e auditadas.
- O profissional consegue responder com valor e data; isso disponibiliza o chat aos dois participantes.
- O contratante consegue aceitar um orçamento sem permitir dupla aceitação concorrente.
- A mensalidade cria/atualiza assinatura via gateway e tolera reentrega de webhook.
- O envio de e-mail ocorre por fila e falhas ficam visíveis para reprocessamento.
- Nenhuma cobrança do serviço é processada pela plataforma no MVP.

## 10. Decisões pendentes e riscos

Antes da implementação da Fase 1, o responsável pelo produto deve decidir:

- Quais campos e documentos são obrigatórios para validar um profissional.
- Se a localização será endereço completo, bairro, coordenada aproximada ou área de atendimento.
- Se o profissional pode enviar mais de um orçamento para a mesma solicitação.
- Como funcionam rejeição, cancelamento, expiração, reabertura e no-show.
- O que significa exatamente `fechado`: serviço concluído, encerrado pelo contratante ou encerrado por prazo.
- Se aceitar um orçamento encerra automaticamente os demais.
- Momento e regras para avaliar; edição, moderação e direito de resposta.
- Planos, preço, período de carência, falha de pagamento e bloqueio por inadimplência.
- Retenção de fotos, mensagens e dados de localização.
- SLA de suporte, denúncias e resolução de conflitos.

Principais riscos: dependência de disponibilidade dos provedores externos, exposição indevida de localização ou fotos, fraude em avaliações, concorrência na aceitação de orçamentos e ambiguidade sobre responsabilidade financeira. Cada risco deve ter teste e métrica antes da abertura pública.

## 11. Rastreabilidade das regras

| Regra em `business-rules.md` | Entrega planejada |
| --- | --- |
| Cadastro e validação de e-mail dos dois perfis | Autenticação e fluxo de validação — Fase 1 |
| Busca por nome, categoria, proximidade e agenda | Descoberta e índices geográficos — Fases 1 e 3 |
| Descrição e fotos na solicitação | Solicitação e armazenamento seguro — Fase 1 |
| Orçamento inicia pendente e possui fluxo de estados | Domínio, transações e auditoria — Fase 1 |
| Chat após resposta do profissional | Conversas vinculadas ao orçamento — Fase 1 |
| Avaliação recíproca | Avaliações pós-fechamento — Fase 2 |
| Pagamento direto entre contratante e profissional | Escopo e critérios do MVP |
| Mensalidade do profissional | Assinaturas e gateway — Fase 1 |
| E-mail, mapas, filas e cache | Integrações e infraestrutura — Fases 1 e 2 |
