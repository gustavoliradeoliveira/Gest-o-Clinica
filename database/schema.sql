-- =============================================================
-- SCHEMA - Sistema de Gestão de Clínicas Médicas
-- PostgreSQL 18
-- =============================================================

-- Extensão para UUIDs (opcional, usando SERIAL por simplicidade)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================
-- TABELA: perfis
-- =============================================================
CREATE TABLE IF NOT EXISTS perfis (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(100) NOT NULL UNIQUE,
    descricao   TEXT,
    permissoes  JSONB NOT NULL DEFAULT '{}',
    ativo       BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- TABELA: usuarios
-- =============================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(150) NOT NULL,
    email       VARCHAR(200) NOT NULL UNIQUE,
    senha       VARCHAR(255) NOT NULL,
    perfil_id   INTEGER NOT NULL REFERENCES perfis(id) ON DELETE RESTRICT,
    ativo       BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- TABELA: especialidades
-- =============================================================
CREATE TABLE IF NOT EXISTS especialidades (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(150) NOT NULL UNIQUE,
    descricao   TEXT,
    ativo       BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- TABELA: medicos
-- =============================================================
CREATE TABLE IF NOT EXISTS medicos (
    id              SERIAL PRIMARY KEY,
    nome            VARCHAR(150) NOT NULL,
    crm             VARCHAR(20) NOT NULL UNIQUE,
    telefone        VARCHAR(20),
    email           VARCHAR(200),
    especialidade_id INTEGER REFERENCES especialidades(id) ON DELETE SET NULL,
    ativo           BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- TABELA: pacientes
-- =============================================================
CREATE TABLE IF NOT EXISTS pacientes (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(150) NOT NULL,
    cpf         VARCHAR(14) NOT NULL UNIQUE,
    data_nasc   DATE NOT NULL,
    telefone    VARCHAR(20),
    email       VARCHAR(200),
    endereco    VARCHAR(255),
    ativo       BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- TABELA: consultas
-- =============================================================
CREATE TABLE IF NOT EXISTS consultas (
    id              SERIAL PRIMARY KEY,
    paciente_id     INTEGER NOT NULL REFERENCES pacientes(id) ON DELETE RESTRICT,
    medico_id       INTEGER NOT NULL REFERENCES medicos(id) ON DELETE RESTRICT,
    data_hora       TIMESTAMP NOT NULL,
    status          VARCHAR(30) NOT NULL DEFAULT 'agendada'
                    CHECK (status IN ('agendada', 'confirmada', 'realizada', 'cancelada')),
    observacoes     TEXT,
    criado_em       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- TABELA: prontuarios
-- =============================================================
CREATE TABLE IF NOT EXISTS prontuarios (
    id              SERIAL PRIMARY KEY,
    consulta_id     INTEGER NOT NULL REFERENCES consultas(id) ON DELETE CASCADE,
    descricao       TEXT NOT NULL,
    diagnostico     TEXT,
    prescricao      TEXT,
    criado_em       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================
-- ÍNDICES
-- =============================================================
CREATE INDEX IF NOT EXISTS idx_usuarios_email      ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_perfil_id  ON usuarios(perfil_id);
CREATE INDEX IF NOT EXISTS idx_medicos_crm         ON medicos(crm);
CREATE INDEX IF NOT EXISTS idx_medicos_especialidade ON medicos(especialidade_id);
CREATE INDEX IF NOT EXISTS idx_pacientes_cpf       ON pacientes(cpf);
CREATE INDEX IF NOT EXISTS idx_consultas_paciente  ON consultas(paciente_id);
CREATE INDEX IF NOT EXISTS idx_consultas_medico    ON consultas(medico_id);
CREATE INDEX IF NOT EXISTS idx_consultas_data      ON consultas(data_hora);
CREATE INDEX IF NOT EXISTS idx_prontuarios_consulta ON prontuarios(consulta_id);