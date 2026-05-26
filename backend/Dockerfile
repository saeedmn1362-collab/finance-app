FROM node:22-slim AS base

WORKDIR /app

RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

RUN npm i -g pnpm@9



# =========================
# Dependencies
# =========================
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json backend/package.json

RUN pnpm install --frozen-lockfile --shamefully-hoist



# =========================
# Builder
# =========================
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules

COPY . .

WORKDIR /app/backend

RUN ../node_modules/.bin/prisma generate --schema=./prisma/schema.prisma

RUN ../node_modules/.bin/tsc -p tsconfig.json



# =========================
# Runner
# =========================
FROM node:22-slim AS runner

WORKDIR /app

RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

# IMPORTANT:
# copy GENERATED prisma client from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/node_modules ./backend/node_modules

COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/backend/package.json ./package.json

EXPOSE 5000

CMD ["sh", "-c", "backend/node_modules/.bin/prisma migrate deploy --schema=./prisma/schema.prisma && node dist/server.js"]