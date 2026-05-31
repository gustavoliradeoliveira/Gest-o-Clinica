# Gestão Clínica — Sistema de Gestão de Clínicas Médicas

Sistema web completo para gestão de clínicas médicas com controle de acesso baseado em perfis, desenvolvido com Node.js, Express.js, EJS e PostgreSQL.

---

## 🩺 Descrição

Permite gerenciar **usuários**, **perfis de acesso**, **pacientes**, **médicos**, **consultas**, **prontuários** e **especialidades médicas** por meio de uma interface web responsiva e moderna.

---

## 🛠️ Tecnologias

| Categoria | Tecnologia |
|-----------|-----------|
| Runtime | Node.js v24.15.0 |
| Framework | Express.js 4 |
| Template Engine | EJS + express-ejs-layouts |
| CSS | Bootstrap 5 + CSS3 customizado |
| JavaScript | jQuery 3 |
| Banco de Dados | PostgreSQL 18.3 |
| Sessões | express-session + connect-pg-simple |
| Senhas | bcryptjs |
| Flash Messages | connect-flash |
| Dev | nodemon |

---

## 📦 Instalação

### Pré-requisitos

- Node.js v20+ instalado
- PostgreSQL 18 instalado e rodando
- `psql` no PATH **ou** usar o caminho completo

### 1. Clone / Abra o projeto

```bash
cd GestaoClinica
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco de dados

#### Criar o banco

```powershell
# Usando o psql pelo caminho completo (PostgreSQL 18 no Windows)
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE gestao_clinica;"
```

> Alternativamente: abra o **pgAdmin 4**, conecte ao servidor e execute `CREATE DATABASE gestao_clinica;`

#### Criar as tabelas

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d gestao_clinica -f database/schema.sql
```

#### Inserir dados iniciais

```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d gestao_clinica -f database/seed.sql
```

### 4. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
copy .env.example .env
```

Edite o `.env` com suas configurações:

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gestao_clinica
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
SESSION_SECRET=chave_secreta_muito_segura
```

### 5. Execute o projeto

```bash
# Desenvolvimento (com hot-reload)
npm run dev

# Produção
npm start
```

Acesse: **http://localhost:3000**

---

## 🔐 Credenciais Padrão

| Campo | Valor |
|-------|-------|
| E-mail | `admin@clinica.com` |
| Senha | `Admin@123` |

---

## 🗂️ Estrutura de Pastas

```
GestaoClinica/
├── src/
│   ├── controllers/     ← Regras de negócio
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── usuarioController.js
│   │   ├── perfilController.js
│   │   ├── pacienteController.js
│   │   ├── medicoController.js
│   │   ├── consultaController.js
│   │   ├── prontuarioController.js
│   │   └── especialidadeController.js
│   ├── models/          ← Acesso ao banco de dados
│   │   ├── db.js        ← Pool de conexão PostgreSQL
│   │   ├── Usuario.js
│   │   ├── Perfil.js
│   │   ├── Paciente.js
│   │   ├── Medico.js
│   │   ├── Consulta.js
│   │   ├── Prontuario.js
│   │   └── Especialidade.js
│   ├── routes/          ← Definição de rotas
│   │   ├── index.js
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── usuarioRoutes.js
│   │   ├── perfilRoutes.js
│   │   ├── pacienteRoutes.js
│   │   ├── medicoRoutes.js
│   │   ├── consultaRoutes.js
│   │   ├── prontuarioRoutes.js
│   │   └── especialidadeRoutes.js
│   ├── middlewares/     ← Autenticação e autorização
│   │   ├── authMiddleware.js
│   │   └── permissaoMiddleware.js
│   ├── views/           ← Templates EJS
│   │   ├── layouts/     ← Layout base (main + auth)
│   │   ├── partials/    ← Componentes reutilizáveis
│   │   ├── auth/        ← Tela de login
│   │   ├── dashboard/
│   │   ├── usuarios/
│   │   ├── perfis/
│   │   ├── pacientes/
│   │   ├── medicos/
│   │   ├── consultas/
│   │   ├── prontuarios/
│   │   ├── especialidades/
│   │   └── erros/
│   └── public/          ← CSS e JS estáticos
│       ├── css/custom.css
│       └── js/main.js
├── database/
│   ├── schema.sql       ← Estrutura do banco
│   └── seed.sql         ← Dados iniciais
├── .env.example
├── app.js               ← Ponto de entrada
├── package.json
├── README.md
└── USO_IA.md
```

---

## ✅ Funcionalidades

| Módulo | CRUD | Observações |
|--------|------|-------------|
| 🔐 Autenticação | Login/Logout | Sessão com PostgreSQL store |
| 👥 Usuários | ✅ Completo | Proteção contra auto-exclusão |
| 🛡️ Perfis de Acesso | ✅ Completo | Permissões granulares por módulo/ação |
| 🧑‍⚕️ Pacientes | ✅ Completo | Busca por nome/CPF, máscara de campo |
| 👨‍⚕️ Médicos | ✅ Completo | Vinculado a especialidade |
| 📅 Consultas | ✅ Completo | Status: agendada/confirmada/realizada/cancelada |
| 📋 Prontuários | ✅ Completo | Vinculado a consultas realizadas |
| 🏷️ Especialidades | ✅ Completo | Gerenciamento de especialidades médicas |

**Recursos adicionais:**
- Paginação em todas as listagens
- Flash messages de sucesso/erro/info com auto-dismiss
- Confirmação de exclusão via JavaScript
- Sidebar dinâmica conforme permissões do perfil
- Máscara de CPF e telefone via jQuery
- Layout responsivo Bootstrap 5
- Busca por texto em todas as entidades

---

## 🔐 Sistema de Permissões

Cada perfil tem um JSON de permissões por módulo:

```json
{
  "pacientes": { "criar": true, "ler": true, "editar": true, "deletar": false },
  "consultas":  { "criar": true, "ler": true, "editar": true, "deletar": false }
}
```

O middleware `verificarPermissao(modulo, acao)` valida cada rota individualmente.

---

## 📊 Diagrama Entidade-Relacionamento

```
PERFIS (1) ────────── (N) USUARIOS
ESPECIALIDADES (1) ── (N) MEDICOS
PACIENTES (1) ─────── (N) CONSULTAS
MEDICOS (1) ────────── (N) CONSULTAS
CONSULTAS (1) ─────── (1) PRONTUARIOS
```
