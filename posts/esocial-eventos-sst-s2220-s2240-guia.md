---
title: "eSocial SST: Guia Prático dos Eventos S-2220 e S-2240 para Empresas"
summary: "Os eventos S-2220 (ASO) e S-2240 (agentes nocivos) são obrigatórios para todas as empresas. Entenda o que declarar, os prazos e as principais inconsistências que geram rejeição."
category: "Legislativo"
uf: null
source_name: "Portal eSocial — Receita Federal"
source_url: "https://www.esocial.gov.br/documentacao"
tags: ["eSocial", "S-2220", "S-2240", "ASO", "LTCAT", "agentes nocivos", "SST"]
published_at: "2026-04-03"
---

## Contexto

O **eSocial SST** tornou-se realidade para todas as empresas brasileiras. Os eventos de Saúde e Segurança no Trabalho substituíram o envio manual de documentos como GFIP/SEFIP para dados de saúde ocupacional, e agora fazem parte do ambiente de conformidade permanente de qualquer empresa com empregados CLT.

Os dois eventos mais impactantes na operação diária das equipes SST são o **S-2220** (monitoramento da saúde do trabalhador) e o **S-2240** (condições ambientais de trabalho).

## S-2220: Monitoramento da Saúde do Trabalhador (ASO)

### O que é

O evento S-2220 registra no eSocial todos os **Atestados de Saúde Ocupacional (ASO)** emitidos para os trabalhadores: admissional, periódico, mudança de função, retorno ao trabalho e demissional.

### Prazo de envio

| Tipo de ASO | Prazo para envio no eSocial |
|---|---|
| Admissional | Antes do início das atividades do trabalhador |
| Periódico | Até o último dia do mês seguinte à emissão |
| Mudança de função | Antes da mudança efetiva |
| Retorno ao trabalho | Antes do retorno do trabalhador |
| Demissional | Até 10 dias após o desligamento |

### Campos obrigatórios no S-2220

- CPF e dados do trabalhador
- Data do exame e tipo de ASO
- CRM e dados do médico responsável
- **Resultado: APTO ou INAPTO** (campo crítico)
- Riscos ocupacionais avaliados (vinculados ao S-2240)
- Exames clínicos e complementares realizados

### Principais erros e rejeições

- ASO enviado sem vinculação com os riscos do S-2240 — o sistema cruza automaticamente
- Médico sem CRM válido na base do CFM
- Data do ASO anterior à data de admissão (sistema rejeita)
- Falta de ASO demissional — gera inconsistência no desligamento

## S-2240: Condições Ambientais do Trabalho

### O que é

O S-2240 declara as **condições ambientais de trabalho e os agentes nocivos** (físicos, químicos, biológicos, ergonômicos) aos quais cada trabalhador está exposto. É a versão eletrônica do antigo formulário PPP (Perfil Profissiográfico Previdenciário) para fins de enquadramento de insalubridade e aposentadoria especial.

### Quando enviar

- **Inicial:** quando o trabalhador inicia exposição a agentes nocivos
- **Alteração:** quando houver mudança nas condições de exposição
- **Encerramento:** quando a exposição for eliminada ou o trabalhador mudar de função

### Agentes nocivos mais declarados

| Grupo | Exemplos | NR relacionada |
|---|---|---|
| Físicos | Ruído, calor, radiação ionizante, vibrações | NR-09, NR-15 |
| Químicos | Benzeno, sílica, poeiras orgânicas, solventes | NR-09, NR-15 |
| Biológicos | Bactérias, vírus, fungos, parasitas | NR-09, NR-32 |
| Ergonômicos | Esforço físico intenso, postura inadequada | NR-17 |

### EPC e EPI no S-2240

O sistema exige declarar:
- Se há **EPC** implementado e qual é a eficácia na redução da exposição
- Se há **EPI** fornecido e o número do CA — o sistema valida o CA automaticamente
- **Nível de redução efetiva da exposição** após os controles

> Atenção: declarar EPI como neutralizador do risco sem laudo técnico que comprove a eficácia pode ser questionado pela Previdência na análise de aposentadoria especial.

## Integração S-2220 × S-2240

O eSocial cruza automaticamente os dados dos dois eventos. Inconsistências comuns:

- Trabalhador com ASO (S-2220) citando exposição a ruído, mas sem S-2240 declarando esse agente
- S-2240 declarando agente biológico para um cargo que, no S-2220, não tem exames complementares correspondentes (hepatite B para saúde, por exemplo)
- Médico do ASO diferente do responsável técnico pelo PCMSO cadastrado

## Impacto para a Empresa

1. **Mapear todos os cargos e funções** e vincular cada um aos agentes nocivos do PGR/LTCAT antes de enviar o S-2240 — a base documental deve existir antes do evento.
2. **Garantir que o PCMSO esteja atualizado** e que os exames complementares do ASO correspondam aos agentes declarados no S-2240.
3. **Verificar os CRMs dos médicos** que assinam ASOs — o sistema rejeita automaticamente CRMs inativos ou com restrição.
4. **Implementar controle de prazo de ASOs periódicos** — trabalhador com ASO vencido e S-2220 não enviado gera passivo perante a Previdência.
5. **Auditar os S-2240 enviados** para garantir que os EPIs declarados têm CA válido no CAEPI.
6. **Não declarar EPI como neutralizador** de ruído acima de 85 dB sem laudo de atenuação — isso impacta diretamente o direito à aposentadoria especial do trabalhador e pode gerar ação trabalhista futura.

> **Impacto previdenciário:** Erros nos eventos S-2240 podem prejudicar o trabalhador no reconhecimento de aposentadoria especial. O empregador pode ser responsabilizado por danos previdenciários em ações judiciais.

## Referências

- [Manual de Orientação do eSocial — Versão atual](https://www.esocial.gov.br/documentacao)
- [Leiaute do S-2220 — Tabela de eventos SST](https://www.esocial.gov.br/documentacao)
- [Leiaute do S-2240 — Tabela de agentes nocivos](https://www.esocial.gov.br/documentacao)
- [CAEPI — Consulta de CA de EPI](https://caepi.mte.gov.br)
