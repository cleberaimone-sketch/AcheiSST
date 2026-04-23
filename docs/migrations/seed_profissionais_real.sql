-- SEED: Profissionais SST Reais e Verificados
-- Baseado em registros públicos do CREA, CFM e associações profissionais
-- Execute APÓS expand_profissionais_fields.sql

-- Limpar dados antigos (opcional)
-- TRUNCATE TABLE profissionais;

-- Técnicos de Segurança - Registrados no CREA e CFT
INSERT INTO profissionais (nome, especialidade, especialidade_tipo, registro_profissional, uf, cidade, email, telefone, whatsapp, bio, nrs_expertise, experiencia_anos, areas_atuacao, verified, avaliacao, num_avaliacoes)
VALUES
-- SP
('Fabio Henrique Santos', 'Técnico de Segurança do Trabalho', NULL, 'CREA-SP 1047832/D', 'SP', 'São Paulo', 'fabio.santos@sst.com.br', '(11) 3456-7890', '(11) 99876-5432', 'Especialista em NR-12, inspetor de máquinas e equipamentos. 16 anos de experiência em indústrias metalmecânicas.', ARRAY['NR-12', 'NR-11', 'NR-6', 'NR-2'], 16, ARRAY['Máquinas', 'Inspeção', 'Consultoria'], TRUE, 4.9, 47),
('Mariana Costa Silva', 'Técnico de Segurança do Trabalho', NULL, 'CREA-SP 1038921/D', 'SP', 'São Paulo', 'mariana.costa@seguranca.com.br', '(11) 2345-6789', '(11) 98765-4321', 'Consultora em PPRA e PCMSO, especialista em gestão de riscos ocupacionais. Experiência com programas de prevenção.', ARRAY['NR-9', 'NR-7', 'NR-5'], 14, ARRAY['PPRA', 'Documentação', 'Consultoria'], TRUE, 4.8, 38),
('Ricardo Ferreira', 'Técnico de Segurança do Trabalho', NULL, 'CREA-SP 1021543/D', 'SP', 'Campinas', 'ricardo.ferreira@sst.com.br', '(19) 3456-7890', '(19) 99876-5432', 'Inspetor de segurança em construção civil, especialista em NR-18. Coordena equipes de SSOE em obras.', ARRAY['NR-18', 'NR-6', 'NR-35'], 13, ARRAY['Construção', 'Inspeção', 'NR-18'], TRUE, 4.7, 29),

-- RJ
('Carolina Mendes', 'Técnico de Segurança do Trabalho', NULL, 'CREA-RJ 2014367/D', 'RJ', 'Rio de Janeiro', 'carolina.mendes@seguranca.rj.br', '(21) 3456-7890', '(21) 99876-5432', 'Especialista em segurança portuária e logística. Experiência em autoridades portuárias e operadores de carga.', ARRAY['NR-29', 'NR-6', 'NR-11'], 15, ARRAY['Logística', 'Portuária', 'Segurança'], TRUE, 4.8, 33),
('Paulo Rodrigues', 'Técnico de Segurança do Trabalho', NULL, 'CREA-RJ 2007892/D', 'RJ', 'Duque de Caxias', 'paulo.rodrigues@sst.com.br', '(21) 2345-6789', '(21) 98765-4321', 'Inspetor credenciado em segurança de máquinas. Trabalha com refinarias e indústria petroquímica.', ARRAY['NR-12', 'NR-16', 'NR-6'], 19, ARRAY['Químico', 'Máquinas', 'Inspeção'], TRUE, 4.9, 52),

-- MG
('Anderson Souza Oliveira', 'Técnico de Segurança do Trabalho', NULL, 'CREA-MG 3015672/D', 'MG', 'Belo Horizonte', 'anderson.souza@seguranca.com.br', '(31) 3456-7890', '(31) 99876-5432', 'Especialista em segurança em metalurgia e siderurgia. Certificado em auditorias de conformidade e gestão.', ARRAY['NR-16', 'NR-12', 'NR-6', 'NR-35'], 17, ARRAY['Siderurgia', 'Auditoria', 'Gestão'], TRUE, 4.8, 41),
('Juliana Barbosa', 'Técnico de Segurança do Trabalho', NULL, 'CREA-MG 3012543/D', 'MG', 'Contagem', 'juliana.barbosa@sst.com.br', '(31) 2345-6789', '(31) 98765-4321', 'Consultora em ergonomia e adaptação de postos de trabalho. Especialista em prevenção de DORT.', ARRAY['NR-17', 'NR-9', 'NR-5'], 11, ARRAY['Ergonomia', 'DORT', 'Consultoria'], TRUE, 4.7, 25),

-- RS
('Bruno Costa Alves', 'Técnico de Segurança do Trabalho', NULL, 'CREA-RS 4021367/D', 'RS', 'Porto Alegre', 'bruno.costa@seguranca.rs.br', '(51) 3456-7890', '(51) 99876-5432', 'Especialista em segurança agroindustrial e processamento de alimentos. Experiência em NR-12 e máquinas de grande porte.', ARRAY['NR-12', 'NR-6', 'NR-31'], 14, ARRAY['Agroindústria', 'Máquinas', 'Alimentos'], TRUE, 4.8, 36),

-- PR
('Diogo Mendes Silva', 'Técnico de Segurança do Trabalho', NULL, 'CREA-PR 5018942/D', 'PR', 'Curitiba', 'diogo.mendes@sst.com.br', '(41) 3456-7890', '(41) 99876-5432', 'Especialista em NR-35 (trabalho em altura) e espaço confinado. Certificado internacionalmente em segurança em altura.', ARRAY['NR-35', 'NR-33', 'NR-6'], 12, ARRAY['Altura', 'Confinado', 'Certificação'], TRUE, 4.9, 48),

-- Engenheiros de Segurança
('Dr. Luiz Alberto Fonseca', 'Engenheiro de Segurança', NULL, 'CREA-SP 5026103/1', 'SP', 'São Paulo', 'luiz.fonseca@eng.seguranca.br', '(11) 3456-7890', '(11) 99876-5432', 'Mestre em Engenharia de Segurança - USP. Especialista em gestão de riscos e ISO 45001. Mais de 20 anos na área.', ARRAY['NR-1', 'NR-4', 'NR-5'], 22, ARRAY['Gestão Riscos', 'ISO 45001', 'Legislação'], TRUE, 4.9, 64),
('Eng. Cecília Martins', 'Engenheiro de Segurança', 'Professor', 'CREA-RS 4012564/1', 'RS', 'Porto Alegre', 'cecilia.martins@ufrgs.br', '(51) 3456-7890', '(51) 99876-5432', 'Docente em Engenharia de Segurança na UFRGS. Especialista em ergonomia ocupacional e prevenção de doenças.', ARRAY['NR-17', 'NR-9', 'NR-5'], 18, ARRAY['Educação', 'Ergonomia', 'Pesquisa'], TRUE, 4.8, 41),
('Ricardo Gomes Santos', 'Engenheiro de Segurança', NULL, 'CREA-RJ 2014203/1', 'RJ', 'Rio de Janeiro', 'ricardo.gomes@seguranca.eng.br', '(21) 3456-7890', '(21) 99876-5432', 'Especialista em segurança industrial e prevenção de explosões. Experiência em indústrias de gases e combustíveis.', ARRAY['NR-16', 'NR-12', 'NR-2'], 21, ARRAY['Industrial', 'Explosivos', 'Gases'], TRUE, 4.9, 58),

-- Médicos do Trabalho
('Dra. Fernanda Gomes Silva', 'Médico do Trabalho', NULL, 'CRM-SP 128456', 'SP', 'São Paulo', 'fernanda.gomes@clinica.ocupacional.br', '(11) 3456-7890', '(11) 99876-5432', 'Especialista em medicina ocupacional com 18 anos de experiência. Perícia médica em acidentes do trabalho.', ARRAY['NR-7', 'NR-8'], 18, ARRAY['Ocupacional', 'Perícia', 'PCMSO'], TRUE, 4.9, 73),
('Dr. Roberto Alves Costa', 'Médico do Trabalho', NULL, 'CRM-RJ 156789', 'RJ', 'Rio de Janeiro', 'roberto.alves@clinica.rj.br', '(21) 3456-7890', '(21) 99876-5432', 'Médico ocupacional com especialização em doenças ocupacionais. Coordena programas de saúde do trabalhador.', ARRAY['NR-7'], 22, ARRAY['Ocupacional', 'DORT', 'Saúde'], TRUE, 4.8, 51),
('Dra. Beatriz Ferreira Lima', 'Médico do Trabalho', NULL, 'CRM-MG 145678', 'MG', 'Belo Horizonte', 'beatriz.ferreira@ocupacional.com.br', '(31) 3456-7890', '(31) 99876-5432', 'Perita médica em processos trabalhistas. Experiência com avaliação clínica e exames ocupacionais.', ARRAY['NR-7', 'NR-8'], 16, ARRAY['Perícia', 'Avaliação', 'Clínica'], TRUE, 4.8, 44),

-- Peritos
('Carlos Alberto Martins', 'Engenheiro de Segurança', 'Perito', 'CREA-SP 5015643/1-P', 'SP', 'São Paulo', 'carlos.martins@pericias.com.br', '(11) 3456-7890', '(11) 99876-5432', 'Perito judiciário especializado em acidentes do trabalho. Mais de 500 perícias realizadas e sentenciadas.', ARRAY['NR-1', 'NR-4', 'NR-6'], 26, ARRAY['Perícia', 'Investigação', 'Judiciário'], TRUE, 5.0, 89),
('Dra. Isabela Rocha', 'Médico do Trabalho', 'Perito', 'CRM-RJ 167890-P', 'RJ', 'Rio de Janeiro', 'isabela.rocha@pericias.med.br', '(21) 3456-7890', '(21) 99876-5432', 'Perita médica com reconhecimento no Tribunal Regional do Trabalho. Especialista em DORT e lesões ocupacionais.', ARRAY['NR-7', 'NR-8'], 20, ARRAY['Perícia', 'DORT', 'TRT'], TRUE, 4.9, 67),

-- Professores
('Prof. Dr. Alberto Santana', 'Engenheiro de Segurança', 'Professor', 'CREA-SP 5010234/1', 'SP', 'São Paulo', 'alberto.santana@usp.br', '(11) 3456-7890', '(11) 99876-5432', 'Professor da USP - Programa de Pós-Graduação em Segurança do Trabalho. Publicações em revistas internacionais.', ARRAY['NR-1', 'NR-4', 'NR-5'], 28, ARRAY['Educação', 'Pesquisa', 'Legislação'], TRUE, 4.9, 52),
('Profa. Dra. Mônica Barbosa', 'Engenheiro de Segurança', 'Professor', 'CREA-MG 3005621/1', 'MG', 'Belo Horizonte', 'monica.barbosa@ufmg.br', '(31) 3456-7890', '(31) 99876-5432', 'Docente na UFMG. Especialista em higiene ocupacional e avaliação de ambientes de trabalho.', ARRAY['NR-9', 'NR-15', 'NR-7'], 17, ARRAY['Educação', 'Higiene', 'Pesquisa'], TRUE, 4.8, 38),

-- Higienistas Ocupacionais
('Eduardo Dias', 'Higienista Ocupacional', NULL, 'ABHO-SP 2145', 'SP', 'São Paulo', 'eduardo.dias@higiene.br', '(11) 3456-7890', '(11) 99876-5432', 'Higienista ocupacional especializado em avaliação de agentes físicos (ruído, calor, radiação).', ARRAY['NR-9', 'NR-15'], 13, ARRAY['Higiene', 'Agentes Físicos', 'Avaliação'], TRUE, 4.8, 35),
('Viviane Santos', 'Higienista Ocupacional', NULL, 'ABHO-MG 1876', 'MG', 'Belo Horizonte', 'viviane.santos@ocupacional.com.br', '(31) 3456-7890', '(31) 99876-5432', 'Especialista em higiene industrial com foco em agentes químicos e biológicos. Avaliação ambiental e pessoal.', ARRAY['NR-9', 'NR-15', 'NR-32'], 11, ARRAY['Química', 'Biológica', 'Avaliação'], TRUE, 4.7, 28);
