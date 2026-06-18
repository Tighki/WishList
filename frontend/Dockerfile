# syntax=docker/dockerfile:1
# Dokploy + Traefik: Node static server on PORT (default 3000).

FROM node:22-bookworm AS build
WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json eslint.config.js ./
COPY public ./public
COPY src ./src

RUN npm run build

FROM node:22-bookworm AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY server.mjs ./server.mjs
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "server.mjs"]
