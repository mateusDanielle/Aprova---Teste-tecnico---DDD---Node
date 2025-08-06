# 📡 HTTP Files - Library Management System

Este diretório contém arquivos `.http` para testar as APIs do sistema de gerenciamento de biblioteca diretamente no VSCode.

## 🚀 Como usar

### Pré-requisitos

1. **VSCode** com a extensão **REST Client** instalada
2. **Aplicação rodando** em `http://localhost:3000`

### Instalação da extensão

```bash
# No VSCode, pressione Ctrl+Shift+X e procure por:
# "REST Client" (por Huachao Mao)
```

## 📁 Estrutura dos arquivos

```
http/
├── users.http              # Testes de usuários
├── books.http              # Testes de livros
├── loans.http              # Testes de empréstimos
└── README.md               # Esta documentação
```

## 🎯 Como executar

### 1. Abrir arquivo .http

- Abra qualquer arquivo `.http` no VSCode
- Exemplo: `http/users.http`

### 2. Executar requisição

- Clique em **"Send Request"** acima de cada requisição
- Ou use o atalho: `Ctrl+Alt+R`

### 3. Ver resposta

- A resposta aparecerá em uma nova aba
- Formato JSON com syntax highlighting

## 🔧 Configuração

Os arquivos `.http` usam URLs diretas para simplicidade:

- **Base URL**: `http://localhost:3000/api`
- **Content-Type**: `application/json`

**Para usar**:

1. Abra um arquivo `.http` no VSCode
2. Clique em "Send Request" acima de cada requisição
3. Veja a resposta em uma nova aba

## 📋 Rotas disponíveis

### 👥 Users (`users.http`)

- `POST /api/users` - Cadastrar usuário
- Testes de validação incluídos

### 📚 Books (`books.http`)

- `POST /api/books` - Cadastrar livro
- `GET /api/books/search?q={term}` - Pesquisar livros
- Testes de validação incluídos

### 📖 Loans (`loans.http`)

- `POST /api/loans` - Emprestar livro
- Fluxo completo de teste
- Testes de validação incluídos

## 🧪 Tipos de teste

### ✅ Casos de sucesso

- Cadastro de usuários (STUDENT, TEACHER, LIBRARIAN)
- Cadastro de livros
- Pesquisa de livros
- Empréstimos com prazos corretos

### ❌ Casos de erro

- Validação de campos obrigatórios
- Validação de tipos de dados
- Testes de negócio (livro já emprestado, etc.)

## 🔄 Fluxo completo

O arquivo `loans.http` inclui um **fluxo completo** que:

1. Cria um usuário
2. Cria um livro
3. Faz o empréstimo usando os IDs retornados

## 💡 Dicas

### Usar dados do seed

```bash
# Primeiro, popule o banco com dados de exemplo
npm run db:seed

# Depois execute os testes .http
```

### Verificar dados

```bash
# Verificar dados no banco
npm run db:check
```

### Limpar dados

```bash
# Limpar dados do banco
npm run db:clean
```

## 🎯 Vantagens dos arquivos .http

1. **Integração nativa** com VSCode
2. **Execução rápida** - um clique
3. **Organização** por domínio
4. **Documentação** viva das APIs
5. **Testes de validação** incluídos
6. **Variáveis** para diferentes ambientes

## 🔗 Links úteis

- **Swagger UI**: `http://localhost:3000/api`
- **Health Check**: `http://localhost:3000/health`
- **Prisma Studio**: `http://localhost:5555`
