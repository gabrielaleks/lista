# Base
FROM node:20-bookworm-slim AS base
WORKDIR /backend
COPY ./backend/package.json ./backend/package-lock.json ./

# Development stage
FROM base AS development
RUN npm install
CMD ["sh", "-c", "npm install && npm run dev"]

# Build stage
FROM base AS build
RUN npm ci
COPY ./backend /backend
RUN npm run build

# Production stage
FROM node:20-bookworm-slim AS production
WORKDIR /backend

COPY --from=build /backend/dist ./dist
COPY --from=build /backend/package.json ./package.json
COPY --from=build /backend/package-lock.json ./package-lock.json
RUN npm ci --omit=dev
CMD ["node", "dist/index.js"]