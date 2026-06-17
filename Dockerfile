# syntax=docker/dockerfile:1

FROM node:22-bookworm AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:22-bookworm AS backend-build
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

FROM node:22-bookworm AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev \
  && npx playwright install chromium \
  && npx playwright install-deps chromium

COPY --from=backend-build /app/backend/dist ./dist
COPY --from=frontend-build /app/frontend/dist ./public

RUN mkdir -p /app/data

EXPOSE 3000
VOLUME ["/app/data"]

CMD ["node", "dist/index.js"]
