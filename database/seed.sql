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
    '$2a$10$jdbsAkKPlcYUCQ5DpaJmaemZZdRiZkQe6/VORdim6IfwZeabk8m2i',
    (SELECT id FROM perfis WHERE nome = 'Administrador')
)
ON CONFLICT (email) DO UPDATE SET senha = EXCLUDED.senha;

