# syntax=docker/dockerfile:1.7

FROM node:26.7.0-bookworm-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate
WORKDIR /app

FROM base AS dependencies
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

FROM dependencies AS development
COPY . .
ENV DATABASE_URL=postgresql://tecnojack:tecnojack@postgres:5432/tecnojack?schema=public
RUN pnpm prisma:generate
CMD ["pnpm", "start:dev"]

FROM dependencies AS build
COPY . .
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build?schema=public
RUN pnpm prisma:generate && pnpm build && pnpm prune --prod

FROM node:26.7.0-bookworm-slim AS production
ENV NODE_ENV=production
WORKDIR /app
RUN groupadd --system --gid 1001 nodejs && useradd --system --uid 1001 --gid nodejs tecnojack
COPY --from=build --chown=tecnojack:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=tecnojack:nodejs /app/dist ./dist
COPY --from=build --chown=tecnojack:nodejs /app/package.json ./package.json
USER tecnojack
EXPOSE 3000
CMD ["node", "dist/main.js"]

