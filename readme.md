# Build migrations
## Create image locally to test
docker buildx build \
  --platform linux/arm64 \
  -t lista-migrations:test \
  -f migrations/Dockerfile \
  --load \
  .

## Pushing to ghcr
docker buildx build \
  --platform linux/arm64 \
  -t ghcr.io/gabrielaleks/lista-migrations:latest \
  -f migrations/Dockerfile \
  --push .

# Build backend
## Create image locally to test
docker buildx build \
  --platform linux/arm64 \
  -t lista-backend:test \
  -f backend/Dockerfile \
  --target production \
  --load \
  .

## Pushing to ghcr
docker buildx build \
  --platform linux/arm64 \
  -t ghcr.io/gabrielaleks/lista-backend:latest \
  -f backend/Dockerfile \
  --target production \
  --push .

# Build frontend
## Create image locally to test
docker buildx build \
  --platform linux/arm64 \
  -t lista-frontend:test \
  -f frontend/Dockerfile \
  --target production \
  --load \
  .

## Pushing to ghcr
docker buildx build \
  --platform linux/arm64 \
  -t ghcr.io/gabrielaleks/lista-frontend:latest \
  -f frontend/Dockerfile \
  --target production \
  --push .