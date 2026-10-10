#1 install dependencies only when needed
FROM node:20-alpine AS deps
WORKDIR /app

# install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

#2 rebuild the source code only when needed
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# environment variables must be present at build time for Next.js client-side variables
ENV NEXT_TELEMETRY_DISABLED 1

# --- FIX: Pass build arguments to Next.js compilation ---
ARG NEXT_PUBLIC_BASE_URL_PROD
ENV NEXT_PUBLIC_BASE_URL_PROD=$NEXT_PUBLIC_BASE_URL_PROD

ARG NEXT_PUBLIC_BASE_URL_DEV
ENV NEXT_PUBLIC_BASE_URL_DEV=$NEXT_PUBLIC_BASE_URL_DEV

RUN npm run build

#3 production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# copy essential files for standalone runtime
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]