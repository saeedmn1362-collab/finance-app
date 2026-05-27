FROM node:22-slim AS base

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@11.1.3 --activate


# =========================
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json backend/package.json

RUN pnpm install --frozen-lockfile


# =========================
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

WORKDIR /app/backend

RUN pnpm prisma generate
RUN pnpm build


# =========================
FROM base AS prod-deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

WORKDIR /app/backend
COPY backend/package.json ./

RUN pnpm install --prod --frozen-lockfile


# =========================
FROM node:22-slim AS runner
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.1.3 --activate

COPY --from=prod-deps /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/backend/package.json ./package.json

# Prisma engines fix
COPY --from=builder /app/backend/node_modules/.prisma ./node_modules/.prisma

EXPOSE 5000

CMD ["node", "dist/server.js"]