# 📚 Library Management System

Sistema de gerenciamento de empréstimos de livros em biblioteca, desenvolvido com NestJS, TypeScript e PostgreSQL, seguindo princípios de Domain-Driven Design (DDD) e Arquitetura Hexagonal.

## 🚀 Tecnologias Utilizadas

- **Backend**: NestJS + TypeScript
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **Validação**: Zod
- **Documentação**: Swagger/OpenAPI
- **Testes**: Jest + Supertest
- **Containerização**: Docker + Docker Compose

## 📋 Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Docker** e **Docker Compose** (para ambiente local)
- **PostgreSQL** (opcional, se não usar Docker)

### Verificando as versões:

```bash
node --version
npm --version
docker --version
docker-compose --version
```

## 🛠️ Instalação e Configuração

### 1. Clone o repositório

```bash
git clone <repository-url>
cd aprova-teste-tecnico-ddd-node
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/library_db"

# Application
PORT=3000
NODE_ENV=development

# JWT (para autenticação futura)
JWT_SECRET=your-secret-key
```

### 4. Configure o banco de dados

#### Opção A: Usando Docker (Recomendado)

```bash
# Inicia o PostgreSQL via Docker
docker-compose up -d postgres

# Aguarde alguns segundos para o banco inicializar
sleep 5
```

#### Opção B: PostgreSQL local

Certifique-se de ter o PostgreSQL rodando localmente na porta 5432.

### 5. Execute as migrações do banco

```bash
# Gera e executa as migrações do Prisma
npx prisma migrate dev

# (Opcional) Popula o banco com dados de exemplo
npx prisma db seed
```

## 🏃‍♂️ Como Executar

### Ambiente de Desenvolvimento

```bash
# Modo watch (recomendado para desenvolvimento)
npm run start:dev

# Modo debug
npm run start:debug

# Modo produção
npm run start:prod
```

### Usando Docker

```bash
# Constrói e executa toda a aplicação
docker-compose up --build

# Executa apenas os serviços necessários
docker-compose up postgres app
```

## 🧪 Como Testar

### Executando os Testes

```bash
# Todos os testes
npm run test

# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration

# Testes E2E
npm run test:e2e

# Cobertura de testes
npm run test:cov

# Testes em modo watch
npm run test:watch
```

### Testando a API

#### 1. Via Swagger UI

Após iniciar a aplicação, acesse:
```
http://localhost:3000/api
```

#### 2. Via cURL

```bash
# Health check
curl http://localhost:3000/health

# Listar usuários
curl http://localhost:3000/api/users

# Criar usuário
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "userType": "STUDENT"
  }'
```

#### 3. Via Postman/Insomnia

Importe a coleção do Swagger ou use os endpoints documentados em `/api`.

## 📊 Monitoramento e Logs

### Health Checks

```bash
# Verificar saúde da aplicação
curl http://localhost:3000/health

# Verificar saúde do banco
curl http://localhost:3000/health/database
```

### Logs

```bash
# Logs da aplicação
npm run start:dev

# Logs do Docker
docker-compose logs -f app
```

## 🗄️ Banco de Dados

### Prisma Studio

Interface visual para gerenciar o banco:

```bash
npx prisma studio
```

Acesse: `http://localhost:5555`

### Comandos Úteis

```bash
# Reset do banco
npx prisma migrate reset

# Gerar cliente Prisma
npx prisma generate

# Verificar status das migrações
npx prisma migrate status

# Criar nova migração
npx prisma migrate dev --name nome-da-migracao
```

## 🏗️ Estrutura do Projeto

```
src/
├── domain/                 # Camada de Domínio (DDD)
│   ├── entities/          # Entidades de negócio
│   ├── value-objects/     # Objetos de valor
│   ├── repositories/      # Interfaces dos repositórios
│   ├── services/          # Serviços de domínio
│   └── events/            # Eventos de domínio
├── application/           # Camada de Aplicação
│   ├── use-cases/        # Casos de uso
│   ├── dto/              # Data Transfer Objects
│   └── services/         # Serviços de aplicação
├── infrastructure/        # Camada de Infraestrutura
│   ├── database/         # Implementações de repositório
│   ├── external/         # Serviços externos
│   └── config/           # Configurações
└── presentation/          # Camada de Apresentação
    ├── controllers/      # Controllers HTTP
    ├── middlewares/      # Middlewares
    └── validators/       # Validadores de entrada
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev          # Aplicação em modo desenvolvimento
npm run start:debug        # Aplicação em modo debug
npm run start:prod         # Aplicação em modo produção

# Testes
npm run test               # Executa todos os testes
npm run test:watch         # Testes em modo watch
npm run test:cov           # Cobertura de testes
npm run test:debug         # Testes em modo debug
npm run test:e2e           # Testes end-to-end

# Build
npm run build              # Compila o projeto
npm run build:webpack      # Build com webpack

# Linting e Formatação
npm run lint               # Executa ESLint
npm run lint:fix           # Corrige problemas de linting
npm run format             # Formata o código

# Banco de Dados
npm run db:generate        # Gera cliente Prisma
npm run db:migrate         # Executa migrações
npm run db:seed            # Popula banco com dados
npm run db:studio          # Abre Prisma Studio
```

## 🐳 Docker

### Comandos Docker

```bash
# Construir imagem
docker build -t aprova-teste-tecnico-ddd-node .

# Executar container
docker run -p 3000:3000 aprova-teste-tecnico-ddd-node

# Usar Docker Compose
docker-compose up --build
docker-compose down
```

### Docker Compose

O arquivo `docker-compose.yml` inclui:
- **PostgreSQL**: Banco de dados
- **Redis**: Cache (opcional)
- **App**: Aplicação NestJS

## 📚 Documentação

- **API Documentation**: `http://localhost:3000/api`
- **Health Check**: `http://localhost:3000/health`
- **Prisma Studio**: `http://localhost:5555`

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Commit

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add new user registration
fix: resolve loan calculation bug
docs: update API documentation
test: add unit tests for user service
refactor: improve loan validation logic
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a documentação da API em `/api`
2. Consulte os logs da aplicação
3. Verifique o status do banco de dados
4. Abra uma issue no repositório

---

**Desenvolvido com ❤️ usando NestJS, TypeScript e DDD**
