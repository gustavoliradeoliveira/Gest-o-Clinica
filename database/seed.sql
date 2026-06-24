-- =============================================================
-- SEED - Dados Iniciais
-- Sistema de Gestão de Clínicas Médicas
-- =============================================================

-- =============================================================
-- PERFIS
-- =============================================================
INSERT INTO perfis (nome, descricao, permissoes) VALUES
(
    'Administrador',
    'Acesso total ao sistema',
    '{
        "usuarios":       {"criar": true, "ler": true, "editar": true, "deletar": true},
        "perfis":         {"criar": true, "ler": true, "editar": true, "deletar": true},
        "pacientes":      {"criar": true, "ler": true, "editar": true, "deletar": true},
        "medicos":        {"criar": true, "ler": true, "editar": true, "deletar": true},
        "consultas":      {"criar": true, "ler": true, "editar": true, "deletar": true},
        "prontuarios":    {"criar": true, "ler": true, "editar": true, "deletar": true},
        "especialidades": {"criar": true, "ler": true, "editar": true, "deletar": true}
    }'::jsonb
),
(
    'Recepcionista',
    'Gerencia pacientes e consultas',
    '{
        "usuarios":       {"criar": false, "ler": false, "editar": false, "deletar": false},
        "perfis":         {"criar": false, "ler": false, "editar": false, "deletar": false},
        "pacientes":      {"criar": true,  "ler": true,  "editar": true,  "deletar": false},
        "medicos":        {"criar": false, "ler": true,  "editar": false, "deletar": false},
        "consultas":      {"criar": true,  "ler": true,  "editar": true,  "deletar": false},
        "prontuarios":    {"criar": false, "ler": true,  "editar": false, "deletar": false},
        "especialidades": {"criar": false, "ler": true,  "editar": false, "deletar": false}
    }'::jsonb
),
(
    'Médico',
    'Acessa consultas e prontuários dos seus pacientes',
    '{
        "usuarios":       {"criar": false, "ler": false, "editar": false, "deletar": false},
        "perfis":         {"criar": false, "ler": false, "editar": false, "deletar": false},
        "pacientes":      {"criar": false, "ler": true,  "editar": false, "deletar": false},
        "medicos":        {"criar": false, "ler": true,  "editar": false, "deletar": false},
        "consultas":      {"criar": false, "ler": true,  "editar": true,  "deletar": false},
        "prontuarios":    {"criar": true,  "ler": true,  "editar": true,  "deletar": false},
        "especialidades": {"criar": false, "ler": true,  "editar": false, "deletar": false}
    }'::jsonb
)
ON CONFLICT (nome) DO NOTHING;

-- =============================================================
-- USUÁRIO ADMINISTRADOR PADRÃO
-- Senha: Admin@123 (hash bcrypt rounds=10)
-- =============================================================
INSERT INTO usuarios (nome, email, senha, perfil_id) VALUES
(
    'Administrador',
    'admin@clinica.com',
    '$2a$10$hXW5M1b6dsaCMmegpMJEH./JeJmT65G4RWZt8rmNhaAwwBEHZt.uG',
    (SELECT id FROM perfis WHERE nome = 'Administrador')
)
ON CONFLICT (email) DO UPDATE SET senha = EXCLUDED.senha;

-- =============================================================
-- ESPECIALIDADES
-- =============================================================
INSERT INTO especialidades (nome, descricao) VALUES
('Cardiologia',      'Diagnóstico e tratamento de doenças do coração'),
('Dermatologia',     'Diagnóstico e tratamento de doenças da pele'),
('Ortopedia',        'Diagnóstico e tratamento do sistema músculo-esquelético'),
('Pediatria',        'Assistência médica a crianças e adolescentes'),
('Neurologia',       'Diagnóstico e tratamento do sistema nervoso'),
('Ginecologia',      'Saúde do sistema reprodutor feminino'),
('Oftalmologia',     'Diagnóstico e tratamento de doenças dos olhos'),
('Psiquiatria',      'Diagnóstico e tratamento de transtornos mentais'),
('Endocrinologia',   'Diagnóstico e tratamento de distúrbios hormonais'),
('Clínica Geral',    'Atenção primária à saúde')
ON CONFLICT (nome) DO NOTHING;

-- =============================================================
-- MÉDICOS DE EXEMPLO
-- =============================================================
INSERT INTO medicos (nome, crm, telefone, email, especialidade_id) VALUES
('Dr. Carlos Andrade',   'CRM-SP 12345', '(11) 99000-1111', 'carlos.andrade@clinica.com',   (SELECT id FROM especialidades WHERE nome = 'Cardiologia')),
('Dra. Ana Souza',       'CRM-SP 23456', '(11) 99000-2222', 'ana.souza@clinica.com',         (SELECT id FROM especialidades WHERE nome = 'Pediatria')),
('Dr. Roberto Lima',     'CRM-SP 34567', '(11) 99000-3333', 'roberto.lima@clinica.com',      (SELECT id FROM especialidades WHERE nome = 'Ortopedia')),
('Dra. Fernanda Costa',  'CRM-SP 45678', '(11) 99000-4444', 'fernanda.costa@clinica.com',    (SELECT id FROM especialidades WHERE nome = 'Dermatologia')),
('Dr. Paulo Mendes',     'CRM-SP 56789', '(11) 99000-5555', 'paulo.mendes@clinica.com',      (SELECT id FROM especialidades WHERE nome = 'Neurologia'))
ON CONFLICT (crm) DO NOTHING;

-- =============================================================
-- PACIENTES DE EXEMPLO
-- =============================================================
INSERT INTO pacientes (nome, cpf, data_nasc, telefone, email, endereco) VALUES
('Maria Oliveira',   '123.456.789-00', '1985-03-15', '(11) 98000-1111', 'maria.oliveira@email.com',   'Rua das Flores, 100 - São Paulo/SP'),
('João Silva',       '234.567.890-11', '1990-07-22', '(11) 98000-2222', 'joao.silva@email.com',       'Av. Paulista, 500 - São Paulo/SP'),
('Luísa Ferreira',   '345.678.901-22', '2000-11-30', '(11) 98000-3333', 'luisa.ferreira@email.com',   'Rua Augusta, 200 - São Paulo/SP'),
('Pedro Santos',     '456.789.012-33', '1975-01-10', '(11) 98000-4444', 'pedro.santos@email.com',     'Rua da Consolação, 300 - São Paulo/SP'),
('Carla Nunes',      '567.890.123-44', '1995-09-05', '(11) 98000-5555', 'carla.nunes@email.com',      'Rua Frei Caneca, 400 - São Paulo/SP')
ON CONFLICT (cpf) DO NOTHING;

-- =============================================================
-- CONSULTAS DE EXEMPLO
-- =============================================================
INSERT INTO consultas (paciente_id, medico_id, data_hora, status, observacoes) VALUES
(
    (SELECT id FROM pacientes WHERE cpf = '123.456.789-00'),
    (SELECT id FROM medicos WHERE crm = 'CRM-SP 12345'),
    CURRENT_TIMESTAMP + INTERVAL '1 day',
    'agendada',
    'Consulta de rotina - revisão cardiológica'
),
(
    (SELECT id FROM pacientes WHERE cpf = '234.567.890-11'),
    (SELECT id FROM medicos WHERE crm = 'CRM-SP 34567'),
    CURRENT_TIMESTAMP + INTERVAL '2 days',
    'confirmada',
    'Dor no joelho direito'
),
(
    (SELECT id FROM pacientes WHERE cpf = '345.678.901-22'),
    (SELECT id FROM medicos WHERE crm = 'CRM-SP 56789'),
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    'realizada',
    'Cefaleia frequente'
);

-- =============================================================
-- PRONTUÁRIO DE EXEMPLO
-- =============================================================
INSERT INTO prontuarios (consulta_id, descricao, diagnostico, prescricao) VALUES
(
    (SELECT id FROM consultas WHERE observacoes = 'Cefaleia frequente' LIMIT 1),
    'Paciente relata cefaleia de forte intensidade há 3 semanas, piora ao fim do dia.',
    'Cefaleia tensional episódica (G44.2)',
    'Ibuprofeno 600mg - tomar em caso de dor. Retorno em 30 dias.'
);