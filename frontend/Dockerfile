# Base stage for both dev and prod
FROM node:20-bookworm-slim AS base
WORKDIR /frontend
COPY ./frontend/package.json ./frontend/package-lock.json ./

# Development stage
FROM base AS development
RUN npm install
CMD ["sh", "-c", "npm install && npm run dev"]

# Build stage
FROM base AS build
RUN npm ci
COPY ./frontend /frontend
RUN npm run build

# Production stage
FROM node:20-bookworm-slim AS production
WORKDIR /frontend

COPY --from=build /frontend/dist ./dist
COPY --from=build /frontend/package.json ./package.json
COPY --from=build /frontend/package-lock.json ./package-lock.json
RUN npm ci --omit=dev
CMD ["npm", "run", "prod"]