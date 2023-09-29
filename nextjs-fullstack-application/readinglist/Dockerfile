FROM node:18-alpine AS builder

WORKDIR /app

COPY . .

RUN if [ -f "./package-lock.json" ]; then npm install; \
    elif [ -f "./yarn.lock" ]; then yarn; \
    elif [ -f "./pnpm-lock.yaml" ]; then pnpm install;fi

COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npx prisma generate && npm run build

# Runner Stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 10015
COPY --from=builder /app/next.config.js ./
COPY --from=builder --chown=10015:nodejs /app/.next/standalone ./
COPY --from=builder --chown=10015:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=10015:nodejs /app/public ./public

USER 10015
EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]