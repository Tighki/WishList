# syntax=docker/dockerfile:1
# Dokploy + Traefik: Node static server on PORT (default 3000).

FROM node:22-bookworm AS build
WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/index.html frontend/vite.config.ts frontend/tsconfig.json frontend/tsconfig.app.json frontend/tsconfig.node.json frontend/eslint.config.js ./
COPY frontend/public ./public
COPY frontend/src ./src

RUN npm run build

FROM node:22-bookworm AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=80

COPY frontend/server.mjs ./server.mjs
COPY --from=build /app/dist ./dist

EXPOSE 80

CMD ["node", "server.mjs"]
