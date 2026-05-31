# USO_IA.md — Como a Inteligência Artificial foi utilizada no desenvolvimento

## Ferramenta utilizada

**Antigravity (Google DeepMind)** — assistente de IA para desenvolvimento de software, com suporte a geração de código, arquitetura de sistemas e documentação técnica.

---

## Como a IA foi utilizada

### 1. Planejamento e Arquitetura

A IA analisou os requisitos do projeto e propôs:
- A arquitetura MVC com separação clara de responsabilidades
- O modelo de dados com todas as entidades e seus relacionamentos
- O sistema de permissões granular (JSON por módulo/ação)
- A ordem de implementação respeitando as dependências entre entidades

### 2. Verificação do Ambiente

Antes de iniciar a codificação, a IA executou comandos para detectar as versões instaladas localmente:
- **Node.js v24.15.0** e **npm 11.12.1** via `node --version`
- **PostgreSQL 18.3** via consulta ao registro do Windows
- Identificou que o `psql` não está no PATH e adaptou as instruções do README para usar o caminho completo

### 3. Geração de Código

A IA gerou a extrutura inicial da aplicação, incluindo:
- Configurações de dependencias
- Configuração do acesso ao banco de dados
- Cadastro de Perfis e Usuários (MVC)
- Controle de rotas e permissões
- Construção e padronização de paginas e CSS baseados em imagens do prototipo Figma.


| Arquivo | Quantidade |
|---------|-----------|
| Models (acesso ao banco) | 3 arquivos |
| Controllers (regras de negócio) | 5 arquivos |
| Routes (definição de rotas) | 5 arquivos |
| Middlewares | 2 arquivos |
| Views EJS | 16 arquivos |
| CSS customizado | 1 arquivo |
| JavaScript frontend | 1 arquivo |
| SQL (schema + seed) | 2 arquivos |
| Documentação | 2 arquivos |

### 4. Boas Práticas Aplicadas pela IA

- **Separação de responsabilidades**: cada arquivo tem uma única função
- **Tratamento de erros**: verificação de códigos de erro PostgreSQL (ex: `23505` para duplicidade, `23503` para FK)
- **Segurança**: senhas com bcrypt (rounds=10), sessões seguras, proteção contra auto-exclusão de conta
- **UX**: flash messages com auto-dismiss, confirmação de exclusão, máscaras de campo
- **Performance**: índices nos campos de busca, `Promise.all` para queries paralelas

### 5. Decisões Técnicas Tomadas pela IA

| Decisão | Justificativa |
|---------|--------------|
| `express-ejs-layouts` para gerenciar layouts | Evita repetição de HTML sem dependências pesadas |
| Permissões em JSONB no PostgreSQL | Flexível, sem necessidade de tabela de pivot |
| `connect-pg-simple` para sessões | Persiste sessões no próprio banco, sem Redis |
| `Promise.all` para queries simultâneas | Reduz latência em páginas com múltiplos dados |
| Variável `usuario_edit` no controller | Evita colisão com `usuario` da sessão nas views |

### 6. Iterações e Correções

Durante o desenvolvimento, a IA identificou e corrigeu automaticamente:
1. **Conflito de variáveis**: `usuario` da sessão vs. `usuario` do controller de edição → renomeado para `usuario_edit`
2. **Sistema de layouts**: ajustou de `include` manual para `express-ejs-layouts` para evitar duplicação de HTML
3. **Dependência faltante**: adicionou `express-ejs-layouts` ao `package.json`

---

## Limitações e intervenções humanas necessárias

- **Configuração do banco**: o usuário precisa criar o banco (`CREATE DATABASE gestao_clinica`) e ajustar o `.env` com sua senha
- **Variáveis de ambiente**: o arquivo `.env` não é gerado automaticamente por segurança
- **Testes**: não foram gerados testes automatizados (unitários/integração)
