# syntax=docker/dockerfile:1.7
# Build context: repo root. Build with:
#   docker build -f apps/web/Dockerfile -t smart-pump-web .
#
# The API URL is inlined at build time by Vite. Override with:
#   --build-arg VITE_API_URL=https://api.example.com

FROM oven/bun:1.3-slim AS deps
WORKDIR /repo
COPY package.json bun.lock turbo.json tsconfig.base.json ./
COPY apps/web/package.json apps/web/
COPY packages/contracts/package.json packages/contracts/
COPY packages/ui/package.json packages/ui/
RUN bun install --frozen-lockfile

FROM deps AS build
ARG VITE_API_URL=http://localhost:3001
ENV VITE_API_URL=${VITE_API_URL}
COPY apps/web ./apps/web
COPY packages/contracts ./packages/contracts
COPY packages/ui ./packages/ui
RUN bun run --cwd apps/web build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0
COPY --from=build /repo/apps/web/.output ./
EXPOSE 3000
USER node
CMD ["node", "server/index.mjs"]
