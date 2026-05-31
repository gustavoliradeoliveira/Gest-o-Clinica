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
-- ÍNDICES
-- =============================================================
CREATE INDEX IF NOT EXISTS idx_usuarios_email      ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_perfil_id  ON usuarios(perfil_id);