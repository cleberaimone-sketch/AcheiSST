-- Seed: Dados de exemplo para tabela profissionais
-- Execute APÓS criar a tabela com expand_profissionais_fields.sql

-- Técnicos de Segurança
INSERT INTO profissionais (nome, especialidade, especialidade_tipo, registro_profissional, uf, cidade, email, telefone, whatsapp, bio, nrs_expertise, experiencia_anos, areas_atuacao, verified, avaliacao, num_avaliacoes) VALUES
('João Silva', 'Técnico de Segurança do Trabalho', NULL, 'CREA-PR 12345/D', 'PR', 'Curitiba', 'joao.silva@email.com', '(41) 3333-3333', '(41) 99999-1111', 'Especialista em NR-35 e trabalho em altura com 15 anos de experiência', ARRAY['NR-35', 'NR-6', 'NR-11', 'NR-5'], 15, ARRAY['Trabalho em altura', 'Espaço confinado', 'EPI'], TRUE, 4.8, 42),
('Maria Santos', 'Técnico de Segurança do Trabalho', NULL, 'CREA-SP 54321/D', 'SP', 'São Paulo', 'maria.santos@email.com', '(11) 2222-2222', '(11) 99999-2222', 'Consultoria em PPRA e PCMSO em empresas de diversos segmentos', ARRAY['NR-9', 'NR-7', 'NR-4', 'NR-5'], 12, ARRAY['Documentação', 'Consultorias', 'Treinamento'], TRUE, 4.7, 38),
('Carlos Oliveira', 'Técnico de Segurança do Trabalho', NULL, 'CREA-RJ 98765/D', 'RJ', 'Rio de Janeiro', 'carlos.oliveira@email.com', '(21) 1111-1111', '(21) 99999-3333', 'Inspetor credenciado em segurança de máquinas e EPC', ARRAY['NR-12', 'NR-11', 'NR-6'], 18, ARRAY['Máquinas e equipamentos', 'Auditoria', 'Investigação'], TRUE, 4.9, 55),

-- Engenheiros de Segurança
('Dr. Pedro Lima', 'Engenheiro de Segurança', NULL, 'CREA-MG 11111/1', 'MG', 'Belo Horizonte', 'pedro.lima@email.com', '(31) 4444-4444', '(31) 99999-4444', 'Mestre em Engenharia de Segurança — especialista em ISO 45001 e gestão de riscos', ARRAY['NR-1', 'NR-4', 'NR-5'], 20, ARRAY['Gestão de risco', 'ISO 45001', 'Legislação'], TRUE, 4.9, 67),
('Eng. Ana Costa', 'Engenheiro de Segurança', NULL, 'CREA-RS 22222/1', 'RS', 'Porto Alegre', 'ana.costa@email.com', '(51) 5555-5555', '(51) 99999-5555', 'Engenharia de segurança em projetos industriais — 14 anos de experiência', ARRAY['NR-2', 'NR-8', 'NR-10'], 14, ARRAY['Projetos industriais', 'Análise de risco'], TRUE, 4.8, 51),

-- Médicos do Trabalho
('Dra. Fernanda Gomes', 'Médico do Trabalho', NULL, 'CRM-SP 123456', 'SP', 'São Paulo', 'fernanda.gomes@clinica.com', '(11) 3333-3333', '(11) 99999-6666', 'Medicina ocupacional, perícias e avaliação clínica em SST', ARRAY['NR-7', 'NR-8'], 18, ARRAY['Ocupacional', 'Perícia', 'Avaliação clínica'], TRUE, 4.9, 72),
('Dr. Roberto Alves', 'Médico do Trabalho', NULL, 'CRM-RJ 654321', 'RJ', 'Rio de Janeiro', 'roberto.alves@clinica.com', '(21) 2222-2222', '(21) 99999-7777', 'Especialista em doenças ocupacionais e processos de perícia', ARRAY['NR-7'], 22, ARRAY['Ocupacional', 'DORT', 'Perícia'], TRUE, 4.7, 48),

-- Peritos
('Carlos Perito', 'Engenheiro de Segurança', 'Perito', 'CREA-RJ 54321/D-P', 'RJ', 'Rio de Janeiro', 'carlos.perito@pericias.com', '(21) 7777-7777', '(21) 99999-8888', 'Perito em acidentes do trabalho — especialista em investigação e responsabilidade', ARRAY['NR-1', 'NR-4'], 25, ARRAY['Perícia', 'Investigação', 'Responsabilidade'], TRUE, 5.0, 89),
('Dra. Beatriz Ferreira', 'Médico do Trabalho', 'Perito', 'CRM-SP 987654-P', 'SP', 'São Paulo', 'beatriz.ferreira@pericias.com', '(11) 8888-8888', '(11) 99999-9999', 'Perita médica em perícias trabalhistas e ações judiciárias', ARRAY['NR-7'], 20, ARRAY['Perícia médica', 'Responsabilidade'], TRUE, 4.9, 63),

-- Professores
('Prof. Dr. Alberto Santos', 'Engenheiro de Segurança', 'Professor', 'CREA-SP 11122/1', 'SP', 'São Paulo', 'alberto@usp.br', '(11) 6666-6666', '(11) 99999-1010', 'Professor de Engenharia de Segurança na USP — publicações em segurança do trabalho', ARRAY['NR-1', 'NR-4', 'NR-5'], 28, ARRAY['Educação', 'Pesquisa', 'Legislação'], TRUE, 4.8, 44),
('Profa. Dra. Cecília Martins', 'Engenheiro de Segurança', 'Professor', 'CREA-RS 22233/1', 'RS', 'Porto Alegre', 'cecilia@ufrgs.br', '(51) 4444-4444', '(51) 99999-1111', 'Docente em Engenharia de Segurança — especialista em ergonomia', ARRAY['NR-17'], 16, ARRAY['Educação', 'Ergonomia', 'Pesquisa'], TRUE, 4.7, 39),

-- Higienistas Ocupacionais
('Higiênista Rafael Souza', 'Higienista Ocupacional', NULL, 'ABHO-PR 5555', 'PR', 'Curitiba', 'rafael.souza@higiene.com', '(41) 7777-7777', '(41) 99999-1212', 'Higiene industrial com foco em agentes físicos — 12 anos de experiência', ARRAY['NR-9', 'NR-15'], 12, ARRAY['Higiene industrial', 'Avaliação ambiental', 'Ruído'], TRUE, 4.8, 35);
