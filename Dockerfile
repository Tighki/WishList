# syntax=docker/dockerfile:1
# Root Dockerfile for Dokploy: build context is repository root.

FROM node:22-bookworm AS build
WORKDIR /app

ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/index.html frontend/vite.config.ts frontend/tsconfig.json frontend/tsconfig.app.json frontend/tsconfig.node.json frontend/eslint.config.js ./
COPY frontend/public ./public
COPY frontend/src ./src

RUN npm run build

FROM nginx:1.27-alpine AS runner

ENV API_UPSTREAM=http://host.docker.internal:3001/api/

COPY frontend/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY frontend/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
