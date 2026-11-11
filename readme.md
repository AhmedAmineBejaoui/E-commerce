# Full-Stack E-Commerce Application

A TypeScript-based commerce application with a React frontend and an Express backend, organized into separate client, server and shared modules.

## Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Radix UI components
- **Backend:** Node.js, Express, TypeScript
- **Data:** PostgreSQL-related dependencies, Drizzle ORM
- **Forms and UI:** React Hook Form, Zod ecosystem and TanStack Query
- **Build:** Vite and TypeScript compiler

## Architecture

```text
client/          React interface
server/          Express server code
shared/          Shared types and modules
drizzle.config.ts Database tooling configuration
Dockerfile       Container build definition
```

## Get started locally

Prerequisites: Node.js, npm and a database compatible with the app's configuration.

```bash
git clone https://github.com/AhmedAmineBejaoui/E-commerce.git
cd E-commerce
npm install
npm run dev
```

Configure required environment variables locally **without committing credentials**. Review server configuration before first launch.

## Useful commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start client and server development processes |
| `npm run build` | Build client and server |
| `npm start` | Start compiled server |
| `npm run check` | Run TypeScript checks |
| `npm run db:push` | Apply schema changes through Drizzle |
| `npm run migrate` | Generate and apply migrations |

> Database commands can change stored data: use a disposable local database when evaluating this project.

## Quality & security notes

Dependency-update pull requests are tracked in GitHub; upgrades should be evaluated individually with tests and compatibility checks. **No blanket claim of production readiness or payment-security certification is made.**

## Author

[Ahmed Amin Bejaoui](https://github.com/AhmedAmineBejaoui)
