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

# Variables d'environnement pour Prisma
ENV DATABASE_URL="file:./dev.db"

# Générer le client Prisma et créer la base de données
RUN npx prisma generate
RUN npx prisma db push --accept-data-loss

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
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Créer le dossier prisma avec les bonnes permissions
RUN mkdir -p /app/prisma && chown -R nextjs:nodejs /app/prisma

USER nextjs

EXPOSE 3006

ENV PORT=3006
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL="file:/app/prisma/dev.db"

# Script de démarrage pour initialiser la BDD si elle n'existe pas
CMD sh -c "npx prisma db push --accept-data-loss && node server.js"
