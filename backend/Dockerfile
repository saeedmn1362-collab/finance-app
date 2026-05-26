# =========================
# 1. BASE IMAGE
# =========================
FROM node:22-slim AS base

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

RUN npm i -g pnpm@9


# =========================
# 2. INSTALL DEPS (CACHED)
# =========================
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json backend/package.json

RUN pnpm install --frozen-lockfile --shamefully-hoist


# =========================
# 3. BUILD STAGE
# =========================
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules

COPY . .

WORKDIR /app/backend

# Prisma generate
RUN ../node_modules/.bin/prisma generate --schema=./prisma/schema.prisma

# Build TS → JS
RUN ../node_modules/.bin/tsc -p tsconfig.json


# =========================
# 4. PRUNE PRODUCTION DEPS (IMPORTANT)
# =========================
FROM base AS prod-deps

WORKDIR /app/backend

COPY backend/package.json ./
COPY pnpm-lock.yaml ../pnpm-lock.yaml
COPY pnpm-workspace.yaml ../pnpm-workspace.yaml

RUN pnpm install --prod --frozen-lockfile --shamefully-hoist


# =========================
# 5. RUNTIME IMAGE (FINAL)
# =========================
FROM node:22-slim AS runner

WORKDIR /app

RUN npm i -g pnpm@9

# فقط production deps
COPY --from=prod-deps /app/backend/node_modules ./node_modules

# build output
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/backend/package.json ./package.json

# Prisma engine fix (important)
COPY --from=builder /app/node_modules/.pnpm ./node_modules/.pnpm

EXPOSE 5000

CMD ["node", "dist/index.js"]