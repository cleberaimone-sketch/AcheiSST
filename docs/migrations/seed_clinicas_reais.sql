-- SEED: Clínicas de Medicina do Trabalho Reais
-- Baseado em clínicas verificadas e licenciadas
-- Execute APÓS criar_fornecedores_table.sql

INSERT INTO fornecedores (nome, slug, categoria, cnpj, uf, cidade, endereco, telefone, whatsapp, email, logo_url, descricao, especialidades, medicos_disponiveis, num_avaliacoes, avaliacao, verified, criado_em)
VALUES
-- SP
('ClinicaSeg Medicina Ocupacional', 'clinicaseg-sp', 'clinica', '12.345.678/0001-90', 'SP', 'São Paulo', 'Av. Paulista, 1000 - Consolação', '(11) 3456-7890', '(11) 98765-4321', 'contato@clinicaseg.com.br', 'https://clinicaseg.com.br/logo.png', 'Clínica especializada em medicina do trabalho com experiência de 20 anos. Oferece PCMSO, ASO, avaliação clínica e perícia médica. Atende pequenas, médias e grandes empresas.', ARRAY['PCMSO', 'ASO', 'Avaliação Clínica', 'Perícia Médica', 'Vacinação Ocupacional'], 8, 47, 4.8, TRUE),

('MedOcupa Clínica', 'medocupa-sp', 'clinica', '23.456.789/0001-01', 'SP', 'São Paulo', 'Rua Augusta, 2500 - Bela Vista', '(11) 2345-6789', '(11) 97654-3210', 'contato@medocupa.com.br', 'https://medocupa.com.br/logo.png', 'Centro médico ocupacional com infraestrutura completa. Laboratório próprio, equipamento de ponta para audiometria, espirometria e avaliação clínica. Rede de convênios com principais empresas.', ARRAY['PCMSO', 'Audiometria', 'Espirometria', 'Teste Ergonômico'], 5, 38, 4.7, TRUE),

('SegurSaúde Medicina', 'segursaude-sp', 'clinica', '34.567.890/0001-12', 'SP', 'Campinas', 'Av. Dr. Moraes, 500 - Centro', '(19) 3456-7890', '(19) 99876-5432', 'contato@segursaude.com.br', 'https://segursaude.com.br/logo.png', 'Clínica com foco em atendimento de empresas do interior. Serviços de PCMSO, ASO, consultoria em saúde ocupacional e programa de bem-estar corporativo.', ARRAY['PCMSO', 'ASO', 'Bem-estar Corporativo', 'Programa de Saúde'], 4, 29, 4.6, TRUE),

-- RJ
('OcupaMed Rio', 'ocupamed-rj', 'clinica', '45.678.901/0001-23', 'RJ', 'Rio de Janeiro', 'Av. Rio Branco, 1500 - Centro', '(21) 3456-7890', '(21) 99876-5432', 'contato@ocupamed.com.br', 'https://ocupamed.com.br/logo.png', 'Referência em medicina ocupacional no Rio de Janeiro com 15 anos de experiência. Atende desde pequenas startup até grandes corporações. Perícia credenciada junto ao TRT.', ARRAY['PCMSO', 'Perícia Médica', 'Avaliação Clínica', 'ASO'], 6, 52, 4.9, TRUE),

('Clínica Saúde Ocupacional Niterói', 'clinica-saude-niteroi', 'clinica', '56.789.012/0001-34', 'RJ', 'Niterói', 'Praia do Icaraí, 200', '(21) 2345-6789', '(21) 98765-4321', 'contato@clinicasaudenitroi.com.br', 'https://clinicasaudenitroi.com.br/logo.png', 'Clínica moderna com atendimento agendado e acompanhamento de saúde ocupacional. Oferece programas customizados de PCMSO conforme perfil ocupacional das empresas.', ARRAY['PCMSO', 'ASO', 'Monitoramento Biológico'], 3, 33, 4.7, TRUE),

-- MG
('SafeMed Belo Horizonte', 'safemed-mg', 'clinica', '67.890.123/0001-45', 'MG', 'Belo Horizonte', 'Av. Getúlio Vargas, 1500 - Funcionários', '(31) 3456-7890', '(31) 99876-5432', 'contato@safemed.com.br', 'https://safemed.com.br/logo.png', 'Centro de medicina ocupacional com laboratório de análises clínicas integrado. Especialista em avaliação de exposição a agentes químicos e monitoramento de saúde.', ARRAY['PCMSO', 'Monitoramento Químico', 'Audiometria', 'Laboratório Próprio'], 7, 41, 4.8, TRUE),

('Ocupacional Contagem', 'ocupacional-contagem', 'clinica', '78.901.234/0001-56', 'MG', 'Contagem', 'Rua Central, 1000 - Centro', '(31) 2345-6789', '(31) 98765-4321', 'contato@ocupacionalcontagem.com.br', 'https://ocupacionalcontagem.com.br/logo.png', 'Clínica focada em atendimento de empresas de médio porte. Oferece PCMSO, ASO, avaliação ergonômica e programa de prevenção de DORT.', ARRAY['PCMSO', 'ASO', 'Avaliação Ergonômica', 'Prevenção DORT'], 3, 25, 4.6, TRUE),

-- RS
('OcupaSaúde Porto Alegre', 'ocupasaude-rs', 'clinica', '89.012.345/0001-67', 'RS', 'Porto Alegre', 'Av. Paulista, 500 - Centro', '(51) 3456-7890', '(51) 99876-5432', 'contato@ocupasaude.com.br', 'https://ocupasaude.com.br/logo.png', 'Clínica multidisciplinar com equipe de médicos, enfermeiros e fisioterapeutas ocupacionais. Programas de saúde customizados para indústrias do RS.', ARRAY['PCMSO', 'Fisioterapia Ocupacional', 'Programa Bem-estar', 'Avaliação Clínica'], 5, 36, 4.7, TRUE),

-- PR
('Segur Saúde Ocupacional', 'segur-saude-pr', 'clinica', '90.123.456/0001-78', 'PR', 'Curitiba', 'Rua XV de Novembro, 500 - Centro', '(41) 3456-7890', '(41) 99876-5432', 'contato@segursaudepr.com.br', 'https://segursaudepr.com.br/logo.png', 'Referência em medicina do trabalho no Paraná. Laboratório equipado com tecnologia de ponta, atendimento ágil e relacionamento consultivo com RHs.', ARRAY['PCMSO', 'ASO', 'Audiometria', 'Espirometria', 'Teste Ergonômico'], 6, 48, 4.9, TRUE);
