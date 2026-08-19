# Tamaade storefront. Mirrors the multi-stage standalone pattern the other
# Next.js apps on this VPS already use.
#
# NEXT_PUBLIC_* values are inlined into the client bundle at build time, so the
# API and site URLs are build args, not runtime env vars — changing them means
# rebuilding the image.
FROM node:20-alpine AS deps

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci


FROM node:20-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL=http://localhost:8000
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG CACHEBUST=1

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NODE_ENV=production

RUN echo "build cache bust: ${CACHEBUST}" && npm run build


FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3006
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3006

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3006/ || exit 1

CMD ["node", "server.js"]
