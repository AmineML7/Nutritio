# Dockerfile pour Nutritio Next.js
FROM node:18-alpine AS base

# Installer les dépendances nécessaires
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Installer les dépendances
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

# Build de l'application
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Image de production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copier les fichiers nécessaires
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3006

ENV PORT=3006
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
