# 🔥 100K Requests (Challenge) - Complete Technical Overview

🇧🇷
Desafio de Backend:
Projetar e implementar uma infraestrutura escalável capaz de suportar uma carga simultânea de 100 mil requisições concorrentes, realizando operações de inserção de dados em banco de dados e retornando uma resposta de status de conclusão para cada solicitação de forma eficiente e confiável.

🇺🇸
Backend Challenge:
Design and implement a scalable infrastructure capable of handling 100,000 concurrent requests, performing data insertion into a database, and returning a completion status response for each request in an efficient and reliable manner.

---

## 🔧 Project Overview

- **Runtime**: Node.js v20.18.0
- **API**: Fastify v5.3 with TypeScript
- **Database**: Postgres v17
- **Architecture**: Monorepo
- **Containerization**: Docker and docker-compose

---

## 📁 Project Structure

### Backend (`fastify`)

```
src/
├── config/             # Redis and Postgres configurations...
├── lib/                # Helper, utils, schemas and more...
├── user/               # User Domain (controller, services & db)
└── docker-compose.yml  # Container setup
```

---

## 📚 Tech Stack

### Backend

- Fastify v5.4
- TypeScript compiled with tsx
- dotenv, CORS, Middleware

---

## 🔌 API Endpoints

REST routes:

- get:`/user/:id`
- post:`/user`

## 🔌 API Integration

### Base URL

```
http://localhost:5000/api
```

### Event Endpoints

#### 📥 GET /user

Return user status, polling every 10 seconds to check the status of a createUserJob.

**Example usage:**

```typescript
http://localhost:5000/api/user/99
```

#### 📥 POST /user

Create a createUserJob and enqueue it in the Jobs queue.

**Example usage:**

```typescript
fetch("http://localhost:5000/api/user", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    id: "ee8f2662-c8b5-4189-9b66-d6af64fe02be",
    name: "Ana Sophia Araújo",
    age: 19,
    score: 859,
    active: true,
    country: "Índia",
    team: {
      name: "Frontend Avengers",
      leader: false,
      projects: [
        {
          name: "Mobile App",
          completed: false,
        },
      ],
    },
    logs: [
      {
        date: "2025-03-25",
        action: "logout",
      },
      {
        date: "2025-03-26",
        action: "login",
      },
      {
        date: "2025-03-29",
        action: "logout",
      },
      {
        date: "2025-03-26",
        action: "login",
      },
    ],
  }),
});
```

## 🔍 Notable Features

- 📋 Processes 100k user creation requests
- 🧾 Uses BullMQ for job management
- 🌐 PostgreSQL as a fast and efficient database

---

## 🔐 Environment Requirements

- Node.js ≥ 20
- Postgres ≥ 18
- `.env` with DB and PORT

## 📦 Example Environment Variables

### 🔹 API (.env)

```env
PORT=5000
POSTGRES_URL="postgres://user:password@host:port/database"
```

---

## 📝 License

## Licensed under the MIT License.
