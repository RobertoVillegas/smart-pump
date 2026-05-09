# syntax=docker/dockerfile:1.7
# Build context: repo root. Build with:
#   docker build -f apps/api/Dockerfile -t smart-pump-api .

FROM oven/bun:1.3-slim AS deps
WORKDIR /repo
COPY package.json bun.lock turbo.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/
COPY packages/contracts/package.json packages/contracts/
RUN bun install --frozen-lockfile

FROM deps AS build
COPY apps/api ./apps/api
COPY packages/contracts ./packages/contracts
RUN bun build apps/api/src/index.ts \
      --outdir apps/api/dist \
      --target bun \
      --minify

FROM oven/bun:1.3-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3001 \
    LOWDB_PATH=/app/data/users.json
COPY --from=build /repo/apps/api/dist ./dist
COPY data ./data
EXPOSE 3001
USER bun
CMD ["bun", "run", "dist/index.js"]
