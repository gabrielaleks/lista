# Lista

A self-hosted shopping list web app. Create and manage grocery lists with support for unit-based and weight-based items, each with their own quantity and price tracking.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, MUI, Tailwind CSS |
| Backend | Node.js, Express 5, TypeScript |
| Database | PostgreSQL 15 |
| Migrations | [dbmate](https://github.com/amacneil/dbmate) |
| Containerization | Docker, Docker Compose |
| CI/CD | GitHub Actions → GHCR |

## Project Structure

```
lista/
├── backend/          # Express REST API
│   ├── src/
│   │   ├── domain/       # Entities, value objects, repository interfaces
│   │   ├── application/  # Services, DTOs, views
│   │   ├── repositories/ # SQL implementations
│   │   ├── web/          # Controllers and routes
│   │   ├── middlewares/
│   │   └── utils/
│   ├── db/
│   │   ├── migrations/   # SQL migration files
│   │   └── mocks/        # Development seed data
│   └── tests/
├── frontend/         # React SPA
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── hooks/
│       ├── api/
│       └── types/
├── migrations/       # Standalone migrations Docker image
└── docker-compose.yaml
```

## Domain Model

A **List** contains one or more **Items**. Items come in two types:

- **UNIT** — bought by quantity (e.g. 3 yogurts at $1.50 each)
- **KG** — bought by weight (e.g. 1.5 kg of rice at $2.00/kg)

Each item tracks whether it has been bought (`wasBought`).

## API

Base path: `/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/lists` | Get all lists (summary view) |
| `GET` | `/lists/:id` | Get a list with all its items |
| `POST` | `/lists` | Create a new list |
| `PUT` | `/lists/:id` | Update a list and its items |
| `DELETE` | `/lists/:id` | Delete a list |

## Database Migrations

Migrations are managed with [dbmate](https://github.com/amacneil/dbmate) and live in `backend/db/migrations/`.

To create a new migration:
```bash
dbmate new <migration-name>
```

To apply migrations manually (outside Docker):
```bash
dbmate up
```

## Deployment

The CI/CD pipelines (`.github/workflows/`) automatically build and push Docker images to [GitHub Container Registry](https://ghcr.io) on every push to `master` that touches the respective service.

| Image | Registry path |
|---|---|
| Backend | `ghcr.io/gabrielaleks/lista-backend:latest` |
| Frontend | `ghcr.io/gabrielaleks/lista-frontend:latest` |
| Migrations | `ghcr.io/gabrielaleks/lista-migrations:latest` |

Images are built for `linux/arm64` (targeting a home server).

### Building images manually

**Migrations**
```bash
# Test locally
docker buildx build --platform linux/arm64 -t lista-migrations:test -f migrations/Dockerfile --load .

# Push to GHCR
docker buildx build --platform linux/arm64 -t ghcr.io/gabrielaleks/lista-migrations:latest -f migrations/Dockerfile --push .
```

**Backend**
```bash
# Test locally
docker buildx build --platform linux/arm64 -t lista-backend:test -f backend/Dockerfile --target production --load .

# Push to GHCR
docker buildx build --platform linux/arm64 -t ghcr.io/gabrielaleks/lista-backend:latest -f backend/Dockerfile --target production --push .
```

**Frontend**
```bash
# Test locally
docker buildx build --platform linux/arm64 -t lista-frontend:test -f frontend/Dockerfile --target production --load .

# Push to GHCR
docker buildx build --platform linux/arm64 -t ghcr.io/gabrielaleks/lista-frontend:latest -f frontend/Dockerfile --target production --push .
```
