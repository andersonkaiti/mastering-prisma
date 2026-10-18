# mastering-prisma

![Node](https://img.shields.io/badge/Node.js-22-5FA04E?logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-5-000000?logo=fastify&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-4169E1?logo=postgresql&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-11-F69220?logo=pnpm&logoColor=white)

API REST de usuários construída para dominar o **Prisma 7**, com arquitetura em
camadas e tipagem ponta a ponta. Serve como estudo de modelagem de dados
(relações 1:1, 1:n, n:n e auto-relacionamento) e de boas práticas de testes e CI.

## Stack

| Camada          | Tecnologia                                                    |
| --------------- | ------------------------------------------------------------- |
| Runtime         | Node.js 22 executando TypeScript nativo via [`tsx`](https://tsx.is) |
| HTTP            | [Fastify 5](https://fastify.dev) + [`fastify-type-provider-zod`](https://github.com/turkerdev/fastify-type-provider-zod) |
| Validação       | [Zod 4](https://zod.dev)                                      |
| ORM             | [Prisma 7](https://www.prisma.io) com o adapter `@prisma/adapter-pg` |
| Banco de dados  | PostgreSQL                                                    |
| Testes          | [Vitest](https://vitest.dev) + [Supertest](https://github.com/ladjs/supertest) |
| Qualidade       | [Biome](https://biomejs.dev), Husky, lint-staged e commitlint (gitmoji) |
| Gerenciador     | pnpm 11                                                       |

## Arquitetura

```mermaid
flowchart TD
    HTTP["infra/http<br/>(Fastify · rotas · factories)"]
    APP["application<br/>(casos de uso)"]
    DOMAIN["domain<br/>(entidades · contratos)"]
    DB["infra/database<br/>(Prisma · repositórios)"]

    HTTP --> APP
    APP --> DOMAIN
    APP --> DB
    DB -.implementa.-> DOMAIN
```

## Modelo de dados

```mermaid
erDiagram
    USER ||--o| PROFILE : "tem"
    USER ||--o{ ORDER : "faz"
    USER ||--o{ USER : "afilia"
    ORDER ||--o{ ORDER_PRODUCT : "contém"
    PRODUCT ||--o{ ORDER_PRODUCT : "aparece em"

    USER {
        string id PK
        string name
        string email UK
        datetime birthdate
        boolean isActive
        string affiliationId FK
    }
    PROFILE {
        string id PK
        string userId FK,UK
        string instagram
        string github
        string bio
    }
    ORDER {
        string id PK
        string userId FK
        int value
    }
    PRODUCT {
        string id PK
        string name
    }
    ORDER_PRODUCT {
        string orderId PK,FK
        string productId PK,FK
        int quantity
    }
```

Schema completo em `src/infra/database/prisma/schema.prisma`.

## Setup

### Pré-requisitos

- Node.js 22+
- pnpm 11+ (`npm install -g pnpm`)
- Uma instância de PostgreSQL

### Passo a passo

**1. Instale as dependências**

```bash
pnpm install
```

**2. Configure o ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mastering_prisma?schema=public"
PORT=3000
```

**3. Prepare o banco de dados**

```bash
pnpm prisma generate      # gera o Prisma Client
pnpm prisma migrate dev   # aplica as migrations
pnpm db:seed              # (opcional) popula com dados fake
```

**4. Suba a API**

```bash
pnpm dev
```

A API fica disponível em `http://localhost:3000` (ou na porta definida em `PORT`).
